import React, { useEffect, useState } from 'react';
import { Grid, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { RiToolsLine } from 'react-icons/ri';
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

  const columns = (): Column<ServicioGetType>[] => {
    const base: Column<ServicioGetType>[] = [
      { id: 'id', label: 'ID', minWidth: 60 },
      { id: 'descripcion', label: 'Descripción', minWidth: 220 },
      { id: 'moto', label: 'Moto', minWidth: 120, format: (v) => v?.placa ?? '-' },
      { id: 'total', label: 'Total', minWidth: 120 },
      { id: 'createdAt', label: 'Creado', minWidth: 160, format: (v) => formatDate(v as any) },
    ];
    return base;
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
