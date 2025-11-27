import { Router } from "express";
import { deleteSucursalHandler, getSucursalesHandler, getSucursalHandler, postSucursalHandler, putSucursalHandler } from "../controllers/sucursal.controller.js";
import { verifyTokenHandler } from "../controllers/auth.controller.js";


const router = Router();

router.get('/', getSucursalesHandler);
router.get('/:id', verifyTokenHandler(), getSucursalHandler);
router.post('/', verifyTokenHandler(), postSucursalHandler);
router.put('/:id', verifyTokenHandler(), putSucursalHandler);
router.delete('/:id', verifyTokenHandler(), deleteSucursalHandler);


export default router;