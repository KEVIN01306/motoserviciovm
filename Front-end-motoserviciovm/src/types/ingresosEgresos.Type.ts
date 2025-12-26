import z from "zod";
import { ingresosEgresosSchema } from "../zod/ingresosEgresos.schema";
import type { SucursalGetType } from "./servicioType";
import type { EstadoType } from "./estadoType";
import type { TipoContabilidadType } from "../zod/tipoContabilidadShcema";
import { estados } from "../utils/estados";

export type IngresosEgresosType = z.infer<typeof ingresosEgresosSchema>;

export type IngresosEgresosGetType = IngresosEgresosType & {
    sucursal: SucursalGetType;
    estado: EstadoType;
    tipo: TipoContabilidadType;
};

export const IngresosEgresosInitialState = {
    descripcion: '',
    monto: 0,
    tipoId: 0,
    sucursalId: 0,
    estadoId: estados().enEspera,
};