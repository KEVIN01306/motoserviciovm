import z from "zod";
import { marcaSchema } from "../zod/marca.schema";
import { estados } from "../utils/estados";

type EstadoType = {
    id: number;
    estado: string;
    createdAt?: string;
    updatedAt?: string;
};

export type MarcaType = z.infer<typeof marcaSchema> & {
    createdAt?: string;
    updatedAt?: string;
    estado?: EstadoType;
};

export const MarcaInitialState: Pick<MarcaType, "marca" | "estadoId"> = {
    marca: "",
    estadoId: estados().activo,
};

