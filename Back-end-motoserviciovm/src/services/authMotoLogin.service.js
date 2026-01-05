import prisma from "../configs/db.config.js";
import { issueAccessToken } from "../helpers/auth.helper.js";

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
                motos: true,
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
        };
    } catch (err) {
        console.error("Error in motoLogin:", err);
        throw err;
    }
};

export { motoLogin };