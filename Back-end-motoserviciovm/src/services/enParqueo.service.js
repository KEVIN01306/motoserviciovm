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

const putEnParqueoSalida = async (id, data, firmaSalidaFile) => {
    try {
        await prisma.$transaction(async (tx) => {
            // Validate if enParqueo exists
            const existing = await tx.enParqueo.findUnique({ where: { id } });
            if (!existing) {
                const error = new Error('DATA_NOT_FOUND');
                error.code = 'DATA_NOT_FOUND';
                throw error;
            }

            // Validate if servicio exists
            const servicio = await tx.servicio.findUnique({ where: { id: existing.servicioId } });
            if (!servicio) {
                const error = new Error('SERVICIO_NOT_FOUND');
                error.code = 'SERVICIO_NOT_FOUND';
                throw error;
            }

            // Add fechaSalida to data
            const fechaSalida = new Date();
            data.fechaSalida = fechaSalida;

            // Handle firmaSalida file
            if (firmaSalidaFile) {
                const firmaPath = `/uploads/enParqueos/${firmaSalidaFile.filename}`;
                data.firmaSalida = firmaPath;
            }

            // Update enParqueo
            const updated = await tx.enParqueo.update({
                where: { id },
                data: { ...data, estadoId: estados().entregado },
            });

            console.log("Updated enParqueo record:", updated);

            return updated;
        });

        return { success: true };
    } catch (err) {
        console.error("Error in putEnParqueoSalida:", err);
        throw new Error('INTERNAL_SERVER_ERROR');
    }
};

export {
        getEnParqueos,
        getEnParqueo,
        postEnParqueo,
        putEnParqueoSalida
    }