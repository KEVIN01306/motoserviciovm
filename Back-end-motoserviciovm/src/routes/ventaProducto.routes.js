import { Router } from 'express';
import { getVentaProductosHandler, getVentaProductoHandler, postVentaProductoHandler, putVentaProductoHandler, deleteVentaProductoHandler } from '../controllers/ventaProducto.controller.js';

const router = Router();

router.get('/', getVentaProductosHandler);
router.get('/:id', getVentaProductoHandler);
router.post('/', postVentaProductoHandler);
router.put('/:id', putVentaProductoHandler);
router.delete('/:id', deleteVentaProductoHandler);

export default router;
