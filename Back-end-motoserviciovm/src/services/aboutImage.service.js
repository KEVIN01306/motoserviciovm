import prisma from "../configs/db.config.js";
import { deleteImage } from "../utils/fileUtils.js";

const getAboutImages = async () => {
    const aboutImages = await prisma.aboutImage.findMany({ orderBy: { id: 'asc' } });
    if (!aboutImages) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return aboutImages;
}

const getAboutImage = async (id) => {
    const aboutImage = await prisma.aboutImage.findFirst({ where: { id: id } });
    if (!aboutImage) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return aboutImage;
}

const postAboutImage = async (data) => {
    const newAboutImage = await prisma.aboutImage.create({ data });
    return newAboutImage;
}

const putAboutImage = async (id, data) => {
    const existing = await prisma.aboutImage.findFirst({ where: { id: id } });
    if (!existing) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const oldImage = existing.image;

    // If new image provided and different, delete old
    if (data.image && data.image !== oldImage) {
        try {
            await deleteImage(oldImage);
        } catch (err) {
            console.error('Error deleting old aboutImage:', err);
        }
    }

    // If explicit removal requested (null or empty), delete old image
    if ((data.image === null || data.image === '') && oldImage) {
        try {
            await deleteImage(oldImage);
        } catch (err) {
            console.error('Error deleting old aboutImage on clear:', err);
        }
    }

    const updated = await prisma.aboutImage.update({ where: { id: id }, data });
    return updated;
}

const deleteAboutImage = async (id) => {
    const existing = await prisma.aboutImage.findFirst({ where: { id: id } });
    if (!existing) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    // remove image file if exists
    if (existing.image) {
        try {
            await deleteImage(existing.image);
        } catch (err) {
            console.error('Error deleting aboutImage on delete:', err);
        }
    }
    const deleted = await prisma.aboutImage.delete({ where: { id: id } });
    return deleted;
}

export {
    getAboutImages,
    getAboutImage,
    postAboutImage,
    putAboutImage,
    deleteAboutImage,
}
