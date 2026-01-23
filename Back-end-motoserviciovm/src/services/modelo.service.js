import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";

const buildModeloNombre = async ({ marcaId, lineaId, año }) => {
    const [marca, linea] = await Promise.all([
        prisma.marca.findUnique({ where: { id: marcaId } }),
        prisma.linea.findUnique({ where: { id: lineaId } }),
    ]);

    if (!marca || !linea) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    return `${marca.marca} ${linea.linea} ${año}`;
}

const getModelos = async () => {
    const modelos = await prisma.modelo.findMany({
        where: {
            estadoId: {
                not: estados().inactivo
            }
        },
        include: {
            marca: true,
            linea: true,
            cilindrada: true,
            estado: true,
        },
        orderBy: { id: 'desc' },
    });

    if (!modelos) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    return modelos;
}

const getModelo = async (id) => {

    const modelo = await prisma.modelo.findUnique({
        where: { id: id, estadoId: {
            not: estados().inactivo
        } },
        include: {
            marca: true,
            linea: true,
            cilindrada: true,
            estado: true,
        },
    });

    if (!modelo) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    return modelo;
}

const postModelo = async (data) => {
    const modeloNombre = await buildModeloNombre(data);

    const existingModelo = await prisma.modelo.findUnique({
        where: { modelo: modeloNombre },
    });
    if (existingModelo) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }

    const newModelo = await prisma.modelo.create({
        data: {
            ...data,
            modelo: modeloNombre,
        },
        include: {
            marca: true,
            linea: true,
            cilindrada: true,
            estado: true,
        },
    });
    return newModelo;
}

const putModelo = async (id, data) => {
    const existingModelo = await prisma.modelo.findUnique({
        where: { id: id },
    });
    if (!existingModelo) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const modeloNombre = await buildModeloNombre(data);

    const duplicateModelo = await prisma.modelo.findUnique({
        where: { modelo: modeloNombre },
    });
    if (duplicateModelo && duplicateModelo.id !== id) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }

    const updatedModelo = await prisma.modelo.update({
        where: { id: id },
        data: {
            ...data,
            modelo: modeloNombre,
        },
        include: {
            marca: true,
            linea: true,
            cilindrada: true,
            estado: true,
        },
    });
    return updatedModelo;
}

const deleteModelo = async (id) => {

    const existingModelo = await prisma.modelo.findUnique({
        where: { id: id },
    });
    if (!existingModelo) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const deletedModelo = await prisma.modelo.update({
        where: { id: id },
        data: { estadoId: 2 },
        include: {
            marca: true,
            linea: true,
            cilindrada: true,
            estado: true,
        },
    });
    return deletedModelo;
}

export {
    getModelos,
    getModelo,
    postModelo,
    putModelo,
    deleteModelo,
}
