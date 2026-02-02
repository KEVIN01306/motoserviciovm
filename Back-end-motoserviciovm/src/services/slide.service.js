import prisma from "../configs/db.config.js";
import { deleteImage } from "../utils/fileUtils.js";

const getSlides = async () => {
    const slides = await prisma.slide.findMany({ orderBy: { id: 'asc' } });
    if (!slides) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return slides;
}

const getSlide = async (id) => {
    const slide = await prisma.slide.findFirst({ where: { id: id } });
    if (!slide) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }
    return slide;
}

const postSlide = async (data) => {
    const newSlide = await prisma.slide.create({ data });
    return newSlide;
}

const putSlide = async (id, data) => {
    const existing = await prisma.slide.findFirst({ where: { id: id } });
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
            console.error('Error deleting old slide image:', err);
        }
    }

    // If explicit removal requested (null or empty), delete old image
    if ((data.image === null || data.image === '') && oldImage) {
        try {
            await deleteImage(oldImage);
        } catch (err) {
            console.error('Error deleting old slide image on clear:', err);
        }
    }

    const updated = await prisma.slide.update({ where: { id: id }, data });
    return updated;
}

const deleteSlide = async (id) => {
    const existing = await prisma.slide.findFirst({ where: { id: id } });
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
            console.error('Error deleting slide image on delete:', err);
        }
    }
    const deleted = await prisma.slide.delete({ where: { id: id } });
    return deleted;
}

export {
    getSlides,
    getSlide,
    postSlide,
    putSlide,
    deleteSlide,
}
