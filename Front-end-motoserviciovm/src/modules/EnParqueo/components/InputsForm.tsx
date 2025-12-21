import { Grid, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { getMotos } from "../../../services/moto.services";
import type { motoGetType } from "../../../types/motoType";

type Props = {
  control: any;
  register: any;
  errors: any;
  setValue?: any;
  watch?: any;
};

const InputsForm = ({ control, register, errors, setValue }: Props) => {
  const [motos, setMotos] = useState<motoGetType[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMotos();
        setMotos(data);
      } catch (err) {
        setMotos([]);
      }
    };
    load();
  }, []);

  return (
    <>
      <Grid size={12}>
        <TextField variant="standard" fullWidth label="Descripción" {...register("descripcion")} error={!!errors.descripcion} helperText={errors.descripcion?.message} />
      </Grid>

      <Grid size={12}>
        <Controller
          control={control}
          name="fechaEntrada"
          render={({ field }) => (
            <TextField
              variant="standard"
              {...field}
              fullWidth
              type="date"
              label="Fecha Entrada"
              InputLabelProps={{ shrink: true }}
              error={!!errors.fechaEntrada}
              helperText={errors.fechaEntrada?.message}
            />
          )}
        />
      </Grid>

      <Grid size={12}>
        <Controller
          control={control}
          name="motoId"
          render={({ field }) => (
            <Autocomplete
              options={motos}
              getOptionLabel={(o) => o.placa || String(o.id)}
              onChange={(_, v) => field.onChange(v?.id ?? null)}
              isOptionEqualToValue={(a, b) => a.id === b.id}
                renderInput={(params) => (
                <TextField variant="standard" {...params} label="Moto (placa)" error={!!errors.motoId} helperText={errors.motoId?.message} />
              )}
            />
          )}
        />
      </Grid>
    </>
  );
};

export default InputsForm;