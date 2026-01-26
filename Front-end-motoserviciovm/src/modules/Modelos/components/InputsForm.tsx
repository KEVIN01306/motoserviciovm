import { Grid, TextField, Autocomplete } from "@mui/material";
import { Controller, type Control } from "react-hook-form";
import { useEffect, useState } from "react";
import type { modeloType } from "../../../types/modeloType";
import type { MarcaType } from "../../../types/marcaType";
import type { LineaType } from "../../../types/lineaType";
import type { CilindradaType } from "../../../types/cilindradaType";
import { getMarcas } from "../../../services/marca.services";
import { getLineas } from "../../../services/linea.services";
import { getCilindradas } from "../../../services/cilindrada.services";

type Props = {
    control: Control<modeloType, any>;
    register: any;
    errors: any;
};

const InputsForm = ({ control, register, errors }: Props) => {
    const [marcas, setMarcas] = useState<MarcaType[]>([]);
    const [lineas, setLineas] = useState<LineaType[]>([]);
    const [cilindradas, setCilindradas] = useState<CilindradaType[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [m, l, c] = await Promise.all([getMarcas(), getLineas(), getCilindradas()]);
                setMarcas(m);
                setLineas(l);
                setCilindradas(c);
            } catch (err) {
                // ignore here; page-level will show errors when fetching individual resources if needed
                console.error(err);
            }
        };

        load();
    }, []);

    return (
        <>
            <Grid size={{ xs: 12 }}>
                <TextField
                    {...register("año", { valueAsNumber: true })}
                    label="Año"
                    placeholder="Ej: 2025"
                    fullWidth
                    variant="standard"
                    type="number"
                    error={!!errors.año}
                    helperText={errors.año?.message as string}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Controller
                    name="marcaId"
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            options={marcas}
                            getOptionLabel={(opt) => opt?.marca ?? ''}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            value={marcas.find((m:any) => m.id === field.value) ?? null}
                            onChange={(_, newVal) => field.onChange(newVal ? newVal.id : 0)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Marca"
                                    variant="standard"
                                    error={!!errors.marcaId}
                                    helperText={errors.marcaId?.message as string}
                                />
                            )}
                        />
                    )}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Controller
                    name="lineaId"
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            options={lineas}
                            getOptionLabel={(opt) => opt?.linea ?? ''}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            value={lineas.find((l:any) => l.id === field.value) ?? null}
                            onChange={(_, newVal) => field.onChange(newVal ? newVal.id : 0)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Línea"
                                    variant="standard"
                                    error={!!errors.lineaId}
                                    helperText={errors.lineaId?.message as string}
                                />
                            )}
                        />
                    )}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Controller
                    name="cilindradaId"
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            options={cilindradas}
                            getOptionLabel={(opt: any) => opt?.cilindrada ?? ''}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            value={cilindradas.find((c:any) => c.id === field.value) ?? null}
                            onChange={(_, newVal) => field.onChange(newVal ? newVal.id : 0)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Cilindrada"
                                    variant="standard"
                                    error={!!errors.cilindradaId}
                                    helperText={errors.cilindradaId?.message as string}
                                />
                            )}
                        />
                    )}
                />
            </Grid>
        </>
    );
};

export default InputsForm;
