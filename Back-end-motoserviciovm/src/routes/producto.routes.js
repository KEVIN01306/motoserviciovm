import { Router } from "express";
import { deleteProductoHandler, getProductoHandler, getProductosHandler, postProductoHandler, putProductoHandler } from "../controllers/producto.controller.js";

const router = Router();

router.get('/', getProductosHandler);
router.get('/:id', getProductoHandler);
router.post('/', postProductoHandler);
router.put('/:id', putProductoHandler);
router.delete('/:id', deleteProductoHandler);   

export default router;