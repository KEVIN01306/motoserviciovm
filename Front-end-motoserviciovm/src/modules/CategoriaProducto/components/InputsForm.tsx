import { Grid, TextField } from "@mui/material";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CategoriaProductoType } from "../../../types/categoriaProductoType";

interface InputsFormProps {
    register: UseFormRegister<CategoriaProductoType>;
    errors: FieldErrors<CategoriaProductoType>;
}

const InputsForm = ({ register, errors }: InputsFormProps) => {
    return (
        <>
            <Grid size={{ xs: 12 }}>
                <TextField
                    {...register("categoria")}
                    label="Categoría"
                    placeholder="Ej: Pastillas"
                    fullWidth
                    variant="standard"
                    error={!!errors.categoria}
                    helperText={errors.categoria?.message}
                />
            </Grid>
        </>
    );
};

export default InputsForm;
