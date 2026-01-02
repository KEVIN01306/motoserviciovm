import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";
import { deleteImage } from "../utils/fileUtils.js";

const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getServicios = async () => {
    const items = await prisma.servicio.findMany({
        where: { estadoId: { not: estados().inactivo } },
        orderBy: { createdAt: 'desc' },
        include: { moto: true, sucursal: true,cliente: true, mecanico: true,estado: true },
    });
    if (!items) { const error = new Error('DATA_NOT_FOUND'); error.code = 'DATA_NOT_FOUND'; throw error; }
    return items;
}

const getServicio = async (id) => {
    const item = await prisma.servicio.findFirst({ where: { id: id, estadoId: { not: estados().inactivo } }, include: { imagen: true, servicioItems: {include: {inventario: true}}, productosCliente: true, moto: true, sucursal: true,cliente: true, mecanico: true, tipoServicio: true, estado: true, ventas: { include: { productos: {include: {producto: true}}, estado: true } } } });
    if (!item) { const error = new Error('DATA_NOT_FOUND'); error.code = 'DATA_NOT_FOUND'; throw error; }
    return item;
}

const postServicio = async (data) => {
    const { servicioItems, productosCliente, imagenesMeta, imagenFiles, ...base } = data;
    const uploaded = Array.isArray(imagenFiles) ? imagenFiles : [];
    const fechaEntrada = new Date() 

    base.fechaEntrada = fechaEntrada

    try {
        const result = await prisma.$transaction(async (tx) => {
            // validate inventario ids if provided
            if (Array.isArray(servicioItems) && servicioItems.length > 0) {
                const ids = [...new Set(servicioItems.map(s => s.inventarioId))];
                const existentes = await tx.inventario.findMany({ where: { id: { in: ids } }, select: { id: true } });
                const existentesIds = existentes.map(e => e.id);
                const missing = ids.filter(i => !existentesIds.includes(i));
                if (missing.length > 0) {
                    const error = new Error('DATA_NOT_FOUND_INVENTARIO'); error.code = 'DATA_NOT_FOUND_INVENTARIO'; throw error;
                }
            }

            const created = await tx.servicio.create({ data: base });

            // create servicioItems
            if (Array.isArray(servicioItems) && servicioItems.length > 0) {
                for (const si of servicioItems) {
                    await tx.servicioInventario.create({ data: { servicioId: created.id, inventarioId: si.inventarioId, checked: !!si.checked, itemName: si.itemName ?? null, itemDescripcion: si.itemDescripcion ?? null, notas: si.notas ?? null } });
                    await pause(30);
                }
            }

            // create productosCliente
            if (Array.isArray(productosCliente) && productosCliente.length > 0) {
                for (const pc of productosCliente) {
                    await tx.servicioProductoCliente.create({ data: { nombre: pc.nombre, cantidad: pc.cantidad, servicioId: created.id } });
                    await pause(30);
                }
            }

            // create imagen records from files + metas
            if (uploaded.length > 0) {
                const metas = Array.isArray(imagenesMeta) ? imagenesMeta : [];
                for (let i = 0; i < uploaded.length; i++) {
                    const f = uploaded[i];
                    const meta = metas[i] ?? {};
                    const descripcion = (typeof meta === 'string') ? meta : (meta.descripcion ?? '');
                    const ruta = '/uploads/servicios/' + f.filename;
                    await tx.imagen.create({ data: { imagen: ruta, descripcion: descripcion, servicioId: created.id } });
                    await pause(30);
                }
            }

            const withNested = await tx.servicio.findFirst({ where: { id: created.id }, include: { imagen: true, servicioItems: true, productosCliente: true, moto: true, sucursal: true } });
            return withNested;
        }, { maxWait: 20000, timeout: 120000 });

        return result;
    } catch (err) {
        // cleanup uploaded files if any
        if (uploaded.length > 0) {
            for (const f of uploaded) {
                try { await deleteImage('/uploads/servicios/' + f.filename); } catch (e) { /* ignore */ }
            }
        }
        throw err;
    }
}

const putServicio = async (id, data) => {
    const { servicioItems, productosCliente, imagenesMeta, imagenFiles, ...base } = data;
    const uploaded = Array.isArray(imagenFiles) ? imagenFiles : [];

    try {
        const result = await prisma.$transaction(async (tx) => {
            const existing = await tx.servicio.findFirst({ where: { id: id } });
            if (!existing) { const error = new Error('DATA_NOT_FOUND'); error.code = 'DATA_NOT_FOUND'; throw error; }

            // validate inventario ids
            if (Array.isArray(servicioItems) && servicioItems.length > 0) {
                const ids = [...new Set(servicioItems.map(s => s.inventarioId))];
                const existentes = await tx.inventario.findMany({ where: { id: { in: ids } }, select: { id: true } });
                const existentesIds = existentes.map(e => e.id);
                const missing = ids.filter(i => !existentesIds.includes(i));
                if (missing.length > 0) { const error = new Error('DATA_NOT_FOUND_INVENTARIO'); error.code = 'DATA_NOT_FOUND_INVENTARIO'; throw error; }
            }

            const updated = await tx.servicio.update({ where: { id: id }, data: base });

            // servicioItems: upsert per inventarioId, then delete missing (like Venta behavior)
            if (Array.isArray(servicioItems)) {
                const sentIds = [];
                for (const si of servicioItems) {
                    const where = { servicioId_inventarioId: { servicioId: id, inventarioId: si.inventarioId } };
                    await tx.servicioInventario.upsert({ where, update: { checked: !!si.checked, itemName: si.itemName ?? null, itemDescripcion: si.itemDescripcion ?? null, notas: si.notas ?? null }, create: { servicioId: id, inventarioId: si.inventarioId, checked: !!si.checked, itemName: si.itemName ?? null, itemDescripcion: si.itemDescripcion ?? null, notas: si.notas ?? null } });
                    sentIds.push(si.inventarioId);
                    await pause(30);
                }
                if (sentIds.length > 0) {
                    await tx.servicioInventario.deleteMany({ where: { servicioId: id, inventarioId: { notIn: sentIds } } });
                } else {
                    await tx.servicioInventario.deleteMany({ where: { servicioId: id } });
                }
            }

            // productosCliente: replace all
            if (Array.isArray(productosCliente)) {
                await tx.servicioProductoCliente.deleteMany({ where: { servicioId: id } });
                for (const pc of productosCliente) {
                    await tx.servicioProductoCliente.create({ data: { nombre: pc.nombre, cantidad: pc.cantidad, servicioId: id } });
                    await pause(30);
                }
            }

            // imagenes: if new files, create records (do not delete existing images here)
            if (uploaded.length > 0) {
                const metas = Array.isArray(imagenesMeta) ? imagenesMeta : [];
                for (let i = 0; i < uploaded.length; i++) {
                    const f = uploaded[i];
                    const meta = metas[i] ?? {};
                    const descripcion = (typeof meta === 'string') ? meta : (meta.descripcion ?? '');
                    const ruta = '/uploads/servicios/' + f.filename;
                    await tx.imagen.create({ data: { imagen: ruta, descripcion: descripcion, servicioId: id } });
                    await pause(30);
                }
            }

            const withNested = await tx.servicio.findFirst({ where: { id: id }, include: { imagen: true, servicioItems: true, productosCliente: true, moto: true, sucursal: true } });
            return withNested;
        }, { maxWait: 20000, timeout: 120000 });

        return result;
    } catch (err) {
        // cleanup uploaded files
        if (uploaded.length > 0) {
            for (const f of uploaded) {
                try { await deleteImage('/uploads/servicios/' + f.filename); } catch (e) { /* ignore */ }
            }
        }
        throw err;
    }
}


const deleteServicio = async (id) => {
    const existing = await prisma.servicio.findFirst({ where: { id: id } });
    if (!existing) { const error = new Error('DATA_NOT_FOUND'); error.code = 'DATA_NOT_FOUND'; throw error; }
    const deleted = await prisma.servicio.update({ where: { id: id }, data: { estadoId: estados().inactivo } });
    return deleted;
}

const salidaServicio = async (id, data) => {
    try {
        const result = await prisma.servicio.update({
            where: { id: id },
            data: {
                proximafecha: data.proximafecha,
                descripcion: data.descripcion,
                observaciones: data.observaciones,
                total: data.total,
                firmaSalida: data.firmaSalida,
            },
        });

        if (!result) {
            const error = new Error('DATA_NOT_FOUND');
            error.code = 'DATA_NOT_FOUND';
            throw error;
        }

        return result;
    } catch (err) {
        console.error('Error in salidaServicio:', err);
        throw err;
    }
};

export {
    getServicios,
    getServicio,
    postServicio,
    putServicio,
    deleteServicio,
    salidaServicio,
}
