import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getVentaProductos, getVentaProducto, postVentaProducto, putVentaProducto, deleteVentaProducto } from "../services/ventaProducto.service.js";
import { ventaProductoSchema } from "../zod/ventaProducto.schema.js";

const getVentaProductosHandler = async (req, res) => {
    try {
        const items = await getVentaProductos();
        return res.status(200).json(responseSuccesAll('VentaProductos obtenidos', items));
    } catch (err) {
        console.error('Get ventaProductos error:', err);
        let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND') { code = 404; msg = err.code; }
        return res.status(code).json(responseError(msg));
    }
}

const getVentaProductoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await getVentaProducto(parseInt(id));
        return res.status(200).json(responseSucces('VentaProducto obtenido', item));
    } catch (err) {
        console.error('Get ventaProducto error:', err);
        let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND') { code = 404; msg = err.code; }
        return res.status(code).json(responseError(msg));
    }
}

const postVentaProductoHandler = async (req, res) => {
    try {
        const data = req.body;
        if (typeof data.ventaId !== 'undefined') data.ventaId = parseInt(data.ventaId);
        if (typeof data.productoId !== 'undefined') data.productoId = parseInt(data.productoId);
        if (typeof data.cantidad !== 'undefined') data.cantidad = parseInt(data.cantidad);
        if (typeof data.totalProducto !== 'undefined') data.totalProducto = parseFloat(data.totalProducto);

        const validation = ventaProductoSchema.safeParse(data);
        if (!validation.success) {
            const msgs = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
            return res.status(400).json(responseError(msgs));
        }
        const created = await postVentaProducto(validation.data);
        return res.status(201).json(responseSucces('VentaProducto creado', created));
    } catch (err) {
        console.error('Post ventaProducto error:', err);
        let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'CONFLICT') { code = 409; msg = err.code; }
        return res.status(code).json(responseError(msg));
    }
}

const putVentaProductoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (typeof data.ventaId !== 'undefined') data.ventaId = parseInt(data.ventaId);
        if (typeof data.productoId !== 'undefined') data.productoId = parseInt(data.productoId);
        if (typeof data.cantidad !== 'undefined') data.cantidad = parseInt(data.cantidad);
        if (typeof data.totalProducto !== 'undefined') data.totalProducto = parseFloat(data.totalProducto);

        const validation = ventaProductoSchema.partial().safeParse(data);
        if (!validation.success) {
            const msgs = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
            return res.status(400).json(responseError(msgs));
        }
        const updated = await putVentaProducto(parseInt(id), validation.data);
        return res.status(200).json(responseSucces('VentaProducto actualizado', updated));
    } catch (err) {
        console.error('Put ventaProducto error:', err);
        let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND') { code = 404; msg = err.code; }
        if (err.code === 'CONFLICT') { code = 409; msg = err.code; }
        return res.status(code).json(responseError(msg));
    }
}

const deleteVentaProductoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteVentaProducto(parseInt(id));
        return res.status(200).json(responseSucces('VentaProducto eliminado', deleted));
    } catch (err) {
        console.error('Delete ventaProducto error:', err);
        let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND') { code = 404; msg = err.code; }
        return res.status(code).json(responseError(msg));
    }
}

export {
    getVentaProductosHandler,
    getVentaProductoHandler,
    postVentaProductoHandler,
    putVentaProductoHandler,
    deleteVentaProductoHandler,
}
