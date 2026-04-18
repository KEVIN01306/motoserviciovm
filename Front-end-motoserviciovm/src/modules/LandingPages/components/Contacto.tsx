import { Calendar, Hash, Mail, Map, MapPin, Send, Smartphone, User, AlertCircle } from "lucide-react";
import { Skeleton, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { ContactoType } from "../../../types/contactoType";
import type { CitaType } from "../../../types/citaType";
import { getTipos, getTipo } from '../../../services/tipoServicio.services';
import { getCitas, postCita } from '../../../services/citas.services';
import { tipoServicioHorarioServices } from '../../../services/tipoServicioHorario.services';
import { getSucursales } from '../../../services/sucursal.services';
import { estados } from '../../../utils/estados';

const Contacto = ({ contacto, loading, loadingTextos, descripcion }: { contacto: ContactoType; loading: boolean; loadingTextos: boolean; descripcion?: string }) => {
    const { register, handleSubmit, watch, setValue } = useForm<Partial<CitaType>>({
        defaultValues: {
            nombreContacto: '',
            telefonoContacto: '',
            dpiNit: '',
            placa: '',
            descripcion: '',
            sucursalId: undefined,
            tipoServicioId: undefined,
            fechaCita: '',
            horaCita: '',
        }
    });

    const [tipos, setTipos] = useState<any[]>([]);
    const [sucursales, setSucursales] = useState<any[]>([]);
    const [horarios, setHorarios] = useState<any[]>([]);
    const [maxDate, setMaxDate] = useState<string | null>(null);
    const [availableHours, setAvailableHours] = useState<{ label: string; start: string; end: string; capacity?: number }[]>([]);
    const [filteredHorarios, setFilteredHorarios] = useState<any[]>([]);
    const [citasFecha, setCitasFecha] = useState<any[]>([]);
    const [horarioErrors, setHorarioErrors] = useState<string[]>([]);
    const [enviandoCita, setEnviandoCita] = useState(false);
    const [mensajeCita, setMensajeCita] = useState<{ tipo: 'exito' | 'error'; mensaje: string } | null>(null);

    const fechaCita = watch('fechaCita');
    const tipoServicioId = watch('tipoServicioId');
    const sucursalId = watch('sucursalId');

    // Obtener tipos de servicio y sucursales
    useEffect(() => {
        const fetchInit = async () => {
            try {
                const [tiposData, sucursalesData] = await Promise.all([
                    getTipos(),
                    getSucursales()
                ]);
                setTipos(tiposData);
                setSucursales(sucursalesData);
            } catch {
                console.error('Error cargando datos');
            }
        };
        fetchInit();
    }, []);

useEffect(() => {
    const fetchHorarios = async () => {
        if (!tipoServicioId || !sucursalId) {
            setHorarios([]);
            setMaxDate(null);
            return;
        }

        try {
            const tipo = await getTipo(String(tipoServicioId));
            
            // 1. Obtenemos el array de horarios
            const vigenciaData = tipo.tipoHorario?.tipoServicioHorarios;
            
            if (!tipo?.tipoHorarioId) {
                setHorarios([]);
                setMaxDate(null);
                return;
            }

            const res = await tipoServicioHorarioServices.getTiposServicioHorario({
                tipoHorarioId: Number(tipo.tipoHorarioId),
                sucursalId: Number(sucursalId)
            });
            setHorarios(res || []);

            // 2. Lógica para el ÚLTIMO registro del array
            if (Array.isArray(vigenciaData) && vigenciaData.length > 0) {
                // Accedemos al último elemento usando el índice [length - 1]
                const ultimoRegistro = vigenciaData[vigenciaData.length - 1];
                
                // Usamos la propiedad con "j" como viene en tu objeto
                const fechaString = ultimoRegistro.fechaVijencia; 

                if (fechaString) {
                    const ultimaFecha = new Date(fechaString);
                    
                    if (!isNaN(ultimaFecha.getTime())) {
                        // Formateamos a YYYY-MM-DD para el input
                        const yyyy = ultimaFecha.toISOString().slice(0, 10);
                        setMaxDate(yyyy);
                        console.log('Fecha del último registro aplicada:', yyyy);
                    }
                }
            } else {
                setMaxDate(null);
            }
        } catch (error) {
            console.error("Error:", error);
            setHorarios([]);
            setMaxDate(null);
        }
    };
    fetchHorarios();
}, [tipoServicioId, sucursalId]);

    // Normalizar texto para comparaciones
    const normalize = (s: string | undefined) => (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

    // Calcular días de la semana disponibles
    useEffect(() => {
        const diasEsOriginal = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const diasEs = diasEsOriginal.map(d => d.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase());
        const set = new Set<number>();
        if (!Array.isArray(filteredHorarios)) {
            return;
        }
        for (const h of filteredHorarios) {
            if (!Array.isArray(h.diasConfig)) continue;
            for (const d of h.diasConfig) {
                const diaTxt = normalize(d?.dia?.dia);
                const idx = diasEs.findIndex(x => x === diaTxt);
                if (idx >= 0) set.add(idx);
            }
        }
    }, [filteredHorarios]);

    // Mantener filteredHorarios con configuración de días
    useEffect(() => {
        if (!Array.isArray(horarios) || horarios.length === 0) {
            setFilteredHorarios([]);
            return;
        }
        const filtered = horarios.filter((h: any) => Array.isArray(h.diasConfig) && h.diasConfig.length > 0);
        setFilteredHorarios(filtered);
    }, [horarios]);

    // Calcular horas disponibles para la fecha seleccionada
    useEffect(() => {
        setAvailableHours([]);
        if (!fechaCita || !Array.isArray(filteredHorarios) || filteredHorarios.length === 0) return;

        const date = new Date(fechaCita + 'T00:00:00');
        if (isNaN(date.getTime())) return;
        const diasEs = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const diaEs = diasEs[date.getDay()];

        const collected: { label: string; start: string; end: string; capacity?: number }[] = [];
        const localErrors: string[] = [];
        for (const sel of filteredHorarios) {
            if (!Array.isArray(sel.diasConfig)) continue;
            const matched = sel.diasConfig.find((d: { dia?: { dia?: string } }) => normalize(d?.dia?.dia) === normalize(diaEs));
            if (!matched) continue;
            if (!Array.isArray(matched.horas) || matched.horas.length === 0) {
                localErrors.push(`El horario no tiene horas para ${diaEs}`);
                continue;
            }
            for (const h of matched.horas) {
                const start = typeof h.horaInicio === 'string' ? h.horaInicio.slice(0, 5) : String(h.horaInicio).slice(0, 5);
                const end = typeof h.horaFin === 'string' ? h.horaFin.slice(0, 5) : String(h.horaFin).slice(0, 5);
                const capacity = (matched && (typeof matched.cantidadPersonal === 'number')) ? Number(matched.cantidadPersonal) : undefined;
                collected.push({ label: `${start} - ${end}`, start, end, capacity });
            }
        }

        // deduplicar por start (y end)
        const dedupMap: Record<string, { label: string; start: string; end: string; capacity?: number }> = {};
        for (const it of collected) {
            const key = it.start + '|' + it.end;
            const existing = dedupMap[key];
            if (!existing) dedupMap[key] = { ...it };
            else {
                if (existing.capacity === undefined || it.capacity === undefined) existing.capacity = undefined;
                else existing.capacity = Number(existing.capacity) + Number(it.capacity);
                dedupMap[key] = existing;
            }
        }
        const list = Object.values(dedupMap).sort((a, b) => a.start.localeCompare(b.start));
        setAvailableHours(list);
        if ((!list || list.length === 0) && Array.isArray(filteredHorarios) && filteredHorarios.length > 0) {
            localErrors.push('No se encontraron horas disponibles para la fecha seleccionada.');
        }
        setHorarioErrors(prev => Array.from(new Set([...(prev || []), ...localErrors])));
    }, [fechaCita, filteredHorarios]);

    // Obtener citas existentes para la fecha
    useEffect(() => {
        let mounted = true;
        const fetchCitas = async () => {
            if (!fechaCita) {
                setCitasFecha([]);
                return;
            }
            try {
                const fechaIso = `${fechaCita}T00:00:00.000Z`;
                const params: { fechaCita: string; sucursalId?: number; estadoIds: string } = { fechaCita: fechaIso, estadoIds: `${estados().confirmado},${estados().enEspera}` };
                if (sucursalId) params.sucursalId = Number(sucursalId);
                const res = await getCitas(params);
                if (!mounted) return;

                const tipoActual = tipos.find(t => String(t.id) === String(tipoServicioId));

                const citasTipoHorario = res.filter( c => c.tipoServicio?.tipoHorarioId === Number(tipoActual?.tipoHorarioId) );
                
                setCitasFecha(citasTipoHorario || []);
            } catch {
                if (!mounted) return;
                setCitasFecha([]);
            }
        };
        fetchCitas();
        return () => { mounted = false; };
    }, [fechaCita, sucursalId,tipos, tipoServicioId]);

    // Limpiar horaCita si no hay horas disponibles
    useEffect(() => {
        if (!availableHours || availableHours.length === 0) {
            setValue('horaCita', '');
        }
    }, [availableHours, setValue]);

    const onSubmit: SubmitHandler<Partial<CitaType>> = async (data) => {
        try {
            setEnviandoCita(true);
            setMensajeCita(null);

            // Validaciones básicas
            if (!data.nombreContacto || !data.telefonoContacto || !data.dpiNit || !data.placa) {
                setMensajeCita({ tipo: 'error', mensaje: 'Por favor completa todos los campos' });
                setEnviandoCita(false);
                return;
            }

            if (!data.tipoServicioId || !data.sucursalId) {
                setMensajeCita({ tipo: 'error', mensaje: 'Selecciona servicio y sucursal' });
                setEnviandoCita(false);
                return;
            }

            if (!data.fechaCita || !data.horaCita) {
                setMensajeCita({ tipo: 'error', mensaje: 'Selecciona fecha y hora' });
                setEnviandoCita(false);
                return;
            }

            const citaData = {
                ...data,
                sucursalId: data.sucursalId ? Number(data.sucursalId) : undefined,
                tipoServicioId: data.tipoServicioId ? Number(data.tipoServicioId) : undefined,
                estadoId: estados().enEspera,
            };

            await postCita(citaData);
            setMensajeCita({ tipo: 'exito', mensaje: '¡Cita reservada exitosamente! Te contactaremos pronto.' });

            // Reset formulario
            setValue('nombreContacto', '');
            setValue('telefonoContacto', '');
            setValue('dpiNit', '');
            setValue('placa', '');
            setValue('descripcion', '');
            setValue('tipoServicioId', undefined);
            setValue('sucursalId', undefined);
            setValue('fechaCita', '');
            setValue('horaCita', '');
        } catch (error) {
            setMensajeCita({ tipo: 'error', mensaje: (error as Error).message || 'Error al crear cita' });
        } finally {
            setEnviandoCita(false);
        }
    };
    return (
        <>
            <section id="contacto" className="py-24 bg-white dark:bg-black">
                <div className="max-w-4xl mx-auto px-4 bg-zinc-50 dark:bg-zinc-900 p-8 md:p-16 rounded-[3rem] border-2 border-zinc-200 dark:border-zinc-800 shadow-2xl">
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2"
                        >
                            Reserva tu <span className="text-red-600">Cita</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]"
                        >
                            {loadingTextos ? <Skeleton width="100%" /> : descripcion}
                        </motion.p>
                    </div>

                    {mensajeCita && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${mensajeCita.tipo === 'exito'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                                }`}
                        >
                            <AlertCircle size={20} />
                            <span className="font-semibold">{mensajeCita.mensaje}</span>
                        </motion.div>
                    )}

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {/* Fila 1: Datos personales */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600" size={18} />
                                <input
                                    {...register('nombreContacto')}
                                    placeholder="Nombre Completo"
                                    className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all"
                                />
                            </div>
                            <div className="relative group">
                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600" size={18} />
                                <input
                                    {...register('telefonoContacto')}
                                    type="tel"
                                    placeholder="Teléfono"
                                    className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Fila 2: DPI */}
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600" size={18} />
                            <input
                                {...register('dpiNit')}
                                placeholder="DPI / NIT"
                                className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all"
                            />
                        </div>

                        {/* Fila 3: Tipo de servicio y Sucursal */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600 pointer-events-none" size={18} />
                                <select
                                    {...register('tipoServicioId')}
                                    onChange={(e) => setValue('tipoServicioId', e.target.value ? Number(e.target.value) : undefined)}
                                    className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all appearance-none"
                                >
                                    <option value="">Tipo de Servicio</option>
                                    {tipos.map(tipo => (
                                        <option key={tipo.id} value={tipo.id}>{tipo.tipo}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600 pointer-events-none" size={18} />
                                <select
                                    {...register('sucursalId')}
                                    onChange={(e) => setValue('sucursalId', e.target.value ? Number(e.target.value) : undefined)}
                                    className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all appearance-none"
                                >
                                    <option value="">Sucursal</option>
                                    {sucursales.map((sucursal: any) => (
                                        <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Fila 4: Fecha y hora */}
                        {tipoServicioId && sucursalId && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600 pointer-events-none" size={18} />
                                    <input
                                        {...register('fechaCita')}
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        max={maxDate || undefined}
                                        className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all"
                                    />
                                </div>
                                {fechaCita && availableHours.length > 0 && (
                                    <div className="relative">
                                        <select
                                            {...register('horaCita')}
                                            className="w-full bg-white dark:bg-black p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all appearance-none"
                                        >
                                            <option value="">Seleccionar Hora</option>
                                            {availableHours.map((hour) => {
                                                const isOccupied = citasFecha.some(cita => cita.horaCita === hour.start);
                                                const capacity = (hour.capacity ?? 0);
                                                const occupied = citasFecha.filter(cita => cita.horaCita === hour.start).length;
                                                return (
                                                    <option
                                                        key={hour.start}
                                                        value={hour.start}
                                                        disabled={isOccupied && occupied >= capacity}
                                                    >
                                                        {hour.label} {isOccupied && capacity > 0 ? `(${occupied}/${capacity})` : ''}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Fila 5: Placa */}
                        <div className="relative group">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600" size={18} />
                            <input
                                {...register('placa')}
                                placeholder="Placa"
                                className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all"
                            />
                        </div>

                        {/* Descripción */}
                        <div className="relative group">
                            <textarea
                                {...register('descripcion')}
                                placeholder="Descripción del servicio requerido (opcional)"
                                rows={3}
                                className="w-full bg-white dark:bg-black p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all resize-none"
                            />
                        </div>

                        {/* Errores de horario */}
                        {horarioErrors.length > 0 && (
                            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                                {horarioErrors.map((err, i) => (
                                    <p key={i} className="text-sm text-orange-700 dark:text-orange-300">{err}</p>
                                ))}
                            </div>
                        )}

                        {/* Botón enviar */}
                        <button
                            type="submit"
                            disabled={enviandoCita}
                            className="w-full bg-zinc-900 dark:bg-red-600 text-white font-black py-5 rounded-2xl uppercase italic text-xl hover:bg-red-600 dark:hover:bg-white dark:hover:text-black transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {enviandoCita ? (
                                <>
                                    <CircularProgress size={20} sx={{ color: 'white' }} /> Procesando...
                                </>
                            ) : (
                                <>
                                    Confirmar Reserva <Send size={20} />
                                </>
                            )}
                        </button>
                    </motion.form>
                </div>
                {/* --- Contacto personal CONTACTO --- */}

                <div className="mt-16 pt-12 border-t-2 border-zinc-200 dark:border-zinc-800 grid md:grid-cols-3 gap-8">
                    {loading ? (
                        <>
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <Skeleton variant="circular" width={56} height={56} className="mb-4" sx={{ bgcolor: 'rgba(0,0,0,0.11)' }} />
                                    <Skeleton variant="text" width={80} height={20} className="mb-1" sx={{ bgcolor: 'rgba(0,0,0,0.11)' }} />
                                    <Skeleton variant="text" width={150} height={16} sx={{ bgcolor: 'rgba(0,0,0,0.11)' }} />
                                </motion.div>
                            ))}
                        </>
                    ) : (
                        <>
                            <motion.a
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contacto.direccion)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                                    <Map className="text-zinc-600 dark:text-zinc-400 group-hover:text-white" size={24} />
                                </div>
                                <h4 className="font-black italic uppercase text-sm mb-1">Ubicación</h4>
                                <p className="text-zinc-500 font-bold text-xs whitespace-pre-line">
                                    {contacto.direccion}
                                </p>
                            </motion.a>

                            <motion.a
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                href={`mailto:${contacto.email}`}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                                    <Mail className="text-zinc-600 dark:text-zinc-400 group-hover:text-white" size={24} />
                                </div>
                                <h4 className="font-black italic uppercase text-sm mb-1">Email</h4>
                                <p className="text-zinc-500 font-bold text-xs truncate w-full px-2">{contacto.email}</p>
                            </motion.a>

                            <motion.a
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true, margin: "-100px" }}
                                href={`tel:${contacto.telefono}`}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                                    <Smartphone className="text-zinc-600 dark:text-zinc-400 group-hover:text-white" size={24} />
                                </div>
                                <h4 className="font-black italic uppercase text-sm mb-1">Teléfono</h4>
                                <p className="text-zinc-500 font-bold text-xs">{contacto.telefono}</p>
                            </motion.a>
                        </>
                    )}
                </div>
            </section>
        </>
    );
}

export default Contacto;