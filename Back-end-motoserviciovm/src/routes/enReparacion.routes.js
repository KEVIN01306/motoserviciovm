import { Router } from 'express';
import { getEnReparacionesHandler, getEnReparacionHandler, postEnReparacionHandler, putEnReparacionHandler, putEnReparacionSalidaHandler } from '../controllers/enReparacion.controller.js';

const router = Router();

router.get('/', getEnReparacionesHandler);
router.get('/:id', getEnReparacionHandler);
router.post('/', postEnReparacionHandler);
router.put('/:id', putEnReparacionHandler);
router.put('/salida/:id', putEnReparacionSalidaHandler);

export default router;
