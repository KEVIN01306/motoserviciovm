import { Grid, TextField, Autocomplete, Box } from "@mui/material";
import { Controller, type Control, type UseFormRegister, type UseFormSetValue, type UseFormWatch, type FieldErrors } from "react-hook-form";
import { useEffect, useState } from "react";
import { getTipos, getTipo } from '../../../services/tipoServicio.services';
import { tipoServicioHorarioServices } from '../../../services/tipoServicioHorario.services';
import type { CitaType } from '../../../types/citaType';
import { useAuthStore } from '../../../store/useAuthStore';

interface InputsFormProps {
  register: UseFormRegister<CitaType>;
  control: Control<CitaType, any>;
  watch: UseFormWatch<CitaType>;
  setValue: UseFormSetValue<CitaType>;
  errors: FieldErrors<CitaType>;
}

const InputsForm = ({ register, control, watch, setValue, errors }: InputsFormProps) => {
  const [tipos, setTipos] = useState<any[]>([]);
  const [horarios, setHorarios] = useState<any[]>([]);
  const [maxDate, setMaxDate] = useState<string | null>(null);

  const sucursalId = watch('sucursalId');
  const tipoServicioId = watch('tipoServicioId');

  useEffect(() => { (async ()=>{ try{ const t = await getTipos(); setTipos(t); }catch(e){} })(); }, []);

  useEffect(() => {
    const fetchHorarios = async () => {
      if (!tipoServicioId || !sucursalId) { setHorarios([]); setMaxDate(null); return; }
      try {
        const tipo = await getTipo(Number(tipoServicioId));
        if (!tipo?.tipoHorarioId) { setHorarios([]); setMaxDate(null); return; }
        const res = await tipoServicioHorarioServices.getTiposServicioHorario({ tipoHorarioId: Number(tipo.tipoHorarioId), sucursalId: Number(sucursalId) });
        setHorarios(res || []);
        if (Array.isArray(res) && res.length>0) setMaxDate(res[0].fechaVijencia);
        else setMaxDate(null);
      } catch (e) { setHorarios([]); setMaxDate(null); }
    };
    fetchHorarios();
  }, [tipoServicioId, sucursalId]);

  

  const user = useAuthStore(s => s.user);

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <TextField {...register('descripcion' as any)} label="Descripción" fullWidth variant="standard" multiline minRows={2} error={!!errors.descripcion} helperText={errors.descripcion?.message} />
      </Grid>

      <Grid size={6}>
        <TextField {...register('fechaCita' as any)} label="Fecha" type="date" fullWidth variant="standard" InputLabelProps={{ shrink: true }} error={!!errors.fechaCita} helperText={errors.fechaCita?.message} inputProps={{ max: maxDate ?? undefined }} />
      </Grid>
      <Grid size={6}>
        <TextField {...register('horaCita' as any)} label="Hora" type="time" fullWidth variant="standard" InputLabelProps={{ shrink: true }} error={!!errors.horaCita} helperText={errors.horaCita?.message} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField {...register('nombreContacto' as any)} label="Nombre contacto" fullWidth variant="standard" error={!!errors.nombreContacto} helperText={errors.nombreContacto?.message} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField {...register('telefonoContacto' as any)} label="Teléfono" fullWidth variant="standard" error={!!errors.telefonoContacto} helperText={errors.telefonoContacto?.message} />
      </Grid>

      <Grid size={12}>
        <Controller name="sucursalId" control={control} render={({ field }) => (
          <Autocomplete
            options={user?.sucursales || []}
            getOptionLabel={(opt: any) => opt?.nombre ?? ''}
            value={user?.sucursales?.find((s: any) => String(s.id) === String(field.value)) ?? null}
            onChange={(_, v: any) => field.onChange(v ? v.id : undefined)}
            renderInput={(params) => <TextField {...params} label="Sucursal" variant="standard" fullWidth />}
          />
        )} />
      </Grid>

      <Grid size={12}>
        <Controller name="tipoServicioId" control={control} render={({ field }) => (
          <Autocomplete
            options={tipos}
            getOptionLabel={(opt:any) => opt?.tipo ?? ''}
            value={tipos.find(t=>String(t.id)===String(field.value)) ?? null}
            onChange={(_, v:any) => field.onChange(v ? v.id : undefined)}
            renderInput={(params) => <TextField {...params} label="Tipo de Servicio" variant="standard" fullWidth />}
          />
        )} />
      </Grid>

      <Grid size={12}>
        <Controller name="tipoServicioHorarioId" control={control} render={({ field }) => (
          <Autocomplete
            options={horarios}
            getOptionLabel={(opt:any) => opt?.nombre ?? String(opt?.id ?? '')}
            value={horarios.find(h=>String(h.id)===String(field.value)) ?? null}
            onChange={(_, v:any) => field.onChange(v ? v.id : undefined)}
            renderInput={(params) => <TextField {...params} label="Horario (opcional)" variant="standard" fullWidth />}
          />
        )} />
        {maxDate && <Box mt={1}><Typography variant="caption">Fecha de vigencia máxima: {maxDate}</Typography></Box>}
      </Grid>

      <Grid size={12}>
        <TextField {...register('placa' as any)} label="Placa" fullWidth variant="standard" />
      </Grid>

      {/* location capture removed - only POST fields are included */}
    </>
  );
}

export default InputsForm;
