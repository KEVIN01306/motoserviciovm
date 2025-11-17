import { Autocomplete, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { Controller, type Control, type FieldErrors, type UseFormRegister, type UseFormSetValue, type UseFormWatch } from "react-hook-form"
import type { UserType } from "../../../types/userType";
import { useEffect, useState } from "react";
import type { RolGetType, RolType } from "../../../types/rolType";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


interface InputsFormProps {
    register: UseFormRegister<UserType>;
    errors: FieldErrors<UserType>;
    control: Control<UserType , any>;
    watch: UseFormWatch<UserType>;
    setValue: UseFormSetValue<UserType>;
    roles: RolGetType[];
    tipoUser?: boolean
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const InputsForm = ({ register, errors, control, watch, setValue, roles, tipoUser = true }: InputsFormProps) => {
    
    const [TipoUser, setTipoUser] = useState(tipoUser);

    const tipo = watch("tipo");
    const rolesList = watch("roles");

    useEffect(() => {
        if (TipoUser) {
            setValue("tipo", "");
        }
    }, [TipoUser, setValue]);

    useEffect(() => {
        console.log(rolesList)
    }, [rolesList])

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
            <Grid size={{ xs: 12, md: 6 }}>
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
            <Grid size={{ xs: 12, md: 6 }}>
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
            <Grid size={{ xs: 12, md: 12 }}>

                <FormControlLabel
                    control={
                        <Checkbox checked={TipoUser} onChange={(e) => setTipoUser(e.target.checked)} name="tipoUser" />
                    }
                    label="Usuario Empleado (MOTOSERVICIOVM)"
                />

            </Grid>
            {
                !TipoUser && (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth size="small" error={!!errors.tipo}>
                            <InputLabel id="tipo-label">Tipo de Usuario</InputLabel>
                            <Controller
                                name="tipo"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        labelId="tipo-label"
                                        label="Tipo de Usuario"
                                        variant="standard"
                                        {...field}
                                    >
                                        <MenuItem value="Usuario Regular">Empleado Regular</MenuItem>
                                        <MenuItem value="Empresa">Empresa</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>
                        {errors.tipo && (
                            <p style={{ color: "#d32f2f", fontSize: "0.8rem", marginTop: "4px" }}>
                                {errors.tipo.message}
                            </p>
                        )}
                    </Grid>
                )
            }
            {
                tipo === "Usuario Regular" || TipoUser ? (
                    <Grid size={{ xs: 12, md: 6 }}>
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
                ) : (<Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        label="Nit"
                        fullWidth
                        variant="standard"
                        size="small"
                        {...register("nit")}
                        error={!!errors.nit}
                        helperText={errors.nit?.message}
                    />
                </Grid>)
            }
            <Grid size={{ xs: 12, md: 12 }}>
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
            {
                TipoUser && (
                    <Grid size={{ xs: 12, md: 6 }}>
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
                )
            }
            <Grid size={{ xs: 12, md: 12 }}>
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

            <Grid size={{ xs: 12, md: 12 }}>
                <Controller
            name="roles"
            control={control}
            render={({ field }) => {
                
                const selectedRoleObjects = (field.value as number[] || []).map(id => 
                    roles.find((rol: RolGetType) => String(rol.id) === String(id))
                ).filter((role): role is RolGetType => !!role);

                return (
                    <Autocomplete
                        multiple
                        id="checkboxes-roles-tags"
                        options={roles}
                        disableCloseOnSelect

                        getOptionLabel={(role) => role.rol}
                    
                        value={selectedRoleObjects} 
                        
                        onChange={(event, newValue: RolGetType[]) => {
                            const roleIds = newValue.map(role => role.id);
                            
                            field.onChange(roleIds); 
                        }}

                        renderOption={(props, option, { selected }) => {
                            return (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option.rol}
                                </li>
                            );
                        }}

                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="Roles del Usuario"
                                placeholder="Seleccionar roles"
                                error={!!errors.roles} 
                            />
                        )}
                    />
                );
            }}
        />
            </Grid>

        </>
    )
}

export default InputsForm;