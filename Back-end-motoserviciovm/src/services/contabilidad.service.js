import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";
import { tiposModulos } from "../utils/modulosTaller.js";
import { tiposContabilidad } from "../utils/tiposContabilidad.js";

const getTotalesContabilidad = async (sucursalIds,fechaInicio,fechaFin) => {

    // Filtro base para no repetir código en cada consulta
    const whereBase = {
        sucursalId: { in: sucursalIds },
        updatedAt: { gte: fechaInicio, lte: fechaFin }
    };

    const totalGastos = await prisma.ingresosEgresos.aggregate({
        where: { tipoId: tiposContabilidad().egreso, estadoId: estados().confirmado, ...whereBase },
        _sum: { monto: true },
    });

    const totalIngresos = await prisma.ingresosEgresos.aggregate({
        where: { tipoId: tiposContabilidad().ingreso, estadoId: estados().confirmado, ...whereBase },
        _sum: { monto: true },
    });

    const IngresosEgresos = await prisma.ingresosEgresos.findMany({
        where: { estadoId: estados().confirmado, ...whereBase },
        include: { tipo: true },
        orderBy: {updatedAt: 'desc'}
    });


    // MODULO CONTROL TALLER

    // TOTAL DE INGRESOS EN SERVICIOS

    const totalServicios = await prisma.servicio.aggregate({
        where: { estadoId: estados().entregado, ...whereBase },
        _sum: { total: true },
    });

    const totalDescuentosServicios = await prisma.servicio.aggregate({
        where: { estadoId: estados().entregado, ...whereBase },
        _sum: { descuentosServicio: true },
    });

    const totalReparaciones = await prisma.enReparacion.aggregate({
        where: { estadoId: estados().entregado, ...whereBase },
        _sum: { total: true },
    });

    const totalParqueos = await prisma.enParqueo.aggregate({
        where: { estadoId: estados().entregado, ...whereBase },
        _sum: { total: true },
    });


    // SERVICIOS DETALLE

    const Servicios = await prisma.servicio.findMany({
        where: { estadoId: estados().entregado, ...whereBase },
        include: { moto: true,mecanico: true, enReparaciones: {where: { estadoId: estados().entregado}}, enParqueos:{where: { estadoId: estados().entregado}}},
        orderBy: { updatedAt: 'desc' },
    });

    const Reparaciones = await prisma.enReparacion.findMany({
        where: { estadoId: estados().entregado, ...whereBase },
        include: { servicio: { include: { moto: true } } },
        orderBy: { id: 'desc' },
    });

    const Parqueos = await prisma.enParqueo.findMany({
        where: { estadoId: estados().entregado, ...whereBase },
        include: { servicio: { include: { moto: true } } },
        orderBy: { id: 'desc' },
    });

    // GASTOS TALLER

    const totalGastosTaller = await prisma.ingresosEgresos.aggregate({
        where: { tipoId: tiposContabilidad().egreso, estadoId: estados().confirmado, moduloTallerId: tiposModulos().taller, ...whereBase },
        _sum: { monto: true },
    });
    // INGRESOS
    const totalIngresosTaller = await prisma.ingresosEgresos.aggregate({
        where: { tipoId: tiposContabilidad().ingreso, moduloTallerId: tiposModulos().taller , estadoId: estados().confirmado, ...whereBase },
        _sum: { monto: true },
    });

    // DETALLE DE GASTOS TALLER



    // TOTAL CAJA TALLER

    const totalCajaTaller = (totalServicios._sum.total + totalReparaciones._sum.total + totalParqueos._sum.total + (totalIngresosTaller._sum.monto || 0) - (totalDescuentosServicios._sum.descuentosServicio || 0)) - (totalGastosTaller._sum.monto || 0);

    // MODULO CONTROL REPUESTOS

    // TOTAL DE INGRESOS EN VENTAS

    const totalVentas = await prisma.venta.aggregate({
        where: { estadoId: estados().confirmado, ...whereBase },
        _sum: { total: true },
    });
    
    // TOTAL GANANCIAS EN VENTAS
    const totalGananciasVentas = await prisma.ventaProducto.aggregate({
        where: { venta: { estadoId: estados().confirmado, ...whereBase } },
        _sum: { ganacia: true },
    });

    // DETALLE DE VENTAS

    const Ventas = await prisma.venta.findMany({
        where: { estadoId: estados().confirmado, ...whereBase },
        include: { servicio: true },
        orderBy: { updatedAt: 'desc'}
    });

    // GASTOS REPUESTOS
    const totalGastosRepuestos = await prisma.ingresosEgresos.aggregate({
        where: { tipoId: tiposContabilidad().egreso, estadoId: estados().confirmado,...whereBase, moduloTallerId: tiposModulos().repuestos },
        _sum: { monto: true },
    });

    // INGRESOS
    const totalIngresosRepuestos = await prisma.ingresosEgresos.aggregate({
        where: { tipoId: tiposContabilidad().ingreso, moduloTallerId: tiposModulos().repuestos , estadoId: estados().confirmado, ...whereBase },
        _sum: { monto: true },
    });

    // DETALLE DE GASTOS REPUESTOS


    // TOTAL CAJA REPUESTOS
    const totalCajaRepuestos = (totalVentas._sum.total || 0) - (totalGastosRepuestos._sum.monto || 0 ) + totalIngresosRepuestos._sum.monto || 0;

    const totalIngresosGenerales = (totalServicios._sum.total + totalReparaciones._sum.total + totalParqueos._sum.total - (totalDescuentosServicios._sum.descuentosServicio || 0)) + (totalVentas._sum.total || 0) + (totalIngresos._sum.monto || 0);
    return {

        // TALLER 
        totalServiciosTaller: (totalServicios._sum.total - (totalDescuentosServicios._sum.descuentosServicio || 0)) || 0,
        totalReparacionesTaller: totalReparaciones._sum.total || 0,
        totalParqueosTaller: totalParqueos._sum.total || 0,
        totalGastosTaller: totalGastosTaller._sum.monto || 0,
        totalIngresosTaller: totalIngresosTaller._sum.monto || 0,
        totalCajaTaller: totalCajaTaller,

        // TALLER DETALLE
        serviciosDetalle: Servicios,
        gastosTallerDetalle: IngresosEgresos.filter(ie => ie.moduloTallerId === tiposModulos().taller && ie.tipoId === tiposContabilidad().egreso),
        ingresosTallerDetalle: IngresosEgresos.filter(ie => ie.moduloTallerId === tiposModulos().taller && ie.tipoId === tiposContabilidad().ingreso),

        // REPUESTOS
        totalVentasRepuestos: totalVentas._sum.total || 0,
        totalGananciasVentas: totalGananciasVentas._sum.ganacia || 0,
        totalGastosRepuestos: totalGastosRepuestos._sum.monto || 0,
        totalIngresosRepuestos: totalIngresosRepuestos._sum.monto || 0,
        totalCajaRepuestos: totalCajaRepuestos,

        // REPUESTOS DETALLE
        ventasDetalle: Ventas,
        gastosRepuestosDetalle: IngresosEgresos.filter(ie => ie.moduloTallerId === tiposModulos().repuestos && ie.tipoId === tiposContabilidad().egreso),
        ingresosRepuestosDetalle: IngresosEgresos.filter(ie => ie.moduloTallerId === tiposModulos().repuestos && ie.tipoId === tiposContabilidad().ingreso),


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