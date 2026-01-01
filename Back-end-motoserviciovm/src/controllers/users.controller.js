import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { userSchema } from "../zod/user.schema.js";
import { getUSer, getUSers, getUSersMecanicos, patchUserActive, postUser, putUser /*, patchUserActive*/ } from "../services/users.service.js";


const getUsersHandler = async (req, res) => {
    try {
        const users = await getUSers();
        

        res.status(200).json(responseSuccesAll("usuarios obtenidos exitosamente", users))

    } catch (error) {
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch (error.code) {
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }

        return res.status(errorCode).json(responseError(errorMessage));
    }

}

const getUsersMecanicosHandler = async (req, res) => {
    try {
        const users = await getUSersMecanicos();
        

        res.status(200).json(responseSuccesAll("usuarios obtenidos exitosamente", users))

    } catch (error) {
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch (error.code) {
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }

        return res.status(errorCode).json(responseError(errorMessage));
    }

}


const getUserHandler = async (req, res) => {
    try {
        const { id } = req.params
        const user = await getUSer(parseInt(id));

        res.status(200).json(responseSucces("usuario obtenido exitosamente", user))

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

        return res.status(errorCode).json(responseError(errorMessage));
    }

}



const postUserHandler = async (req,res) => {
    try{
        const data = req.body

        const validationResult = userSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => 
            `${issue.path.join('.')}: ${issue.message}`
            );
            return res.status(400).json(responseError(errorMessages));
        }
            
        const { data: value } = validationResult;

        const userEmail = await postUser(value)

        res.status(201).json(responseSucces("Usuario creado exitosamente",userEmail))
    }catch (error){
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch(error.code){
            case 'CONFLICT':
                errorCode = 400;
                errorMessage = error.code;
                break;
        }

        return res.status(errorCode).json(responseError(errorMessage));
    }
}

const putUserHandler = async (req,res) => {
    try{
        const { id } = req.params
        const data = req.body

        const validationResult = userSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issues => 
            `${issues.path.join('.')}: ${issues.message}`
            )

            return res.status(400).json(responseError(errorMessages));
        }

        const { data: value} = validationResult;

        const UserEmail = await putUser(parseInt(id),value)

        res.status(200).json(responseSucces("usuario actualizado exitosamente",UserEmail))
    }catch (error){
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR'
        switch(error.code){
            case 'DATA_NOT_FOUND':
                errorCode = 400;
                errorMessage = error.code;
                break;
        }
        
        console.log(error)

        return res.status(errorCode).json(responseError(errorMessage));
    }
   
}


const patchUserActiveHandler = async (req, res) => {
    try {

        const { id } = req.params; 

        const result = await patchUserActive(parseInt(id)); 
        res.status(200).json(responseSucces("usuario actualizado exitosamente", result));

    } catch (error) {
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR';
        switch (error.code) {
            case 'DATA_NOT_FOUND':
                errorCode = 404;
                errorMessage = error.code;
                break;
        }

        console.error(error);
        return res.status(errorCode).json(responseError(errorMessage));
    }
}


export {
    getUsersHandler,
    getUserHandler,
    postUserHandler,
    putUserHandler,
    patchUserActiveHandler,
    getUsersMecanicosHandler
}