import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";
import { tiposContabilidad } from "../utils/tiposContabilidad.js";


const getTotalesContabilidad = async (sucursalIds,fechaInicio,fechaFin) => {
    const totalVentas = await prisma.venta.aggregate({
        where: { estadoId: estados().confirmado, sucursalId: { in: sucursalIds }, updatedAt: { gte: fechaInicio, lte: fechaFin } },
        _sum: { total: true },
    });

    const totalGananciasVentas = await prisma.ventaProducto.aggregate({
        where: { venta: { estadoId: estados().confirmado, sucursalId: { in: sucursalIds }, updatedAt: { gte: fechaInicio, lte: fechaFin } } },
        _sum: { ganacia: true },
    });

    const totalServicios = await prisma.servicio.aggregate({
        where: { estadoId: estados().confirmado, sucursalId: { in: sucursalIds }, updatedAt: { gte: fechaInicio, lte: fechaFin } },
        _sum: { total: true },
    });

    const Ventas = await prisma.venta.findMany({
        where: { estadoId: estados().confirmado, sucursalId: { in: sucursalIds }, updatedAt: { gte: fechaInicio, lte: fechaFin } },
    });

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

    const Servicios = await prisma.servicio.findMany({
        where: { estadoId: estados().confirmado, sucursalId: { in: sucursalIds }, updatedAt: { gte: fechaInicio, lte: fechaFin } },
        include: { moto: true },
    });

    return {
        servicios: Servicios,
        servicioCount: Servicios.length,
        ventas: Ventas,
        ventaCount: Ventas.length,
        ingresosEgresos: IngresosEgresos,
        ingresosEgresosCount: IngresosEgresos.length,
        totalServicios: totalServicios._sum.total || 0,
        totalVentas: totalVentas._sum.total || 0,
        totalGastos: totalGastos._sum.monto || 0,
        totalIngresos: totalIngresos._sum.monto || 0,
        totalGananciasVentas: totalGananciasVentas._sum.ganacia || 0,
        totalIngresosGenerales: (totalServicios._sum.total || 0) + (totalGananciasVentas._sum.ganacia || 0) + (totalIngresos._sum.monto || 0),
    };
}

export {
    getTotalesContabilidad,
}