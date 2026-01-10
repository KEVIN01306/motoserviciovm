import { Autocomplete, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { Controller, type Control, type FieldErrors, type UseFormRegister, type UseFormSetValue, type UseFormWatch } from "react-hook-form"
import type { UserType } from "../../../types/userType";
import { useEffect, useState } from "react";
import type { RolGetType, RolType } from "../../../types/rolType";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import type { SucursalType } from "../../../types/sucursalType";
import type { motoGetType } from "../../../types/motoType";


interface InputsFormProps {
    register: UseFormRegister<UserType>;
    errors: FieldErrors<UserType>;
    control: Control<UserType, any>;
    watch: UseFormWatch<UserType>;
    setValue: UseFormSetValue<UserType>;
    roles: RolGetType[];
    sucursales: SucursalType[];
    motos: motoGetType[];
    tipoUser?: boolean
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const InputsForm = ({ register, errors, control, watch, setValue, roles, tipoUser = true, sucursales, motos }: InputsFormProps) => {

    const [TipoUser, setTipoUser] = useState(tipoUser);

    const tipo = watch("tipo");
    useEffect(() => {
        if (TipoUser) {
            setValue("tipo", "");
        }
    }, [TipoUser, setValue]);

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
                                        <MenuItem value="Usuario Regular">Usuario Regular</MenuItem>
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
                            required={tipo === "Usuario Regular" || TipoUser}
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
                        required={tipo === "Empresa"}
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
                    required={tipo === "" || TipoUser}
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
                            required={tipo === "" || TipoUser}
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

                                onChange={(_event, newValue: RolGetType[]) => {
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

            <Grid size={{ xs: 12, md: 12 }}>
                <Controller
                    name="sucursales"
                    control={control}
                    render={({ field }) => {

                        const selectedSucursalObjects = (field.value as number[] || []).map(id =>
                            sucursales.find((sucursal: SucursalType) => String(sucursal.id) === String(id))
                        ).filter((sucursal): sucursal is SucursalType => !!sucursal);

                        return (
                            <Autocomplete
                                multiple
                                id="checkboxes-sucursales-tags"
                                options={sucursales}
                                disableCloseOnSelect

                                getOptionLabel={(sucursal) => sucursal.nombre}

                                value={selectedSucursalObjects}

                                onChange={(_event, newValue: SucursalType[]) => {
                                    const sucursalIds = newValue.map(sucursal => sucursal.id);

                                    field.onChange(sucursalIds);
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
                                            {option.nombre}
                                        </li>
                                    );
                                }}

                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label="Sucursales del Usuario"
                                        placeholder="Seleccionar sucursales"
                                        error={!!errors.sucursales}
                                    />
                                )}
                            />
                        );
                    }}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
                <Controller
                    name="motos"
                    control={control}
                    render={({ field }) => {

                        const selectedmotoObjects = (field.value as number[] || []).map(id =>
                            motos.find((moto: motoGetType) => String(moto.id) === String(id))
                        ).filter((moto): moto is motoGetType => !!moto);

                        return (
                            <Autocomplete
                                multiple
                                id="checkboxes-motos-tags"
                                options={motos}
                                disableCloseOnSelect

                                getOptionLabel={(moto) => moto.placa}

                                value={selectedmotoObjects}

                                onChange={(_event, newValue: motoGetType[]) => {
                                    const motoIds = newValue.map(moto => moto.id);

                                    field.onChange(motoIds);
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
                                            {option.placa}
                                        </li>
                                    );
                                }}

                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label="Motos del Usuario"
                                        placeholder="Seleccionar motos"
                                        error={!!errors.motos}
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