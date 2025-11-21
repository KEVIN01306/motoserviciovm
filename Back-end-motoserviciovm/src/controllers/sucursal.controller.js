import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { deleteSucursal, getSucursal, getSucursales, postSucursal, putSucursal } from "../services/sucursal.service.js";
import { sucursalSchema } from "../zod/sucursal.schema.js";


const getSucursalesHandler = async (req, res) => {
    try{
        const sucursales = await getSucursales();
        res.status(200).json(responseSuccesAll("sucursales obtenidas exitosamente", sucursales));
    }catch(error){
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


const getSucursalHandler = async (req, res) => {
    try{
        const { id } = req.params;
        const sucursal = await getSucursal(parseInt(id));
        res.status(200).json(responseSuccesAll("sucursal obtenida exitosamente", sucursal));
    }catch(error){
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

const postSucursalHandler = async (req, res) => {
    try{
        const data = req.body;

        console.log(data)

        const validationResult = sucursalSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => issue.message);
            return res.status(400).json(responseError(errorMessages));
        }

        const { data: value } = validationResult;

        const newSucursal = await postSucursal(value);
        res.status(201).json(responseSucces("sucursal creada exitosamente", newSucursal));
    }catch(error){
        console.error(error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch(error.code){
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

const putSucursalHandler = async (req, res) => {
    try{
        const { id } = req.params;
        const data = req.body;
        const validationResult = sucursalSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => issue.message);
            return res.status(400).json(responseError(errorMessages));
        }

        const { data: value } = validationResult;

        const updatedSucursal = await putSucursal(parseInt(id), value);
        res.status(200).json(responseSucces("sucursal actualizada exitosamente", updatedSucursal));
    }catch(error){
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

const deleteSucursalHandler = async (req, res) => {
    try{
        const { id } = req.params;
        await deleteSucursal(parseInt(id));
        res.status(200).json(responseSucces("sucursal eliminada exitosamente", null));
    }catch(error){
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

export { 
    getSucursalesHandler,
    getSucursalHandler,
    postSucursalHandler,
    putSucursalHandler,
    deleteSucursalHandler
}