import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";

const getProductos = async () => {
    const productos = await prisma.producto.findMany({
        where: { estadoId: { not: estados().inactivo } },
        orderBy: { nombre: 'asc' },
    });
    if (!productos || productos.length === 0) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return productos;
}

const getProducto = async (id) => {
    const producto = await prisma.producto.findUnique({
        where: { id: id, estadoId: { not: estados().inactivo } },
    });
    if (!producto) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return producto;
}

const postProducto = async (data) => {
    const existingProducto = await prisma.producto.findUnique({
        where: { nombre: data.nombre },
    });
    if (existingProducto) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }
    const newProducto = await prisma.producto.create({
        data: data,
    });
    return newProducto;
}

const putProducto = async (id, data) => {
    const existingProducto = await prisma.producto.findUnique({
        where: { id: id },
    });
    if (!existingProducto) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const updatedProducto = await prisma.producto.update({
        where: { id: id },
        data: data,
    });
    return updatedProducto;
}

const deleteProducto = async (id) => {
    const existingProducto = await prisma.producto.findUnique({
        where: { id: id },
    });
    if (!existingProducto) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const deletedProducto = await prisma.producto.update({
        where: { id: id },
        data: { estadoId: estados().inactivo },
    });
    return deletedProducto;
}

export {
    getProductos,
    getProducto,
    postProducto,
    putProducto,
    deleteProducto,
}