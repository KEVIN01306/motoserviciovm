import { Router } from "express";

const router = Router();

router.use('/users', (await import('./user.routes.js')).default);
router.use('/roles', (await import('./rol.routes.js')).default);
router.use('/permisos', (await import('./permiso.routes.js')).default);
router.use('/auth', (await import('./auth.routes.js')).default);
router.use('/sucursales', (await import('./sucursal.routes.js')).default);

export default router;
