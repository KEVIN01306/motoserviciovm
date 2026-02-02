import { Router } from "express";
import { getTextosHandler, getTextoHandler, postTextoHandler, putTextoHandler, deleteTextoHandler } from "../controllers/texto.controller.js";
import { verifyTokenHandler } from "../controllers/auth.controller.js";

const router = Router();

router.get('/', getTextosHandler);
router.get('/:id', getTextoHandler);
router.post('/', verifyTokenHandler(), postTextoHandler);
router.put('/:id', verifyTokenHandler(), putTextoHandler);
router.delete('/:id', verifyTokenHandler(), deleteTextoHandler);

export default router;
