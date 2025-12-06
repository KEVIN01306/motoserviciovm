import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import {
    getInventarios,
    getInventario,
    postInventario,
    putInventario,
    deleteInventario,
} from "../services/inventario.service.js";
import { inventarioSchema } from "../zod/inventario.schema.js";

const getInventariosHandler = async (req, res) => {
    try {
        const inventarios = await getInventarios();
        return res.status(200).json(responseSuccesAll('Inventarios obtenidos exitosamente', inventarios));
    } catch (error) {
        console.error('Get inventarios error:', error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR';
        switch (error.code) {
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }
        return res.status(errorCode).json(responseError(errorMessage));
    }
};

const getInventarioHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const inventario = await getInventario(parseInt(id));
        return res.status(200).json(responseSucces('Inventario obtenido exitosamente', inventario));
    } catch (error) {
        console.error('Get inventario error:', error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR';
        switch (error.code) {
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }
        return res.status(errorCode).json(responseError(errorMessage));
    }
};

const postInventarioHandler = async (req, res) => {
    try {
        const data = req.body;
        const validationResult = inventarioSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
                `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json({ error: errorMessages });
        }
        const { data: value } = validationResult;
        const newInventario = await postInventario(value);
        return res.status(201).json(responseSucces('Inventario creado exitosamente', newInventario));
    } catch (error) {
        console.error('Post inventario error:', error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR';
        switch (error.code) {
            case 'CONFLICT':
                errorCode = 409;
                errorMessage = error.code;
                break;
        }
        return res.status(errorCode).json(responseError(errorMessage));
    }
};

const putInventarioHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const validationResult = inventarioSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
                `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json({ error: errorMessages });
        }
        const { data: value } = validationResult;
        const updatedInventario = await putInventario(parseInt(id), value);
        return res.status(200).json(responseSucces('Inventario actualizado exitosamente', updatedInventario));
    } catch (error) {
        console.error('Put inventario error:', error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR';
        switch (error.code) {
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }
        return res.status(errorCode).json(responseError(errorMessage));
    }
};

const deleteInventarioHandler = async (req, res) => {
    try {
        const { id } = req.params;  
        await deleteInventario(parseInt(id));
        return res.status(200).json(responseSucces('Inventario eliminado exitosamente', null));
    } catch (error) {
        console.error('Delete inventario error:', error);
         let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR';
        switch (error.code) {
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }
        return res.status(errorCode).json(responseError(errorMessage));
    }
};


export {
    getInventariosHandler,
    getInventarioHandler,
    postInventarioHandler,
    putInventarioHandler,
    deleteInventarioHandler
};