import { Router } from "express";
import { getMotosHandler, getMotoHandler, postMotoHandler, putMotoHandler, deleteMotoHandler } from "../controllers/moto.controller.js";
import { verifyTokenHandler } from "../controllers/auth.controller.js";
import configureMulter from "../configs/multer.config.js";
import path from "path";


const MOTO_UPLOAD = path.join('motos');
const upload = configureMulter({destinationFolder: MOTO_UPLOAD});

const router = Router();

router.get("/",verifyTokenHandler(), getMotosHandler);
router.get("/:id", verifyTokenHandler(), getMotoHandler);
router.post("/", verifyTokenHandler(),upload.single('avatar'), postMotoHandler);
router.put("/:id", verifyTokenHandler(),upload.single('avatar'), putMotoHandler);
router.delete("/:id", verifyTokenHandler(), deleteMotoHandler);

export default router;