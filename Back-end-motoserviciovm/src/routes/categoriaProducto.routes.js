import { Router } from "express";
import { deleteCategoriaProductoHandler, getCategoriaProductoHandler, getCategoriasProductoHandler, postCategoriaProductoHandler, putCategoriaProductoHandler } from "../controllers/categoriaProducto.controller.js";

const router = Router();

router.get('/', getCategoriasProductoHandler);
router.get('/:id', getCategoriaProductoHandler);
router.post('/', postCategoriaProductoHandler);
router.put('/:id', putCategoriaProductoHandler);
router.delete('/:id', deleteCategoriaProductoHandler);

export default router;