import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";

const getEnParqueos = async () => {
    const enParqueo = await prisma.enParqueo.findMany({
        where: { estadoId: { not: estados().inactivo } },
        orderBy: { id: 'asc' },
        include: {
            servicio: {
                include: {
                    moto: {
                        include: {
                            modelo: true,
                            users: true,
                        }
                    },
                }
            },
            estado: true,
        }
    });
    if (!enParqueo) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return enParqueo;
}

const getEnParqueo = async (id) => {
    const enParqueo = await prisma.enParqueo.findUnique({
        where: { id: id, estadoId: { not: estados().inactivo } },
        include: {
            servicio: {
                include: {
                    moto: {
                        include: {
                            modelo: true,
                            users: true,
                        }
                    },
                }
            },
            estado: true,
        }
    });

    if (!enParqueo) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return enParqueo;
}

const postEnParqueo = async (data) => {
    const existingEnParqueo = await prisma.enParqueo.findFirst({
        where: { motoId: data.motoId, estadoId: estados().activo },
    });
    const moto = await prisma.moto.findUnique({
        where: { id: data.motoId },
    });
    if (!moto) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    if (moto.estadoId === estados().enReparacion) {
        const error = new Error('MOTO_IN_REPARATION');
        error.code = 'MOTO_IN_REPARATION';
        throw error;
    }

    if (moto.estadoId === estados().enParqueo) {
        const error = new Error('MOTO_ALREADY_IN_PARKING');
        error.code = 'MOTO_ALREADY_IN_PARKING';
        throw error;
    }

    if (existingEnParqueo) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }
    await prisma.moto.update({
        where: { id: data.motoId },
        data: { estadoId: estados().enParqueo },
    })
    const newEnParqueo = await prisma.enParqueo.create({
        data: data,
    });

    return newEnParqueo;
}

const putEnParqueoSalida = async (id, data) => {

    try {
        await prisma.$transaction(async (tx) => {
            const existingEnParqueo = await tx.enParqueo.findUnique({
                where: { id: id },
            });

            if (!existingEnParqueo) {
                const error = new Error('DATA_NOT_FOUND');
                error.code = 'DATA_NOT_FOUND';
                throw error;
            }

            const servicio = await tx.servicio.findUnique({ where: { id: existingEnParqueo.servicioId }, include: { enReparaciones: true } });
            if (!servicio) {
                const error = new Error('SERVICIO_NOT_FOUND');
                error.code = 'SERVICIO_NOT_FOUND';
                throw error;
            }

            const motoId = servicio.motoId;

            const isTermino = servicio.enReparaciones.every(reparacion => reparacion.estadoId === estados().activo);

            // Update servicio state
            await tx.servicio.update({
                where: { id: existingEnParqueo.servicioId },
                data: { estadoId: isTermino ? estados().enReparacion : estados().enServicio },
            });


            await tx.moto.update({
                where: { id: motoId },
                data: { estadoId: isTermino ? estados().enReparacion : estados().enServicio },
            });

            const fechaSalida = new Date();
            data.fechaSalida = fechaSalida;

            const updatedEnParqueo = await tx.enParqueo.update({
                where: { id: id },
                data: {
                    ...data,
                    estadoId: estados().entregado,
                },
            });
            return updatedEnParqueo;
        }, { timeout: 30000, maxWait: 10000 }
        );
    } catch (error) {
        throw error;
    }
    
}

export {
        getEnParqueos,
        getEnParqueo,
        postEnParqueo,
        putEnParqueoSalida
    }