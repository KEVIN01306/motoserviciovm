import { Router } from 'express';
import { getServiciosHandler, getServicioHandler, postServicioHandler, putServicioHandler, deleteServicioHandler } from '../controllers/servicio.controller.js';
import configureMulter from '../configs/multer.config.js';
import path from 'path';

const SERVICIO_UPLOAD = path.join('servicios');
const upload = configureMulter({ destinationFolder: SERVICIO_UPLOAD });

const router = Router();

router.get('/', getServiciosHandler);
router.get('/:id', getServicioHandler);
// accept multiple images in field 'imagenes'
router.post('/', upload.array('imagenes', 10), postServicioHandler);
router.put('/:id', upload.array('imagenes', 10), putServicioHandler);
router.delete('/:id', deleteServicioHandler);

export default router;
