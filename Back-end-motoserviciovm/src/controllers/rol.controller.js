import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { deleteRol, getRol, getRoles, postRol, putRol } from "../services/rol.service.js"
import { rolSchema } from "../zod/rol.schema.js";

const getRolesHandler = async (req, res) => {

    try{
        const roles = await getRoles();

        res.status(200).json(responseSuccesAll("roles obtenidos exitosamente", roles));
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
        res.status(errorCode).json({ error: errorMessage });
    }
}

const getRolHandler = async (req, res) => {
    try{
        const { id } = req.params;
        const rol = await getRol(parseInt(id));
        res.status(200).json(responseSuccesAll("rol obtenido exitosamente", rol));
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
        res.status(errorCode).json({ error: errorMessage });
    }
}

const postRolHandler = async (req, res) => {
    try{
        const data = req.body;
        
        const validationResult = rolSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => 
            `${issue.path.join('.')}: ${issue.message}`
            );
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;

        const newRol = await postRol(value);
        res.status(201).json(responseSucces("rol creado exitosamente", newRol));
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

const putRolHandler = async (req, res) => {
    try{
        const { id } = req.params;
        const {rol, descripcion, permisos} = req.body;
        const data = {rol, descripcion, permisos};
        const validationResult = rolSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => 
            `${issue.path.join('.')}: ${issue.message}`
            );
            return res.status(400).json(responseError(errorMessages));
        }
        const { data: value } = validationResult;
        const updatedRol = await putRol(parseInt(id), value);
        res.status(200).json(responseSucces("rol actualizado exitosamente", updatedRol));
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

const deleteRolHandler = async (req, res) => {
    try{
        const { id } = req.params;  
        await deleteRol(parseInt(id));
        res.status(200).json(responseSucces("rol eliminado exitosamente", null));
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
    getRolesHandler,
    getRolHandler,
    postRolHandler,
    putRolHandler,
    deleteRolHandler
};