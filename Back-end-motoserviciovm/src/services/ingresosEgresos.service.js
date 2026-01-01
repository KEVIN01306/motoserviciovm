import prisma from '../configs/db.config.js';
import { estados } from '../utils/estados.js';

const postIngresoEgreso = async (data) => {
    return await prisma.ingresosEgresos.create({ data });
};

const getIngresosEgresos = async () => {
    const ingresosEgresos = await prisma.ingresosEgresos.findMany({
        where: {
            estadoId: {
                not: estados().inactivo,
            },
        },
            
        orderBy: { createdAt: 'desc' },
        include: { tipo: true, sucursal: true,estado: true },
    });

    if (!ingresosEgresos) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    return ingresosEgresos;
};

const getIngresoEgreso = async (id) => {
    const ingresoEgreso = await prisma.ingresosEgresos.findUnique({
        where: {
            id: id,
            estadoId: {
                not: estados().inactivo,
            },
        },
        include: { tipo: true, sucursal: true, estado: true, moduloTaller: true },   
    });

    if (!ingresoEgreso) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    return ingresoEgreso;
};

const putIngresoEgreso = async (id, data) => {
    const existingIngresoEgreso = await prisma.ingresosEgresos.findUnique({
        where: { id: id },
    });
    if (!existingIngresoEgreso) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const updatedIngresoEgreso = await prisma.ingresosEgresos.update({
        where: { id: id },
        data,
    });
    return updatedIngresoEgreso;
};

const deleteIngresoEgreso = async (id) => {
    const existingIngresoEgreso = await prisma.ingresosEgresos.findUnique({
        where: { id: id },
    });
    if (!existingIngresoEgreso) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const deletedIngresoEgreso = await prisma.ingresosEgresos.update({
        where: { id: id },
        data: { estadoId: estados().inactivo },
    });
    return deletedIngresoEgreso;
};

const finalizarIngresoEgreso = async (id) => {
    const existingIngresoEgreso = await prisma.ingresosEgresos.findUnique({
        where: { id: id },
    });
    if (!existingIngresoEgreso) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const finalizedIngresoEgreso = await prisma.ingresosEgresos.update({
        where: { id: id },
        data: { estadoId: estados().confirmado },
    });
    return finalizedIngresoEgreso;
};

const cancelarIngresoEgreso = async (id) => {
    const existingIngresoEgreso = await prisma.ingresosEgresos.findUnique({
        where: { id: id },
    });
    if (!existingIngresoEgreso) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const canceledIngresoEgreso = await prisma.ingresosEgresos.update({
        where: { id: id },
        data: { estadoId: estados().cancelado },
    });
    return canceledIngresoEgreso;
};

export {
    postIngresoEgreso,
    getIngresosEgresos,
    getIngresoEgreso,
    putIngresoEgreso,
    deleteIngresoEgreso,
    finalizarIngresoEgreso,
    cancelarIngresoEgreso,
};