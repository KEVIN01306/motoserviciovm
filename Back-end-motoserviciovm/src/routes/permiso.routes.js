import { Router } from "express";
import { deletePermisoHandler, getPermisoHandler, getPermisosHandler, postPermisoHandler, putPermisoHandler } from "../controllers/permiso.controller.js";
import { verifyTokenHandler } from "../controllers/auth.controller.js";

const router = Router();

router.get('/',verifyTokenHandler(), getPermisosHandler);
router.get('/:id', verifyTokenHandler(), getPermisoHandler);
router.post('/', verifyTokenHandler(), postPermisoHandler);
router.put('/:id', verifyTokenHandler(), putPermisoHandler);
router.delete('/:id', verifyTokenHandler(), deletePermisoHandler);

export default router;