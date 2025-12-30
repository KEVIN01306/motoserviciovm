import type { IngresosEgresosGetType } from "./ingresosEgresos.Type";
import type { ServicioGetType } from "./servicioType";
import type { VentaGetType } from "./ventaType";

export type contabilidadTotalesType = {
        // TALLER 
        totalServiciosTaller: number,
        totalGastosTaller: number,
        totalCajaTaller: number,

        // TALLER DETALLE
        serviciosDetalle: ServicioGetType[],
        gastosTallerDetalle: IngresosEgresosGetType[],

        // REPUESTOS
        totalVentasRepuestos: number,
        totalGananciasVentas: number,
        totalGastosRepuestos: number,
        totalCajaRepuestos: number,

        // REPUESTOS DETALLE
        ventasDetalle: VentaGetType[],
        gastosRepuestosDetalle: IngresosEgresosGetType[],
        // GENERALES
        totalIngresos: number,
        totalGastos: number,
        totalCajaGeneral: number,

        ingresosEgresosDetalle: IngresosEgresosGetType[],

}

