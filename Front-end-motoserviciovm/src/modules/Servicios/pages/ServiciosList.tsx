import React, { useEffect, useState } from 'react';
import { Grid, Fab, Chip } from '@mui/material';
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
import { PiDeviceTabletFill, PiUserCheckBold } from 'react-icons/pi';
import { estados } from '../../../utils/estados';
import type { EstadoType } from '../../../types/estadoType';
import { MdBikeScooter } from 'react-icons/md';

const ServiciosList = () => {
  const [items, setItems] = useState<ServicioGetType[]>([]);
  const [filtered, setFiltered] = useState<ServicioGetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [term, setTerm] = useState('');
  const goTo = useGoTo();
  const user = useAuthStore(s => s.user);

  const fetch = async () => {
    try {
      setLoading(true);
      const data = await getServicios();
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Error cargando servicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  useEffect(() => {
    if (!term.trim()) { setFiltered(items); return; }
    const l = term.toLowerCase();
    setFiltered(items.filter(i => String(i.id).toLowerCase().includes(l) || (i.descripcion ?? '').toLowerCase().includes(l) || (i.moto?.placa ?? '').toLowerCase().includes(l)));
  }, [term, items]);

    const chipColorByEstado = (id: number) => {
        switch (id) {
        case estados().enEspera:
            return "warning";
        case estados().confirmado:
            return "success";
        case estados().cancelado:
            return "error";
        default:
            return "primary";
        }
    };


  const columns = (): Column<ServicioGetType>[] => {
    const base: Column<ServicioGetType>[] = [
      { id: 'id', label: 'Codigo', minWidth: 60 },
      { id: 'descripcion', label: 'Descripción', minWidth: 220 },
      { id: 'moto', label: 'Moto', minWidth: 120, format: (v) => v?.placa ?? '-' },
      { id: 'total', label: 'Total', minWidth: 120 },
       { id: 'estado', label: 'Estado', minWidth: 100, format: (v: EstadoType) => <Chip variant='outlined' label={v?.estado ?? ''} color={chipColorByEstado(v?.id ?? 0)} /> },
      { id: 'createdAt', label: 'Creado', minWidth: 160, format: (v) => formatDate(v as any) },
    ];

    const actions = getTableActions();
    if (actions.length) base.push({ id: 'actions', label: 'Acciones', actions });

    return base;
  };

  const getTableActions = () => {
    return (row: ServicioGetType) => {
      const isEnEspera = row.estadoId === estados().enEspera;
      const actions: { label: any; onClick: (r: ServicioGetType) => void; permiso: string }[] = [];

      if (!isEnEspera) {
        if (user?.permisos.includes('servicios:detail')) {
          actions.push({ label: (<><PiDeviceTabletFill /><span className="ml-1.5">Detalle</span></>), onClick: (r) => goTo(`/admin/servicios/${r.id}`), permiso: 'ingresos-egresos:detail' });
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


      if (user?.permisos.includes('servicios:finalize')) {
        actions.push({ label: (<><PiUserCheckBold /><span className="ml-1.5">Finalizar</span></>), onClick: async (r) => {
          if (!window.confirm(`¿Finalizar el registro #${r.id}?`)) return;
          alert('Funcionalidad no implementada aún');
        }, permiso: 'servicios:finalize' });
      }

      if (user?.permisos.includes('servicios:cancel')) {
        actions.push({ label: (<><RiMoneyDollarCircleLine /><span className="ml-1.5">Cancelar</span></>), onClick: async (r) => {
          if (!window.confirm(`¿Cancelar el registro #${r.id}?`)) return;
          alert('Funcionalidad no implementada aún');
        }, permiso: 'servicios:cancel' });
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
          <Grid size={{ xs: 8, md: 4 }} display={'flex'} flexGrow={1} alignItems={'center'} justifyContent={'end'}>
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
