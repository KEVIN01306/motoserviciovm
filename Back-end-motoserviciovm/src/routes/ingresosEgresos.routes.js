import { Router } from "express";
import { deleteIngresoEgresoHandler, getIngresoEgresoHandler, getIngresosEgresosHandler, postIngresoEgresoHandler, putIngresoEgresoHandler, finalizarIngresoEgresoHandler, cancelarIngresoEgresoHandler } from "../controllers/ingresosEgresos.controller.js";

const router = Router();

router.get('/', getIngresosEgresosHandler);
router.get('/:id',getIngresoEgresoHandler);
router.post('/', postIngresoEgresoHandler);
router.put('/:id', putIngresoEgresoHandler);
router.delete('/:id', deleteIngresoEgresoHandler);
router.patch('/:id/finalizar', finalizarIngresoEgresoHandler);
router.patch('/:id/cancelar', cancelarIngresoEgresoHandler);

export default router;