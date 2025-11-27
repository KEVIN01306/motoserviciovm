import { Router } from "express";
import { getMotosHandler, getMotoHandler, postMotoHandler, putMotoHandler, deleteMotoHandler } from "../controllers/moto.controller.js";
import { verifyTokenHandler } from "../controllers/auth.controller.js";

const router = Router();

router.get("/",verifyTokenHandler(), getMotosHandler);
router.get("/:id", verifyTokenHandler(), getMotoHandler);
router.post("/", verifyTokenHandler(), postMotoHandler);
router.put("/:id", verifyTokenHandler(), putMotoHandler);
router.delete("/:id", verifyTokenHandler(), deleteMotoHandler);
export default router;