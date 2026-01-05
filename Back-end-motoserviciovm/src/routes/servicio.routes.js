import { Router } from 'express';
import { getServiciosHandler, getServicioHandler, postServicioHandler, putServicioHandler, deleteServicioHandler, salidaServicioHandler, putProgresoHandler, updateProximoServicioItemsHandler, addServicioImagesHandler } from '../controllers/servicio.controller.js';
import configureMulter from '../configs/multer.config.js';
import path from 'path';

const SERVICIO_UPLOAD = path.join('servicios');
const upload = configureMulter({ destinationFolder: SERVICIO_UPLOAD });

const router = Router();

router.get('/', getServiciosHandler);
router.get('/:id', getServicioHandler);
// accept multiple images in field 'imagenes'
router.post('/', upload.fields([
        { name: 'imagenes', maxCount: 10 },
        { name: 'firmaEntrada', maxCount: 1 }
    ]), postServicioHandler);
router.put('/:id', upload.fields([
        { name: 'imagenes', maxCount: 10 },
        { name: 'firmaEntrada', maxCount: 1 },
    ]), putServicioHandler);
router.put('/salida/:id', upload.fields([
    { name: 'firmaSalida', maxCount: 1 }
]), salidaServicioHandler);
router.put('/progreso/:id', putProgresoHandler);
router.put('/proximosServiciosItems/:id', updateProximoServicioItemsHandler);
router.put('/:id/imagenes', upload.fields([
    { name: 'imagenes', maxCount: 10 }
]), addServicioImagesHandler);
router.delete('/:id', deleteServicioHandler);

export default router;
