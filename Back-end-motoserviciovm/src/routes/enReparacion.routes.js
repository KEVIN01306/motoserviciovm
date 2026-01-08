import { Router } from 'express';
import { getEnReparacionesHandler, getEnReparacionHandler, postEnReparacionHandler, putEnReparacionHandler, putEnReparacionSalidaHandler, putRepuestosReparacionHandler } from '../controllers/enReparacion.controller.js';

const router = Router();

router.get('/', getEnReparacionesHandler);
router.get('/:id', getEnReparacionHandler);
router.post('/', postEnReparacionHandler);
router.put('/:id', putEnReparacionHandler);
router.put('/salida/:id', putEnReparacionSalidaHandler);
router.put('/:id/repuestos', putRepuestosReparacionHandler);

export default router;
