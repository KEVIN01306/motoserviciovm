import { Grid, TextField } from "@mui/material";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CilindradaType } from "../../../types/cilindradaType";

interface InputsFormProps {
    register: UseFormRegister<CilindradaType>;
    errors: FieldErrors<CilindradaType>;
}

const InputsForm = ({ register, errors }: InputsFormProps) => {
    return (
        <>
            <Grid size={{ xs: 12 }}>
                <TextField
                    {...register("cilindrada", { valueAsNumber: true })}
                    type="number"
                    label="Cilindrada"
                    placeholder="Ej: 400"
                    fullWidth
                    variant="standard"
                    error={!!errors.cilindrada}
                    helperText={errors.cilindrada?.message}
                />
            </Grid>
        </>
    );
};

export default InputsForm;
