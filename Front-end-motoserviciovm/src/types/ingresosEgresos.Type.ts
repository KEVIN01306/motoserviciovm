import z from "zod";
import { ingresosEgresosSchema } from "../zod/ingresosEgresos.schema";
import type { SucursalType } from "./sucursalType";
import type { EstadoType } from "./estadoType";
import type { TipoContabilidadType } from "../zod/tipoContabilidadShcema";
import { estados } from "../utils/estados";
import { useAuthStore } from "../store/useAuthStore";
import { tiposContabilidad } from "../utils/tiposContabilidad";

const sucursalId = useAuthStore.getState().user.sucursales[0].id;

export type IngresosEgresosType = z.infer<typeof ingresosEgresosSchema>;

export type IngresosEgresosGetType = IngresosEgresosType & {
    sucursal: SucursalType;
    estado: EstadoType;
    tipo: TipoContabilidadType;
    moduloTaller: moduloTallerType | null;
};

export type moduloTallerType = {
    id: number;
    modulo: string;

    createdAt?: string;
    updatedAt?: string;
}

export const IngresosEgresosInitialState = {
    descripcion: '',
    monto: 0,
    tipoId: tiposContabilidad().ingreso,
    sucursalId: sucursalId || 0,
    estadoId: estados().enEspera,
    moduloTallerId: null
};