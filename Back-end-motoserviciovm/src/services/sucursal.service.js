import prisma from "../configs/db.config.js";

const getSucursales = async () => {
    const sucursales = await prisma.sucursal.findMany();
    if (!sucursales) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return sucursales;
}

const getSucursal = async (id) => {
    const sucursal = await prisma.sucursal.findUnique({
        where: { id: id },
    });
    if (!sucursal) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return sucursal;
}

const postSucursal = async (data) => {
    const existingSucursal = await prisma.sucursal.findUnique({
        where: { nombre: data.nombre },
    });
    if (existingSucursal) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }
    const newSucursal = await prisma.sucursal.create({
        data,
    });
    return newSucursal;
}


const putSucursal = async (id, data) => {
    const sucursal = await prisma.sucursal.findUnique({
        where: { id: id },
    });
    if (!sucursal) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const updatedSucursal = await prisma.sucursal.update({
        where: { id: id },
        data,
    });
    return updatedSucursal;
}


const deleteSucursal = async (id) => {
    const sucursal = await prisma.sucursal.findUnique({
        where: { id: id },
    });
    if (!sucursal) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    await prisma.sucursal.delete({
        where: { id: id },
    });
}

export {
    getSucursales,
    getSucursal,
    postSucursal,
    putSucursal,
    deleteSucursal
}