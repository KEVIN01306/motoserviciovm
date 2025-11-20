import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getMarcas, getMarca, postMarca, putMarca, deleteMarca } from "../services/marca.service.js";
import { marcaSchema } from "../zod/marca.schema.js";

const getMarcasHandler = async (req, res) => {
    try {
        const marcas = await getMarcas();
        res.status(200).json(responseSuccesAll("marcas obtenidas exitosamente", marcas));
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

const getMarcaHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const marca = await getMarca(parseInt(id));
        res.status(200).json(responseSuccesAll("marca obtenida exitosamente", marca));
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

const postMarcaHandler = async (req, res) => {
    try {
        const data = req.body;
        const validationResult = marcaSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => 
                `${issue.path.join('.')}: ${issue.message}`
            );
            return res.status(400).json({ errors: errorMessages });
        }

        const { data: value } = validationResult;

        const newMarca = await postMarca(value);
        res.status(201).json(responseSucces("marca creada exitosamente", newMarca));
    }
    catch (error) {
        console.error(error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch (error.code) {
            case 'CONFLICT':
                errorCode = 409;
                errorMessage = error.code;
                break;
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }
        res.status(errorCode).json(responseError(errorMessage));
    }
}

const putMarcaHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const validationResult = marcaSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => 
                `${issue.path.join('.')}: ${issue.message}`
            );
            return res.status(400).json({ errors: errorMessages });
        }

        const { data: value } = validationResult;

        const updatedMarca = await putMarca(parseInt(id), value);
        res.status(200).json(responseSucces("marca actualizada exitosamente", updatedMarca));
    }
    catch (error) {
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

const deleteMarcaHandler = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteMarca(parseInt(id));
        res.status(200).json(responseSucces("marca deshabilitada exitosamente", null));
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
    getMarcasHandler,
    getMarcaHandler,
    postMarcaHandler,
    putMarcaHandler,
    deleteMarcaHandler
}