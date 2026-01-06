import { verifyAccessToken } from "../helpers/auth.helper.js"
import { responseError, responseSucces } from "../helpers/response.helper.js"
import { schemaAuth } from "../zod/auth.schema.js"
import { login, motoLogin } from "../services/auth.services.js"
import prisma from "../configs/db.config.js"


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
        const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null;
        if (!token) return res.status(401).json({ error: 'Bearer token no enviado' });

        const payload = await verifyAccessToken(token);

        const currentUser = await prisma.user.findUnique({ where: { id: Number(payload.sub) } })
        if (!currentUser) return res.status(401).json(responseError('Token invalido - usuario no encontrado'))
        if (!currentUser.activo) return res.status(423).json(responseError('LOCKED'))

        req.user = payload;
        req.currentUser = currentUser;

        next();
      } catch (err) {
        return res.status(401).json(responseError('Token invalido o expirado'));
      }
    };
}


const meHandler = (getMeService) => {
  return async (req, res) => {
    try {
      const payload = req.user;
      if (!payload || !payload.sub) return res.status(401).json(responseError('Token invalido'));

      

      const userInfo = await getMeService(payload.sub);

      return res.status(200).json(responseSucces('User info', { user: userInfo }))
    } catch (error) {
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

    return res.status(errorCode).json(responseError(errorMessage));
  }
  }
}

const motoLoginHandler = async (req, res) => {
    try {
        const { identifier, placa, userType } = req.body;

        if (!identifier || !placa || !userType) {
            return res.status(400).json(responseError("INVALID_REQUEST", "Missing required fields."));
        }

        const auth = await motoLogin({ identifier, placa, userType });

        return res.status(200).json(responseSucces("Login successful",auth ));
    } catch (err) {
        console.error("Error in motoLoginHandler:", err);
        let code = 500;
        let msg = "INTERNAL_SERVER_ERROR";
        if (err.code === "AUTH_ERROR") {
            code = 401;
            msg = "AUTHENTICATION_ERROR";
        }
        return res.status(code).json(responseError(msg));
    }
};



export {
    loginHandler,
    verifyTokenHandler,
  meHandler,
  motoLoginHandler,
};