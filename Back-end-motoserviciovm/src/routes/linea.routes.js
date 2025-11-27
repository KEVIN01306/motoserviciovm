import { Router } from "express";
import { getLineasHandler, getLineaHandler, postLineaHandler, putLineaHandler, deleteLineaHandler } from "../controllers/linea.controller.js";
import { verifyTokenHandler } from "../controllers/auth.controller.js";

const router = Router();

router.get('/',verifyTokenHandler(), getLineasHandler);
router.get('/:id', verifyTokenHandler(), getLineaHandler);
router.post('/', verifyTokenHandler(), postLineaHandler);
router.put('/:id', verifyTokenHandler(), putLineaHandler);
router.delete('/:id', verifyTokenHandler(), deleteLineaHandler);
export default router;