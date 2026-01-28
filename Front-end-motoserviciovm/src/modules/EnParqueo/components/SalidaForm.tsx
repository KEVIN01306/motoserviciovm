import { Grid, TextField, Typography } from "@mui/material";
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import SignatureField from "../../../components/utils/SignatureField";
import type { EnParqueoGetType, EnParqueoType } from "../../../types/enParqueoType";

type Props = {
  control: Control<EnParqueoType>;
  register?: UseFormRegister<EnParqueoType>;
  errors?: FieldErrors<EnParqueoType>;
  readOnlyValues?: Partial<EnParqueoGetType>;
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

      <Grid size={{ xs: 12 }}>
        <Controller
          control={control}
          name="firmaSalida"
          render={({ field }) => (
            <SignatureField
              onSaveSignature={field.onChange}
              initialValue={typeof field.value === 'string' ? field.value : ''} 
            />
          )}
        />
        {errors?.firmaSalida && (
          <Typography color="error" variant="caption">{errors.firmaSalida.message}</Typography>
        )}
      </Grid>
    </>
  );
};

export default SalidaForm;