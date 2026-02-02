import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getAboutImages, getAboutImage, postAboutImage, putAboutImage, deleteAboutImage } from "../services/aboutImage.service.js";
import { aboutImageSchema } from "../zod/aboutImage.schema.js";

const directorio = '/uploads/aboutImage/';

const getAboutImagesHandler = async (req, res) => {
    try {
        const aboutImages = await getAboutImages();
        return res.status(200).json(responseSuccesAll('AboutImages obtenidos exitosamente', aboutImages));
    } catch (err) {
        console.error('Get aboutImages error:', err);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch(err.code){
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = err.code;
                break;
        }
        return res.status(errorCode).json(responseError(errorMessage));
    }
}

const getAboutImageHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const aboutImage = await getAboutImage(parseInt(id));
        return res.status(200).json(responseSucces('AboutImage obtenido exitosamente', aboutImage));
    } catch (err) {
        console.error('Get aboutImage error:', err);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch(err.code){
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = err.code;
                break;
        }
        return res.status(errorCode).json(responseError(errorMessage));
    }
}

const postAboutImageHandler = async (req, res) => {
    try {
        const data = req.body || {};
        if (req.file) {
            data.image = directorio + req.file.filename;
        }

        const validationResult = aboutImageSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const newAboutImage = await postAboutImage(value);
        return res.status(201).json(responseSucces('AboutImage creado exitosamente', newAboutImage));
    } catch (err) {
        console.error('Post aboutImage error:', err);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        return res.status(errorCode).json(responseError(errorMessage));
    }
}

const putAboutImageHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body || {};
        if (req.file) {
            data.image = directorio + req.file.filename;
        } else {
            // allow clearing image by sending empty string or null
            if (data.image === '' || data.image === 'null') data.image = null;
        }

        const validationResult = aboutImageSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const updated = await putAboutImage(parseInt(id), value);
        return res.status(200).json(responseSucces('AboutImage actualizado exitosamente', updated));
    } catch (err) {
        console.error('Put aboutImage error:', err);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch(err.code){
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = err.code;
                break;
        }
        return res.status(errorCode).json(responseError(errorMessage));
    }
}

const deleteAboutImageHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteAboutImage(parseInt(id));
        return res.status(200).json(responseSucces('AboutImage eliminado exitosamente', deleted));
    } catch (err) {
        console.error('Delete aboutImage error:', err);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch(err.code){
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = err.code;
                break;
        }
        return res.status(errorCode).json(responseError(errorMessage));
    }
}

export {
    getAboutImagesHandler,
    getAboutImageHandler,
    postAboutImageHandler,
    putAboutImageHandler,
    deleteAboutImageHandler,
}
