import { Router } from "express";
import { getTiposHorarioHandler } from "../controllers/tipoHorario.controller.js";
import { verifyTokenHandler } from "../controllers/auth.controller.js";

const router = Router();

router.get("/", getTiposHorarioHandler);

export default router;
