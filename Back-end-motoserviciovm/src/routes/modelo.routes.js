import { Router } from "express";
import { deleteModeloHandler, getModeloHandler, getModelosHandler, postModeloHandler, putModeloHandler } from "../controllers/modelo.controller.js";

const router = Router();

router.get('/',getModelosHandler)
router.get('/:id',getModeloHandler)
router.post('/',postModeloHandler)
router.put('/:id',putModeloHandler)
router.delete('/:id',deleteModeloHandler)


export default router;