import { Grid, TextField, Autocomplete, Box, Typography, Button, CircularProgress } from "@mui/material";
import { LocalizationProvider, DatePicker, PickersDay } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import {format} from 'date-fns/format';
import { Controller, type Control, type UseFormRegister, type UseFormSetValue, type UseFormWatch, type FieldErrors } from "react-hook-form";
import { useEffect, useState } from "react";
import { getTipos, getTipo } from '../../../services/tipoServicio.services';
import { getClienteByDocumento } from '../../../services/users.services';
import { getMotoByPlaca } from '../../../services/moto.services';
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
  const [availableHours, setAvailableHours] = useState<{ label: string; start: string; end: string }[]>([]);
  const [filteredHorarios, setFilteredHorarios] = useState<any[]>([]);

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
        if (Array.isArray(res) && res.length>0) {
          // elegir la fechaVijencia mínima entre los resultados
          try {
            const dates = res.map((r: any) => new Date(r.fechaVijencia + 'T00:00:00')).filter((d: Date) => !isNaN(d.getTime()));
            if (dates.length>0) {
              const minDate = dates.reduce((a: Date, b: Date) => a.getTime() <= b.getTime() ? a : b);
              const yyyy = minDate.toISOString().slice(0,10);
              setMaxDate(yyyy);
            } else setMaxDate(null);
          } catch(e) { setMaxDate(null); }
        } else setMaxDate(null);
      } catch (e) { setHorarios([]); setMaxDate(null); }
    };
    fetchHorarios();
  }, [tipoServicioId, sucursalId]);

  const fechaCita = watch('fechaCita');

  // Normaliza texto para comparar sin acentos y en minúsculas
  const normalize = (s: string | undefined) => (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

  // calcular días de la semana (0-6) que están disponibles según filteredHorarios
  const availableWeekdays = (() => {
    const diasEsOriginal = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const diasEs = diasEsOriginal.map(d => d.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase());
    const set = new Set<number>();
    if (!Array.isArray(filteredHorarios)) return set;
    for (const h of filteredHorarios) {
      if (!Array.isArray(h.diasConfig)) continue;
      for (const d of h.diasConfig) {
        const diaTxt = normalize(d?.dia?.dia);
        const idx = diasEs.findIndex(x => x === diaTxt);
        if (idx >= 0) set.add(idx);
      }
    }
    return set;
  })();

  useEffect(() => {
    // Reset available hours when dependencies change
    setAvailableHours([]);
    if (!fechaCita || !Array.isArray(filteredHorarios) || filteredHorarios.length === 0) return;

    const date = new Date(fechaCita + 'T00:00:00');
    if (isNaN(date.getTime())) return;
    const diasEs = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const diaEs = diasEs[date.getDay()];

    // recolectar todas las horas de todos los horarios que aplican a la fecha
    const collected: { label: string; start: string; end: string }[] = [];
    for (const sel of filteredHorarios) {
      if (!Array.isArray(sel.diasConfig)) continue;
      const matched = sel.diasConfig.find((d: any) => normalize(d?.dia?.dia) === normalize(diaEs));
      if (!matched || !Array.isArray(matched.horas)) continue;
      for (const h of matched.horas) {
        const start = typeof h.horaInicio === 'string' ? h.horaInicio.slice(0,5) : String(h.horaInicio).slice(0,5);
        const end = typeof h.horaFin === 'string' ? h.horaFin.slice(0,5) : String(h.horaFin).slice(0,5);
        collected.push({ label: `${start} - ${end}`, start, end });
      }
    }

    // deduplicar por start (y end) y ordenar
    const dedupMap = new Map<string, { label: string; start: string; end: string }>();
    for (const it of collected) dedupMap.set(it.start + '|' + it.end, it);
    const list = Array.from(dedupMap.values()).sort((a, b) => a.start.localeCompare(b.start));
    setAvailableHours(list);
  }, [fechaCita, filteredHorarios]);

  // Si no hay horas disponibles, limpiar horaCita para que no quede valor inválido
  useEffect(() => {
    if (!availableHours || availableHours.length === 0) {
      setValue('horaCita', '');
    }
  }, [availableHours, setValue]);

  // Mantener los horarios que tienen configuración de días (no depende de la fecha seleccionada)
  useEffect(() => {
    if (!Array.isArray(horarios) || horarios.length === 0) { setFilteredHorarios([]); return; }
    const filtered = horarios.filter((h: any) => Array.isArray(h.diasConfig) && h.diasConfig.length > 0);
    setFilteredHorarios(filtered);
  }, [horarios]);

  

  const user = useAuthStore(s => s.user);

  const [buscandoCliente, setBuscandoCliente] = useState(false);
  const [clienteFound, setClienteFound] = useState<any | null>(null);
  const [buscandoMoto, setBuscandoMoto] = useState(false);
  const [motoFound, setMotoFound] = useState<any | null>(null);

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Controller name="descripcion" control={control} render={({ field }) => (
          <TextField {...field} label="Descripción" fullWidth variant="standard" multiline minRows={2} error={!!errors.descripcion} helperText={errors.descripcion?.message} />
        )} />
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

      <Grid size={6}>
        <Controller name="fechaCita" control={control} render={({ field }) => {
          const value = field.value ? new Date(field.value + 'T00:00:00') : null;
          return (
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                value={value}
                onChange={(d: Date | null) => {
                  if (d && !isNaN(d.getTime())) field.onChange(format(d, 'yyyy-MM-dd'));
                  else field.onChange('');
                }}
                shouldDisableDate={(day: Date) => {
                  // disable if no available weekdays computed or day not in set
                  if (!(availableWeekdays instanceof Set) || availableWeekdays.size === 0) return true;
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  const maxDateObj = maxDate ? new Date(maxDate + 'T00:00:00') : null;
                  // disable if before today or after maxDate
                  const d = new Date(day);
                  d.setHours(0,0,0,0);
                  if (d.getTime() < today.getTime()) return true;
                  if (maxDateObj && d.getTime() > maxDateObj.getTime()) return true;
                  return !availableWeekdays.has(day.getDay());
                }}
                renderDay={(day, _value, DayComponentProps) => {
                  const isAvailable = availableWeekdays && availableWeekdays.has(day.getDay());
                  return (
                    <PickersDay
                      {...DayComponentProps}
                      sx={isAvailable ? { bgcolor: 'success.main', color: 'white', '&:hover': { bgcolor: 'success.dark' } } : undefined}
                    />
                  );
                }}
                inputFormat="yyyy-MM-dd"
                minDate={undefined}
                maxDate={maxDate ? new Date(maxDate + 'T00:00:00') : undefined}
                disabled={!(sucursalId && tipoServicioId && horarios.length>0)}
                renderInput={(params) => <TextField {...params} fullWidth variant="standard" error={!!errors.fechaCita} helperText={errors.fechaCita?.message} />}
              />
            </LocalizationProvider>
          );
        }} />
      </Grid>

      {maxDate && <Grid size={12}><Box mt={1}><Typography variant="caption">Fecha de vigencia máxima: {maxDate}</Typography></Box></Grid>}

      <Grid size={6}>
        {availableHours && availableHours.length>0 ? (
          <Autocomplete
            options={availableHours}
            getOptionLabel={(opt:any) => opt?.label ?? ''}
            value={availableHours.find((o) => o.start === watch('horaCita')) ?? null}
            onChange={(_, v:any) => setValue('horaCita', v ? v.start : '')}
            renderInput={(params) => <TextField {...params} label="Hora disponible" variant="standard" fullWidth error={!!errors.horaCita} helperText={errors.horaCita?.message} />}
          />
        ) : (
          <TextField {...register('horaCita' as any)} label="Hora" type="time" fullWidth variant="standard" InputLabelProps={{ shrink: true }} error={!!errors.horaCita} helperText={errors.horaCita?.message} disabled={true} />
        )}
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField {...register('nombreContacto' as any)} label="Nombre contacto" fullWidth variant="standard" error={!!errors.nombreContacto} helperText={errors.nombreContacto?.message} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField {...register('telefonoContacto' as any)} label="Teléfono" fullWidth variant="standard" error={!!errors.telefonoContacto} helperText={errors.telefonoContacto?.message} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField {...register('dpiNit' as any)} label="DPI / NIT" fullWidth variant="standard" error={!!errors.dpiNit} helperText={errors.dpiNit?.message} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button variant="outlined" onClick={async () => {
            const doc = (watch('dpiNit') || '').toString().trim();
            if (!doc) return;
            try {
              setBuscandoCliente(true);
              setClienteFound(null);
              const found = await getClienteByDocumento(doc);
              setClienteFound(found);
              if (found && found.id) setValue('clienteId', found.id);
            } catch (e) {
              setClienteFound(null);
            } finally { setBuscandoCliente(false); }
          }}>
            {buscandoCliente ? <CircularProgress size={18} /> : 'Buscar cliente'}
          </Button>
          {clienteFound && (
            <Box>
              <Typography><strong>Cliente:</strong> {clienteFound.nombre ?? clienteFound.name ?? '-'} </Typography>
              <Typography variant="caption">DPI: {clienteFound.documento ?? clienteFound.dpi ?? '-'}</Typography>
            </Box>
          )}
        </Box>
      </Grid>

      

      <Grid size={12}>
        <TextField {...register('placa' as any)} label="Placa" fullWidth variant="standard" />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button variant="outlined" onClick={async () => {
            const placaVal = (watch('placa') || '').toString().trim();
            if (!placaVal) return;
            try {
              setBuscandoMoto(true);
              setMotoFound(null);
              const found = await getMotoByPlaca(placaVal);
              setMotoFound(found);
              if (found && found.id) setValue('motoId', found.id);
              // if moto has users, optionally set cliente
              if (found && Array.isArray(found.users) && found.users.length>0) {
                setClienteFound(found.users[0]);
                if (found.users[0].id) setValue('clienteId', found.users[0].id);
              }
            } catch (e) {
              setMotoFound(null);
            } finally { setBuscandoMoto(false); }
          }}>
            {buscandoMoto ? <CircularProgress size={18} /> : 'Buscar moto'}
          </Button>
          {motoFound && (
            <Box>
              <Typography><strong>Placa:</strong> {motoFound.placa ?? '-'}</Typography>
              <Typography variant="caption">Modelo: {motoFound.modelo?.modelo ?? motoFound.modelo?.nombre ?? '-'}</Typography>
            </Box>
          )}
        </Box>
      </Grid>

      {/* location capture removed - only POST fields are included */}
    </>
  );
}

export default InputsForm;
