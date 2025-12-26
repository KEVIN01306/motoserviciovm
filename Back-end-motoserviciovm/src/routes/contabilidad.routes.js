import { Router } from "express";
import { getContabilidad } from "../controllers/contabilidad.controller.js";

const router = Router();

router.get("/totales", getContabilidad);

export default router;