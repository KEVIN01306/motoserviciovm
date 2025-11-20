import { Router } from "express";
import { deleteCilindradaHandler, getCilindradaHandler, getCilindradasHandler, postCilindradaHandler, putCilindradaHandler } from "../controllers/cilindrada.controller.js";

const router = Router();

router.get('/',getCilindradasHandler)
router.get('/:id',getCilindradaHandler)
router.post('/',postCilindradaHandler)
router.put('/:id',putCilindradaHandler)
router.delete('/:id',deleteCilindradaHandler)

export default router;