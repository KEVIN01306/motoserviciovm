import { Router } from "express";
import { deleteMarcaHandler, getMarcaHandler, getMarcasHandler, postMarcaHandler, putMarcaHandler } from "../controllers/marca.controller.js";
import { verifyTokenHandler } from "../controllers/auth.controller.js";


const router = Router();

router.get('/',verifyTokenHandler(),getMarcasHandler)
router.get('/:id',verifyTokenHandler(), getMarcaHandler)
router.post('/',verifyTokenHandler(), postMarcaHandler)
router.put('/:id',verifyTokenHandler(), putMarcaHandler)
router.delete('/:id',verifyTokenHandler(), deleteMarcaHandler)

export default router;