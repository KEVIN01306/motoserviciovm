import z from "zod";
import { lineaSchema } from "../zod/linea.schema";
import { estados } from "../utils/estados";

type EstadoType = {
    id: number;
    estado: string;
    createdAt?: string;
    updatedAt?: string;
};

export type LineaType = z.infer<typeof lineaSchema> & {
    createdAt?: string;
    updatedAt?: string;
    estado?: EstadoType;
};

export const LineaInitialState: Pick<LineaType, "linea" | "estadoId"> = {
    linea: "",
    estadoId: estados().activo,
};

