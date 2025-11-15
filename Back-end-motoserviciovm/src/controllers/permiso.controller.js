import { response } from 'express';
import { deletePermiso, getPermiso, getPermisos, postPermiso, updatePermiso } from '../services/permiso.service.js';
import { permisoSchema } from '../zod/permiso.schema.js';
import { responseError, responseSucces } from '../helpers/response.helper.js';

const getPermisosHandler = async (req, res, next) => {
    try {
        const permisos = await getPermisos();   

        res.status(200).json(responseSucces("permisos obtenidos exitosamente", permisos));

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

const getPermisoHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const permiso = await getPermiso(parseInt(id)); 
        res.status(200).json(responseSucces("permiso obtenido exitosamente", permiso));
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


const postPermisoHandler = async (req, res, next) => {
    try {
        const data = req.body;
        
        
        const validationResult = permisoSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => 
            `${issue.path.join('.')}: ${issue.message}`);   
            return res.status(400).json({ errors: errorMessages });
        }
        const { data: value } = validationResult;
        const newPermiso = await postPermiso(value);
        res.status(201).json(responseSucces("permiso creado exitosamente", newPermiso));
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

const putPermisoHandler = async (req, res, next) => {
    try{
        const { id } = req.params;
        const data = req.body;
        const validationResult = permisoSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => 
            `${issue.path.join('.')}: ${issue.message}`
            );
            return res.status(400).json({ errors: errorMessages });
        }
        const { data: value } = validationResult;

        const updatedPermiso = await updatePermiso(parseInt(id), value);
        res.status(200).json(responseSucces("permiso actualizado exitosamente", updatedPermiso));
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

const deletePermisoHandler = async (req, res, next) => {
    try{
        const { id } = req.params;
        await deletePermiso(parseInt(id));
        res.status(204).send();
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
    getPermisosHandler,
    getPermisoHandler,
    postPermisoHandler,
    putPermisoHandler,
    deletePermisoHandler
}