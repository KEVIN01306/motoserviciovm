import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getTextos, getTexto, postTexto, putTexto, deleteTexto } from "../services/texto.service.js";
import { textoSchema } from "../zod/texto.schema.js";

const getTextosHandler = async (req, res) => {
    try {
        const textos = await getTextos();
        return res.status(200).json(responseSuccesAll('Textos obtenidos exitosamente', textos));
    } catch (err) {
        console.error('Get textos error:', err);
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

const getTextoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const texto = await getTexto(parseInt(id));
        return res.status(200).json(responseSucces('Texto obtenido exitosamente', texto));
    } catch (err) {
        console.error('Get texto error:', err);
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

const postTextoHandler = async (req, res) => {
    try {
        const data = req.body || {};

        const validationResult = textoSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const newTexto = await postTexto(value);
        return res.status(201).json(responseSucces('Texto creado exitosamente', newTexto));
    } catch (err) {
        console.error('Post texto error:', err);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        return res.status(errorCode).json(responseError(errorMessage));
    }
}

const putTextoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body || {};

        const validationResult = textoSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const updated = await putTexto(parseInt(id), value);
        return res.status(200).json(responseSucces('Texto actualizado exitosamente', updated));
    } catch (err) {
        console.error('Put texto error:', err);
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

const deleteTextoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteTexto(parseInt(id));
        return res.status(200).json(responseSucces('Texto eliminado exitosamente', deleted));
    } catch (err) {
        console.error('Delete texto error:', err);
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
    getTextosHandler,
    getTextoHandler,
    postTextoHandler,
    putTextoHandler,
    deleteTextoHandler,
}
