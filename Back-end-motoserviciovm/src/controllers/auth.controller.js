import { verifyAccessToken } from "../helpers/auth.helper.js"
import { responseError, responseSucces } from "../helpers/response.helper.js"
import { schemaAuth } from "../zod/auth.schema.js"
import { login } from "../services/auth.services.js"


const loginHandler = async (req,res) => {
    try {
        const data = req.body

        const validationResult = schemaAuth.safeParse(data);
        
        if (!validationResult.success) {
            return res.status(400).json(responseError('INVALID_REQUEST', validationResult.error.errors));
        }

        const { data: value } = validationResult

        const token = await login(value)

        res.status(200).json(responseSucces('credenciales aceptadas', token))

    }catch (error) {
    console.error(error);
    let errorCode = 500;
    let errorMessage = 'INTERNAL_SERVER_ERROR';
    switch(error.code){
      case 'DATA_NOT_FOUND':
        errorCode = 404;
        errorMessage = error.code;
        break;
        case 'AUTH_ERROR':
            errorCode = 400;
            errorMessage = error.code;
            break;
        case 'LOCKED':
            errorCode = 423;
            errorMessage = error.code;
            break
    }

    return res.status(errorCode).json({
      message: errorMessage
    });
  }
}



const verifyTokenHandler = () => {
  return async (req, res, next) => {
      try {
        const auth = req.header('Authorization');
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
        if (!token) return res.status(401).json({ error: 'Bearer token no enviado' });
  
        await verifyAccessToken(token);
        
        next();
      } catch (err) {
        return res.status(401).json(responseError('Token invalido o expirado'));
      }
    };
}




export {
    loginHandler,
    verifyTokenHandler,
};