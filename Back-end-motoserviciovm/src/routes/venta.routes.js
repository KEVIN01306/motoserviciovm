import { Router } from 'express';
import { getVentasHandler, getVentaHandler, postVentaHandler, putVentaHandler, deleteVentaHandler, patchCancelarVentaHandler, patchFinalizarVentaHandler } from '../controllers/venta.controller.js';

const router = Router();

router.get('/', getVentasHandler);
router.get('/:id', getVentaHandler);
router.post('/', postVentaHandler);
router.put('/:id', putVentaHandler);
router.delete('/:id', deleteVentaHandler);
router.patch('/:id/cancelar', patchCancelarVentaHandler);
router.patch('/:id/finalizar', patchFinalizarVentaHandler);

export default router;
