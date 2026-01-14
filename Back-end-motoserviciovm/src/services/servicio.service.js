import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";
import { deleteImage } from "../utils/fileUtils.js";

const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getServicios = async (filters = {}) => {
    const { placa, startDate, endDate } = filters;

    // Adjust endDate to include the entire day by adding one day
    const adjustedEndDate = endDate ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) : undefined;

    const whereClause = {
        estadoId: { not: estados().inactivo },
        ...(placa && { moto: { placa: placa } }),
        ...(startDate && adjustedEndDate && { createdAt: { gte: new Date(startDate), lt: adjustedEndDate } }),
    };

    const items = await prisma.servicio.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: { moto: true, sucursal: true, cliente: true, mecanico: true, estado: true },
    });

    /*if (!items || items.length === 0) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
        */

    return items;
}

const getServicio = async (id) => {
    const item = await prisma.servicio.findFirst({ where: { id: id, estadoId: { not: estados().inactivo } }, include: { imagen: true, servicioItems: {include: {inventario: true}}, productosCliente: true, moto: {include: { modelo: true}}, sucursal: true,cliente: true, mecanico: true, servicioOpcionesTipoServicio: {include: {opcionServicio: true}} , tipoServicio: {include: {opcionServicios: true}} , estado: true, proximoServicioItems: true , ventas: { include: { productos: {include: {producto: true}}, estado: true } },enReparaciones: {include: {repuestos: true, estado: true}}, enParqueos: {include: {estado: true}} } });
    if (!item) { const error = new Error('DATA_NOT_FOUND'); error.code = 'DATA_NOT_FOUND'; throw error; }
    return item;
}

const postServicio = async (data) => {
    const { servicioItems, productosCliente, imagenesMeta, imagenFiles, opcionesServicioManual, ...base } = data;
    const uploaded = Array.isArray(imagenFiles) ? imagenFiles : [];
    const fechaEntrada = new Date();

    base.fechaEntrada = fechaEntrada;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // validate inventario ids if provided
            if (Array.isArray(servicioItems) && servicioItems.length > 0) {
                const ids = [...new Set(servicioItems.map((s) => s.inventarioId))];
                const existentes = await tx.inventario.findMany({ where: { id: { in: ids } }, select: { id: true } });
                const existentesIds = existentes.map((e) => e.id);
                const missing = ids.filter((i) => !existentesIds.includes(i));
                if (missing.length > 0) {
                    const error = new Error("DATA_NOT_FOUND_INVENTARIO");
                    error.code = "DATA_NOT_FOUND_INVENTARIO";
                    throw error;
                }
            }

            const created = await tx.servicio.create({ data: base });

            // create servicioItems
            if (Array.isArray(servicioItems) && servicioItems.length > 0) {
                for (const si of servicioItems) {
                    await tx.servicioInventario.create({
                        data: {
                            servicioId: created.id,
                            inventarioId: si.inventarioId,
                            checked: !!si.checked,
                            itemName: si.itemName ?? null,
                            itemDescripcion: si.itemDescripcion ?? null,
                            notas: si.notas ?? null,
                        },
                    });
                    await pause(30);
                }
            }

            // create productosCliente
            if (Array.isArray(productosCliente) && productosCliente.length > 0) {
                for (const pc of productosCliente) {
                    await tx.servicioProductoCliente.create({
                        data: { nombre: pc.nombre, cantidad: pc.cantidad, servicioId: created.id },
                    });
                    await pause(30);
                }
            }

            // create ServicioOpcionesTipoServicio
            let opciones = await tx.opcionServicio.findMany({
                where: { tipoServicios: { some: { id: base.tipoServicioId } } },
            });

            if (opciones.length === 0 && Array.isArray(opcionesServicioManual) && opcionesServicioManual.length > 0) {
                // Ensure opcionesServicioManual is parsed as an array of integers
                const parsedOpcionesServicioManual = opcionesServicioManual.map((item) =>
                    typeof item === "string" ? JSON.parse(item) : item
                ).flat();

                opciones = await tx.opcionServicio.findMany({
                    where: { id: { in: parsedOpcionesServicioManual } },
                });
            }

            for (const opcion of opciones) {
                await tx.servicioOpcionesTipoServicio.create({
                    data: {
                        servicioId: created.id,
                        opcionServicioId: opcion.id,
                        checked: false,
                        observaciones: "",
                    },
                });
            }

            // create imagen records from files + metas
            if (uploaded.length > 0) {
                const metas = Array.isArray(imagenesMeta) ? imagenesMeta : [];
                for (let i = 0; i < uploaded.length; i++) {
                    const f = uploaded[i];
                    const meta = metas[i] ?? {};
                    const descripcion = typeof meta === "string" ? meta : meta.descripcion ?? "";
                    const ruta = "/uploads/servicios/" + f.filename;
                    await tx.imagen.create({
                        data: { imagen: ruta, descripcion: descripcion, servicioId: created.id },
                    });
                    await pause(30);
                }
            }

            const withNested = await tx.servicio.findFirst({
                where: { id: created.id },
                include: { imagen: true, servicioItems: true, productosCliente: true, moto: true, sucursal: true },
            });
            return withNested;
        }, { maxWait: 20000, timeout: 120000 });

        return result;
    } catch (err) {
        // cleanup uploaded files if any
        if (uploaded.length > 0) {
            for (const f of uploaded) {
                try {
                    await deleteImage("/uploads/servicios/" + f.filename);
                } catch (e) {
                    /* ignore */
                }
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
    const { proximoServicioItems, kilometrajeProximoServicio, ...base } = data;

    try {
        if (base.accionSalida === 'REPARAR' && !base.descripcionAccion) {
            throw new Error("Missing descripcionAccion for REPARAR action");
        }

        const result = await prisma.$transaction(async (tx) => {
            const totalDescuentos = await tx.venta.aggregate({
                where: {
                    servicioId: id
                },
                _sum: {
                    descuentoTotal: true 
                }
            });

            const updated = await tx.servicio.update({
                where: { id: id },
                data: {
                    proximafecha: base.proximafecha,
                    descripcion: base.descripcion,
                    observaciones: base.observaciones,
                    total: base.total,
                    firmaSalida: base.firmaSalida,
                    kilometrajeProximoServicio: kilometrajeProximoServicio,
                    estadoId: estados().entregado,
                    fechaSalida: new Date(),
                    descuentosServicio: totalDescuentos._sum.descuentoTotal || 0,
                },
            });

             if (base.accionSalida === 'SOLOSALIDA') {
                await tx.moto.update({
                    where: { id: updated.motoId },
                    data: { estadoId: estados().activo },
                });
                await tx.servicio.update({
                    where: { id: id },
                    data: { estadoId: estados().entregado },
                });
             }

            if (base.accionSalida === 'REPARAR') {
                await tx.moto.update({
                    where: { id: updated.motoId },
                    data: { estadoId: estados().enReparacion },
                });

                await tx.servicio.update({
                    where: { id: id },
                    data: { estadoId: estados().enReparacion },
                });

                await tx.enReparacion.create({
                    data: {
                        servicioId: id,
                        fechaEntrada: new Date(),
                        estadoId: estados().activo,
                        descripcion: base.descripcionAccion,
                        total: base.totalSalidaAnticipado || 0,
                    },
                });
            }

            if (base.accionSalida === 'PARQUEAR') {
                await tx.moto.update({
                    where: { id: updated.motoId },
                    data: { estadoId: estados().enParqueo },
                });

                await tx.servicio.update({
                    where: { id: id },
                    data: { estadoId: estados().enParqueo },
                });

                await tx.enParqueo.create({
                    data: {
                        servicioId: id,
                        fechaEntrada: new Date(),
                        estadoId: estados().activo,
                        descripcion: base.descripcionAccion,
                    },
                });
            }

            // Handle proximoServicioItems
            if (Array.isArray(proximoServicioItems) && proximoServicioItems.length > 0) {
                await tx.servicioProductoProximo.deleteMany({ where: { servicioId: id } });
                for (const item of proximoServicioItems) {
                    await tx.servicioProductoProximo.create({
                        data: {
                            nombre: item.nombre,
                            servicioId: id,
                        },
                    });
                }
            }

            return updated;
        },{ maxWait: 20000, timeout: 120000 });

        return result;
    } catch (err) {
        console.error('Error in salidaServicio:', err);
        throw err;
    }
};

const putProgreso = async (id, progresoItems) => {
    try {
        const updates = progresoItems.map((item) =>
            prisma.servicioOpcionesTipoServicio.update({
                where: {
                    servicioId_opcionServicioId: {
                        servicioId: id,
                        opcionServicioId: item.opcionServicioId,
                    },
                },
                data: {
                    checked: item.checked,
                    observaciones: item.observaciones,
                },
            })
        );

        // Execute updates in parallel without a transaction
        await Promise.all(updates);

        return { success: true };
    } catch (err) {
        console.error("Error in putProgreso:", err);
        throw err;
    }
};

const putProximoServicioItems = async (id, proximoServicioItems) => {
    try {
        await prisma.$transaction(async (tx) => {
            // Delete existing items for the service
            await tx.servicioProductoProximo.deleteMany({ where: { servicioId: id } });

            // Recreate items for the service
            for (const item of proximoServicioItems) {
                await tx.servicioProductoProximo.create({
                    data: {
                        nombre: item.nombre,
                        servicioId: id,
                    },
                });
            }
        });

        return { success: true };
    } catch (err) {
        console.error("Error in putProximoServicioItems:", err);
        throw err;
    }
};

const addServicioImages = async (id, imagenFiles, imagenesMeta) => {
    const uploaded = Array.isArray(imagenFiles) ? imagenFiles : [];

    console.log("addServicioImages called with imagenesMeta:", imagenesMeta);

    try {
        await prisma.$transaction(async (tx) => {
            // Add new images
            if (uploaded.length > 0) {
                const metas = Array.isArray(imagenesMeta) ? imagenesMeta : [];
                for (let i = 0; i < uploaded.length; i++) {
                    const f = uploaded[i];
                    const meta = metas[i] ?? {};
                    const descripcion = typeof meta === "string" ? meta : meta.descripcion ?? "";
                    const ruta = "/uploads/servicios/" + f.filename;
                    await tx.imagen.create({
                        data: {
                            imagen: ruta,
                            descripcion: descripcion,
                            servicioId: id,
                        },
                    });
                    await pause(30);
                }
            }
        });

        return { success: true };
    } catch (err) {
        console.error("Error in addServicioImages:", err);
        throw err;
    }
};

const putObservacionesServicio = async (id, observaciones) => {
    const existing = await prisma.servicio.findFirst({ where: { id: id } });
    if (!existing) { const error = new Error('DATA_NOT_FOUND'); error.code = 'DATA_NOT_FOUND'; throw error; }
    const updated = await prisma.servicio.update({ where: { id: id }, data: { observaciones: observaciones } });
    return updated;
}

export {
    getServicios,
    getServicio,
    postServicio,
    putServicio,
    deleteServicio,
    salidaServicio,
    putProgreso,
    putProximoServicioItems,
    addServicioImages,
    putObservacionesServicio,
}