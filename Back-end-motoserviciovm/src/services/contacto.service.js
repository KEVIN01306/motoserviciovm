import prisma from "../configs/db.config.js";

const getContactos = async () => {
    const contactos = await prisma.contacto.findMany({ orderBy: { id: 'asc' } });
    if (!contactos || contactos.length === 0) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return contactos;
}

const getContacto = async (id) => {
    const contacto = await prisma.contacto.findUnique({ where: { id: id } });
    if (!contacto) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return contacto;
}

const postContacto = async (data) => {
    const newContacto = await prisma.contacto.create({ data });
    return newContacto;
}

const putContacto = async (id, data) => {
    const existing = await prisma.contacto.findUnique({ where: { id: id } });
    if (!existing) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const updated = await prisma.contacto.update({ where: { id: id }, data });
    return updated;
}

const deleteContacto = async (id) => {
    const existing = await prisma.contacto.findUnique({ where: { id: id } });
    if (!existing) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const deleted = await prisma.contacto.delete({ where: { id: id } });
    return deleted;
}

export {
    getContactos,
    getContacto,
    postContacto,
    putContacto,
    deleteContacto,
}
