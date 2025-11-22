import z from "zod";
import { lineaSchema } from "../zod/linea.schema";
import { estados } from "../utils/estados";

export type LineaType = z.infer<typeof lineaSchema>

export const LineaInitialState: Pick<LineaType, "linea" | "estadoId"> = {
    linea: "",
    estadoId: estados().activo,
};

/**
 * Normaliza los datos recibidos desde la API para que el formulario pueda usar `reset` sin fallas
 */
export const mergeLineaDataWithDefaults = (apiData: Partial<LineaType>): Partial<LineaType> => {
    return {
        linea: apiData.linea ?? LineaInitialState.linea,
        estadoId: apiData.estadoId ?? LineaInitialState.estadoId,
    };
}