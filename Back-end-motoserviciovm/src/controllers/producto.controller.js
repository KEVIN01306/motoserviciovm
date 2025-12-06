import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import {
    getProductos,
    getProducto,
    postProducto,
    putProducto,
    deleteProducto,
} from "../services/producto.service.js";
import { productoSchema } from "../zod/producto.schema.js";

const directorio = '/uploads/productos/';

const getProductosHandler = async (req, res) => {
    try {
        const productos = await getProductos();
        return res.status(200).json(responseSuccesAll('Productos Obtenidos exitosamente', productos ));
    } catch (err) {
        console.error('Get productos error:', err);
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

const getProductoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await getProducto(parseInt(id));
        return res.status(200).json(responseSucces('Producto obtenido exitosamente', producto ));
    } catch (err) {
        console.error('Get producto error:', err);
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

const postProductoHandler = async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            data.imagen = directorio + req.file.filename;
        }
        data.estadoId = parseInt(data.estadoId);
        data.categoriaId = parseInt(data.categoriaId);
        data.precio = parseFloat(data.precio);
        data.cantidad = parseInt(data.cantidad);

        const validationResult = productoSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const newProducto = await postProducto(value);
        return  res.status(201).json(responseSucces('Producto creado exitosamente', newProducto ));
    } catch (err) {
        console.error('Post producto error:', err);
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
}

const putProductoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (req.file) {
            data.imagen = directorio + req.file.filename;
        }
        data.estadoId = parseInt(data.estadoId);
        data.categoriaId = parseInt(data.categoriaId);
        data.precio = parseFloat(data.precio);
        data.cantidad = parseInt(data.cantidad);
        const validationResult = productoSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const updatedProducto = await putProducto(parseInt(id), value);
        return res.status(200).json(responseSucces('Producto actualizado exitosamente', updatedProducto ));
    } catch (err) {
        console.error('Put producto error:', err);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch(err.code){
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = err.code;
                break;
            case 'CONFLICT':
                errorCode = 409;
                errorMessage = err.code;
                break;
        }
        return res.status(errorCode).json(responseError(errorMessage));
    }
}

const deleteProductoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProducto = await deleteProducto(parseInt(id));
        return res.status(200).json(responseSucces('Producto eliminado exitosamente', deletedProducto ));
    } catch (err) {
        console.error('Delete producto error:', err);
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
    getProductosHandler,
    getProductoHandler,
    postProductoHandler,
    putProductoHandler,
    deleteProductoHandler
};