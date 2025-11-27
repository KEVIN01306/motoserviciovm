import { Router } from "express";
import { deleteModeloHandler, getModeloHandler, getModelosHandler, postModeloHandler, putModeloHandler } from "../controllers/modelo.controller.js";
import { verifyTokenHandler } from "../controllers/auth.controller.js";

const router = Router();

router.get('/',verifyTokenHandler(), getModelosHandler)
router.get('/:id',verifyTokenHandler(), getModeloHandler)
router.post('/',verifyTokenHandler(), postModeloHandler)
router.put('/:id',verifyTokenHandler(), putModeloHandler)
router.delete('/:id',verifyTokenHandler(), deleteModeloHandler)

export default router;