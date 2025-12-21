import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";

const getEnReparaciones = async () => {
    const items = await prisma.enReparacion.findMany({
        where: { estadoId: { not: estados().inactivo } },
        orderBy: { id: 'asc' },
        include: {
            moto: { include: { modelo: true, users: true } },
            estado: true,
        },
    });
    if (!items) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return items;
};

const getEnReparacion = async (id) => {
    const item = await prisma.enReparacion.findUnique({
        where: { id: id, estadoId: { not: estados().inactivo } },
        include: { moto: { include: { modelo: true, users: true } }, estado: true, repuestos: true },
    });
    if (!item) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return item;
};

const postEnReparacion = async (data) => {
    // prevent duplicate active reparacion for same moto
    const existing = await prisma.enReparacion.findFirst({ where: { motoId: data.motoId, estadoId: estados().activo } });
    // ensure moto exists
    const moto = await prisma.moto.findUnique({ where: { id: data.motoId } });
    if (!moto) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    if (moto.estadoId === estados().enParqueo) {
        const error = new Error('MOTO_IN_PARKING');
        error.code = 'MOTO_IN_PARKING';
        throw error;
    }

    if (moto.estadoId === estados().enReparacion) {
        const error = new Error('MOTO_ALREADY_IN_REPARATION');
        error.code = 'MOTO_ALREADY_IN_REPARATION';
        throw error;
    }

    if (existing) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }

    await prisma.moto.update({
        where: { id: data.motoId },
        data: { estadoId: estados().enReparacion },
    });

    const created = await prisma.enReparacion.create({
        data
    });
    return created;
};

const putEnReparacion = async (id, data) => {
    const existing = await prisma.enReparacion.findUnique({ where: { id } });
    if (!existing) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const updated = await prisma.enReparacion.update({ where: { id }, data: { ...data }, include: { moto: { include: { modelo: true, users: true } }, estado: true } });
    return updated;
};

const putEnReparacionSalida = async (id, data) => {
    const existing = await prisma.enReparacion.findUnique({ where: { id } });
    if (!existing) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    // set moto to activo
    await prisma.moto.update({ where: { id: existing.motoId }, data: { estadoId: estados().activo } });

    const fechaSalida = new Date();
    data.fechaSalida = fechaSalida;

    const updated = await prisma.enReparacion.update({ where: { id }, data: { ...data, estadoId: estados().entregado }, include: { repuestos: true } });
    return updated;
};

export {
    getEnReparaciones,
    getEnReparacion,
    postEnReparacion,
    putEnReparacion,
    putEnReparacionSalida,
    
};
