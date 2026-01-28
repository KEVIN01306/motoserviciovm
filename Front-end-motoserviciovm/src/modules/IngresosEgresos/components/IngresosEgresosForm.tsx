import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Grid, TextField, Button, MenuItem, Autocomplete } from '@mui/material';
import { useForm } from 'react-hook-form';
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
  const { register, handleSubmit, setValue, formState: { isSubmitting }, reset } = useForm<IngresosEgresosType>({ defaultValues: { ...(initial ?? IngresosEgresosInitialState) } as any });
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [sucursalSelected, setSucursalSelected] = useState<any | null>(null);
  const user = useAuthStore(state => state.user);

  useImperativeHandle(ref, () => ({
    reset: () => reset(),
  }));

  useEffect(() => {
    (async () => {
      try {
        const s = await getSucursales();
        setSucursales(s);
        const defaultId = initial?.sucursalId ?? undefined;
        if (defaultId) {
          const found = s.find((x: any) => Number(x.id) === Number(defaultId));
          if (found) { setSucursalSelected(found); setValue('sucursalId' as any, found.id); }
        } else {
          const userSucArr = Array.isArray(user?.sucursales) ? user!.sucursales : [];
          if (userSucArr.length > 0) {
            const first = userSucArr[0];
            const candidateId = typeof first === 'object' ? first?.id : Number(first);
            const found = s.find((x: any) => Number(x.id) === Number(candidateId));
            if (found) { setSucursalSelected(found); setValue('sucursalId' as any, found.id); }
          }
        }
      } catch (e) { console.error(e); }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const internalSubmit = async (data: IngresosEgresosType) => {
    await onSubmit({ ...data });
  };

  return (
    <FormEstructure handleSubmit={handleSubmit(internalSubmit)} pGrid={2}>
      <Grid size={{ xs: 12 }}>
        <TextField {...register('descripcion' as any)} label="Descripción" fullWidth variant="standard" />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField {...register('monto' as any, { valueAsNumber: true })} label="Monto" type="number" fullWidth variant="standard" />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField select {...register('tipoId' as any)} defaultValue={initial?.tipoId ?? tiposContabilidad().egreso} label="Tipo" fullWidth variant="standard">
          <MenuItem key={tiposContabilidad().egreso} selected value={tiposContabilidad().egreso}>Egreso</MenuItem>
          <MenuItem key={tiposContabilidad().ingreso} value={tiposContabilidad().ingreso}>Ingreso</MenuItem>
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Autocomplete
          options={sucursales}
          getOptionLabel={(o: any) => o?.nombre ?? `Sucursal ${o?.id}`}
          value={sucursalSelected}
          onChange={(_, n) => { setSucursalSelected(n ?? null); setValue('sucursalId' as any, n?.id ?? 0); }}
          isOptionEqualToValue={(a: any, b: any) => Number(a?.id) === Number(b?.id)}
          renderInput={(params) => <TextField {...params} label="Sucursal" variant="standard" fullWidth />}
        />
      </Grid>
      {
        
      }
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select {...register('moduloTallerId' as any, { valueAsNumber: true })} defaultValue={initial?.moduloTallerId} fullWidth label="Módulo" variant="standard" >
             <MenuItem selected value={1}>Taller</MenuItem>
             <MenuItem value={2}>Repuestos</MenuItem>
            </TextField>
          </Grid>

      <Grid size={{ xs: 12 }}>
        <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>{submitLabel}</Button>
      </Grid>
    </FormEstructure>
  );
});

export default IngresosEgresosForm;
