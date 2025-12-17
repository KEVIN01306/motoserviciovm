import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";

const getEnParqueos = async () => {
    const enParqueo = await prisma.enParqueo.findMany({
        where: { estadoId: {not: estados().inactivo} },
        orderBy: { id: 'asc' },
        include: {
            moto: {
                include: {
                    modelo: true,
                    users: true,
                }
            },
            estado: true,
        }
    });
    if (!enParqueo) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return enParqueo;
}

const getEnParqueo = async (id) => {
    const enParqueo = await prisma.enParqueo.findUnique({
        where: { id: id ,estadoId: {not: estados().inactivo} },
        include: {
            moto: {
                include: {
                    modelo: true,
                    users: true,
                }
            },
            estado: true,
        }
    });

    if (!enParqueo) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return  enParqueo ;
}

const postEnParqueo = async (data) => {
    const existingEnParqueo = await prisma.enParqueo.findFirst({
        where: { motoId: data.motoId, estadoId: estados().activo },
    });

    if (existingEnParqueo) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }
    await prisma.moto.update({
        where: { id: data.motoId },
        data: { estadoId: estados().enParqueo },
    })
    const newEnParqueo = await prisma.enParqueo.create({
        data: data,
    });

    return newEnParqueo;
}

const putEnParqueoSalida = async (id, data) => {
    const existingEnParqueo = await prisma.enParqueo.findUnique({
        where: { id: id },
    });

    if (!existingEnParqueo) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    await prisma.moto.update({
        where: { id: existingEnParqueo.motoId },
        data: { estadoId: estados().activo },
    });

    const fechaSalida = new Date();
    data.fechaSalida = fechaSalida;

    const updatedEnParqueo = await prisma.enParqueo.update({
        where: { id: id },
        data: {
            ...data,
            estadoId: estados().entregado,
        },
    });
    return updatedEnParqueo;
}

export {
    getEnParqueos,
    getEnParqueo,
    postEnParqueo, 
    putEnParqueoSalida
}