import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";
import fs from "fs";
import path from "path";

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
    // Convert avatar filename to data URL (base64) for each moto
    const motosWithAvatars = await Promise.all(motos.map(async (m) => {
        const avatarData = m.avatar ? await readImageAsDataURL(m.avatar) : null;
        return { ...m, avatar: avatarData };
    }));
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
            modelo: true,
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
    const avatarData = moto.avatar ? await readImageAsDataURL(moto.avatar) : null;
    return { ...moto, avatar: avatarData };
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

    // If avatar comes as base64, save it and store filename
    if (motoData.avatar) {
        const maybeFilename = await saveBase64ImageToFile(motoData.avatar);
        if (maybeFilename) {
            motoData.avatar = maybeFilename;
        }
    }

    const usersConnect = users ? users.map(userId => ({ id: userId })) : [];

    const newMoto = await prisma.moto.create({
        data: {
            ...motoData,
            users: {
                connect: usersConnect,
            },
        },
    });

    // Return with avatar as data URL
    const avatarData = newMoto.avatar ? await readImageAsDataURL(newMoto.avatar) : null;
    return { ...newMoto, avatar: avatarData };
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

    // If a new avatar (base64) is provided, save it and optionally remove old file
    if (motoData.avatar) {
        const parsed = parseBase64Image(motoData.avatar);
        if (parsed) {
            // save new image
            const newFilename = await saveBase64ImageToFile(motoData.avatar);
            if (newFilename) {
                // delete old file if it exists and looks like a filename
                try {
                    if (moto.avatar) {
                        const oldPath = path.join(IMAGES_DIR, moto.avatar);
                        await fsPromises.unlink(oldPath).catch(() => {});
                    }
                } catch (err) {
                    // ignore deletion errors
                }
                motoData.avatar = newFilename;
            }
        }
    }

    const usersConnect = users ? users.map(userId => ({ id: userId })) : [];

    const updatedMoto = await prisma.moto.update({
        where: { id: id },
        data: {
            ...motoData,
            users: {
                connect: usersConnect,
            },
        },
    });

    const avatarData = updatedMoto.avatar ? await readImageAsDataURL(updatedMoto.avatar) : null;
    return { ...updatedMoto, avatar: avatarData };
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