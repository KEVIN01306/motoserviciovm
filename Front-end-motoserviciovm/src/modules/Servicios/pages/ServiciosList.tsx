import { useEffect, useState } from 'react';
import { Grid, Fab, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { RiMoneyDollarCircleLine, RiToolsLine } from 'react-icons/ri';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';
import Search from '../../../components/utils/Search';
import TableCustom from '../../../components/Table/Table';
import type { Column } from '../../../components/Table/Table';
import { useGoTo } from '../../../hooks/useGoTo';
import { useAuthStore } from '../../../store/useAuthStore';
import { getServicios } from '../../../services/servicios.services';
import type { ServicioGetType } from '../../../types/servicioType';
import { formatDate } from '../../../utils/formatDate';
import { PiDeviceTabletFill } from 'react-icons/pi';
import { estados, estadosServicio } from '../../../utils/estados';
import type { EstadoType } from '../../../types/estadoType';
import { MdBikeScooter } from 'react-icons/md';
import { FaBarsProgress } from "react-icons/fa6";


const ServiciosList = () => {
  const [items, setItems] = useState<ServicioGetType[]>([]);
  const [filtered, setFiltered] = useState<ServicioGetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [term, setTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<number | 'all'>(estados().enServicio);
  const goTo = useGoTo();
  const user = useAuthStore(s => s.user);

  const fetch = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedEstado !== 'all') params.estadoId = selectedEstado;

      const canViewAll = !!user?.permisos?.includes('servicios:viewAll');
      if (!canViewAll && user?.id) {
        params.mecanicoId = Number(user.id);
      }

      const data = await getServicios(params);
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Error cargando servicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [selectedEstado, user?.id, user?.permisos]);

  useEffect(() => {
    if (!term.trim()) { setFiltered(items); return; }
    const l = term.toLowerCase();
    setFiltered(items.filter(i => String(i.id).toLowerCase().includes(l) || (i.descripcion ?? '').toLowerCase().includes(l) || (i.moto?.placa ?? '').toLowerCase().includes(l)));
  }, [term, items]);

    const chipColorByEstado = (id: number) => {
        switch (id) {
        case estados().enEspera:
            return "warning";
        case estados().entregado:
            return "success";
        case estados().cancelado:
            return "error";
        default:
            return "primary";
        }
    };


  const columns = (): Column<ServicioGetType>[] => {
    const base: Column<ServicioGetType>[] = [
      { id: 'createdAt', label: 'Creado', minWidth: 160, format: (v) => formatDate(v as any) },
      { id: 'moto', label: 'Moto', minWidth: 120, format: (v) => v?.placa ?? '-' },
      { id: 'estado', label: 'Estado', minWidth: 100, format: (v: EstadoType) => <Chip variant='outlined' label={v?.estado ?? ''} color={chipColorByEstado(v?.id ?? 0)} /> },
      { id: 'id', label: 'Codigo', minWidth: 60 },
      { id: 'descripcion', label: 'Descripción', minWidth: 220 },
    ];

    const actions = getTableActions();
    if (actions.length) base.push({ id: 'actions', label: 'Acciones', actions });

    return base;
  };

  const getTableActions = () => {
    return (row: ServicioGetType) => {
      const isEnEspera = row.estadoId === estados().enEspera;
      const actions: { label: any; onClick: (r: ServicioGetType) => void; permiso: string }[] = [];

      if (row.estadoId === estados().entregado) {
        if (user?.permisos.includes('servicios:detail')) {
          actions.push({ label: (<><PiDeviceTabletFill /><span className="ml-1.5">Detalle</span></>), onClick: (r) => goTo(`/admin/servicios/${r.id}`), permiso: 'ingresos-egresos:detail' });
        }

        if (user?.permisos.includes('servicios:salidaDetalle')) {
          actions.push({ label: (<><MdBikeScooter /><span className="ml-1.5">Detalle Salida</span></>), onClick: (r) => goTo(`/admin/servicios/${r.id}/salidaDetalle`), permiso: 'servicios:salidaDetalle' });
        }
          return actions;
      }
      if (row.estadoId === estados().enReparacion || row.estadoId === estados().enParqueo) {
         if (user?.permisos.includes('servicios:detail')) {
          actions.push({ label: (<><PiDeviceTabletFill /><span className="ml-1.5">Detalle</span></>), onClick: (r) => goTo(`/admin/servicios/${r.id}`), permiso: 'servicios:detail' });
            }
          
          if (user?.permisos.includes('servicios:salida')) {
            actions.push({ label: (<><MdBikeScooter /><span className="ml-1.5">Salida</span></>), onClick: (r) => goTo(`/admin/servicios/${r.id}/salida`), permiso: 'servicios:edit' });
          }

          if (user?.permisos.includes('servicios:progreso')) {
            actions.push({ label: (<><FaBarsProgress /><span className="ml-1.5">Progreso</span></>), onClick: (r) => goTo(`/admin/servicios/${r.id}/progreso`), permiso: 'servicios:progreso' });
      }

      return actions;
          
      }

       if (user?.permisos.includes('servicios:detail')) {
          actions.push({ label: (<><PiDeviceTabletFill /><span className="ml-1.5">Detalle</span></>), onClick: (r) => goTo(`/admin/servicios/${r.id}`), permiso: 'servicios:detail' });
            }
          if (user?.permisos.includes('servicios:edit')) {
            actions.push({ label: (<><RiMoneyDollarCircleLine /><span className="ml-1.5">Editar</span></>), onClick: (r) => goTo(`/admin/servicios/${r.id}/edit`), permiso: 'servicios:edit' });
          }

          if (user?.permisos.includes('servicios:salida')) {
            actions.push({ label: (<><MdBikeScooter /><span className="ml-1.5">Salida</span></>), onClick: (r) => goTo(`/admin/servicios/${r.id}/salida`), permiso: 'servicios:edit' });
          }

          if (user?.permisos.includes('servicios:progreso')) {
            actions.push({ label: (<><FaBarsProgress /><span className="ml-1.5">Progreso</span></>), onClick: (r) => goTo(`/admin/servicios/${r.id}/progreso`), permiso: 'servicios:progreso' });
      }
      


      

      return actions.filter(a => user?.permisos.includes(a.permiso));
    };
  };

  

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={fetch} />;

  return (
    <>
      <BreadcrumbsRoutes items={[{ label: 'Servicios', icon: <RiToolsLine fontSize="inherit" />, href: '/admin/servicios' }]} />
      <Grid container spacing={2} flexGrow={1} size={12} width="100%">
        <Grid flexGrow={1} container p={1} gap={2} justifyContent={{ sm: 'center', md: 'flex-end' }}>
          <Grid size={{ xs: 12, md: 2 }} display={'flex'} flexGrow={1} alignItems={'center'} justifyContent={'start'}>
            <FormControl fullWidth size="small">
              <InputLabel id="estado-select-label">Estado</InputLabel>
              <Select
                labelId="estado-select-label"
                variant='standard'
                value={selectedEstado}
                label="Estado"
                onChange={(e) => setSelectedEstado(e.target.value as number | 'all')}
              >
                <MenuItem value={'all'}>Todos</MenuItem>
                {Object.entries(estadosServicio()).map(([key, val]: any) => (
                  <MenuItem key={key} value={val.id}>{val.estado}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} display={'flex'} flexGrow={1} alignItems={'center'} justifyContent={'end'}>
            <Search onSearch={setTerm} placeholder="Buscar servicios..." />
          </Grid>
          {user?.permisos.includes('servicios:create') && (
            <Grid size={{ xs: 1, md: 1 }} display={'flex'} flexGrow={1} alignItems={'center'} justifyContent={'end'}>
              <Fab size="small" color="primary" aria-label="add" onClick={() => goTo('/admin/servicios/create')}>
                <AddIcon />
              </Fab>
            </Grid>
          )}
        </Grid>
        <Grid size={12}>
          <TableCustom columns={columns()} rows={filtered} />
        </Grid>
      </Grid>
    </>
  );
};

export default ServiciosList;
