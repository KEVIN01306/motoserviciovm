import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";

const getLineas = async () => {
    const lineas = await prisma.linea.findMany({
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

    if (!lineas) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    return lineas;
}


const getLinea = async (id) => {
    const linea = await prisma.linea.findUnique({
        where: { id: id,estadoId: {
            not: estados().inactivo
        } },
        
        include: {
            estado: true,
        },
    });

    if (!linea) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    return linea;
}

const postLinea = async (data) => {
    const existingLinea = await prisma.linea.findUnique({
        where: { linea: data.linea },
    });
    if (existingLinea) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }
    const newLinea = await prisma.linea.create({
        data,
    });
    return newLinea;
}

const putLinea = async (id, data) => {
    const existingLinea = await prisma.linea.findUnique({
        where: { id: id },
    });
    if (!existingLinea) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const updatedLinea = await prisma.linea.update({
        where: { id: id },
        data,
    });
    return updatedLinea;
}

const deleteLinea = async (id) => {
    const existingLinea = await prisma.linea.findUnique({
        where: { id: id },
    });
    if (!existingLinea) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    
    const deletedLinea = await prisma.linea.update({
        where: { id: id },
        data: { estadoId: 2 },
    });
    return deletedLinea;
}

export {
    getLineas,
    getLinea,
    postLinea,
    putLinea,
    deleteLinea,
}