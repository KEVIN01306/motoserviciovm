import z from "zod";
import { marcaSchema } from "../zod/marca.schema";
import { estados } from "../utils/estados";

export type MarcaType = z.infer<typeof marcaSchema>
export const MarcaInitialState: Pick<MarcaType, "marca" | "estadoId"> = {
    marca: "",
    estadoId: estados().activo,
};

/**
 * Normaliza los datos recibidos desde la API para que el formulario pueda usar `reset` sin fallas
 */
export const mergeMarcaDataWithDefaults = (apiData: Partial<MarcaType>): Partial<MarcaType> => {
    return {
        marca: apiData.marca ?? MarcaInitialState.marca,
        estadoId: apiData.estadoId ?? MarcaInitialState.estadoId,
    };
}
