import prisma from "../configs/db.config.js";

const getTextos = async () => {
    const textos = await prisma.texto.findMany({ orderBy: { id: 'asc' } });
    if (!textos || textos.length === 0) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return textos;
}

const getTexto = async (id) => {
    const texto = await prisma.texto.findUnique({ where: { id: id } });
    if (!texto) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return texto;
}

const postTexto = async (data) => {
    const newTexto = await prisma.texto.create({ data });
    return newTexto;
}

const putTexto = async (id, data) => {
    const existing = await prisma.texto.findUnique({ where: { id: id } });
    if (!existing) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const updated = await prisma.texto.update({ where: { id: id }, data });
    return updated;
}

const deleteTexto = async (id) => {
    const existing = await prisma.texto.findUnique({ where: { id: id } });
    if (!existing) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const deleted = await prisma.texto.delete({ where: { id: id } });
    return deleted;
}

export {
    getTextos,
    getTexto,
    postTexto,
    putTexto,
    deleteTexto,
}
