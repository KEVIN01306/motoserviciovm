import { Router } from "express";
import { getMotosHandler, getMotoHandler, postMotoHandler, putMotoHandler, deleteMotoHandler } from "../controllers/moto.controller.js";

const router = Router();

router.get("/", getMotosHandler);
router.get("/:id", getMotoHandler);
router.post("/", postMotoHandler);
router.put("/:id", putMotoHandler);
router.delete("/:id", deleteMotoHandler);

export default router;