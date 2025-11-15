import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { Controller, type Control, type FieldErrors, type UseFormRegister, type UseFormSetValue, type UseFormWatch } from "react-hook-form"
import type { UserType } from "../../../types/userType";


interface InputsFormProps {
    register: UseFormRegister<UserType>;
    errors: FieldErrors<UserType>;
    control: Control<UserType>;
    watch: UseFormWatch<UserType>;
    setValue: UseFormSetValue<UserType>;
}
const InputsForm = ({register,errors, control}: InputsFormProps) => {

    return (
        <>
            <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                    label="Primer Nombre"
                    fullWidth
                    required
                    variant="standard"
                    size="small"
                    {...register("primerNombre")}
                    error={!!errors.primerNombre}
                    helperText={errors.primerNombre?.message}
                />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                    label="Segundo Nombre"
                    fullWidth
                    variant="standard"
                    size="small"
                    {...register("segundoNombre")}
                    error={!!errors.segundoNombre}
                    helperText={errors.segundoNombre?.message}
                />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                    label="Primer Apellido"
                    fullWidth
                    required
                    variant="standard"
                    size="small"
                    {...register("primerApellido")}
                    error={!!errors.primerApellido}
                    helperText={errors.primerApellido?.message}
                />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                    label="Segundo Apellido"
                    fullWidth
                    variant="standard"
                    size="small"
                    {...register("segundoApellido")}
                    error={!!errors.segundoApellido}
                    helperText={errors.segundoApellido?.message}
                />
            </Grid>
            <Grid size={{sm: 12, md: 12}}>
                <TextField
                    label="Email"
                    fullWidth
                    required
                    variant="filled"
                    size="small"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
            </Grid>
            <Grid size={{sm: 12, md: 6}}>
                <TextField
                    label="Password"
                    fullWidth
                    required
                    type="password"
                    variant="filled"
                    size="small"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
            </Grid>
            <Grid size={{sm: 12, md: 6}}>
                <TextField
                    label="Numero de Telefono"
                    fullWidth
                    variant="standard"
                    size="small"
                    {...register("numeroTel")}
                    error={!!errors.numeroTel}
                    helperText={errors.numeroTel?.message}
                />
            </Grid>
            <Grid size={{sm: 12, md: 6}}>
                <TextField
                    label="Numero de Telefono (Auxiliar)"
                    fullWidth
                    variant="standard"
                    size="small"
                    {...register("numeroAuxTel")}
                    error={!!errors.numeroAuxTel}
                    helperText={errors.numeroAuxTel?.message}
                />
            </Grid>
            <Grid size={{sm: 12, md: 6}}>
                <TextField
                    label="Dpi"
                    fullWidth
                    variant="standard"
                    size="small"
                    {...register("dpi")}
                    error={!!errors.dpi}
                    helperText={errors.dpi?.message}
                />
            </Grid>
            <Grid size={{sm: 12, md: 6}}>
                <TextField
                    label="Nit"
                    fullWidth
                    variant="standard"
                    size="small"
                    {...register("nit")}
                    error={!!errors.nit}
                    helperText={errors.nit?.message}
                />
            </Grid>
            {/*<Grid size={{sm: 12, md: 6}}>
                <FormControl fullWidth size="small" error={!!errors.rol}>
                    <InputLabel id="role-label">Rol</InputLabel>
                    <Controller
                        name="roles"
                        control={control}
                        render={({ field }) => (
                            <Select
                                labelId="role-label"
                                label="Rol"
                                variant="standard"
                                {...field}
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="user">User</MenuItem>
                            </Select>
                        )}
                    />
                </FormControl>
                {errors.rol && (
                    <p style={{ color: "#d32f2f", fontSize: "0.8rem", marginTop: "4px" }}>
                        {errors.rol.message}
                    </p>
                )}
            </Grid>*/}
            <Grid size={{sm: 12, md: 12}}>
                <TextField
                    label="Fecha de Nacimiento"
                    required
                    fullWidth
                    type="date"
                    variant="standard"
                    size="small"
                    focused={true}
                    {...register("fechaNac")}
                    error={!!errors.fechaNac}
                    helperText={errors.fechaNac?.message}
                />
            </Grid>
        </>
    )
}

export default InputsForm;