import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";
import fs from "fs";
import path from "path";
import { deleteImage } from "../utils/fileUtils.js";

const fsPromises = fs.promises;
const IMAGES_DIR = path.join(process.cwd(), "src", "imagenes", "motos");

async function ensureImagesDir() {
    await fsPromises.mkdir(IMAGES_DIR, { recursive: true });
}

function parseBase64Image(dataString) {
    if (!dataString) return null;
    const matches = dataString.match(/^data:(image\/[^;]+);base64,(.+)$/);
    if (matches) {
        const mime = matches[1];
        const data = matches[2];
        const ext = mime.split("/")[1].replace("jpeg", "jpg");
        return { ext, data, mime };
    }
    // If it's raw base64 without data: prefix, assume png
    // Heuristic: if long enough, treat as base64 payload
    const isLikelyBase64 = typeof dataString === 'string' && dataString.length > 200 && /^[A-Za-z0-9+/=\r\n]+$/.test(dataString.slice(0, 200));
    if (isLikelyBase64) {
        return { ext: 'png', data: dataString, mime: 'image/png' };
    }
    return null;
}

async function saveBase64ImageToFile(base64String) {
    const parsed = parseBase64Image(base64String);
    if (!parsed) return null;
    await ensureImagesDir();
    const filename = `${Date.now()}_${Math.random().toString(36).slice(2,8)}.${parsed.ext}`;
    const filePath = path.join(IMAGES_DIR, filename);
    await fsPromises.writeFile(filePath, parsed.data, 'base64');
    return filename;
}

async function readImageAsDataURL(filename) {
    if (!filename) return null;
    try {
        const filePath = path.join(IMAGES_DIR, filename);
        const buffer = await fsPromises.readFile(filePath);
        const ext = path.extname(filename).replace('.', '') || 'png';
        const mime = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        return `data:${mime};base64,${buffer.toString('base64')}`;
    } catch (err) {
        return null;
    }
}

const getMotos = async () => {
    const motos = await prisma.moto.findMany({
        include: {
            modelo: true,
            users: true,
            estado: true,
        },
        where: { estadoId: {
            not: estados().inactivo
        },
     },
    });

        const motosWithAvatars = motos.map((m) => ({ ...m, avatar: null }));
    if (!motos) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return motosWithAvatars;
}

const getMoto = async (id) => {
    const moto = await prisma.moto.findUnique({
        include: {
            modelo: {
                include: {
                    marca: true,
                    cilindrada: true,
                    linea: true,
            },
        },
            users: true,
            estado: true,
        },
        where: { id: id ,estadoId: {
            not: estados().inactivo
        } },
    });
    if (!moto) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return  moto ;
}

const postMoto = async (data) => {
    const existingMoto = await prisma.moto.findUnique({
        where: { placa: data.placa },
    });
    if (existingMoto) {
        const error = new Error('CONFLICT');
        error.code = 'CONFLICT';
        throw error;
    }

    const { users, ...motoData } = data;

    const usersConnect = users ? users.map(userId => ({ id: userId })) : [];

    const newMoto = await prisma.moto.create({
        data: {
            ...motoData,
            users: {
                connect: usersConnect,
            },
        },
    });

    return { ...newMoto };
}

const putMoto = async (id, data) => {
    const moto = await prisma.moto.findUnique({
        where: { id: id },
    });
    if (!moto) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const { users, ...motoData } = data;

    const usersConnect = users ? users.map(userId => ({ id: userId })) : [];

    const oldAvatar = moto.avatar;

    if (oldAvatar && data.avatar && oldAvatar !== data.avatar) {
            try {
                await deleteImage(oldAvatar);
            } catch (err) {
                console.error('Failed to delete old avatar:', err);
            }
    }

    const updatedMoto = await prisma.moto.update({
        where: { id: id },
        data: {
            ...motoData,
            users: {
                set: usersConnect,
            },
        },
    });

    return { ...updatedMoto };
}

const deleteMoto = async (id) => {
    const moto = await prisma.moto.findUnique({
        where: { id: id },
    });
    if (!moto) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    const deletedMoto = await prisma.moto.update({
        where: { id: id },
        data: { estadoId: estados().inactivo }
    });
    return deletedMoto;
}

export {
    getMotos,
    getMoto,
    postMoto,
    putMoto,
    deleteMoto,
}