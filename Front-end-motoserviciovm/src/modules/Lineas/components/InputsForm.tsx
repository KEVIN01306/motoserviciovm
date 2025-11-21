import { Grid, TextField } from "@mui/material";
import type { UseFormRegister, FormState } from "react-hook-form";
import type { LineaType } from "../../../types/lineaType";

type Props = {
    register: UseFormRegister<LineaType>;
    errors: FormState<LineaType>["errors"];
};

const InputsForm = ({ register, errors }: Props) => {
    return (
        <>
            <Grid size={{ xs: 12 }}>
                <TextField
                    {...register("linea")}
                    label="Línea"
                    placeholder="Ej: DL150"
                    fullWidth
                    variant="standard"
                    error={!!errors.linea}
                    helperText={errors.linea?.message as string}
                />
            </Grid>
        </>
    );
};

export default InputsForm;

