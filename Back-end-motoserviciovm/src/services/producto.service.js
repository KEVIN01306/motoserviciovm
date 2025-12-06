import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";
import { deleteImage } from "../utils/fileUtils.js";

const getProductos = async () => {
    const productos = await prisma.producto.findMany({
        where: { estadoId: { not: estados().inactivo } },
        orderBy: { nombre: 'asc' },
        include: { categoria: true },
    });
    if (!productos || productos.length === 0) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return productos;
}

const getProducto = async (id) => {
    const producto = await prisma.producto.findFirst({
        where: { id: id, estadoId: { not: estados().inactivo } },
        include: { categoria: true },
    });
    if (!producto) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return producto;
}

const postProducto = async (data) => {
    const existingProducto = await prisma.producto.findFirst({
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
    const existingProducto = await prisma.producto.findFirst({
        where: { id: id },
    });
    if (!existingProducto) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const oldImagen = existingProducto.imagen;
    if (data.imagen && data.imagen !== oldImagen) {
       try {
            await deleteImage(oldImagen);
       } catch (error) {
            console.error('Error deleting old image:', error);
       }
    }

    const updatedProducto = await prisma.producto.update({
        where: { id: id },
        data: data,
    });
    return updatedProducto;
}

const deleteProducto = async (id) => {
    const existingProducto = await prisma.producto.findFirst({
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