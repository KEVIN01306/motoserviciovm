import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";

const getVentas = async () => {
    const ventas = await prisma.venta.findMany({
        where: { estadoId: { not: estados().inactivo } },
        orderBy: { createdAt: 'desc' },
        include: { usuario: true, servicio: true, productos: { include: { producto: true } }, estado: true,sucursal: true },
    });
    if (!ventas) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return ventas;
}

const getVenta = async (id) => {
    const venta = await prisma.venta.findFirst({
        where: { id: id, estadoId: { not: estados().inactivo } },
        include: { usuario: true, servicio: true, productos: { include: { producto: true } }, estado: true, sucursal: true },
    });
    if (!venta) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return venta;
}

const postVenta = async (data) => {
    const newVenta = await prisma.venta.create({ data });
    return newVenta;
}

const postVentaWithProductos = async (data) => {
    const productos = Array.isArray(data.productos) ? data.productos : [];
    // remove productos from main data
    const ventaData = { ...data };
    delete ventaData.productos;

    const createdVenta = await prisma.venta.create({ data: ventaData });

    if (productos.length > 0) {
        for (const p of productos) {
            // adjust stock: fetch product
            const prod = await prisma.producto.findFirst({ where: { id: p.productoId } });
            if (!prod) { const error = new Error('DATA_NOT_FOUND'); error.code = 'DATA_NOT_FOUND'; throw error; }
            const newStock = prod.cantidad - p.cantidad;
            if (newStock < 0) { const error = new Error('INSUFFICIENT_STOCK'); error.code = 'INSUFFICIENT_STOCK'; throw error; }
            await prisma.producto.update({ where: { id: prod.id }, data: { cantidad: newStock } });

            const upsertData = {
                where: { ventaId_productoId: { ventaId: createdVenta.id, productoId: p.productoId } },
                update: { cantidad: p.cantidad, totalProducto: p.totalProducto, costo: p.costo, precio: p.precio, ganacia: p.ganacia },
                create: { ventaId: createdVenta.id, productoId: p.productoId, cantidad: p.cantidad, totalProducto: p.totalProducto, costo: prod.costo, precio: prod.precio, ganacia: (prod.precio - prod.costo) * p.cantidad}
            };
            try {
                await prisma.ventaProducto.upsert(upsertData);
            } catch (err) {
                console.error('Upsert ventaProducto error:', err);
                // continue with others
            }
        }
    }

    const ventaWithProductos = await prisma.venta.findFirst({ where: { id: createdVenta.id }, include: { productos: true, usuario: true, servicio: true } });
    return ventaWithProductos;
}

const putVenta = async (id, data) => {
    const existing = await prisma.venta.findFirst({ where: { id: id } });
    if (!existing) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const updated = await prisma.venta.update({ where: { id: id }, data });
    return updated;
}

const putVentaWithProductos = async (id, data) => {
    const existing = await prisma.venta.findFirst({ where: { id: id } });
    if (!existing) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const productos = Array.isArray(data.productos) ? data.productos : null;
    const ventaData = { ...data };
    delete ventaData.productos;

    const updatedVenta = await prisma.venta.update({ where: { id: id }, data: ventaData });

    if (productos !== null) {
        // upsert each producto (create or update)
        const sentProductoIds = [];
        for (const p of productos) {
            // compute delta relative to existing ventaProducto (if any)
            const existingVP = await prisma.ventaProducto.findFirst({ where: { ventaId: id, productoId: p.productoId } });
            const prevCantidad = existingVP ? existingVP.cantidad : 0;
            const delta = p.cantidad - prevCantidad; // positive => reduce stock, negative => increase stock

            // fetch product
            const prod = await prisma.producto.findFirst({ where: { id: p.productoId } });
            if (!prod) { const error = new Error('DATA_NOT_FOUND'); error.code = 'DATA_NOT_FOUND'; throw error; }

            const newStock = prod.cantidad - delta;
            if (newStock < 0) { const error = new Error('INSUFFICIENT_STOCK'); error.code = 'INSUFFICIENT_STOCK'; throw error; }
            await prisma.producto.update({ where: { id: prod.id }, data: { cantidad: newStock } });

            const upsertData = {
                where: { ventaId_productoId: { ventaId: id, productoId: p.productoId } },
                update: { cantidad: p.cantidad, totalProducto: p.totalProducto, costo: prod.costo, precio: prod.precio, ganacia: (prod.precio - prod.costo) * p.cantidad },
                create: { ventaId: id, productoId: p.productoId, cantidad: p.cantidad, totalProducto: p.totalProducto, costo: prod.costo, precio: prod.precio, ganacia: (prod.precio - prod.costo) * p.cantidad }
            };
            try {
                await prisma.ventaProducto.upsert(upsertData);
                sentProductoIds.push(p.productoId);
            } catch (err) {
                console.error('Upsert ventaProducto error:', err);
            }
        }

        // Delete any existing VentaProducto for this venta that were NOT sent in the request
        if (sentProductoIds.length > 0) {
            // before deleting, restore stock for those items
            const toDelete = await prisma.ventaProducto.findMany({ where: { ventaId: id, productoId: { notIn: sentProductoIds } } });
            for (const d of toDelete) {
                try {
                    const prod = await prisma.producto.findFirst({ where: { id: d.productoId } });
                    if (prod) {
                        await prisma.producto.update({ where: { id: prod.id }, data: { cantidad: prod.cantidad + d.cantidad } });
                    }
                } catch (err) {
                    console.error('Restore stock error:', err);
                }
            }
            await prisma.ventaProducto.deleteMany({ where: { ventaId: id, productoId: { notIn: sentProductoIds } } });
        } else {
            // empty array => remove all products for this venta and restore their stock
            const toDelete = await prisma.ventaProducto.findMany({ where: { ventaId: id } });
            for (const d of toDelete) {
                try {
                    const prod = await prisma.producto.findFirst({ where: { id: d.productoId } });
                    if (prod) {
                        await prisma.producto.update({ where: { id: prod.id }, data: { cantidad: prod.cantidad + d.cantidad } });
                    }
                } catch (err) {
                    console.error('Restore stock error:', err);
                }
            }
            await prisma.ventaProducto.deleteMany({ where: { ventaId: id } });
        }
    }

    const ventaWithProductos = await prisma.venta.findFirst({ where: { id: id }, include: { productos: true, usuario: true, servicio: true } });
    return ventaWithProductos;
}

const deleteVenta = async (id) => {
    const existing = await prisma.venta.findFirst({ where: { id: id } });
    if (!existing) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const deleted = await prisma.venta.update({ where: { id: id }, data: { estadoId: estados().inactivo } });
    return deleted;
}

const patchCancelarVenta = async (id) => {
    const existing = await prisma.venta.findFirst({ where: { id: id } });
    if (!existing) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    // restore stock for all VentaProducto linked to this venta
    const ventaProductos = await prisma.ventaProducto.findMany({ where: { ventaId: id } });
    for (const vp of ventaProductos) {
        try {
            const prod = await prisma.producto.findFirst({ where: { id: vp.productoId } });
            if (prod) {
                await prisma.producto.update({ where: { id: prod.id }, data: { cantidad: prod.cantidad + vp.cantidad } });
            }
        } catch (err) {
            console.error('Error restoring stock for productoId', vp.productoId, err);
        }
    }

    const cancelled = await prisma.venta.update({ where: { id: id }, data: { estadoId: estados().cancelado } });
    return cancelled;
}

const patchFinalizarVenta = async (id) => {
    const existing = await prisma.venta.findFirst({ where: { id: id } });
    if (!existing) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const ventaProductos = await prisma.ventaProducto.findMany({
        where: { ventaId: id },
    });

    let totalGanancia = 0;
    let costoTotal = 0;
    let precioTotal = 0;

    for (const vp of ventaProductos) {
        totalGanancia += vp.ganacia;
        costoTotal += vp.costo * vp.cantidad;
        precioTotal += vp.precio * vp.cantidad;
    }

    const finalized = await prisma.venta.update({
        where: { id: id },
        data: {
            estadoId: estados().confirmado,
            gananciaTotal: totalGanancia,
            costo: costoTotal,
            precioTotal: precioTotal,
        },
    });
    return finalized;
}

export {
    getVentas,
    getVenta,
    postVenta,
    putVenta,
    deleteVenta,
    postVentaWithProductos,
    putVentaWithProductos,
    patchCancelarVenta,
    patchFinalizarVenta,
}
