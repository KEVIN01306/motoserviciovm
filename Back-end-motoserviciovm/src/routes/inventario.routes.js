import { Router } from "express";
import { deleteInventarioHandler, getInventarioHandler, getInventariosHandler, postInventarioHandler, putInventarioHandler } from "../controllers/intentario.controller.js";

const router = Router();

router.get('/', getInventariosHandler);
router.get('/:id', getInventarioHandler);
router.post('/', postInventarioHandler);
router.put('/:id', putInventarioHandler);
router.delete('/:id', deleteInventarioHandler);

export default router;