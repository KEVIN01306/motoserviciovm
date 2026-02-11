import { Grid, TextField, Typography } from "@mui/material";
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import SignatureField from "../../../components/utils/SignatureField";
import type { EnReparacionGetType, EnReparacionType } from "../../../types/enReparacionType";

type Props = {
  control: Control<EnReparacionType>;
  register: UseFormRegister<EnReparacionType>;
  errors: FieldErrors<EnReparacionType>;
  readOnlyValues?: Partial<EnReparacionGetType>;
};

const SalidaForm = ({ control, register, errors, readOnlyValues }: Props) => {
  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{readOnlyValues?.servicio?.moto?.placa}</Typography>
      </Grid>

      <Grid size={12}>
        <TextField variant="standard" fullWidth label="Descripción" {...register("descripcion")} error={!!errors.descripcion} helperText={errors.descripcion?.message} />
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

      <Grid size={12}>
        <TextField variant="standard" fullWidth label="observaciones" {...register("observaciones")} error={!!errors.observaciones} helperText={errors.observaciones?.message} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Controller
          control={control}
          name="firmaSalida"
          render={({ field }) => (
            <SignatureField
              onSaveSignature={field.onChange}
              initialValue={field.value as any}
              text="Agregar firma de salida"
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
