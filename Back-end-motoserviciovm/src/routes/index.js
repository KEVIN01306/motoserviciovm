import { Router } from "express";
import path from "path";
import express from "express";

const router = Router();

router.use(express.static(path.join(process.cwd(), 'public')));
router.use('/users', (await import('./user.routes.js')).default);
router.use('/roles', (await import('./rol.routes.js')).default);
router.use('/permisos', (await import('./permiso.routes.js')).default);
router.use('/auth', (await import('./auth.routes.js')).default);
router.use('/sucursales', (await import('./sucursal.routes.js')).default);
router.use('/lineas', (await import('./linea.routes.js')).default);
router.use('/marcas', (await import('./marca.routes.js')).default);
router.use('/cilindradas', (await import('./cilindrada.routes.js')).default);
router.use('/modelos', (await import('./modelo.routes.js')).default);
router.use('/motos', (await import('./moto.routes.js')).default);
router.use('/ai', (await import('./ai.routes.js')).default);
router.use('/opcionservicio', (await import('./opcionservicio.routes.js')).default);
router.use('/tiposervicio', (await import('./tipoServicio.routes.js')).default);
router.use('/categoriasproducto', (await import('./categoriaProducto.routes.js')).default);
router.use('/productos', (await import('./producto.routes.js')).default);
router.use('/inventarios', (await import('./inventario.routes.js')).default);
router.use('/enParqueo', (await import('./enParqueo.routes.js')).default);
router.use('/enReparacion', (await import('./enReparacion.routes.js')).default);
router.use('/repuestosReparacion', (await import('./repuestosReparacion.routes.js')).default);
router.use('/ventas', (await import('./venta.routes.js')).default);
router.use('/ventaProductos', (await import('./ventaProducto.routes.js')).default);
router.use('/servicios', (await import('./servicio.routes.js')).default);
router.use('/contabilidad', (await import('./contabilidad.routes.js')).default);
router.use('/ingresos-egresos', (await import('./ingresosEgresos.routes.js')).default);
router.use('/tipoHorario', (await import('./tipoHorario.routes.js')).default);
router.use('/tipoServicioHorario', (await import('./tipoServicioHorario.routes.js')).default);
router.use('/diasDisponibles', (await import('./diasDisponibles.routes.js')).default);
router.use('/citas', (await import('./cita.routes.js')).default);

export default router;
