import { Router } from "express";
import { deleteRolHandler, getRolesHandler, getRolHandler, putRolHandler,postRolHandler } from "../controllers/rol.controller.js";
import { verifyTokenHandler } from "../controllers/auth.controller.js";

const router = Router();

router.get('/',verifyTokenHandler(), getRolesHandler);
router.get('/:id', verifyTokenHandler(), getRolHandler);
router.post('/', verifyTokenHandler(), postRolHandler);
router.put('/:id', verifyTokenHandler(), putRolHandler);
router.delete('/:id', verifyTokenHandler(), deleteRolHandler);

export default router;