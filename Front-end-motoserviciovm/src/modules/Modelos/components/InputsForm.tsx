import { Grid, TextField, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
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
                <FormControl fullWidth variant="standard" error={!!errors.marcaId}>
                    <InputLabel id="marca-label">Marca</InputLabel>
                    <Controller
                        name="marcaId"
                        control={control}
                        render={({ field }) => (
                            <Select labelId="marca-label" label="Marca" {...field}>
                                <MenuItem value={0}>Seleccione una marca</MenuItem>
                                {marcas.map((m) => (
                                    <MenuItem key={m.id} value={m.id}>
                                        {m.marca}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <FormControl fullWidth variant="standard" error={!!errors.lineaId}>
                    <InputLabel id="linea-label">Línea</InputLabel>
                    <Controller
                        name="lineaId"
                        control={control}
                        render={({ field }) => (
                            <Select labelId="linea-label" label="Línea" {...field}>
                                <MenuItem value={0}>Seleccione una línea</MenuItem>
                                {lineas.map((l) => (
                                    <MenuItem key={l.id} value={l.id}>
                                        {l.linea}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <FormControl fullWidth variant="standard" error={!!errors.cilindradaId}>
                    <InputLabel id="cilindrada-label">Cilindrada</InputLabel>
                    <Controller
                        name="cilindradaId"
                        control={control}
                        render={({ field }) => (
                            <Select labelId="cilindrada-label" label="Cilindrada" {...field}>
                                <MenuItem value={0}>Seleccione una cilindrada</MenuItem>
                                {cilindradas.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>
                                        {c.cilindrada}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                </FormControl>
            </Grid>
        </>
    );
};

export default InputsForm;
