import type { IngresosEgresosGetType } from "./ingresosEgresos.Type";
import type { ServicioGetType } from "./servicioType";
import type { VentaGetType } from "./ventaType";

export type contabilidadTotalesType = {
  // Arrays de objetos (usando los tipos que ya tienes)
  servicios: ServicioGetType[];
  ventas: VentaGetType[];
  ingresosEgresos: IngresosEgresosGetType[];

  // Contadores
  servicioCount: number;
  ventaCount: number;
  ingresosEgresosCount: number;

  // Totales financieros
  totalServicios: number;
  totalVentas: number;
  totalGastos: number;
  totalIngresos: number;
  totalGananciasVentas: number;
  totalIngresosGenerales: number;
}

