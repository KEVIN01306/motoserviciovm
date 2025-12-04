import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";

const getCategoriasProducto = async () => {
    const categorias = await prisma.categoriaProducto.findMany({
        where: { estadoId: { not: estados().inactivo } },
        orderBy: { categoria: 'asc' },
    });
    if (!categorias || categorias.length === 0) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return categorias;
};

const getCategoriaProducto = async (id) => {
    const categoria = await prisma.categoriaProducto.findUnique({
        where: { id: id, estadoId: { not: estados().inactivo } },
    });
    if (!categoria) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return categoria;
}

const postCategoriaProducto = async (data) => {
    const existingCategoria = await prisma.categoriaProducto.findUnique({
        where: { categoria: data.categoria },
    });
    if (existingCategoria) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }
    const { productos: productoIds, ...restData } = data;

    const productoConnect = (productoIds || []).map(productoId => ({ id: productoId }));
    const newCategoria = await prisma.categoriaProducto.create({
        data: {
            ...restData,
            productos: {
                connect: productoConnect,
            },
        },
    });
    return newCategoria;
};

const putCategoriaProducto = async (id, data) => {
    const existingCategoria = await prisma.categoriaProducto.findUnique({
        where: { id: id },
    });
    if (!existingCategoria) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const { productos: productoIds, ...restData } = data;

    const productoConnect = (productoIds || []).map(productoId => ({ id: productoId }));
    const updatedCategoria = await prisma.categoriaProducto.update({
        where: { id: id },
        data: {
            ...restData,
            productos: {
                connect: productoConnect,
            },
        },
    });
    return updatedCategoria;
};

const deleteCategoriaProducto = async (id) => {
    const existingCategoria = await prisma.categoriaProducto.findUnique({
        where: { id: id },
    });
    if (!existingCategoria) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const deletedCategoria = await prisma.categoriaProducto.update({
        where: { id: id },
        data: { estadoId: estados().inactivo },
    });
    return deletedCategoria;
};

export {
    getCategoriasProducto,
    getCategoriaProducto,
    postCategoriaProducto,
    putCategoriaProducto,
    deleteCategoriaProducto,
};