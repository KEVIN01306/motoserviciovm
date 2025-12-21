import prisma from "../configs/db.config.js";

const getVentaProductos = async () => {
    const items = await prisma.ventaProducto.findMany({ orderBy: { createdAt: 'desc' }, include: { producto: true, venta: true  } });
    if (!items) {
        const error = new Error('DATA_NOT_FOUND'); error.code = 'DATA_NOT_FOUND'; throw error;
    }
    return items;
}

const getVentaProducto = async (id) => {
    const item = await prisma.ventaProducto.findFirst({ where: { id: id }, include: { producto: true, venta: true } });
    if (!item) { const error = new Error('DATA_NOT_FOUND'); error.code = 'DATA_NOT_FOUND'; throw error; }
    return item;
}

const postVentaProducto = async (data) => {
    // ensure unique ventaId+productoId
    const exist = await prisma.ventaProducto.findFirst({ where: { ventaId: data.ventaId, productoId: data.productoId } });
    if (exist) { const error = new Error('CONFLICT'); error.code = 'CONFLICT'; throw error; }
    const created = await prisma.ventaProducto.create({ data });
    return created;
}

const putVentaProducto = async (id, data) => {
    const existing = await prisma.ventaProducto.findFirst({ where: { id: id } });
    if (!existing) { const error = new Error('DATA_NOT_FOUND'); error.code = 'DATA_NOT_FOUND'; throw error; }
    // if ventaId/productoId being changed, ensure uniqueness
    if ((typeof data.ventaId !== 'undefined' && data.ventaId !== existing.ventaId) || (typeof data.productoId !== 'undefined' && data.productoId !== existing.productoId)) {
        const check = await prisma.ventaProducto.findFirst({ where: { ventaId: data.ventaId ?? existing.ventaId, productoId: data.productoId ?? existing.productoId } });
        if (check && check.id !== existing.id) { const error = new Error('CONFLICT'); error.code = 'CONFLICT'; throw error; }
    }
    const updated = await prisma.ventaProducto.update({ where: { id: id }, data });
    return updated;
}

const deleteVentaProducto = async (id) => {
    const existing = await prisma.ventaProducto.findFirst({ where: { id: id } });
    if (!existing) { const error = new Error('DATA_NOT_FOUND'); error.code = 'DATA_NOT_FOUND'; throw error; }
    const deleted = await prisma.ventaProducto.delete({ where: { id: id } });
    return deleted;
}

export {
    getVentaProductos,
    getVentaProducto,
    postVentaProducto,
    putVentaProducto,
    deleteVentaProducto,
}
