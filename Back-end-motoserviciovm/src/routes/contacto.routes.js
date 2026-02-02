import { Router } from "express";
import { getContactosHandler, getContactoHandler, postContactoHandler, putContactoHandler, deleteContactoHandler } from "../controllers/contacto.controller.js";
import { verifyTokenHandler } from "../controllers/auth.controller.js";

const router = Router();

router.get('/', getContactosHandler);
router.get('/:id', getContactoHandler);
router.post('/', verifyTokenHandler(), postContactoHandler);
router.put('/:id', verifyTokenHandler(), putContactoHandler);
router.delete('/:id', verifyTokenHandler(), deleteContactoHandler);

export default router;
