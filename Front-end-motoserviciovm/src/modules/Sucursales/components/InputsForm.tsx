import { TextField, Grid } from "@mui/material";
import type { UseFormRegister, FormState } from "react-hook-form";
import type { SucursalType } from "../../../types/sucursalType";

type Props = {
    register: UseFormRegister<SucursalType>
    errors: FormState<SucursalType>['errors']
    control?: any
}

const InputsForm = ({ register, errors }: Props) => {
    return (
        <>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    {...register("nombre")}
                    label="Nombre"
                    placeholder="Ej: Sucursal Centro"
                    fullWidth
                    variant="standard"
                    error={!!errors.nombre}
                    helperText={errors.nombre?.message as string}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    {...register("telefono")}
                    label="Teléfono"
                    placeholder="Ej: +502 7123 4567"
                    fullWidth
                    variant="standard"
                    error={!!errors.telefono}
                    helperText={errors.telefono?.message as string}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    {...register("email")}
                    label="Email"
                    placeholder="Ej: sucursal@motoservicio.com"
                    fullWidth
                    variant="standard"
                    error={!!errors.email}
                    helperText={errors.email?.message as string}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 12 }}>
                <TextField
                    {...register("direccion")}
                    label="Dirección"
                    placeholder="Ej: Calle Principal, Zona 1"
                    fullWidth
                    variant="standard"
                    error={!!errors.direccion}
                    helperText={errors.direccion?.message as string}
                    multiline
                    rows={4}
                />
            </Grid>
        </>
    )
}

export default InputsForm
