import Router from 'express';
import { deleteOpcionServicioHandler, getOpcionesServicioHandler, getOpcionServicioHandler, postOpcionServicioHandler, putOpcionServicioHandler } from '../controllers/opcionServicio.controller.js';

const router = Router();

router.get('/', getOpcionesServicioHandler);
router.get('/:id', getOpcionServicioHandler);
router.post('/', postOpcionServicioHandler);
router.put('/:id', putOpcionServicioHandler);
router.delete('/:id', deleteOpcionServicioHandler);


export default router;