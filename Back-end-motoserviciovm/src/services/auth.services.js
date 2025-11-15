import { issueAccessToken } from "../helpers/auth.helper.js"
import prisma from "../configs/db.config.js"


const login = async (data) => {

    const userValied = await prisma.user.findUnique({where: {email: data.email, password: data.password}})

    if (!userValied){
        const error = new Error('AUTH_ERROR')
        error.code = 'AUTH_ERROR'
        throw error;
    }

    if (!userValied.activo){
        const error = new Error('LOCKED')
        error.code = 'LOCKED'
        throw error;
    }

    const token = await issueAccessToken({sub: userValied._id, role: userValied.role})

    return {
        token: token,
        user: {
            id: userValied.id,
            primerNombre: userValied.primerNombre,
            email: userValied.email,
            roles: userValied.roles,
        },
    }
}

export {
    login
}