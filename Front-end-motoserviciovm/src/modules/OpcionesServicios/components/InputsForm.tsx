import React from "react";
import { Grid, TextField } from "@mui/material";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { OpcionServicioType } from "../../../types/opcionServicioType";

interface InputsFormProps {
    register: UseFormRegister<OpcionServicioType>;
    errors: FieldErrors<OpcionServicioType>;
}

const InputsForm = ({ register, errors }: InputsFormProps) => {
    return (
        <>
            <Grid size={{ xs: 12 }}>
                <TextField
                    {...register("opcion")}
                    label="Opción de Servicio"
                    placeholder="Ej: Lavado Completo"
                    fullWidth
                    variant="standard"
                    error={!!errors.opcion}
                    helperText={errors.opcion?.message}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    {...register("descripcion")}
                    label="Descripción"
                    placeholder="Descripción breve"
                    fullWidth
                    variant="standard"
                    multiline
                    minRows={3}
                    error={!!errors.descripcion}
                    helperText={errors.descripcion?.message}
                />
            </Grid>
        </>
    );
};

export default InputsForm;
