import { useEffect, useState } from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { RiEdit2Line } from 'react-icons/ri';
import { HiOutlineTrash } from 'react-icons/hi2';
import ModalConfirm from '../../../components/utils/modals/ModalConfirm';
import { deleteCita } from '../../../services/citas.services';
import { successToast, errorToast } from '../../../utils/toast';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';
import TableCustom from '../../../components/Table/Table';
import type { Column } from '../../../components/Table/Table';
import { useGoTo } from '../../../hooks/useGoTo';
import { useAuthStore } from '../../../store/useAuthStore';
import { getCitas } from '../../../services/citas.services';
import { getTipos } from '../../../services/tipoServicio.services';
import { getTiposHorario } from '../../../services/tipoHorario.services';
import type { TipoServicioGetType } from '../../../types/tipoServicioType';
import type { CitaGetType } from '../../../types/citaType';
import { PiDeviceTabletFill } from 'react-icons/pi';
import AddIcon from '@mui/icons-material/Add';
import Search from '../../../components/utils/Search';
import { Fab } from '@mui/material';

const CitasList = () => {
  const goTo = useGoTo();
  const user = useAuthStore(s => s.user);
  const userSucursales = Array.isArray(user?.sucursales) ? user!.sucursales : [];

  const [items, setItems] = useState<CitaGetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tipos, setTipos] = useState<TipoServicioGetType[]>([]);
  const [tiposHorario, setTiposHorario] = useState<any[]>([]);
  const [sucursalId, setSucursalId] = useState<number | undefined>(userSucursales.length ? Number(userSucursales[0].id) : undefined);
  const [tipoServicioId, setTipoServicioId] = useState<number | undefined>(undefined);
  const [tipoHorarioId, setTipoHorarioId] = useState<number | undefined>(undefined);
  const [citaToDelete, setCitaToDelete] = useState<CitaGetType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<CitaGetType[]>([]);

  const fetch = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (sucursalId) params.sucursalId = sucursalId;
      if (tipoServicioId) params.tipoServicioId = tipoServicioId;
      if (tipoHorarioId) params.tipoHorarioId = tipoHorarioId;
      const res = await getCitas(params);
      setItems(res);
    } catch (err: any) {
      setError(err?.message ?? 'Error cargando citas');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [sucursalId, tipoServicioId, tipoHorarioId]);

  useEffect(() => {
    (async () => {
      try { const t = await getTipos(); setTipos(t); } catch (e) {}
      try { const th = await getTiposHorario(); setTiposHorario(th); } catch (e) {}
    })();
  }, []);

  // filter items by searchTerm
  useEffect(() => {
    if (!searchTerm.trim()) { setFilteredItems(items); return; }
    const q = searchTerm.toLowerCase();
    const filtered = items.filter(i => (
      String(i.id ?? '').toLowerCase().includes(q) ||
      (i.tipoServicio?.tipo ?? '').toLowerCase().includes(q) ||
      (i.placa ?? '').toLowerCase().includes(q) ||
      (i.nombreContacto ?? '').toLowerCase().includes(q) ||
      (i.sucursal?.nombre ?? '').toLowerCase().includes(q)
    ));
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  const getTableActions = () => {
    const allActions = [
      {
        label: (
          <>
            <RiEdit2Line /> <span className="ml-1.5">Editar</span>
          </>
        ),
        onClick: (row: CitaGetType) => goTo(`${row.id}/edit`),
        permiso: 'citas:edit',
      },
      {
        label: (
          <>
            <PiDeviceTabletFill /> <span className="ml-1.5">Detalle</span>
          </>
        ),
        onClick: (row: CitaGetType) => goTo(`${row.id}`),
        permiso: 'citas:detail',
      },
      {
        label: (
          <>
            <HiOutlineTrash /> <span className="ml-1.5">Eliminar</span>
          </>
        ),
        onClick: (row: CitaGetType) => setCitaToDelete(row),
        permiso: 'citas:delete',
      },
    ];

    return allActions.filter((a) => user?.permisos?.includes(a.permiso));
  };

  const getTableColumns = (): Column<CitaGetType>[] => {
    const base: Column<CitaGetType>[] = [
      { id: 'id', label: 'ID', minWidth: 60 },
      { id: 'fechaCita', label: 'Fecha', minWidth: 120 },
      { id: 'horaCita', label: 'Hora', minWidth: 80 },
      { id: 'tipoServicio', label: 'Tipo', minWidth: 160, format: (v: any) => v?.tipo ?? '' },
      { id: 'sucursal', label: 'Sucursal', minWidth: 200, format: (v: any) => v?.nombre ?? '' },
      { id: 'placa', label: 'Placa', minWidth: 100 },
      { id: 'nombreContacto', label: 'Contacto', minWidth: 160 },
    ];

    const actions = getTableActions();
    if (actions.length > 0) base.push({ id: 'actions', label: 'Acciones', actions });
    return base;
  };

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={fetch} />;


  return (
    <>
      <BreadcrumbsRoutes items={[{ label: 'Citas', icon: <PiDeviceTabletFill fontSize="inherit" />, href: '/admin/citas' }]} />
      <Grid container spacing={2} flexGrow={1} size={12} width={'100%'}>
        <Grid flexGrow={1} container p={1} gap={2} justifyContent={{ sm: 'center', md: 'flex-end' }}>
          <Grid size={{ xs: 8, md: 8 }} display={'flex'} flexGrow={1} alignItems={'center'} justifyContent={'end'}>
            <Search onSearch={setSearchTerm} placeholder={'Buscar citas...'} />
          </Grid>
          {user?.permisos?.includes('citas:create') && (
            <Grid size={{ xs: 1, md: 1 }} display={'flex'} flexGrow={1} alignItems={'center'} justifyContent={'end'}>
              <Fab size="small" color="primary" aria-label="add" onClick={() => goTo('/admin/citas/create')}>
                <AddIcon />
              </Fab>
            </Grid>
          )}
        </Grid>
        <Grid display={'flex'} gap={2} p={1}>
          <FormControl size="small">
            <InputLabel id="sucursal-select-label">Sucursal</InputLabel>
            <Select labelId="sucursal-select-label" value={sucursalId ?? ''} label="Sucursal" onChange={(e) => setSucursalId(e.target.value ? Number(e.target.value) : undefined)}>
              {userSucursales.map((s: any) => (<MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>))}
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel id="tipo-select-label">Tipo Servicio</InputLabel>
            <Select labelId="tipo-select-label" value={tipoServicioId ?? ''} label="Tipo Servicio" onChange={(e) => setTipoServicioId(e.target.value ? Number(e.target.value) : undefined)}>
              <MenuItem value={''}>Todos</MenuItem>
              {tipos.map(t => (<MenuItem key={t.id} value={t.id}>{t.tipo}</MenuItem>))}
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel id="tipoh-select-label">Tipo Horario</InputLabel>
            <Select labelId="tipoh-select-label" value={tipoHorarioId ?? ''} label="Tipo Horario" onChange={(e) => setTipoHorarioId(e.target.value ? Number(e.target.value) : undefined)}>
              <MenuItem value={''}>Todos</MenuItem>
              {tiposHorario.map(t => (<MenuItem key={t.id} value={t.id}>{t.tipo}</MenuItem>))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={() => { setSucursalId(undefined); setTipoServicioId(undefined); setTipoHorarioId(undefined); setSearchTerm(''); }}>Limpiar</Button>
        </Grid>
        <Grid size={12}>
          <TableCustom columns={getTableColumns()} rows={filteredItems} />
        </Grid>
      </Grid>
      <ModalConfirm
        open={!!citaToDelete}
        title="Eliminar cita"
        text={`¿Seguro que deseas eliminar la cita ${citaToDelete?.id}?`}
        cancel={{ name: 'Cancelar', cancel: () => setCitaToDelete(null), color: 'primary' }}
        confirm={{ name: isDeleting ? 'Eliminando...' : 'Eliminar', confirm: async () => {
          if (!citaToDelete) return;
          try {
            setIsDeleting(true);
            await deleteCita(citaToDelete.id);
            successToast('Cita eliminada');
            setCitaToDelete(null);
            fetch();
          } catch (e:any) {
            errorToast(e?.message ?? 'Error eliminando cita');
          } finally { setIsDeleting(false); }
        }, color: 'error' }}
        onClose={() => setCitaToDelete(null)}
      />
    </>
  );
};

export default CitasList;
