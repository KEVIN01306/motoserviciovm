import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getModelos, getModelo, postModelo, putModelo, deleteModelo } from "../services/modelo.service.js";
import { modeloSchema } from "../zod/modelo.schema.js";

const getModelosHandler = async (req, res) => {
    try {
        const modelos = await getModelos();
        res.status(200).json(responseSuccesAll("modelos obtenidos exitosamente", modelos));
    } catch (error) {
        console.error(error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch (error.code) {
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }
        res.status(errorCode).json(responseError(errorMessage));
    }
}

const getModeloHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const modelo = await getModelo(parseInt(id));
        res.status(200).json(responseSuccesAll("modelo obtenido exitosamente", modelo));
    } catch (error) {
        console.error(error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch (error.code) {
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }
        res.status(errorCode).json(responseError(errorMessage));
    }
}

const postModeloHandler = async (req, res) => {
    try {
        const data = req.body;

        const validationResult = modeloSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => 
                `${issue.path.join('.')}: ${issue.message}`
            );
            return res.status(400).json({ errors: errorMessages });
        }

        const { data: value } = validationResult;

        const newModelo = await postModelo(value);
        res.status(201).json(responseSucces("modelo creado exitosamente", newModelo));
    } catch (error) {
        console.error(error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch (error.code) {
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
            case 'CONFLICT':
                errorCode = 409;
                errorMessage = error.code;
                break;
        }
        res.status(errorCode).json(responseError(errorMessage));
    }
}

const putModeloHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const validationResult = modeloSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => 
                `${issue.path.join('.')}: ${issue.message}`
            );
            return res.status(400).json({ errors: errorMessages });
        }

        const { data: value } = validationResult;

        const updatedModelo = await putModelo(parseInt(id), value);
        res.status(200).json(responseSucces("modelo actualizado exitosamente", updatedModelo));
    } catch (error) {
        console.error(error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch (error.code) {
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }
        res.status(errorCode).json(responseError(errorMessage));
    }
}

const deleteModeloHandler = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteModelo(parseInt(id));
        res.status(200).json(responseSucces("modelo deshabilitado exitosamente", null));
    } catch (error) {
        console.error(error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
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
    getModelosHandler,
    getModeloHandler,
    postModeloHandler,
    putModeloHandler,
    deleteModeloHandler
}

