import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getSlides, getSlide, postSlide, putSlide, deleteSlide } from "../services/slide.service.js";
import { slideSchema } from "../zod/slide.schema.js";

const directorio = '/uploads/slides/';

const getSlidesHandler = async (req, res) => {
    try {
        const slides = await getSlides();
        return res.status(200).json(responseSuccesAll('Slides obtenidos exitosamente', slides));
    } catch (err) {
        console.error('Get slides error:', err);
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

const getSlideHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const slide = await getSlide(parseInt(id));
        return res.status(200).json(responseSucces('Slide obtenido exitosamente', slide));
    } catch (err) {
        console.error('Get slide error:', err);
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

const postSlideHandler = async (req, res) => {
    try {
        const data = req.body || {};
        if (req.file) {
            data.image = directorio + req.file.filename;
        }

        const validationResult = slideSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const newSlide = await postSlide(value);
        return res.status(201).json(responseSucces('Slide creado exitosamente', newSlide));
    } catch (err) {
        console.error('Post slide error:', err);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        return res.status(errorCode).json(responseError(errorMessage));
    }
}

const putSlideHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body || {};
        if (req.file) {
            data.image = directorio + req.file.filename;
        } else {
            // allow clearing image by sending empty string or null
            if (data.image === '' || data.image === 'null') data.image = null;
        }

        const validationResult = slideSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const updated = await putSlide(parseInt(id), value);
        return res.status(200).json(responseSucces('Slide actualizado exitosamente', updated));
    } catch (err) {
        console.error('Put slide error:', err);
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

const deleteSlideHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteSlide(parseInt(id));
        return res.status(200).json(responseSucces('Slide eliminado exitosamente', deleted));
    } catch (err) {
        console.error('Delete slide error:', err);
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
    getSlidesHandler,
    getSlideHandler,
    postSlideHandler,
    putSlideHandler,
    deleteSlideHandler,
}
