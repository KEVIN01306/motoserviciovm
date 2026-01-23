import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";
import { tiposModulos } from "../utils/modulosTaller.js";
import { tiposContabilidad } from "../utils/tiposContabilidad.js";


const getTotalesContabilidad = async (sucursalIds,fechaInicio,fechaFin) => {

    const totalGastos = await prisma.ingresosEgresos.aggregate({
        where: { tipoId: tiposContabilidad().egreso, estadoId: estados().confirmado, sucursalId: { in: sucursalIds }, updatedAt: { gte: fechaInicio, lte: fechaFin } },
        _sum: { monto: true },
    });

    const totalIngresos = await prisma.ingresosEgresos.aggregate({
        where: { tipoId: tiposContabilidad().ingreso, estadoId: estados().confirmado, sucursalId: { in: sucursalIds }, updatedAt: { gte: fechaInicio, lte: fechaFin } },
        _sum: { monto: true },
    });

    const IngresosEgresos = await prisma.ingresosEgresos.findMany({
        where: { estadoId: estados().confirmado, sucursalId: { in: sucursalIds }, updatedAt: { gte: fechaInicio, lte: fechaFin } },
        include: { tipo: true },
    });


    // MODULO CONTROL TALLER

    // TOTAL DE INGRESOS EN SERVICIOS

    const totalServicios = await prisma.servicio.aggregate({
        where: { estadoId: estados().entregado, sucursalId: { in: sucursalIds }, updatedAt: { gte: fechaInicio, lte: fechaFin } },
        _sum: { total: true },
    });

    const totalDescuentosServicios = await prisma.servicio.aggregate({
        where: { estadoId: estados().entregado, sucursalId: { in: sucursalIds }, updatedAt: { gte: fechaInicio, lte: fechaFin } },
        _sum: { descuentosServicio: true },
    });

    // SERVICIOS DETALLE

    const Servicios = await prisma.servicio.findMany({
        where: { estadoId: estados().entregado, sucursalId: { in: sucursalIds }, updatedAt: { gte: fechaInicio, lte: fechaFin } },
        include: { moto: true },
        orderBy: { id: 'desc' },
    });

    // GASTOS TALLER

    const totalGastosTaller = await prisma.ingresosEgresos.aggregate({
        where: { tipoId: tiposContabilidad().egreso, estadoId: estados().entregado, sucursalId: { in: sucursalIds }, moduloTallerId: tiposModulos().taller, updatedAt: { gte: fechaInicio, lte: fechaFin } },
        _sum: { monto: true },
    });

    // DETALLE DE GASTOS TALLER



    // TOTAL CAJA TALLER

    const totalCajaTaller = (totalServicios._sum.total - (totalDescuentosServicios._sum.descuentosServicio || 0)) - (totalGastosTaller._sum.monto || 0);

    // MODULO CONTROL REPUESTOS

    // TOTAL DE INGRESOS EN VENTAS

    const totalVentas = await prisma.venta.aggregate({
        where: { estadoId: estados().confirmado, sucursalId: { in: sucursalIds }, updatedAt: { gte: fechaInicio, lte: fechaFin } },
        _sum: { total: true },
    });
    
    // TOTAL GANANCIAS EN VENTAS
    const totalGananciasVentas = await prisma.ventaProducto.aggregate({
        where: { venta: { estadoId: estados().confirmado, sucursalId: { in: sucursalIds }, updatedAt: { gte: fechaInicio, lte: fechaFin } } },
        _sum: { ganacia: true },
    });

    // DETALLE DE VENTAS

    const Ventas = await prisma.venta.findMany({
        where: { estadoId: estados().confirmado, sucursalId: { in: sucursalIds }, updatedAt: { gte: fechaInicio, lte: fechaFin } },
        include: { servicio: true },
    });

    // GASTOS REPUESTOS
    const totalGastosRepuestos = await prisma.ingresosEgresos.aggregate({
        where: { tipoId: tiposContabilidad().egreso, estadoId: estados().confirmado, sucursalId: { in: sucursalIds }, moduloTallerId: tiposModulos().repuestos, updatedAt: { gte: fechaInicio, lte: fechaFin } },
        _sum: { monto: true },
    });

    // DETALLE DE GASTOS REPUESTOS


    // TOTAL CAJA REPUESTOS
    const totalCajaRepuestos = (totalVentas._sum.total || 0) - (totalGastosRepuestos._sum.monto || 0);

    const totalIngresosGenerales = (totalServicios._sum.total - (totalDescuentosServicios._sum.descuentosServicio || 0)) + (totalVentas._sum.total || 0) + (totalIngresos._sum.monto || 0);
    return {

        // TALLER 
        totalServiciosTaller: (totalServicios._sum.total - (totalDescuentosServicios._sum.descuentosServicio || 0)) || 0,
        totalGastosTaller: totalGastosTaller._sum.monto || 0,
        totalCajaTaller: totalCajaTaller,

        // TALLER DETALLE
        serviciosDetalle: Servicios,
        gastosTallerDetalle: IngresosEgresos.filter(ie => ie.moduloTallerId === tiposModulos().taller && ie.tipoId === tiposContabilidad().egreso),

        // REPUESTOS
        totalVentasRepuestos: totalVentas._sum.total || 0,
        totalGananciasVentas: totalGananciasVentas._sum.ganacia || 0,
        totalGastosRepuestos: totalGastosRepuestos._sum.monto || 0,
        totalCajaRepuestos: totalCajaRepuestos,

        // REPUESTOS DETALLE
        ventasDetalle: Ventas,
        gastosRepuestosDetalle: IngresosEgresos.filter(ie => ie.moduloTallerId === tiposModulos().repuestos && ie.tipoId === tiposContabilidad().egreso),

        // GENERALES
        totalIngresos: totalIngresosGenerales || 0,
        totalGastos: totalGastos._sum.monto || 0,
        totalCajaGeneral: (totalIngresosGenerales || 0) - (totalGastos._sum.monto || 0),
       
        ingresosEgresosDetalle: IngresosEgresos,
    };
}

export {
    getTotalesContabilidad,
}