import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";

const getRoles = async () => {
    const roles = await prisma.rol.findMany({
        where: {
            estadoId: {
                not: estados().inactivo
            }
        },
        include: { permisos: true }
    });
    

    if (!roles) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    return roles;
}


const getRol = async (id) => {
    const rol = await prisma.rol.findUnique({
        where: { id: id, estadoId: {
            not: estados().inactivo
        } },
        include: { permisos: true }
    });
    if (!rol) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return rol;
}

const postRol = async (data) => {
    const existingRol = await prisma.rol.findUnique({
        where: { rol: data.rol },
    }); 

    if (existingRol) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }

    const { permisos: permisoIds, ...rolData } = data;

    const permisosConnect = (permisoIds || []).map(permisoId => ({
        id: permisoId
    }))

    const newRol = await prisma.rol.create({
        data: {
            ...rolData,
            permisos: {
                connect: permisosConnect
            }
        },
    });
    return newRol;
}

const putRol = async (id, data) => {
    const rol = await prisma.rol.findUnique({
        where: { id: id },
    }); 
    if (!rol) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const { permisos: permisoIds, ...rolData } = data;

    const permisosConnect = (permisoIds || []).map(permisoId => ({
        id: permisoId
    }))
    const updatedRol = await prisma.rol.update({
        where: { id: id },
        data: {
            ...rolData,
            permisos: {
                set: permisosConnect
            }
        },
    });
    return updatedRol;
}

const deleteRol = async (id) => {
    const rol = await prisma.rol.findUnique({
        where: { id: id },
    });
    if (!rol) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const deletedRol = await prisma.rol.delete({
        where: { id: id },
    });
    return deletedRol;
}

export {
    getRoles,
    getRol,
    postRol,
    putRol,
    deleteRol
}