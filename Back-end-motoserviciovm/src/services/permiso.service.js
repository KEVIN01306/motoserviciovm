import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";


const getPermisos = async () => {
    const permisos =  await prisma.permiso.findMany({
        where: {
            estadoId: {
                not: estados().inactivo
            }
        },
    });  
    if (!permisos) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return permisos;
}

const getPermiso = async (id) => {
    const permiso = await prisma.permiso.findUnique({
        where: { id: id ,estadoId: {
            not: estados().inactivo
        } },
    });
    if (!permiso) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return permiso;
}

const postPermiso = async (data) => {
    const existingPermiso = await prisma.permiso.findUnique({
        where: { permiso: data.permiso },
    });
    if (existingPermiso) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }
    const newPermiso = await prisma.permiso.create({
        data,
    });
    return newPermiso;
}

const updatePermiso = async (id, data) => {
    const permiso = await prisma.permiso.findUnique({
        where: { id: id },
    });
    if (!permiso) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const updatedPermiso = await prisma.permiso.update({
        where: { id: id },
        data,
    });
    return updatedPermiso;
}

const deletePermiso = async (id) => {
    const permiso = await prisma.permiso.findUnique({
        where: { id: id },
    });
    if (!permiso) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const deletedPermiso = await prisma.permiso.delete({
        where: { id: id },
    });
    return deletedPermiso;
}

export {
    getPermisos,
    getPermiso,
    postPermiso,
    updatePermiso,
    deletePermiso,
}