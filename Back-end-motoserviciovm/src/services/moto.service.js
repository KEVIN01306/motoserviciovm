import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";

const getMotos = async () => {
    const motos = await prisma.moto.findMany({
        include: {
            modelo: true,
            users: true,
            estado: true,
        },
        where: { estadoId: {
            not: estados().inactivo
        },
     },
    });
    if (!motos) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return motos;
}

const getMoto = async (id) => {
    const moto = await prisma.moto.findUnique({
        include: {
            modelo: true,
            users: true,
            estado: true,
        },
        where: { id: id ,estadoId: {
            not: estados().inactivo
        } },
    });
    if (!moto) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return moto;
}

const postMoto = async (data) => {
    const existingMoto = await prisma.moto.findUnique({
        where: { placa: data.placa },
    });
    if (existingMoto) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }
    const newMoto = await prisma.moto.create({
        data,
    });
    return newMoto;
}

const putMoto = async (id, data) => {
    const moto = await prisma.moto.findUnique({
        where: { id: id },
    });
    if (!moto) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const updatedMoto = await prisma.moto.update({
        where: { id: id },
        data,
    });
    return updatedMoto;
}

const deleteMoto = async (id) => {
    const moto = await prisma.moto.findUnique({
        where: { id: id },
    });
    if (!moto) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const deletedMoto = await prisma.moto.update({
        where: { id: id },
        data: { estadoId: estados().inactivo }
    });
    return deletedMoto;
}

export {
    getMotos,
    getMoto,
    postMoto,
    putMoto,
    deleteMoto,
}