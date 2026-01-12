import { Router } from "express";
import { getEnParqueoHandler, getEnParqueosHandler, postEnParqueoHandler, putEnParqueoSalidaHandler } from "../controllers/enParqueo.controller.js";
import configureMulter from '../configs/multer.config.js';
import path from 'path';
const SERVICIO_UPLOAD = path.join('enParqueos');
const upload = configureMulter({ destinationFolder: SERVICIO_UPLOAD });

const router = Router();

router.get('/', getEnParqueosHandler);
router.get('/:id', getEnParqueoHandler);
router.post('/', postEnParqueoHandler);
router.put('/salida/:id', upload.fields([{ name: 'firmaSalida', maxCount: 1 }]), putEnParqueoSalidaHandler);

export default router;