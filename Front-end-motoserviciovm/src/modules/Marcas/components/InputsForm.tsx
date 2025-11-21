import { Grid, TextField } from "@mui/material";
import type { UseFormRegister, FormState } from "react-hook-form";
import type { MarcaType } from "../../../types/marcaType";

type Props = {
    register: UseFormRegister<MarcaType>;
    errors: FormState<MarcaType>["errors"];
};

const InputsForm = ({ register, errors }: Props) => {
    return (
        <>
            <Grid size={{ xs: 12 }}>
                <TextField
                    {...register("marca")}
                    label="Marca"
                    placeholder="Ej: Haojue"
                    fullWidth
                    variant="standard"
                    error={!!errors.marca}
                    helperText={errors.marca?.message as string}
                />
            </Grid>
        </>
    );
};

export default InputsForm;

