import { Router } from 'express';
import { deleteTipoServicioHandler, getTiposServicioHandler, getTipoServicioHandler, postTipoServicioHandler, putTipoServicioHandler } from '../controllers/tipoServicio.controller.js';
const router = Router()

router.get('/', getTiposServicioHandler);
router.get('/:id', getTipoServicioHandler);
router.post('/', postTipoServicioHandler);
router.put('/:id', putTipoServicioHandler);
router.delete('/:id', deleteTipoServicioHandler);

export default router;

