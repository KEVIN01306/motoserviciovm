import { Router } from "express";
import { getEnParqueoHandler, getEnParqueosHandler, postEnParqueoHandler, putEnParqueoSalidaHandler } from "../controllers/enParqueo.controller.js";

const router = Router();

router.get('/', getEnParqueosHandler);
router.get('/:id', getEnParqueoHandler);
router.post('/', postEnParqueoHandler);
router.put('/salida/:id', putEnParqueoSalidaHandler);

export default router;