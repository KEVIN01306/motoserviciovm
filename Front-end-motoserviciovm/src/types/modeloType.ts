import z from "zod";
import type { modeloSchema } from "../zod/modelo.schema";
import { estados } from "../utils/estados";
import type { LineaType } from "./lineaType";
import type { MarcaType } from "./marcaType";
import type { CilindradaType } from "./cilindradaType";
import type { EstadoType } from "./estadoType";


export type modeloType = z.infer<typeof modeloSchema> ;

export type modeloGetType = z.infer<typeof modeloSchema> & {
    modelo: string;
    linea: LineaType;
    marca: MarcaType;
    cilindrada: CilindradaType;
    estado: EstadoType
};

export const modeloInitialState: modeloType = {
    año:          new Date().getFullYear(),
    marcaId:      0,
    lineaId:      0,
    cilindradaId: 0,
    estadoId:     estados().activo,
};

/** Normaliza los datos recibidos desde la API para que el formulario pueda usar `reset` sin fallas
 */
export const mergeModeloDataWithDefaults = (apiData: Partial<modeloType>): Partial<modeloType> => { 
    return {
        año:          apiData.año ?? modeloInitialState.año,
        marcaId:      apiData.marcaId ?? modeloInitialState.marcaId,
        lineaId:      apiData.lineaId ?? modeloInitialState.lineaId,
        cilindradaId: apiData.cilindradaId ?? modeloInitialState.cilindradaId,
        estadoId:     apiData.estadoId ?? modeloInitialState.estadoId,
    };
}
