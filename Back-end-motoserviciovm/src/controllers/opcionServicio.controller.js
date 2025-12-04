import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import {
    getOpcionesServicio, 
    getOpcionServicio,
    postOpcionServicio, 
    putOpcionServicio, 
    deleteOpcionServicio 
} from "../services/opcionServicio.service.js";
import { opcionesServicioSchema } from "../zod/opcionServicio.shema.js";

const getOpcionesServicioHandler = async (req, res) => {
    try {
        const opciones = await getOpcionesServicio();
        return res.status(200).json(responseSuccesAll('Opciones servicio Obtenidas exitosamente', opciones ));
    } catch (err) {
        console.error('Get opciones servicio error:', err);
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

const getOpcionServicioHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const opcion = await getOpcionServicio(parseInt(id));
        return res.status(200).json(responseSucces('Opcion servicio obtenida exitosamente', opcion ));
    } catch (err) {
        console.error('Get opcion servicio error:', err);
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


const postOpcionServicioHandler = async (req, res) => {
    try {
        const data = req.body;

        const validationResult = opcionesServicioSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }

        const { data: value } = validationResult;

        const newOpcion = await postOpcionServicio(value);
        return res.status(201).json(responseSucces('Opcion servicio creado exitosamente', newOpcion ));
    } catch (err) {
        console.error('Post opcion servicio error:', err);
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

const putOpcionServicioHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const validationResult = opcionesServicioSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }

        const { data: value } = validationResult;

        const updatedOpcion = await putOpcionServicio(parseInt(id), value);
        return res.status(200).json(responseSucces('Opcion servicio actualizada exitosamente', updatedOpcion ));
    } catch (err) {
        console.error('Put opcion servicio error:', err);
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

const deleteOpcionServicioHandler = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteOpcionServicio(parseInt(id));
        return res.status(200).json(responseSucces('Opcion servicio eliminada exitosamente', null));
    } catch (err) {
        console.error('Delete opcion servicio error:', err);
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
    getOpcionesServicioHandler,
    getOpcionServicioHandler,
    postOpcionServicioHandler,
    putOpcionServicioHandler,
    deleteOpcionServicioHandler
}