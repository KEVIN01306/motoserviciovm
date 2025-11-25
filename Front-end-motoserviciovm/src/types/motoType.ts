import z from "zod";
import { motoSchema as _motoSchema } from "../zod/moto.schema";
import type { modeloGetType } from "./modeloType";
import type { UserGetType } from "./userType";

export type motoType = z.infer<typeof _motoSchema>;

export type motoGetType = Omit<motoType, "users"> & {
    modelo: modeloGetType;
    users: UserGetType[];
};

export const MotoInitialState = {
    placa: "",
    avatar: "",
    modeloId: 0,
    estadoId: 1,
    users: [] as number[],
};

/**
 * Normaliza los datos recibidos desde la API para que el formulario pueda usar `reset` sin fallas
 */

export const mergeMotoDataWithDefaults = (apiData: Partial<motoGetType>): Partial<motoType> => {
    return {
        placa: apiData.placa ?? MotoInitialState.placa,
        avatar: apiData.avatar ?? MotoInitialState.avatar,
        modeloId: apiData.modeloId ?? MotoInitialState.modeloId,
        estadoId: apiData.estadoId ?? MotoInitialState.estadoId,
        users: (apiData.users || [])
            .map((user: UserGetType) => (user.id !== undefined ? Number(user.id) : undefined))
            .filter((id): id is number => typeof id === "number" && !Number.isNaN(id)),
    };
};