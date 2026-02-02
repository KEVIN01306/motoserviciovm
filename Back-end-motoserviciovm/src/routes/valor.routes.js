import { Router } from "express";
import { getValoresHandler, getValorHandler, postValorHandler, putValorHandler, deleteValorHandler } from "../controllers/valor.controller.js";
import { verifyTokenHandler } from "../controllers/auth.controller.js";

const router = Router();

router.get('/', getValoresHandler);
router.get('/:id', getValorHandler);
router.post('/', verifyTokenHandler(), postValorHandler);
router.put('/:id', verifyTokenHandler(), putValorHandler);
router.delete('/:id', verifyTokenHandler(), deleteValorHandler);

export default router;
