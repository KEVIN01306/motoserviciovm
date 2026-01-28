import { Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getMotos } from "../../../services/moto.services";
import type { motoGetType } from "../../../types/motoType";

type Props = {
  control: any;
  register: any;
  errors: any;
  setValue?: any;
  watch?: any;
};

const InputsForm = ({ register, errors }: Props) => {
  const [, setMotos] = useState<motoGetType[]>([]);

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
