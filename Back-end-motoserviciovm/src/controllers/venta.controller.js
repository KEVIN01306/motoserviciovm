import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getVentas, getVenta, postVenta, putVenta, deleteVenta, postVentaWithProductos, putVentaWithProductos, patchFinalizarVenta, patchCancelarVenta } from "../services/venta.service.js";
import { ventaSchema } from "../zod/venta.schema.js";
import { ventaProductoSchema } from "../zod/ventaProducto.schema.js";

const getVentasHandler = async (req, res) => {
    try {
        const items = await getVentas();
        return res.status(200).json(responseSuccesAll('Ventas obtenidas', items));
    } catch (err) {
        console.error('Get ventas error:', err);
        let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND') { code = 404; msg = err.code; }
        return res.status(code).json(responseError(msg));
    }
}

const getVentaHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await getVenta(parseInt(id));
        return res.status(200).json(responseSucces('Venta obtenida', item));
    } catch (err) {
        console.error('Get venta error:', err);
        let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND') { code = 404; msg = err.code; }
        return res.status(code).json(responseError(msg));
    }
}

const postVentaHandler = async (req, res) => {
    try {
        const data = req.body;
        if (typeof data.usuarioId !== 'undefined') data.usuarioId = parseInt(data.usuarioId);
        if (typeof data.servicioId !== 'undefined' && data.servicioId !== null) data.servicioId = parseInt(data.servicioId);
        if (typeof data.total !== 'undefined') data.total = parseFloat(data.total);
        if (typeof data.estadoId !== 'undefined') data.estadoId = parseInt(data.estadoId);

        // validate venta base
        const validation = ventaSchema.safeParse(data);
        if (!validation.success) {
            const msgs = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
            return res.status(400).json(responseError(msgs));
        }

        // if productos provided, validate each (client must NOT send ventaId)
        if (Array.isArray(data.productos)) {
            for (const pRaw of data.productos) {
                const p = { ...pRaw };
                if (typeof p.productoId !== 'undefined') p.productoId = parseInt(p.productoId);
                if (typeof p.cantidad !== 'undefined') p.cantidad = parseInt(p.cantidad);
                if (typeof p.totalProducto !== 'undefined') p.totalProducto = parseFloat(p.totalProducto);
                const vp = ventaProductoSchema.omit({ ventaId: true }).safeParse(p);
                if (!vp.success) {
                    const msgs = vp.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
                    return res.status(400).json(responseError(msgs));
                }
            }
            const created = await postVentaWithProductos(data);
            return res.status(201).json(responseSucces('Venta creada con productos', created));
        }

        const created = await postVenta(validation.data);
        return res.status(201).json(responseSucces('Venta creada', created));
    } catch (err) {
        console.error('Post venta error:', err);
        let status = 500;
        let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND') { status = 404; msg = err.code; }
        if (err.code === 'INSUFFICIENT_STOCK') { status = 409; msg = err.code; }
        return res.status(status).json(responseError(msg));
    }
}

const putVentaHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (typeof data.usuarioId !== 'undefined') data.usuarioId = parseInt(data.usuarioId);
        if (typeof data.servicioId !== 'undefined' && data.servicioId !== null) data.servicioId = parseInt(data.servicioId);
        if (typeof data.total !== 'undefined') data.total = parseFloat(data.total);
        if (typeof data.estadoId !== 'undefined') data.estadoId = parseInt(data.estadoId);

        const validation = ventaSchema.partial().safeParse(data);
        if (!validation.success) {
            const msgs = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
            return res.status(400).json(responseError(msgs));
        }

        if (Array.isArray(data.productos)) {
            for (const pRaw of data.productos) {
                const p = { ...pRaw };
                if (typeof p.productoId !== 'undefined') p.productoId = parseInt(p.productoId);
                if (typeof p.cantidad !== 'undefined') p.cantidad = parseInt(p.cantidad);
                if (typeof p.totalProducto !== 'undefined') p.totalProducto = parseFloat(p.totalProducto);
                const vp = ventaProductoSchema.partial().safeParse(p);
                if (!vp.success) {
                    const msgs = vp.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
                    return res.status(400).json(responseError(msgs));
                }
            }
            const updated = await putVentaWithProductos(parseInt(id), data);
            return res.status(200).json(responseSucces('Venta actualizada con productos', updated));
        }

        const updated = await putVenta(parseInt(id), validation.data);
        return res.status(200).json(responseSucces('Venta actualizada', updated));
    } catch (err) {
        console.error('Put venta error:', err);
        let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND') { code = 404; msg = err.code; }
        if (err.code === 'INSUFFICIENT_STOCK') { code = 409; msg = err.code; }
        return res.status(code).json(responseError(msg));
    }
}

const deleteVentaHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteVenta(parseInt(id));
        return res.status(200).json(responseSucces('Venta eliminada', deleted));
    } catch (err) {
        console.error('Delete venta error:', err);
        let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND') { code = 404; msg = err.code; }
        return res.status(code).json(responseError(msg));
    }
}

const patchCancelarVentaHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const cancelled = await patchCancelarVenta(parseInt(id));
        return res.status(200).json(responseSucces('Venta cancelada', cancelled));
    } catch (err) {
        console.error('Cancelar venta error:', err);
        let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND') { code = 404; msg = err.code; }
        return res.status(code).json(responseError(msg));
    }
}

const patchFinalizarVentaHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const finalized = await patchFinalizarVenta(parseInt(id));
        return res.status(200).json(responseSucces('Venta finalizada', finalized));
    } catch (err) {
        console.error('Finalizar venta error:', err);
        let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
        if (err.code === 'DATA_NOT_FOUND') { code = 404; msg = err.code; }
        return res.status(code).json(responseError(msg));
    }
}

export {
    getVentasHandler,
    getVentaHandler,
    postVentaHandler,
    putVentaHandler,
    deleteVentaHandler,
    patchCancelarVentaHandler,
    patchFinalizarVentaHandler
}