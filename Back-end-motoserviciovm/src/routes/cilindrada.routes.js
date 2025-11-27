import { Router } from "express";
import { deleteCilindradaHandler, getCilindradaHandler, getCilindradasHandler, postCilindradaHandler, putCilindradaHandler } from "../controllers/cilindrada.controller.js";
import { verifyTokenHandler } from "../controllers/auth.controller.js";

const router = Router();

router.get('/',verifyTokenHandler(), getCilindradasHandler)
router.get('/:id',verifyTokenHandler(), getCilindradaHandler)
router.post('/',verifyTokenHandler(), postCilindradaHandler)
router.put('/:id',verifyTokenHandler(), putCilindradaHandler)
router.delete('/:id',verifyTokenHandler(), deleteCilindradaHandler)
export default router;