import { Router } from "express";
import { getLineasHandler, getLineaHandler, postLineaHandler, putLineaHandler, deleteLineaHandler } from "../controllers/linea.controller.js";
import { verifyTokenHandler } from "../controllers/auth.controller.js";

const router = Router();

router.get('/', getLineasHandler);
router.get('/:id', getLineaHandler);
router.post('/', postLineaHandler);
router.put('/:id', putLineaHandler);
router.delete('/:id', deleteLineaHandler);

export default router;