import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getTipoServicio,getTiposServicio,postTipoServicio,putTipoServicio,deleteTipoServicio } from "../services/tipoServicio.service.js";
import { tipoServicioSchema } from "../zod/tipoServicio.schema.js";

const getTiposServicioHandler = async (req, res) => {
    try {
        const tipos = await getTiposServicio();
        return res.status(200).json(responseSuccesAll('Tipos servicio Obtenidos exitosamente', tipos ));
    } catch (err) {
        console.error('Get tipos servicio error:', err);
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

const getTipoServicioHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const tipo = await getTipoServicio(parseInt(id));
        return res.status(200).json(responseSucces('Tipo servicio obtenida exitosamente', tipo ));
    } catch (err) {
        console.error('Get tipo servicio error:', err);
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

const postTipoServicioHandler = async (req, res) => {
    try {
        const data = req.body;
        const validationResult = tipoServicioSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }

        const { data: value } = validationResult;
        const newOpcion = await postTipoServicio(value);
        return  res.status(201).json(responseSucces('Opcion servicio creada exitosamente', newOpcion ));
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

const putTipoServicioHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const validationResult = tipoServicioSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue =>
            `${issue.path.join('.')}: ${issue.message}`);
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const updatedOpcion = await putTipoServicio(parseInt(id), value);
        return res.status(200).json(responseSucces('Opcion servicio actualizada exitosamente', updatedOpcion ));
    } catch (err) {
        console.error('Put opcion servicio error:', err);
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

const deleteTipoServicioHandler = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteTipoServicio(parseInt(id));
        return res.status(200).json(responseSucces('Tipo servicio eliminada exitosamente'));
    } catch (err) {
        console.error('Delete tipo servicio error:', err);
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
    getTiposServicioHandler,
    getTipoServicioHandler,
    postTipoServicioHandler,
    putTipoServicioHandler,
    deleteTipoServicioHandler
}