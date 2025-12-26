import React, { useEffect, useState } from 'react';
import TableCustom from '../../../components/Table/Table';
import { getIngresosEgresos, deleteIngresoEgreso, finalizarIngresoEgreso, cancelarIngresoEgreso } from '../../../services/ingresosEgresos.services';
import { Box, Grid, Fab, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';
import Search from '../../../components/utils/Search';
import { useAuthStore } from '../../../store/useAuthStore';
import { useGoTo } from '../../../hooks/useGoTo';
import AddIcon from '@mui/icons-material/Add';
import type { Column } from '../../../components/Table/Table';
import type { IngresosEgresosGetType } from '../../../types/ingresosEgresos.Type';
import { formatDate } from '../../../utils/formatDate';
import { successToast, errorToast } from '../../../utils/toast';
import { estados } from '../../../utils/estados';
import { PiDeviceTabletFill, PiUserCheckBold } from 'react-icons/pi';

const IngresosEgresosList = () => {
  const [items, setItems] = useState<IngresosEgresosGetType[]>([]);
  const [filteredItems, setFilteredItems] = useState<IngresosEgresosGetType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchCodigo, setSearchCodigo] = useState<string>('');
  const user = useAuthStore(state => state.user);
  const goTo = useGoTo();

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await getIngresosEgresos();
      setItems(res as IngresosEgresosGetType[]);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  useEffect(() => {
    if (searchCodigo.trim()) {
      const codigoTerm = searchCodigo.trim().toLowerCase();
      setFilteredItems(items.filter(i => String(i.id).toLowerCase().includes(codigoTerm)));
      return;
    }
    if (!searchTerm.trim()) { setFilteredItems(items); return; }
    const term = searchTerm.toLowerCase();
    setFilteredItems(items.filter(i =>
      String(i.id).toLowerCase().includes(term) ||
      (i.descripcion ?? '').toLowerCase().includes(term) ||
      (i.sucursal?.nombre ?? '').toLowerCase().includes(term)
    ));
  }, [searchTerm, searchCodigo, items]);

  const breadcrumbsData = [
    { label: 'Ingresos/Egresos', icon: <RiMoneyDollarCircleLine fontSize="inherit" />, href: '/admin/ingresos-egresos' },
  ];

  const chipColorByEstado = (id: number) => {
    switch (id) {
      case estados().enEspera: return 'warning';
      case estados().confirmado: return 'success';
      case estados().cancelado: return 'error';
      default: return 'primary';
    }
  };

  const getTableActions = () => {
    return (row: IngresosEgresosGetType) => {
      const isEnEspera = row.estadoId === estados().enEspera;
      const actions: { label: any; onClick: (r: IngresosEgresosGetType) => void; permiso: string }[] = [];

      if (!isEnEspera) {
        if (user?.permisos.includes('ingresos-egresos:detail')) {
          actions.push({ label: (<><PiDeviceTabletFill /><span className="ml-1.5">Detalle</span></>), onClick: (r) => goTo(`/admin/ingresos-egresos/${r.id}`), permiso: 'ingresos-egresos:detail' });
        }
        return actions;
      }
      if (user?.permisos.includes('ingresos-egresos:detail')) {
          actions.push({ label: (<><PiDeviceTabletFill /><span className="ml-1.5">Detalle</span></>), onClick: (r) => goTo(`/admin/ingresos-egresos/${r.id}`), permiso: 'ingresos-egresos:detail' });
        }
      if (user?.permisos.includes('ingresos-egresos:edit')) {
        actions.push({ label: (<><RiMoneyDollarCircleLine /><span className="ml-1.5">Editar</span></>), onClick: (r) => goTo(`/admin/ingresos-egresos/${r.id}/edit`), permiso: 'ingresos-egresos:edit' });
      }

      if (user?.permisos.includes('ingresos-egresos:finalize')) {
        actions.push({ label: (<><PiUserCheckBold /><span className="ml-1.5">Finalizar</span></>), onClick: async (r) => {
          if (!window.confirm(`¿Finalizar el registro #${r.id}?`)) return;
          try { await finalizarIngresoEgreso(r.id); successToast('Finalizado'); fetch(); } catch (err:any) { errorToast(err?.message ?? 'Error al finalizar'); }
        }, permiso: 'ingresos-egresos:finalize' });
      }

      if (user?.permisos.includes('ingresos-egresos:cancel')) {
        actions.push({ label: (<><RiMoneyDollarCircleLine /><span className="ml-1.5">Cancelar</span></>), onClick: async (r) => {
          if (!window.confirm(`¿Cancelar el registro #${r.id}?`)) return;
          try { await cancelarIngresoEgreso(r.id); successToast('Cancelado'); fetch(); } catch (err:any) { errorToast(err?.message ?? 'Error al cancelar'); }
        }, permiso: 'ingresos-egresos:cancel' });
      }

      return actions.filter(a => user?.permisos.includes(a.permiso));
    };
  };

  const getTableColumns = (): Column<IngresosEgresosGetType>[] => {
    const base: Column<IngresosEgresosGetType>[] = [
      { id: 'id', label: 'Codigo', minWidth: 50 },
      { id: 'descripcion', label: 'Descripción', minWidth: 150 },
      { id: 'monto', label: 'Monto', minWidth: 100 },
      { id: 'tipo', label: 'Tipo', minWidth: 100, format: (v) => v?.tipo ?? '' },
      { id: 'sucursal', label: 'Sucursal', minWidth: 150, format: (v) => v?.nombre ?? '' },
      { id: 'createdAt', label: 'Creado', minWidth: 120, format: (v) => formatDate(v as any) },
      { id: 'estado', label: 'Estado', minWidth: 120, format: (v:any) => <Chip variant='outlined' label={v?.estado ?? ''} color={chipColorByEstado(v?.id ?? 0)} /> },
    ];

    const actions = getTableActions();
    if (actions.length) base.push({ id: 'actions', label: 'Acciones', actions });
    return base;
  };

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={fetch} />;

  return (
    <>
      <BreadcrumbsRoutes items={breadcrumbsData} />
      <Grid container spacing={2} flexGrow={1} size={12} width="100%">
        <Grid flexGrow={1} container p={1} gap={2} justifyContent={{ sm: 'center', md: 'flex-end' }}>
          <Grid size={{ xs: 8, md: 2 }} display={'flex'} flexGrow={1} alignItems={'center'} justifyContent={'end'}>
            <Search onSearch={setSearchCodigo} placeholder="Buscar Por Codigo..." />
          </Grid>
          <Grid size={{ xs: 8, md: 2 }} display={'flex'} flexGrow={1} alignItems={'center'} justifyContent={'end'}>
            <Search onSearch={setSearchTerm} placeholder="Buscar ingresos/egresos..." />
          </Grid>
          {user?.permisos.includes('ingresos-egresos:create') && (
            <Grid size={{ xs: 1, md: 1 }} display={'flex'} flexGrow={1} alignItems={'center'} justifyContent={'end'}>
              <Fab size="small" color="primary" aria-label="add" onClick={() => goTo('/admin/ingresos-egresos/create')}>
                <AddIcon />
              </Fab>
            </Grid>
          )}
        </Grid>
        <Grid size={12}>
          <TableCustom<IngresosEgresosGetType> columns={getTableColumns()} rows={filteredItems} />
        </Grid>
      </Grid>
    </>
  );
};

export default IngresosEgresosList;
