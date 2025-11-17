import { Grid, TextField } from "@mui/material"
import { type Control, type FieldErrors, type UseFormRegister } from "react-hook-form"
import type { RolType } from "../../../types/rolType";

interface InputsFormProps {
    register: UseFormRegister<RolType>;
    errors: FieldErrors<RolType>;
    control?: Control<RolType, any>;
}

const InputsForm = ({ register, errors }: InputsFormProps) => {
    return (
        <>
            <Grid size={{ xs: 12, md: 12 }}>
                <TextField
                    label="Nombre del Rol"
                    fullWidth
                    required
                    variant="standard"
                    size="small"
                    {...register("rol")}
                    error={!!errors.rol}
                    helperText={errors.rol?.message}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
                <TextField
                    label="Descripción"
                    fullWidth
                    multiline
                    rows={4}
                    variant="standard"
                    size="small"
                    {...register("descripcion")}
                    error={!!errors.descripcion}
                    helperText={errors.descripcion?.message}
                />
            </Grid>
        </>
    )
}

export default InputsForm;