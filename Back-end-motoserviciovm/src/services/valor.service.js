import prisma from "../configs/db.config.js";

const getValores = async () => {
    const valores = await prisma.valor.findMany({ orderBy: { id: 'asc' } });
    if (!valores || valores.length === 0) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return valores;
}

const getValor = async (id) => {
    const valor = await prisma.valor.findUnique({ where: { id: id } });
    if (!valor) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return valor;
}

const postValor = async (data) => {
    const newValor = await prisma.valor.create({ data });
    return newValor;
}

const putValor = async (id, data) => {
    const existing = await prisma.valor.findUnique({ where: { id: id } });
    if (!existing) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const updated = await prisma.valor.update({ where: { id: id }, data });
    return updated;
}

const deleteValor = async (id) => {
    const existing = await prisma.valor.findUnique({ where: { id: id } });
    if (!existing) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const deleted = await prisma.valor.delete({ where: { id: id } });
    return deleted;
}

export {
    getValores,
    getValor,
    postValor,
    putValor,
    deleteValor,
}
