import prisma from "../configs/db.config.js";

const getCilindradas = async () => {
    const cilindradas = await prisma.cilindrada.findMany();

    if (!cilindradas) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    return cilindradas;
}

const getCilindrada = async (id) => {
    const cilindrada = await prisma.cilindrada.findUnique({
        where: { id: id }
    });

    if (!cilindrada) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    return cilindrada;
}

const postCilindrada = async (data) => {
    const existingCilindrada = await prisma.cilindrada.findUnique({
        where: { cilindrada: data.cilindrada },
    });
    if (existingCilindrada) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }
    const newCilindrada = await prisma.cilindrada.create({
        data,
    });
    return newCilindrada;
}

const putCilindrada = async (id, data) => {
    const existingCilindrada = await prisma.cilindrada.findUnique({
        where: { id: id },
    });
    if (!existingCilindrada) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const updatedCilindrada = await prisma.cilindrada.update({
        where: { id: id },
        data,
    });
    return updatedCilindrada;
}

const deleteCilindrada = async (id) => {
    const existingCilindrada = await prisma.cilindrada.findUnique({
        where: { id: id },
    });
    if (!existingCilindrada) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const deletedCilindrada = await prisma.cilindrada.update({
        where: { id: id },
        data: { estadoId: 2 },
    });
    return deletedCilindrada;
}

export {
    getCilindradas,
    getCilindrada,
    postCilindrada,
    putCilindrada,
    deleteCilindrada,
}

