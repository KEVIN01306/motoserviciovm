import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getContactos, getContacto, postContacto, putContacto, deleteContacto } from "../services/contacto.service.js";
import { contactoSchema } from "../zod/contacto.schema.js";

const getContactosHandler = async (req, res) => {
    try {
        const contactos = await getContactos();
        return res.status(200).json(responseSuccesAll('Contactos obtenidos exitosamente', contactos));
    } catch (err) {
        console.error('Get contactos error:', err);
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

const getContactoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const contacto = await getContacto(parseInt(id));
        return res.status(200).json(responseSucces('Contacto obtenido exitosamente', contacto));
    } catch (err) {
        console.error('Get contacto error:', err);
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

const postContactoHandler = async (req, res) => {
    try {
        const data = req.body || {};

        const validationResult = contactoSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const newContacto = await postContacto(value);
        return res.status(201).json(responseSucces('Contacto creado exitosamente', newContacto));
    } catch (err) {
        console.error('Post contacto error:', err);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        return res.status(errorCode).json(responseError(errorMessage));
    }
}

const putContactoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body || {};

        const validationResult = contactoSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const updated = await putContacto(parseInt(id), value);
        return res.status(200).json(responseSucces('Contacto actualizado exitosamente', updated));
    } catch (err) {
        console.error('Put contacto error:', err);
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

const deleteContactoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteContacto(parseInt(id));
        return res.status(200).json(responseSucces('Contacto eliminado exitosamente', deleted));
    } catch (err) {
        console.error('Delete contacto error:', err);
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
    getContactosHandler,
    getContactoHandler,
    postContactoHandler,
    putContactoHandler,
    deleteContactoHandler,
}
