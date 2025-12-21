import { Router } from 'express';
import { getRepuestosHandler, getRepuestoHandler, postRepuestoHandler, putRepuestoHandler, deleteRepuestoHandler, patchCheckedRepuestosHandler } from '../controllers/repuestosReparacion.controller.js';
import configureMulter from '../configs/multer.config.js';
import path from 'path';

const REPARACION_REPUESTO_UPLOAD = path.join('repuestosReparacion');
const upload = configureMulter({ destinationFolder: REPARACION_REPUESTO_UPLOAD });

const router = Router();

router.get('/', getRepuestosHandler);
router.get('/:id', getRepuestoHandler);
router.post('/', upload.single('imagen'), postRepuestoHandler);
router.put('/:id', upload.single('imagen'), putRepuestoHandler);
router.delete('/:id', deleteRepuestoHandler);
router.patch('/:id/checked', patchCheckedRepuestosHandler);

export default router;
