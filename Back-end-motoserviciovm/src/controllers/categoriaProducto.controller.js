import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import 
    {
    getCategoriasProducto,
    getCategoriaProducto,
    postCategoriaProducto,
    putCategoriaProducto,
    deleteCategoriaProducto,
} from "../services/categoriaProducto.service.js";

import { categoriaProductoSchema } from "../zod/categoriaProducto.schema.js";

const getCategoriasProductoHandler = async (req, res) => {
    try {
        const categorias = await getCategoriasProducto();
        return res.status(200).json(responseSuccesAll('Categorías de producto obtenidas exitosamente', categorias ));
    } catch (err) {
        console.error('Get categorías de producto error:', err);
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
};

const getCategoriaProductoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const categoria = await getCategoriaProducto(parseInt(id));
        return res.status(200).json(responseSucces('Categoría de producto obtenida exitosamente', categoria ));
    } catch (err) {
        console.error('Get categoría de producto error:', err);
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
};

const postCategoriaProductoHandler = async (req, res) => {
    try {
        const data = req.body;
        const validationResult = categoriaProductoSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const newCategoria = await postCategoriaProducto(value);
        return  res.status(201).json(responseSucces('Categoría de producto creada exitosamente', newCategoria ));
    } catch (err) {
        console.error('Post categoría de producto error:', err);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch(err.code){
            case 'CONFLICT':
                errorCode = 409;
                errorMessage = err.code;
                break;
        }
        return res.status(errorCode).json(responseError(errorMessage));
    }
};

const putCategoriaProductoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const validationResult = categoriaProductoSchema.safeParse(data);

        if (!validationResult.success) {    
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const updatedCategoria = await putCategoriaProducto(parseInt(id), value);
        return res.status(200).json(responseSucces('Categoría de producto actualizada exitosamente', updatedCategoria ));
    } catch (err) {
        console.error('Put categoría de producto error:', err);
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
};

const deleteCategoriaProductoHandler = async (req, res) => {    
    try {
        const { id } = req.params;
        const deletedCategoria = await deleteCategoriaProducto(parseInt(id));
        return res.status(200).json(responseSucces('Categoría de producto eliminada exitosamente', deletedCategoria ));
    } catch (err) {
        console.error('Delete categoría de producto error:', err);
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
};


export {
    getCategoriasProductoHandler,
    getCategoriaProductoHandler,    
    postCategoriaProductoHandler,
    putCategoriaProductoHandler,
    deleteCategoriaProductoHandler
};