import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getEnParqueo, getEnParqueos, postEnParqueo, putEnParqueoSalida } from "../services/enParqueo.service.js";
import { enParqueoSchema } from "../zod/enParqueo.schema.js";



const getEnParqueosHandler = async (req, res) => {
    try {
        const enParqueos = await getEnParqueos();
        res.status(200).json(responseSuccesAll('En Parqueos obtenidos exitosamente', enParqueos));
    } catch (error) {
        console.error('Error retrieving En Parqueos:', error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR';
        switch (error.code) {
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }
        res.status(errorCode).json(responseError(errorMessage));
    }
}


const getEnParqueoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const enParqueo = await getEnParqueo(parseInt(id));
        res.status(200).json(responseSucces('En Parqueo obtenido exitosamente', enParqueo));
    } catch (error) {
        console.error('Error retrieving En Parqueo:', error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR';
        switch (error.code) {
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }
        res.status(errorCode).json(responseError(errorMessage));
    }
}

const postEnParqueoHandler = async (req, res) => {
    try {
        const data = req.body;
        const validationResult = enParqueoSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const newEnParqueo = await postEnParqueo(value);
        res.status(201).json(responseSucces('En Parqueo creado exitosamente', newEnParqueo));
    } catch (error) {
        console.error('Error creating En Parqueo:', error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR';
        switch (error.code) {
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
            case 'MOTO_IN_REPARATION':
                errorCode = 409;
                errorMessage = error.code;
                break;
            case 'MOTO_ALREADY_IN_PARKING':
                errorCode = 409;
                errorMessage = error.code;
                break;
        }
        res.status(errorCode).json(responseError(errorMessage));
    }
}

const putEnParqueoSalidaHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const validationResult = enParqueoSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
                `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const updatedEnParqueo = await putEnParqueoSalida(parseInt(id), value);
        res.status(200).json(responseSucces('En Parqueo actualizado exitosamente', updatedEnParqueo));
    } catch (error) {
        console.error('Error updating En Parqueo:', error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR';
        switch (error.code) {
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }
        res.status(errorCode).json(responseError(errorMessage));
    }
}


export {
    getEnParqueosHandler,
    getEnParqueoHandler,
    postEnParqueoHandler,
    putEnParqueoSalidaHandler
}