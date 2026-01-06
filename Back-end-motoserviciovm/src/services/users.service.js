import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";

const getUSers = async () => {

	const users = await prisma.user.findMany({
		where: {estadoId: {
			not: estados().inactivo
		}},
		include:{
			roles: true,
			sucursales: true,
		}
	});

	if (!users){
		const error = new Error("DATA_NOT_FOUND");
		error.code('DATA_NOT_FOUND')
		throw error;
	}

	return users;
}

const getUSersMecanicos = async () => {

	const users = await prisma.user.findMany({
		where: {estadoId: {
			not: estados().inactivo
		},
		tipo: ""
	},
		include:{
			roles: true,
			sucursales: true,
		}
	});

	if (!users){
		const error = new Error("DATA_NOT_FOUND");
		error.code('DATA_NOT_FOUND')
		throw error;
	}

	return users;
}


const getUSersClientes = async () => {

	const users = await prisma.user.findMany({
		where: {estadoId: {
			not: estados().inactivo
		},
		tipo: {not: "" }
	},
		include:{
			roles: true,
			sucursales: true,
		}
	});

	if (!users){
		const error = new Error("DATA_NOT_FOUND");
		error.code('DATA_NOT_FOUND')
		throw error;
	}

	return users;
}

const getUSer = async (id) => {

	const user = await prisma.user.findUnique({
		where: { id: id, estadoId: {
			not: estados().inactivo
		} },
		include:{
			roles: true,
			sucursales: true,
			estado: true,
			motos: {
				include: {
					modelo: {
						include: {
							marca: true,
							linea: true,
							cilindrada: true,
							estado: true,
						}
					},
					estado: true,
				}
			},
		}
	});

	if (!user){
		const error = new Error("DATA_NOT_FOUND");
		error.code('DATA_NOT_FOUND')
		throw error;
	}

	return user;
}


const postUser = async (data) => {
	
		const user = await prisma.user.findUnique({
			where: { email: data.email }
		});

		if (user) {
			const error = new Error('CONFLICT');
			error.code = 'CONFLICT';
			throw error;
		}
		const { roles: rolIds, sucursales: sucursalIds, ...userData } = data;

		const rolesConnect = (rolIds || []).map(rolId => ({
			id: rolId
		}))

		const sucursalesConnect = (sucursalIds || []).map(sucursalId => ({
			id: sucursalId
		}))
		const newUser = await prisma.user.create({
			data: {
				...userData,
				roles:{
					connect: rolesConnect
				},
				sucursales:{
					connect: sucursalesConnect
				}
			},
			include:{
				roles: true,
				sucursales: true,	
			}
		});
		//console.log(newUSer.email)

		return newUser.email
}



const putUser = async (id, data) => {

		const user = await prisma.user.findUnique({
			where: { id: id}
		});

		if (!user) {
			const error = new Error('DATA_NOT_FOUND');
			error.code = 'DATA_NOT_FOUND';
			throw error;
		}

		const { roles: rolIds, sucursales: sucursalIds, ...userData } = data;

		const rolesConnect = (rolIds || []).map(rolId => ({
			id: rolId
		}))

		const sucursalesConnect = (sucursalIds || []).map(sucursalId => ({
			id: sucursalId
		}))
		const newUser = await prisma.user.update({
			where: { id: id },
			data: {
				...userData,
				roles:{
					set: rolesConnect
				},
				sucursales:{
					set: sucursalesConnect
				}
			},
			include:{
				roles: true,
				sucursales: true,
			}
		});

		return newUser.email
}


const patchUserActive = async (id) => {
    const user = await prisma.user.findUnique({ where: { id: id } });

    if (!user) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const newActiveState = !user.activo;

    const updatedUser = await prisma.user.update({
        where: { id: id },
        data: { activo: newActiveState }
    });

    return {
        email: updatedUser.email,
        activo: updatedUser.activo
    };
}


export {
	getUSers,
	getUSer,
	postUser,
	putUser,
	patchUserActive,
	getUSersMecanicos,
	getUSersClientes
}