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
        <TextField variant="standard" fullWidth label="total" {...register("total", { valueAsNumber: true })} error={!!errors.total} helperText={errors.total?.message} />
      </Grid>

      <Grid size={12}>
        <TextField variant="standard" fullWidth label="observaciones" {...register("observaciones")} error={!!errors.observaciones} helperText={errors.observaciones?.message} />
      </Grid>
    </>
  );
};

export default InputsForm;
