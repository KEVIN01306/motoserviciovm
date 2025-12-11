import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";

const getOpcionesServicio = async () => {
    const opciones = await prisma.opcionServicio.findMany({
        where: { estadoId: {not: estados().inactivo }},
        orderBy: { opcion: 'asc' },
    });

    if (!opciones) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return opciones;
};

const getOpcionServicio = async (id) => {
    const opcion = await prisma.opcionServicio.findFirst({
        where: { id: id, estadoId: {not: estados().inactivo }},
    });
    if (!opcion) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return opcion;
}

const postOpcionServicio = async (data) => {

    const existingOpcion = await prisma.opcionServicio.findUnique({
        where: { opcion: data.opcion },
    });

    if (existingOpcion) {
    const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }


    const opcion = await prisma.opcionServicio.create({
        data,
    });

    return opcion;
};


const putOpcionServicio = async (id, data) => {
    const existingOpcion = await prisma.opcionServicio.findUnique({
        where: { id: id },
    });

    if (!existingOpcion) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const opcion = await prisma.opcionServicio.update({
        where: { id: id },
        data,
    });


    return opcion;
};

const deleteOpcionServicio = async (id) => {
    const existingOpcion = await prisma.opcionServicio.findUnique({
        where: { id: id },
    });

    if (!existingOpcion) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const opcion = await prisma.opcionServicio.update({
        where: { id: id },
        data: { estadoId: estados().inactivo },
    });
    return opcion;
};

export { 
    getOpcionesServicio, 
    getOpcionServicio,
    postOpcionServicio, 
    putOpcionServicio, 
    deleteOpcionServicio 
};