import { Router } from "express";
import { getDiasDisponiblesHandler, getDiaDisponibleHandler } from "../controllers/diasDisponibles.controller.js";

const router = Router();

router.get("/", getDiasDisponiblesHandler);
router.get("/:id", getDiaDisponibleHandler);

export default router;
