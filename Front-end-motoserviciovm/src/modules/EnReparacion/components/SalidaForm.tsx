import { Grid, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import type { EnReparacionGetType } from "../../../types/enReparacionType";

type Props = {
  control: any;
  register?: any;
  errors?: any;
  readOnlyValues?: Partial<EnReparacionGetType>;
};

const SalidaForm = ({ control, register, errors, readOnlyValues }: Props) => {
  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{readOnlyValues?.servicio?.moto?.placa}</Typography>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField variant="standard" fullWidth label="Descripción" value={readOnlyValues?.descripcion ?? ""} InputProps={{ readOnly: true }} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          {...(register ? register("total", { valueAsNumber: true }) : {})}
          label="Total"
          placeholder="Ej: 300.00"
          fullWidth
          variant="standard"
          type="number"
          error={!!errors?.total}
          helperText={errors?.total?.message}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Controller
          control={control}
          name="observaciones"
          render={({ field }) => (
            <TextField variant="standard" {...field} fullWidth label="Observaciones" multiline rows={3} error={!!errors?.observaciones} helperText={errors?.observaciones?.message} />
          )}
        />
      </Grid>
    </>
  );
};

export default SalidaForm;
