import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getServicios, getServicio, postServicio, putServicio, deleteServicio } from "../services/servicio.service.js";
import { servicioSchema } from "../zod/servicio.schema.js";

const directorio = '/uploads/servicios/';

const getServiciosHandler = async (req, res) => {
    try {
        const items = await getServicios();
        return res.status(200).json(responseSuccesAll('Servicios obtenidos', items));
    } catch (err) {
        console.error('Get servicios error:', err);
        let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND') { code = 404; msg = err.code; }
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
        // parse numeric fields
        if (typeof body.estadoId !== 'undefined') body.estadoId = parseInt(body.estadoId);
        if (typeof body.sucursalId !== 'undefined') body.sucursalId = parseInt(body.sucursalId);
        if (typeof body.motoId !== 'undefined') body.motoId = parseInt(body.motoId);
        if (typeof body.clienteId !== 'undefined' && body.clienteId !== null) body.clienteId = parseInt(body.clienteId);
        if (typeof body.mecanicoId !== 'undefined') body.mecanicoId = parseInt(body.mecanicoId);
        if (typeof body.tipoServicioId !== 'undefined') body.tipoServicioId = parseInt(body.tipoServicioId);
        if (typeof body.total !== 'undefined') body.total = parseFloat(body.total);

        // parse nested arrays if sent as JSON strings; ensure imagenesMeta is always an array
        try { if (typeof body.servicioItems === 'string') body.servicioItems = JSON.parse(body.servicioItems); } catch(e) { body.servicioItems = []; }
        try { if (typeof body.productosCliente === 'string') body.productosCliente = JSON.parse(body.productosCliente); } catch(e) { body.productosCliente = []; }
        try { if (typeof body.imagenesMeta === 'string') body.imagenesMeta = JSON.parse(body.imagenesMeta); } catch(e) { body.imagenesMeta = []; }
        console.log('Body imagenesMeta before parse:', body.imagenesMeta);
        try { if (typeof body.imagenesMeta === 'string') body.imagenesMeta = JSON.parse(body.imagenesMeta); } catch(e) { body.imagenesMeta = []; }
        console.log('Body imagenesMeta after parse:', body.imagenesMeta);
        if (!Array.isArray(body.imagenesMeta)) body.imagenesMeta = [];
        console.log('Body imagenesMeta final:', body.imagenesMeta);

        const validation = servicioSchema.safeParse(body);
        if (!validation.success) {
            const msgs = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
            return res.status(400).json(responseError(msgs));
        }

        // convert date strings to JS Date objects so Prisma receives Date for DateTime fields
        if (typeof body.fechaEntrada === 'string' && body.fechaEntrada) body.fechaEntrada = new Date(body.fechaEntrada);
        if (typeof body.fechaSalida === 'string' && body.fechaSalida) body.fechaSalida = new Date(body.fechaSalida);
        if (typeof body.proximaFechaServicio === 'string' && body.proximaFechaServicio) body.proximaFechaServicio = new Date(body.proximaFechaServicio);

        // attach files array to data after converting dates
        const dataToSend = { ...body, imagenFiles: req.files };

        const created = await postServicio(dataToSend);
        return res.status(201).json(responseSucces('Servicio creado', created));
    } catch (err) {
        console.error('Post servicio error:', err);
        let status = 500; let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND') { status = 404; msg = err.code; }
        return res.status(status).json(responseError(msg));
    }
}

const putServicioHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body || {};
        if (typeof body.estadoId !== 'undefined') body.estadoId = parseInt(body.estadoId);
        if (typeof body.sucursalId !== 'undefined') body.sucursalId = parseInt(body.sucursalId);
        if (typeof body.motoId !== 'undefined') body.motoId = parseInt(body.motoId);
        if (typeof body.clienteId !== 'undefined' && body.clienteId !== null) body.clienteId = parseInt(body.clienteId);
        if (typeof body.mecanicoId !== 'undefined') body.mecanicoId = parseInt(body.mecanicoId);
        if (typeof body.tipoServicioId !== 'undefined') body.tipoServicioId = parseInt(body.tipoServicioId);
        if (typeof body.total !== 'undefined') body.total = parseFloat(body.total);

        try { if (typeof body.servicioItems === 'string') body.servicioItems = JSON.parse(body.servicioItems); } catch(e) { body.servicioItems = []; }
        try { if (typeof body.productosCliente === 'string') body.productosCliente = JSON.parse(body.productosCliente); } catch(e) { body.productosCliente = []; }
        console.log('Body imagenesMeta before parse:', body.imagenesMeta);
        try { if (typeof body.imagenesMeta === 'string') body.imagenesMeta = JSON.parse(body.imagenesMeta); } catch(e) { body.imagenesMeta = []; }
        console.log('Body imagenesMeta after parse:', body.imagenesMeta);
        if (!Array.isArray(body.imagenesMeta)) body.imagenesMeta = [];
        console.log('Body imagenesMeta final:', body.imagenesMeta);
        const dataToSend = { ...body, imagenFiles: req.files };

        const validation = servicioSchema.partial().safeParse(body);
        if (!validation.success) {
            const msgs = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
            return res.status(400).json(responseError(msgs));
        }
        // convert date strings to JS Date objects so Prisma receives Date for DateTime fields
        if (typeof body.fechaEntrada === 'string' && body.fechaEntrada) body.fechaEntrada = new Date(body.fechaEntrada);
        if (typeof body.fechaSalida === 'string' && body.fechaSalida) body.fechaSalida = new Date(body.fechaSalida);
        if (typeof body.proximaFechaServicio === 'string' && body.proximaFechaServicio) body.proximaFechaServicio = new Date(body.proximaFechaServicio);


        const updated = await putServicio(parseInt(id), dataToSend);
        return res.status(200).json(responseSucces('Servicio actualizado', updated));
    } catch (err) {
        console.error('Put servicio error:', err);
        let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
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

export {
    getServiciosHandler,
    getServicioHandler,
    postServicioHandler,
    putServicioHandler,
    deleteServicioHandler,
}
