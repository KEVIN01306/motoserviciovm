import { Router } from "express";
import { verifyTokenHandler } from "../controllers/auth.controller.js";
import { getTipoServicioHorarioHandler, getTipoServicioHorariosHandler, postTipoServicioHorarioHandler, putTipoServicioHorarioHandler } from "../controllers/tipoServicioHorario.controller.js";
import { upsertTipoServicioHorarioDiaHandler } from "../controllers/tipoServicioHorario.controller.js";

const router = Router();

router.get("/", getTipoServicioHorariosHandler);
router.get("/:id", getTipoServicioHorarioHandler);
router.post("/",  postTipoServicioHorarioHandler);
router.put("/:id", putTipoServicioHorarioHandler);
router.post("/:id/dias", upsertTipoServicioHorarioDiaHandler);

export default router;
