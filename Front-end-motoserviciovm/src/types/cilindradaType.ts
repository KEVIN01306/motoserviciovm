import z from "zod";
import { cilindradaSchema } from "../zod/cilindrada.schema";
import { estados } from "../utils/estados";

export type CilindradaType = z.infer<typeof cilindradaSchema>;

export const CilindradaInitialState = {
	cilindrada: 0,
	estadoId: estados().activo,
};

/**
 * Normaliza los datos recibidos desde la API para que el formulario pueda usar `reset` sin fallas
 */
export const mergeCilindradaDataWithDefaults = (apiData: Partial<CilindradaType>): Partial<CilindradaType> => {
	return {
		cilindrada: apiData.cilindrada ?? CilindradaInitialState.cilindrada,
		estadoId: apiData.estadoId ?? CilindradaInitialState.estadoId,
	};
};