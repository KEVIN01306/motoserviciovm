import { issueAccessToken } from "../helpers/auth.helper.js"
import prisma from "../configs/db.config.js"


const login = async (data) => {

    const userValied = await prisma.user.findUnique({
        where: { email: data.email, password: data.password },
        include: { roles: true, sucursales: true }
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
            sucursales: userValied.sucursales,
        },
    }
}

const getMe = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: { roles: true, sucursales: true }
    })

    if (!user) {
        const error = new Error('DATA_NOT_FOUND')
        error.code = 'DATA_NOT_FOUND'
        throw error
    }

    if (!user.activo) {
        const error = new Error('LOCKED')
        error.code = 'LOCKED'
        throw error
    }


    const permisos = await prisma.permiso.findMany({
        where: {
            roles: { some: { id: { in: user.roles.map(role => role.id) } } }
        }
    })

    const roleNames = user.roles.map(role => role.rol)
    const permisoNames = permisos.map(p => p.permiso)


    return {
        id: user.id,
        primerNombre: user.primerNombre,
        email: user.email,
        roles: roleNames,
        permisos: permisoNames,
        sucursales: user.sucursales,
    }
}

const motoLogin = async ({ identifier, placa, userType }) => {
    try {
        // Determine the field to use for user identification
        const userField = userType === "Empresa" ? "nit" : "dpi";

        // Find the user based on the identifier and user type
        const user = await prisma.user.findFirst({
            where: {
                [userField]: identifier,
                tipo: userType,
                activo: true,
            },
            include: {
                roles: true,
                motos: { include: { modelo: true , estado: true }},
            },
        });

        if (!user) {
            const error = new Error("AUTH_ERROR");
            error.code = "AUTH_ERROR";
            throw error;
        }

        // Find the moto based on the placa
        const moto = await prisma.moto.findFirst({
            where: {
                placa: placa,
            },
        });

        if (!moto) {
            const error = new Error("AUTH_ERROR");
            error.code = "AUTH_ERROR";
            throw error;
        }

        // Check if the user is associated with the moto
        const userMotoRelation = await prisma.user.findFirst({
            where: {
                id: user.id,
                motos: {
                    some: {
                        id: moto.id,
                    },
                },
            },
        });

        if (!userMotoRelation) {
            const error = new Error("AUTH_ERROR");
            error.code = "AUTH_ERROR";
            throw error;
        }

        const permisos = await prisma.permiso.findMany({
            where: {
                roles: { some: { id: { in: user.roles.map((role) => role.id) } } },
            },
        });

        const roleNames = user.roles.map((role) => role.rol);
        const permisoNames = permisos.map((p) => p.permiso);

        const token = await issueAccessToken({ sub: user.id, role: roleNames[0] });

        return {
            token,
            user: {
                id: user.id,
                primerNombre: user.primerNombre,
                email: user.email,
                roles: roleNames,
                permisos: permisoNames,
            },
            motos: user.motos,
        };
    } catch (err) {
        console.error("Error in motoLogin:", err);
        throw err;
    }
};

export {
    login,
    getMe,
    motoLogin,
}