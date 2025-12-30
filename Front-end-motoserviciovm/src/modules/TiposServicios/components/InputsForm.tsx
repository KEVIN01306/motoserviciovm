import { Autocomplete, Checkbox, FormControlLabel, FormLabel, Grid, TextField } from "@mui/material";
import { Controller, type Control, type FieldErrors, type UseFormRegister, type UseFormSetValue, type UseFormWatch } from "react-hook-form";
import type { TipoServicioType } from "../../../types/tipoServicioType";
import type { OpcionServicioType } from "../../../types/opcionServicioType";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface InputsFormProps {
    register: UseFormRegister<TipoServicioType>;
    errors: FieldErrors<TipoServicioType>;
    control: Control<TipoServicioType, any>;
    watch: UseFormWatch<TipoServicioType>;
    setValue: UseFormSetValue<TipoServicioType>;
    opciones: OpcionServicioType[];
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const InputsForm = ({ register, errors, control, watch, setValue, opciones }: InputsFormProps) => {

    return (
        <>
            <Grid size={{ xs: 12 }}>
                <TextField
                    label="Tipo de Servicio"
                    fullWidth
                    variant="standard"
                    {...register("tipo")}
                    error={!!errors.tipo}
                    helperText={errors.tipo?.message}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    label="Descripción"
                    fullWidth
                    variant="standard"
                    multiline
                    minRows={3}
                    {...register("descripcion")}
                    error={!!errors.descripcion}
                    helperText={errors.descripcion?.message}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Controller
                    name="opcionServicios"
                    control={control}
                    render={({ field }) => {
                        const selectedObjects = (field.value as number[] || []).map(id =>
                            opciones.find(o => String(o.id) === String(id))
                        ).filter((o): o is OpcionServicioType => !!o);

                        return (
                            <Autocomplete
                                multiple
                                id="checkboxes-opciones-tags"
                                options={opciones}
                                disableCloseOnSelect
                                getOptionLabel={(opt) => opt.opcion}
                                value={selectedObjects}
                                onChange={(event, newValue: OpcionServicioType[]) => {
                                    const ids = newValue.map(v => v.id);
                                    field.onChange(ids);
                                }}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option.opcion}
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label="Opciones de Servicio"
                                        placeholder="Seleccionar opciones"
                                        error={!!errors.opcionServicios}
                                    />
                                )}
                            />
                        );
                    }}
                />
            </Grid>

            <Grid>
                <Controller name="servicioCompleto" control={control} render={({field}) => (
                    <FormControlLabel 
                       label="¿Es un servicio completo?"
                        control={
                            <Checkbox  {...field} checked={field.value} onChange={(e: any) => field.onChange(e.target.checked)} />
                        }
                    />
                )}>

                </Controller>
            </Grid>

            <Grid size={{ xs: 12 }}>
                {/* Ordered list of selected options */}
                <div>
                    <ol className="pl-6">
                        { (watch("opcionServicios") || []).map((id: number, idx: number) => {
                            const opt = opciones.find(o => String(o.id) === String(id));
                            return <li key={String(id) ?? idx} className="text-sm">{opt ? opt.opcion : `Opción ${id}`}</li>;
                        }) }
                    </ol>
                </div>
            </Grid>
        </>
    );
}

export default InputsForm;
