import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getLineas, getLinea, postLinea, putLinea, deleteLinea } from "../services/linea.service.js";
import { lineaSchema } from "../zod/linea.schema.js";

const getLineasHandler = async (req, res) => {
    try {
        const lineas = await getLineas();
        res.status(200).json(responseSuccesAll("lineas obtenidas exitosamente", lineas));
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

const getLineaHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const linea = await getLinea(parseInt(id));
        res.status(200).json(responseSuccesAll("linea obtenida exitosamente", linea));
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

const postLineaHandler = async (req, res) => {
    try {
        const data = req.body;

        const validationResult = lineaSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => 
                `${issue.path.join('.')}: ${issue.message}`
            );
            return res.status(400).json({ errors: errorMessages });
        }

        const { data: value } = validationResult;

        const newLinea = await postLinea(value);
        res.status(201).json(responseSucces("linea creada exitosamente", newLinea));
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

const putLineaHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const validationResult = lineaSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => 
                `${issue.path.join('.')}: ${issue.message}`
            );
            return res.status(400).json({ errors: errorMessages });
        }

        const { data: value } = validationResult;

        const updatedLinea = await putLinea(parseInt(id), value);
        res.status(200).json(responseSucces("linea actualizada exitosamente", updatedLinea));
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

const deleteLineaHandler = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteLinea(parseInt(id));
        res.status(200).json(responseSucces("linea deshabilitada exitosamente", null));
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
    getLineasHandler,
    getLineaHandler,
    postLineaHandler,
    putLineaHandler,
    deleteLineaHandler
}
