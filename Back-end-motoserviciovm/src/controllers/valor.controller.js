import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getValores, getValor, postValor, putValor, deleteValor } from "../services/valor.service.js";
import { valorSchema } from "../zod/valor.schema.js";

const getValoresHandler = async (req, res) => {
    try {
        const valores = await getValores();
        return res.status(200).json(responseSuccesAll('Valores obtenidos exitosamente', valores));
    } catch (err) {
        console.error('Get valores error:', err);
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

const getValorHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const valor = await getValor(parseInt(id));
        return res.status(200).json(responseSucces('Valor obtenido exitosamente', valor));
    } catch (err) {
        console.error('Get valor error:', err);
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

const postValorHandler = async (req, res) => {
    try {
        const data = req.body || {};

        const validationResult = valorSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const newValor = await postValor(value);
        return res.status(201).json(responseSucces('Valor creado exitosamente', newValor));
    } catch (err) {
        console.error('Post valor error:', err);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        return res.status(errorCode).json(responseError(errorMessage));
    }
}

const putValorHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body || {};

        const validationResult = valorSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const updated = await putValor(parseInt(id), value);
        return res.status(200).json(responseSucces('Valor actualizado exitosamente', updated));
    } catch (err) {
        console.error('Put valor error:', err);
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

const deleteValorHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteValor(parseInt(id));
        return res.status(200).json(responseSucces('Valor eliminado exitosamente', deleted));
    } catch (err) {
        console.error('Delete valor error:', err);
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
    getValoresHandler,
    getValorHandler,
    postValorHandler,
    putValorHandler,
    deleteValorHandler,
}
