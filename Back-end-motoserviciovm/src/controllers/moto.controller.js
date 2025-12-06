import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getMotos,getMoto,postMoto,putMoto,deleteMoto } from "../services/moto.service.js";
import { parseArrayNumbers } from "../utils/parseArrayNumbers.js";
import { motoSchema } from "../zod/moto.schema.js";

const directorio = '/uploads/motos/';

const getMotosHandler =  async (req, res) => {
    try {
        const motos = await getMotos();
        res.status(200).json(responseSuccesAll("Motos obtenidas exitosamente", motos));
    } catch (error) {
        console.error(error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch(error.code){
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }
        res.status(errorCode).json(responseError(errorMessage));
    }
}

const getMotoHandler =  async (req, res) => {
    try {
        const { id } = req.params;
        const moto = await getMoto(parseInt(id));
        res.status(200).json(responseSucces("Moto obtenido exitosamente", moto));
    } catch (error) {
        console.error(error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch(error.code){
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }
        res.status(errorCode).json({ error: errorMessage });
    }
}

const postMotoHandler =  async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            data.avatar = directorio + req.file.filename;
        }
        data.modeloId = parseInt(data.modeloId);
        data.estadoId = parseInt(data.estadoId);
        data.users = parseArrayNumbers(data.users);
        const validationResult = motoSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const newMoto = await postMoto(value);
        res.status(201).json(responseSucces("Moto creada exitosamente", newMoto));
    } catch (error) {
        console.error(error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch(error.code){
            case 'CONFLICT':
                errorCode = 409;
                errorMessage = error.code;
                break;
        }
        res.status(errorCode).json(responseError(errorMessage));
    }
}

const putMotoHandler =  async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (req.file) {
            data.avatar = directorio + req.file.filename;
        }
        data.modeloId = parseInt(data.modeloId);
        data.estadoId = parseInt(data.estadoId);
        data.users = parseArrayNumbers(data.users);
        const validationResult = motoSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const updatedMoto = await putMoto(parseInt(id), value);
        res.status(200).json(responseSucces("Moto actualizada exitosamente", updatedMoto));
    } catch (error) {
        console.error(error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch(error.code){
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }
        res.status(errorCode).json(responseError(errorMessage));
    }
}

const deleteMotoHandler =  async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMoto = await deleteMoto(parseInt(id));
        res.status(200).json(responseSucces("Moto eliminada exitosamente", deletedMoto));
    } catch (error) {
        console.error(error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch(error.code){
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }
        res.status(errorCode).json({ error: errorMessage });
    }
}

export {
    getMotosHandler,
    getMotoHandler,
    postMotoHandler,
    putMotoHandler,
    deleteMotoHandler
}