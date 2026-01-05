import { Router } from "express";
import { loginHandler, verifyTokenHandler, meHandler, motoLoginHandler } from "../controllers/auth.controller.js";
import { getMe } from "../services/auth.services.js";

const router = Router()

router.post('/', loginHandler)
router.post('/moto-login', motoLoginHandler);
router.get('/me', verifyTokenHandler(), meHandler(getMe))


export default router;