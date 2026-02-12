import type { IngresosEgresosGetType } from "./ingresosEgresos.Type";
import type { ServicioGetType } from "./servicioType";
import type { VentaGetType } from "./ventaType";

export type contabilidadTotalesType = {
        // TALLER 
        totalServiciosTaller: number,
        totalGastosTaller: number,
        totalIngresosTaller: number
        totalCajaTaller: number,
        totalReparacionesTaller: number,
        totalParqueosTaller: number,

        // TALLER DETALLE
        serviciosDetalle: ServicioGetType[],
        gastosTallerDetalle: IngresosEgresosGetType[],
        ingresosTallerDetalle: IngresosEgresosGetType[],

        // REPUESTOS
        totalVentasRepuestos: number,
        totalGananciasVentas: number,
        totalGastosRepuestos: number,
        totalIngresosRepuestos: number,
        totalCajaRepuestos: number,

        // REPUESTOS DETALLE
        ventasDetalle: VentaGetType[],
        gastosRepuestosDetalle: IngresosEgresosGetType[],
        ingresosRepuestosDetalle: IngresosEgresosGetType[],
        
        // GENERALES
        totalIngresos: number,
        totalGastos: number,
        totalCajaGeneral: number,

        ingresosEgresosDetalle: IngresosEgresosGetType[],

}

