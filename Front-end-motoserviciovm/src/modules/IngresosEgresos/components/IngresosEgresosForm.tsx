import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Grid, TextField, Button, MenuItem, Autocomplete } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import FormEstructure from '../../../components/utils/FormEstructure';
import { IngresosEgresosInitialState, type IngresosEgresosType } from '../../../types/ingresosEgresos.Type';
import { getSucursales } from '../../../services/sucursal.services';
import { tiposContabilidad } from '../../../utils/tiposContabilidad';
import { useAuthStore } from '../../../store/useAuthStore';

type Props = {
  initial?: Partial<IngresosEgresosType>;
  onSubmit: (payload: IngresosEgresosType) => Promise<void>;
  submitLabel?: string;
};

const IngresosEgresosForm = forwardRef((props: Props, ref) => {
  const { initial, onSubmit, submitLabel = 'Guardar' } = props;
  
  const defaultValues = {
    ...(IngresosEgresosInitialState),
    ...initial
  };

  const { register, handleSubmit, setValue, formState: { isSubmitting }, reset, control } = useForm<IngresosEgresosType>({ 
    defaultValues 
  });

  const [sucursales, setSucursales] = useState<any[]>([]);
  const [sucursalSelected, setSucursalSelected] = useState<any | null>(null);
  const user = useAuthStore(state => state.user);

  useImperativeHandle(ref, () => ({
    reset: () => {
      reset(defaultValues); 
      setSucursalSelected(null);
    },
  }));

  useEffect(() => {
    (async () => {
      try {
        const s = await getSucursales();
        setSucursales(s);
        
        const defaultId = initial?.sucursalId;
        let targetId = defaultId;

        if (!targetId) {
          const userSucArr = Array.isArray(user?.sucursales) ? user.sucursales : [];
          if (userSucArr.length > 0) {
            const first = userSucArr[0];
            targetId = typeof first === 'object' ? first?.id : Number(first);
          }
        }

        if (targetId) {
          const found = s.find((x: any) => Number(x.id) === Number(targetId));
          if (found) {
            setSucursalSelected(found);
            setValue('sucursalId', found.id as any);
          }
        }
      } catch (e) { console.error(e); }
    })();
  }, [initial, user, setValue]);

  const internalSubmit = async (data: IngresosEgresosType) => {
    await onSubmit(data);
  };

  return (
    <FormEstructure handleSubmit={handleSubmit(internalSubmit)} pGrid={2}>
      <Grid size={{ xs: 12 }}>
        <TextField {...register('descripcion')} label="Descripción" fullWidth variant="standard" />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField {...register('monto', { valueAsNumber: true })} label="Monto" type="number" fullWidth variant="standard" />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="tipoId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Tipo"
              fullWidth
              variant="standard"
            >
              <MenuItem value={tiposContabilidad().egreso}>Egreso</MenuItem>
              <MenuItem value={tiposContabilidad().ingreso}>Ingreso</MenuItem>
            </TextField>
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Autocomplete
          options={sucursales}
          getOptionLabel={(o: any) => o?.nombre ?? ""}
          value={sucursalSelected}
          onChange={(_, n) => { 
            setSucursalSelected(n); 
            setValue('sucursalId', n?.id ?? 0); 
          }}
          isOptionEqualToValue={(a, b) => a?.id === b?.id}
          renderInput={(params) => <TextField {...params} label="Sucursal" variant="standard" fullWidth />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="moduloTallerId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              fullWidth
              label="Módulo"
              variant="standard"
              value={field.value || null} 
              onChange={(e) => field.onChange(Number(e.target.value))}            >
              <MenuItem value={1}>Taller</MenuItem>
              <MenuItem value={2}>Repuestos</MenuItem>
            </TextField>
          )}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </Grid>
    </FormEstructure>
  );
});

export default IngresosEgresosForm;
