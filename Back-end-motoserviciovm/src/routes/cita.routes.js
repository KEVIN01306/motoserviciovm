import { Router } from "express";
import { getCitasHandler, getCitaHandler, postCitaHandler, putCitaHandler, deleteCitaHandler } from "../controllers/cita.controller.js";

const router = Router();

router.get("/", getCitasHandler);
router.get("/:id", getCitaHandler);
router.post("/", postCitaHandler);
router.put("/:id", putCitaHandler);
router.delete("/:id", deleteCitaHandler);

export default router;
