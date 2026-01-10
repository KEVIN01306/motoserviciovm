import z from "zod";
import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getServicios, getServicio, postServicio, putServicio, deleteServicio, salidaServicio, putProgreso, putProximoServicioItems, addServicioImages } from "../services/servicio.service.js";
import { estados } from "../utils/estados.js";
import { servicioSchema, servicioProductoProximoSchema } from "../zod/servicio.schema.js";

const directorio = '/uploads/servicios/';

const getServiciosHandler = async (req, res) => {
    try {
        const { placa, startDate, endDate } = req.query;

        const filters = {
            ...(placa && { placa }),
            ...(startDate && endDate && { startDate, endDate }),
        };

        const items = await getServicios(filters);
        return res.status(200).json(responseSuccesAll("Servicios obtenidos", items));
    } catch (err) {
        console.error("Get servicios error:", err);
        let code = 500;
        let msg = "INTERNAL_SERVER_ERROR";
        if (err.code === "DATA_NOT_FOUND") {
            code = 404;
            msg = err.code;
        }
        return res.status(code).json(responseError(msg));
    }
}

const getServicioHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await getServicio(parseInt(id));
        return res.status(200).json(responseSucces('Servicio obtenido', item));
    } catch (err) {
        console.error('Get servicio error:', err);
        let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND') { code = 404; msg = err.code; }
        return res.status(code).json(responseError(msg));
    }
}

const postServicioHandler = async (req, res) => {
    try {
        const body = req.body || {};
        const directorio = '/uploads/servicios/'; // Ajusta según tu configuración

        // 1. Manejo de archivos provenientes de upload.fields
        // Inicializamos para que Zod no de error de 'undefined'
        body.firmaEntrada = null; 
        let imagenesParaPrisma = [];

        if (req.files) {
            // Manejar la Firma (va al campo string del body)
            if (req.files['firmaEntrada'] && req.files['firmaEntrada'][0]) {
                body.firmaEntrada = directorio + req.files['firmaEntrada'][0].filename;
            }

            // Manejar el Array de Imágenes (se pasará como imagenFiles)
            if (req.files['imagenes']) {
                imagenesParaPrisma = req.files['imagenes'];
            }
        }
        body.kilometrajeProximoServicio = parseInt(body.kilometrajeProximoServicio) || 0; // Inicializamos para que Zod no de error de 'undefined'
        // 2. Parseo de campos numéricos
        const camposNumericos = ['estadoId', 'sucursalId', 'motoId', 'clienteId', 'mecanicoId', 'tipoServicioId', 'kilometraje'];

        camposNumericos.forEach(campo => {
            const valor = body[campo];
            
            // Si el valor es "null" (string), null, o vacío, lo seteamos como null explícito
            if (valor === 'null' || valor === '' || valor === null || valor === undefined) {
                body[campo] = null;
            } else {
                const parsed = parseInt(valor);
                body[campo] = isNaN(parsed) ? null : parsed;
            }
        });
        if (body.total) body.total = parseFloat(body.total);

        // 3. Parseo de JSON Strings (Arrays anidados)
        const camposJSON = ['servicioItems', 'productosCliente', 'imagenesMeta', 'opcionesServicioManual'];
        camposJSON.forEach(campo => {
            try {
                if (typeof body[campo] === 'string') {
                    body[campo] = JSON.parse(body[campo]);
                }
            } catch (e) {
                body[campo] = [];
            }
        });

        // 4. Validación con Zod
        // Ahora firmaEntrada ya es un string o null, no undefined.
        const validation = servicioSchema.safeParse(body);
        if (!validation.success) {
            const msgs = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
            return res.status(400).json(responseError(msgs));
        }

        // 5. Preparar objeto final para postServicio(data)
        if (body.proximaFechaServicio) body.proximaFechaServicio = new Date(body.proximaFechaServicio);

        const dataToSend = { 
            ...body, 
            imagenFiles: imagenesParaPrisma // Aquí pasamos los archivos para el loop de Prisma
        };

        const created = await postServicio(dataToSend);
        return res.status(201).json(responseSucces('Servicio creado', created));

    } catch (err) {
        console.error('Post servicio error:', err);
        let status = 500;
        let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND_INVENTARIO') {
            status = 404;
            msg = 'Uno de los items de inventario no existe';
        }
        return res.status(status).json(responseError(msg));
    }
}
    const putServicioHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body || {};

        // 1. Manejo de archivos (Firmas e Imágenes)
        let imagenesParaPrisma = [];

        if (req.files) {
            // Firma de Recepción (Entrada)
            if (req.files['firmaRecepcion'] && req.files['firmaRecepcion'][0]) {
                body.firmaEntrada = directorio + req.files['firmaRecepcion'][0].filename;
            }

            // Firma de Salida
            if (req.files['firmaSalida'] && req.files['firmaSalida'][0]) {
                body.firmaSalida = directorio + req.files['firmaSalida'][0].filename;
            }

            // Array de nuevas imágenes
            if (req.files['imagenes']) {
                imagenesParaPrisma = req.files['imagenes'];
            }
        }

        console.log('Body after file handling:', body);

    

        // 2. Parseo de campos numéricos (solo si vienen en el body)
        const camposNumericos = ['estadoId', 'sucursalId', 'motoId', 'clienteId', 'mecanicoId', 'tipoServicioId', 'kilometraje'];

        camposNumericos.forEach(campo => {
            const valor = body[campo];
            
            // Si el valor es "null" (string), null, o vacío, lo seteamos como null explícito
            if (valor === 'null' || valor === '' || valor === null || valor === undefined) {
                body[campo] = null;
            } else {
                const parsed = parseInt(valor);
                body[campo] = isNaN(parsed) ? null : parsed;
            }
        });
        if (body.total !== undefined) body.total = parseFloat(body.total);

        // 3. Parseo de JSON Strings
        const camposJSON = ['servicioItems', 'productosCliente', 'imagenesMeta'];
        camposJSON.forEach(campo => {
            try {
                if (typeof body[campo] === 'string') {
                    body[campo] = JSON.parse(body[campo]);
                }
            } catch (e) {
                // En PUT, a veces es mejor no resetear a [] si falla el parse, 
                // pero mantenemos tu lógica de consistencia.
                body[campo] = body[campo] || []; 
            }
        });

        // 4. Validación parcial con Zod
        const validation = servicioSchema.partial().safeParse(body);
        if (!validation.success) {
            const msgs = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
            return res.status(400).json(responseError(msgs));
        }

        // 5. Conversión de fechas
        if (typeof body.proximaFechaServicio === 'string' && body.proximaFechaServicio) {
            body.proximaFechaServicio = new Date(body.proximaFechaServicio);
        }

        // 6. Preparar objeto para el servicio
        const dataToSend = { 
            ...body, 
            imagenFiles: imagenesParaPrisma 
        };

        const updated = await putServicio(parseInt(id), dataToSend);
        return res.status(200).json(responseSucces('Servicio actualizado', updated));

    } catch (err) {
        console.error('Put servicio error:', err);
        let code = 500; 
        let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND') { code = 404; msg = err.code; }
        return res.status(code).json(responseError(msg));
    }
}

const deleteServicioHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteServicio(parseInt(id));
        return res.status(200).json(responseSucces('Servicio eliminado', deleted));
    } catch (err) {
        console.error('Delete servicio error:', err);
        let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND') { code = 404; msg = err.code; }
        return res.status(code).json(responseError(msg));
    }
}

const salidaServicioHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body || {};

        console.log('Salida servicio body:', body);

        // Handle file uploads
        if (req.files && req.files['firmaSalida'] && req.files['firmaSalida'][0]) {
            body.firmaSalida = directorio + req.files['firmaSalida'][0].filename;
        }

        // Parse numeric fields
        if (body.total !== undefined) body.total = parseFloat(body.total);
        if (body.kilometrajeProximoServicio !== undefined) {
            body.kilometrajeProximoServicio = parseInt(body.kilometrajeProximoServicio);
        }

        // Parse date fields
        if (typeof body.proximaFechaServicio === 'string' && body.proximaFechaServicio) {
            body.proximaFechaServicio = new Date(body.proximaFechaServicio);
        }

        // Parse JSON fields
        if (typeof body.proximoServicioItems === 'string') {
            try {
                body.proximoServicioItems = JSON.parse(body.proximoServicioItems);
            } catch (e) {
                return res.status(400).json(responseError('Invalid JSON format for proximoServicioItems'));
            }
        }

        // Validate proximoServicioItems with Zod
        if (body.proximoServicioItems) {
            const validation = z.array(servicioProductoProximoSchema).safeParse(body.proximoServicioItems);
            if (!validation.success) {
                const msgs = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
                return res.status(400).json(responseError(msgs));
            }
        }

        if (body.accionSalida == '' || body.accionSalida == null || typeof body.accionSalida === 'undefined') {
            return res.status(400).json(responseError('Accion de salida no definida'));
        }

        if ((body.accionSalida == "REPARAR" || body.accionSalida == "PARQUEAR") && (body.descripcionAccion == '' || body.descripcionAccion == null || typeof body.descripcionAccion === 'undefined')) {
            return res.status(400).json(responseError('Descripcion de accion no definida'));
        }

        // Prepare data for service
        const dataToSend = {
            proximaFechaServicio: body.proximaFechaServicio,
            descripcionProximoServicio: body.descripcionProximoServicio,
            observaciones: body.observaciones,
            total: body.total,
            firmaSalida: body.firmaSalida,
            kilometrajeProximoServicio: body.kilometrajeProximoServicio,
            proximoServicioItems: body.proximoServicioItems,
            estadoId: estados().entregado,
            accionSalida: body.accionSalida,
            descripcionAccion: body.descripcionAccion,
        };

        const updated = await salidaServicio(parseInt(id), dataToSend);
        return res.status(200).json(responseSucces('Salida registrada', updated));
    } catch (err) {
        console.error('Salida servicio error:', err);
        let code = 500;
        let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND') { code = 404; msg = err.code; }
        return res.status(code).json(responseError(msg));
    }
};

const putProgresoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { progresoItems } = req.body;
        console.log("Received progresoItems:", progresoItems);

        if (!Array.isArray(progresoItems)) {
            return res.status(400).json(responseError("Invalid data format. Expected an array of progreso items."));
        }

        const updated = await putProgreso(parseInt(id), progresoItems);
        return res.status(200).json(responseSucces("Progreso actualizado", updated));
    } catch (err) {
        console.error("Error in putProgresoHandler:", err);
        let code = 500;
        let msg = "INTERNAL_SERVER_ERROR";
        if (err.code === "DATA_NOT_FOUND") {
            code = 404;
            msg = err.code;
        }
        return res.status(code).json(responseError(msg));
    }
};

const updateProximoServicioItemsHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const proximoServicioItems = req.body;

        if (!Array.isArray(proximoServicioItems)) {
            return res.status(400).json(responseError("Invalid data format. Expected an array of proximoServicioItems."));
        }

        console.log("Received proximoServicioItems:", proximoServicioItems);

        // Delete existing items for the service and recreate them
        const updated = await putProximoServicioItems(parseInt(id), proximoServicioItems);
        return res.status(200).json(responseSucces("ProximoServicioItems updated successfully", updated));
    } catch (err) {
        console.error("Error in updateProximoServicioItemsHandler:", err);
        let code = 500;
        let msg = "INTERNAL_SERVER_ERROR";
        if (err.code === "DATA_NOT_FOUND") {
            code = 404;
            msg = err.code;
        }
        return res.status(code).json(responseError(msg));
    }
};

const addServicioImagesHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const imagenFiles = req.files?.imagenes || [];
        const imagenesMeta = req.body.imagenesMeta || [];
        const parsedImagenesMeta = typeof imagenesMeta === "string" ? JSON.parse(imagenesMeta) : imagenesMeta;

        console.log("Received imagenesMeta:", parsedImagenesMeta);
        const result = await addServicioImages(parseInt(id), imagenFiles, parsedImagenesMeta);
        return res.status(200).json(responseSucces("Images added successfully", result));
    } catch (err) {
        console.error("Error in addServicioImagesHandler:", err);
        let code = 500;
        let msg = "INTERNAL_SERVER_ERROR";
        if (err.code === "DATA_NOT_FOUND") {
            code = 404;
            msg = err.code;
        }
        return res.status(code).json(responseError(msg));
    }
};

export {
    getServiciosHandler,
    getServicioHandler,
    postServicioHandler,
    putServicioHandler,
    deleteServicioHandler,
    salidaServicioHandler,
    putProgresoHandler,
    updateProximoServicioItemsHandler,
    addServicioImagesHandler,
}
