import { issueAccessToken } from "../helpers/auth.helper.js"
import prisma from "../configs/db.config.js"


const login = async (data) => {

    const userValied = await prisma.user.findUnique({
        where: { email: data.email, password: data.password },
        include: { roles: true }
    })

    if (!userValied) {
        const error = new Error('AUTH_ERROR')
        error.code = 'AUTH_ERROR'
        throw error
    }

    if (!userValied.activo) {
        const error = new Error('LOCKED')
        error.code = 'LOCKED'
        throw error
    }

    const permisos = await prisma.permiso.findMany({
        where: {
            roles: { some: { id: { in: userValied.roles.map(role => role.id) } } }
        }
    })

    const roleNames = userValied.roles.map(role => role.rol)
    const permisoNames = permisos.map(p => p.permiso)

    const token = await issueAccessToken({ sub: userValied.id, role: roleNames[0] })

    return {
        token,
        user: {
            id: userValied.id,
            primerNombre: userValied.primerNombre,
            email: userValied.email,
            roles: roleNames,
            permisos: permisoNames,
        },
    }
}

export {
    login
}