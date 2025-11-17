import { Router } from "express";
import { deleteSucursalHandler, getSucursalesHandler, getSucursalHandler, postSucursalHandler, putSucursalHandler } from "../controllers/sucursal.controller.js";


const router = Router();

router.get('/', getSucursalesHandler);
router.get('/:id', getSucursalHandler);
router.post('/', postSucursalHandler);
router.put('/:id', putSucursalHandler);
router.delete('/:id', deleteSucursalHandler);


export default router;