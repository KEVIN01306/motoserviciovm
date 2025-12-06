import { Router } from "express";
import { deleteProductoHandler, getProductoHandler, getProductosHandler, postProductoHandler, putProductoHandler } from "../controllers/producto.controller.js";
import configureMulter from "../configs/multer.config.js";
import path from "path";

const PRODUCTO_UPLOAD = path.join('productos');
const upload = configureMulter({destinationFolder: PRODUCTO_UPLOAD});

const router = Router();

router.get('/', getProductosHandler);
router.get('/:id', getProductoHandler);
router.post('/',upload.single('imagen'), postProductoHandler);
router.put('/:id', upload.single('imagen'), putProductoHandler);
router.delete('/:id', deleteProductoHandler);   

export default router;