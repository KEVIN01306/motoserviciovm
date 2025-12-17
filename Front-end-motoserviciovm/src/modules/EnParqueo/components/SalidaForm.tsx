import { Grid, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import type { EnParqueoGetType } from "../../../types/enParqueoType";

type Props = {
  control: any;
  register?: any;
  errors?: any;
  readOnlyValues?: Partial<EnParqueoGetType>;
};

const SalidaForm = ({ control, register, errors, readOnlyValues }: Props) => {
  return (
    <>
      <Grid size={{ xs: 12 }}>
        <TextField fullWidth label="Placa" value={readOnlyValues?.moto?.placa ?? ""} InputProps={{ readOnly: true }} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField fullWidth label="Descripción" value={readOnlyValues?.descripcion ?? ""} InputProps={{ readOnly: true }} />
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
            <TextField {...field} fullWidth label="Observaciones" multiline rows={3} error={!!errors?.observaciones} helperText={errors?.observaciones?.message} />
          )}
        />
      </Grid>
    </>
  );
};

export default SalidaForm;