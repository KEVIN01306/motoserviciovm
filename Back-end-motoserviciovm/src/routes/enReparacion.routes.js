import { Router } from 'express';
import { getEnReparacionesHandler, getEnReparacionHandler, postEnReparacionHandler, putEnReparacionHandler, putEnReparacionSalidaHandler, putRepuestosReparacionHandler } from '../controllers/enReparacion.controller.js';
import configureMulter from '../configs/multer.config.js';
import path from 'path';
const SERVICIO_UPLOAD = path.join('enReparaciones');
const upload = configureMulter({ destinationFolder: SERVICIO_UPLOAD });

const router = Router();

router.get('/', getEnReparacionesHandler);
router.get('/:id', getEnReparacionHandler);
router.post('/', postEnReparacionHandler);
router.put('/:id', putEnReparacionHandler);
router.put('/salida/:id', upload.fields([{ name: 'firmaSalida', maxCount: 1 }]), putEnReparacionSalidaHandler);
router.put('/:id/repuestos', putRepuestosReparacionHandler);

export default router;
