import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";

const getEnReparaciones = async () => {
    const items = await prisma.enReparacion.findMany({
        where: { estadoId: { not: estados().inactivo } },
        orderBy: { id: 'asc' },
        include: {
            servicio: { include: { moto: { include: { modelo: true, users: true } } } },
            estado: true,
        },
    });
    if (!items) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return items;
};

const getEnReparacion = async (id) => {
    const item = await prisma.enReparacion.findUnique({
        where: { id: id, estadoId: { not: estados().inactivo } },
        include: { servicio: { include: { moto: { include: { modelo: true, users: true } } } }, estado: true, repuestos: true, ventas: {include: {estado: true,productos:{include: {producto: true}}}}  },
    });
    if (!item) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return item;
};

const postEnReparacion = async (data) => {
    // prevent duplicate active reparacion for same moto
    const existing = await prisma.enReparacion.findFirst({ where: { motoId: data.motoId, estadoId: estados().activo } });
    // ensure moto exists
    const moto = await prisma.moto.findUnique({ where: { id: data.motoId } });
    if (!moto) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    
    if (moto.estadoId === estados().enReparacion) {
        const error = new Error('MOTO_ALREADY_IN_REPARATION');
        error.code = 'MOTO_ALREADY_IN_REPARATION';
        throw error;
    }

    if (existing) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }

    
    await prisma.moto.update({
        where: { id: data.motoId },
        data: { estadoId: estados().enReparacion },
    });

    

    const created = await prisma.enReparacion.create({
        data
    });
    return created;
};

const putEnReparacion = async (id, data) => {
    const existing = await prisma.enReparacion.findUnique({ where: { id } });
    if (!existing) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const updated = await prisma.enReparacion.update({ where: { id }, data: data} );
    return updated;
};

const putEnReparacionSalida = async (id, data, firmaSalidaFile) => {
    try {
        await prisma.$transaction(async (tx) => {
            // Validate if enReparacion exists
            const existing = await tx.enReparacion.findUnique({ where: { id } });
            if (!existing) {
                const error = new Error('DATA_NOT_FOUND');
                error.code = 'DATA_NOT_FOUND';
                throw error;
            }

            // Validate if servicio exists
            const servicio = await tx.servicio.findUnique({ where: { id: existing.servicioId }, include: { enParqueos: true } });
            if (!servicio) {
                const error = new Error('SERVICIO_NOT_FOUND');
                error.code = 'SERVICIO_NOT_FOUND';
                throw error;
            }

            const isTermino = servicio.enParqueos.every(parqueo => parqueo.estadoId === estados().activo);

            const motoId = servicio.motoId;

            // Update servicio state
            await tx.servicio.update({
                where: { id: existing.servicioId },
                data: { estadoId: isTermino ? estados().enParqueo : estados().enServicio },
            });

            // Update moto state
            await tx.moto.update({ where: { id: motoId }, data: { estadoId: isTermino ? estados().enParqueo : estados().enServicio } });

            // Add fechaSalida to data
            const fechaSalida = new Date();
            data.fechaSalida = fechaSalida;

            // Handle firmaSalida file
            if (firmaSalidaFile) {
                const firmaPath = `/uploads/enReparaciones/${firmaSalidaFile.filename}`;
                data.firmaSalida = firmaPath;
            }

            // Update enReparacion
            const updated = await tx.enReparacion.update({
                where: { id },
                data: { ...data, estadoId: estados().entregado },
                include: { repuestos: true },
            });

            return updated;
        },{ timeout: 30000, maxWait: 10000 } );

        return { success: true };
    } catch (err) {
        console.error("Error in putEnReparacionSalida:", err);
        throw new Error('INTERNAL_SERVER_ERROR');
    }
};
const putRepuestosReparacion = async (enReparacionId, repuestos) => {
    try {
        // 1. Preparamos los datos FUERA de la transacción para ahorrar tiempo
        const dataParaInsertar = repuestos.map(repuesto => ({
            nombre: repuesto.nombre,
            descripcion: repuesto.descripcion,
            refencia: repuesto.refencia || "",
            cantidad: repuesto.cantidad,
            checked: repuesto.checked || false,
            reparacionId: enReparacionId, // Usamos el ID directo
            estadoId: repuesto.estadoId || estados().activo 
        }));

        // 2. Ejecutamos la transacción
        await prisma.$transaction(async (tx) => {
            // Eliminar existentes
            await tx.repuestosReparacion.deleteMany({
                where: { reparacionId: enReparacionId },
            });

            // Insertar todos de un solo golpe (Mucho más rápido que un loop)
            await tx.repuestosReparacion.createMany({
                data: dataParaInsertar,
            });
        }, {
            // AQUÍ es donde se pone el timeout
            maxWait: 5000,
            timeout: 15000 
        });

        return { success: true };
    } catch (err) {
        console.error("Error in putRepuestosReparacion:", err);
        throw err;
    }
};

export {
    getEnReparaciones,
    getEnReparacion,
    postEnReparacion,
    putEnReparacion,
    putEnReparacionSalida,
    putRepuestosReparacion,
    
};
