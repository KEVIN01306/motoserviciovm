import { Grid, TextField, Box, FormControlLabel, Checkbox } from "@mui/material";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { InventarioType } from "../../../types/inventarioType";

interface InputsFormProps {
    register: UseFormRegister<InventarioType>;
    errors: FieldErrors<InventarioType>;
}

const InputsForm = ({ register, errors }: InputsFormProps) => {
    return (
        <>
            <Grid size={{ xs: 12 }}>
                <TextField
                    {...register("item")}
                    label="Item"
                    placeholder="Ej: Luces Traseras"
                    fullWidth
                    variant="standard"
                    error={!!errors.item}
                    helperText={errors.item?.message}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    {...register("descripcion")}
                    label="Descripción"
                    placeholder="Descripción del ítem"
                    fullWidth
                    variant="standard"
                    multiline
                    minRows={2}
                    error={!!errors.descripcion}
                    helperText={errors.descripcion?.message}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Box sx={{ mt: 1 }}>
                    <FormControlLabel
                        control={<Checkbox {...register("activo")} />}
                        label="Activo"
                    />
                </Box>
            </Grid>
        </>
    );
};

export default InputsForm;
