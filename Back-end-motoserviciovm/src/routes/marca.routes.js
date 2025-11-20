import { Router } from "express";
import { deleteMarcaHandler, getMarcaHandler, getMarcasHandler, postMarcaHandler, putMarcaHandler } from "../controllers/marca.controller.js";


const router = Router();

router.get('/',getMarcasHandler)
router.get('/:id',getMarcaHandler)
router.post('/',postMarcaHandler)
router.put('/:id',putMarcaHandler)
router.delete('/:id',deleteMarcaHandler)


export default router;