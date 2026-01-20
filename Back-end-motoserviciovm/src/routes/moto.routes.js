import { Router } from "express";
import { getMotosHandler, getMotoPlacaHandler, getMotoHandler, postMotoHandler, putMotoHandler, deleteMotoHandler } from "../controllers/moto.controller.js";
import { verifyTokenHandler } from "../controllers/auth.controller.js";
import configureMulter from "../configs/multer.config.js";
import path from "path";


const MOTO_UPLOAD = path.join('motos');
const upload = configureMulter({destinationFolder: MOTO_UPLOAD});

const router = Router();

router.get("/", verifyTokenHandler(), getMotosHandler);
router.get("/placa/:placa", verifyTokenHandler(), getMotoPlacaHandler);
router.get("/:id", verifyTokenHandler(), getMotoHandler);
router.post("/", verifyTokenHandler(), upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'calcomania', maxCount: 1 }]), postMotoHandler);
router.put("/:id", verifyTokenHandler(), upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'calcomania', maxCount: 1 }]), putMotoHandler);
router.delete("/:id", verifyTokenHandler(), deleteMotoHandler);

export default router;