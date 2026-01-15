import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";

const getMarcas = async () => {
    const marcas = await prisma.marca.findMany({
        where: {
            estadoId: {
                not: estados().inactivo
            }
        },
        include: {
            estado: true,
        },
        orderBy: { id: 'desc' },
    });
    if (!marcas) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return marcas;
}

const getMarca = async (id) => {
    const marca = await prisma.marca.findUnique({
        where: { 
            id: id,estadoId: {
                not: estados().inactivo
            }
        },
        include: {
            estado: true,
        },
    });
    if (!marca) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return marca;
}

const postMarca = async (data) => {
    const existingMarca = await prisma.marca.findUnique({
        where: { marca: data.marca },
    });
    if (existingMarca) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }
    const newMarca = await prisma.marca.create({
        data,
    });

    return newMarca;
}

const putMarca = async (id, data) => {
    const existingMarca = await prisma.marca.findUnique({
        where: { id: id },
    });
    if (!existingMarca) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const updatedMarca = await prisma.marca.update({
        where: { id: id },
        data,
    });
    return updatedMarca;
}

const deleteMarca = async (id) => {
    const existingMarca = await prisma.marca.findUnique({
        where: { id: id },
    });
    if (!existingMarca) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const deletedMarca = await prisma.marca.update({
        where: { id: id },
        data: { estadoId: 2 },
    });
    return deletedMarca;
}

export {
    getMarcas,
    getMarca,
    postMarca,
    putMarca,
    deleteMarca,
}