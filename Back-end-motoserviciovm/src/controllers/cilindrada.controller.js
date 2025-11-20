import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getCilindradas, getCilindrada, postCilindrada, putCilindrada, deleteCilindrada } from "../services/cilindrada.service.js";
import { cilindradaSchema } from "../zod/cilindrada.schema.js";

const getCilindradasHandler = async (req, res) => {
    try {
        const cilindradas = await getCilindradas();
        res.status(200).json(responseSuccesAll("cilindradas obtenidas exitosamente", cilindradas));
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

const getCilindradaHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const cilindrada = await getCilindrada(parseInt(id));
        res.status(200).json(responseSuccesAll("cilindrada obtenida exitosamente", cilindrada));
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

const postCilindradaHandler = async (req, res) => {
    try {
        const data = req.body;

        const validationResult = cilindradaSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => 
                `${issue.path.join('.')}: ${issue.message}`
            );
            return res.status(400).json({ errors: errorMessages });
        }

        const { data: value } = validationResult;

        const newCilindrada = await postCilindrada(value);
        res.status(201).json(responseSucces("cilindrada creada exitosamente", newCilindrada));
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

const putCilindradaHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const validationResult = cilindradaSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => 
                `${issue.path.join('.')}: ${issue.message}`
            );
            return res.status(400).json({ errors: errorMessages });
        }

        const { data: value } = validationResult;

        const updatedCilindrada = await putCilindrada(parseInt(id), value);
        res.status(200).json(responseSucces("cilindrada actualizada exitosamente", updatedCilindrada));
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

const deleteCilindradaHandler = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteCilindrada(parseInt(id));
        res.status(200).json(responseSucces("cilindrada deshabilitada exitosamente", null));
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
    getCilindradasHandler,
    getCilindradaHandler,
    postCilindradaHandler,
    putCilindradaHandler,
    deleteCilindradaHandler
}

