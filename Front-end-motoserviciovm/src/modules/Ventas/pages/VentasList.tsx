import React, { useEffect, useState } from 'react';
import { Box, Chip, Fab, Grid } from '@mui/material';
import TableCustom from '../../../components/Table/Table';
import { getVentas } from '../../../services/ventas.services';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { RiEdit2Line, RiProductHuntLine } from 'react-icons/ri';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';
import Search from '../../../components/utils/Search';
import { useAuthStore } from '../../../store/useAuthStore';
import { useGoTo } from '../../../hooks/useGoTo';
import AddIcon from '@mui/icons-material/Add';
import type { Column } from '../../../components/Table/Table';
import { formatDate } from '../../../utils/formatDate';
import type { VentaGetType } from '../../../types/ventaType';
import { PiDeviceTabletFill, PiUserCheckBold } from 'react-icons/pi';
import type { EstadoType } from '../../../types/estadoType';
import { estados } from '../../../utils/estados';
import { cancelarVenta, finalizarVenta } from '../../../services/ventas.services';
import { successToast, errorToast } from '../../../utils/toast';

const VentasList = () => {
  const [items, setItems] = useState<VentaGetType[]>([]);
  const [filteredItems, setFilteredItems] = useState<VentaGetType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchCodigo, setSearchCodigo] = useState<string>('');
  const user = useAuthStore(state => state.user);
  const goTo = useGoTo();

  const fetch = async () => {
    try {
      setLoading(true);
      const v = await getVentas();
      setItems(v as VentaGetType[]);
    } catch (err: any) {
      setError(err.message || 'Error cargando ventas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  useEffect(() => {
    // If searchCodigo has value, filter only by codigo (id) and return.
    if (searchCodigo.trim()) {
      const codigoTerm = searchCodigo.trim().toLowerCase();
      setFilteredItems(items.filter(i => String(i.id).toLowerCase().includes(codigoTerm)));
      return;
    }

    // Otherwise, if searchTerm is empty show all items.
    if (!searchTerm.trim()) {
      setFilteredItems(items);
      return;
    }

    const term = searchTerm.toLowerCase();
    setFilteredItems(items.filter(i =>
      String(i.id).toLowerCase().includes(term) ||
      (i.usuario?.primerNombre ?? '').toLowerCase().includes(term) ||
        (i.estado?.estado ?? '').toLowerCase().includes(term)
    ));
  }, [searchTerm, searchCodigo, items]);

  const breadcrumbsData = [
    { label: 'Ventas', icon: <RiProductHuntLine fontSize="inherit" />, href: '/admin/ventas' },
  ];

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

  const getTableActions = () => {
    // return a function so Table can compute actions per row
    return (row: VentaGetType) => {
      const isEnEspera = row.estadoId === estados().enEspera;
      const actions: { label: any; onClick: (r: VentaGetType) => void; permiso: string }[] = [];

      // if not en espera -> only detail
      if (!isEnEspera) {
        if (user?.permisos.includes('ventas:detail')) {
          actions.push({ label: (<><PiDeviceTabletFill /><span className="ml-1.5">Detalle</span></>), onClick: (r) => goTo(`/admin/ventas/${r.id}`), permiso: 'ventas:detail' });
        }
        return actions;
      }

      // en espera: allow edit, finalize, cancel, detail based on permissions
      if (user?.permisos.includes('ventas:edit')) {
        actions.push({ label: (<><RiEdit2Line /><span className="ml-1.5">Editar</span></>), onClick: (r) => goTo(`/admin/ventas/${r.id}/edit`), permiso: 'ventas:edit' });
      }

      if (user?.permisos.includes('ventas:finalize')) {
        actions.push({ label: (<><PiUserCheckBold /><span className="ml-1.5">Finalizar</span></>), onClick: async (r) => {
          if (!window.confirm(`¿Finalizar la venta #${r.id}?`)) return;
          try {
            await finalizarVenta(r.id);
            successToast('Venta finalizada');
            fetch();
          } catch (err: any) {
            errorToast(err?.message ?? 'Error al finalizar');
          }
        }, permiso: 'ventas:finalize' });
      }

      if (user?.permisos.includes('ventas:cancel')) {
        actions.push({ label: (<><RiProductHuntLine /><span className="ml-1.5">Cancelar</span></>), onClick: async (r) => {
          if (!window.confirm(`¿Cancelar la venta #${r.id}?`)) return;
          try {
            await cancelarVenta(r.id);
            successToast('Venta cancelada');
            fetch();
          } catch (err: any) {
            errorToast(err?.message ?? 'Error al cancelar');
          }
        }, permiso: 'ventas:cancel' });
      }

      if (user?.permisos.includes('ventas:detail')) {
        actions.push({ label: (<><PiDeviceTabletFill /><span className="ml-1.5">Detalle</span></>), onClick: (r) => goTo(`/admin/ventas/${r.id}`), permiso: 'ventas:detail' });
      }

      return actions.filter(a => user?.permisos.includes(a.permiso));
    };
  };

  const getTableColumns = (): Column<VentaGetType>[] => {
    const base: Column<VentaGetType>[] = [
        { id: 'id', label: 'Codigo', minWidth: 50},
        { id: 'usuario', label: 'Usuario', minWidth: 150, format: (v) => v?.primerNombre ?? '' },
        { id: 'estado', label: 'Estado', minWidth: 100, format: (v: EstadoType) => <Chip variant='outlined' label={v?.estado ?? ''} color={chipColorByEstado(v?.id ?? 0)} /> },
      { id: 'total', label: 'Total', minWidth: 100 },
      { id: 'createdAt', label: 'Creado', minWidth: 120, format: (v) => formatDate(v as any) },
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
            <Search onSearch={setSearchTerm} placeholder="Buscar ventas..." />
          </Grid>
          {user?.permisos.includes('ventas:create') && (
            <Grid size={{ xs: 1, md: 1 }} display={'flex'} flexGrow={1} alignItems={'center'} justifyContent={'end'}>
              <Fab size="small" color="primary" aria-label="add" onClick={() => goTo('/admin/ventas/create')}>
                <AddIcon />
              </Fab>
            </Grid>
          )}
        </Grid>
        <Grid size={12}>
          <TableCustom<VentaGetType> columns={getTableColumns()} rows={filteredItems} />
        </Grid>
      </Grid>
    </>
  );
};

export default VentasList;
