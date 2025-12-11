import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";

const getTiposServicio = async () => {
    const tipos = await prisma.tipoServicio.findMany({
        where: { estadoId: estados().activo },
        orderBy: { tipo: 'asc' },
    });

    if (!tipos) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return tipos;
};

const getTipoServicio = async (id) => {
    const tipo = await prisma.tipoServicio.findUnique({
        where: { id: id, estadoId: estados().activo },
        include: { opcionServicios: true },
    });
    if (!tipo) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return tipo;
}

const postTipoServicio = async (data) => {
    const existingTipo = await prisma.tipoServicio.findUnique({
        where: { tipo: data.tipo },
    });
    if (existingTipo) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }

    const { opcionServicios: opcionServicioIds, ...restData } = data;

    const opcionServicioConnect = (opcionServicioIds || []).map(opcionServicioId => ({ id: opcionServicioId }));

    const newTipo = await prisma.tipoServicio.create({
        data: {
            ...restData,
            opcionServicios: {
                connect: opcionServicioConnect
            }
        },
    });
    return newTipo;
};

const putTipoServicio = async (id, data) => {
    const existingTipo = await prisma.tipoServicio.findUnique({
        where: { id: id },
    });
    if (!existingTipo) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const { opcionServicios: opcionServicioIds, ...restData } = data;

    const opcionServicioConnect = (opcionServicioIds || []).map(opcionServicioId => ({ id: opcionServicioId }));

    const updateData = {
        ...restData,
        opcionServicios: {
            connect: opcionServicioConnect
        }
    };

    const updatedTipo = await prisma.tipoServicio.update({
        where: { id: id },
        data: updateData,
    });
    return updatedTipo;
};

const deleteTipoServicio = async (id) => {
    const existingTipo = await prisma.tipoServicio.findUnique({
        where: { id: id },
    });
    if (!existingTipo) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const deletedTipo = await prisma.tipoServicio.update({
        where: { id: id },
        data: { estadoId: estados().inactivo },
    });
    return deletedTipo;
};

export {
    getTiposServicio,
    getTipoServicio,
    postTipoServicio,
    putTipoServicio,
    deleteTipoServicio,
};