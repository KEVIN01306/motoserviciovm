import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";

const getInventarios = async () => {
    const inventarios = await prisma.inventario.findMany({
        where: { estadoId: { not: estados().inactivo } },
        orderBy: { item: 'asc' },
        
    });
    if (!inventarios) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return inventarios;
}

const getInventario = async (id) => {
    const inventario = await prisma.inventario.findUnique({
        where: { id: id, estadoId: { not: estados().inactivo } },
    });
    if (!inventario) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return inventario;
}

const postInventario = async (data) => {
    const existingInventario = await prisma.inventario.findFirst({
        where: { item: data.item },
    });
    if (existingInventario) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }
    const newInventario = await prisma.inventario.create({
        data: {
            ...data,
        },
    });
    return newInventario;
}


const putInventario = async (id, data) => {
    const existingInventario = await prisma.inventario.findUnique({
        where: { id: id },
    });
    if (!existingInventario) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const updatedInventario = await prisma.inventario.update({
        where: { id: id },
        data: {
            ...data,
        },
    });
    return updatedInventario;
}


const deleteInventario = async (id) => {
    const existingInventario = await prisma.inventario.findUnique({
        where: { id: id },
    });
    if (!existingInventario) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const deletedInventario = await prisma.inventario.update({
        where: { id: id },
        data: { estadoId: estados().inactivo },
    });
    return deletedInventario;
}

export {
    getInventarios,
    getInventario,
    postInventario,
    putInventario,
    deleteInventario,
}