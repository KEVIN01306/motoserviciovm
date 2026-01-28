import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIngresoEgreso, finalizarIngresoEgreso, cancelarIngresoEgreso } from '../../../services/ingresosEgresos.services';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { Box, Button, Paper } from '@mui/material';
import { successToast, errorToast } from '../../../utils/toast';
import { useAuthStore } from '../../../store/useAuthStore';
import { estados } from '../../../utils/estados';

const IngresoEgresoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);

  const fetch = async () => {
    try {
      setLoading(true);
      if (!id) throw new Error('No id');
      const res = await getIngresoEgreso(Number(id));
      setData(res);
    } catch (e:any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={fetch} />;

  const breadcrumbsData = [
    { label: 'Ingresos/Egresos', icon: <RiMoneyDollarCircleLine fontSize="inherit" />, href: '..' },
    { label: `Detalle ${data.id}`, icon: <RiMoneyDollarCircleLine fontSize="inherit" />, href: `/admin/ingresos-egresos/${id}` },
  ];

  const doFinalize = async () => {
    try {
      await finalizarIngresoEgreso(Number(id));
      successToast('Finalizado');
      fetch();
    } catch (e:any) { errorToast(e.message || 'Error'); }
  };

  const doCancel = async () => {
    try {
      await cancelarIngresoEgreso(Number(id));
      successToast('Cancelado');
      fetch();
    } catch (e:any) { errorToast(e.message || 'Error'); }
  };

  return (
    <>
      <BreadcrumbsRoutes items={breadcrumbsData} />
      <Paper sx={{ p: 2, width: '100%' }}>
        <Box>Id: {data.id}</Box>
        <Box>Descripción: {data.descripcion}</Box>
        <Box>Monto: {data.monto}</Box>
        <Box>Tipo: {data.tipo?.tipo}</Box>
        <Box>Sucursal: {data.sucursal?.nombre}</Box>
        <Box>Estado: {data.estado?.estado}</Box>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={() => navigate('..')}>Volver</Button>
          {
            user?.permisos.includes('ingresos-egresos:finalize') && data.estadoId === estados().enEspera && (
              <Button variant="contained" color="success" onClick={doFinalize}>Finalizar</Button>
            )
          }
          {
            user?.permisos.includes('ingresos-egresos:cancel') && data.estadoId === estados().enEspera && (
              <Button variant="contained" color="error" onClick={doCancel}>Cancelar</Button>
            )
          }
          {
            user?.permisos.includes('ingresos-egresos:edit') && data.estadoId === estados().enEspera && (
              <Button variant="contained" color="primary" onClick={() => navigate(`../${data.id}/edit`)}>Editar</Button>
            )
          }
        </Box>
      </Paper>
    </>
  );
};

export default IngresoEgresoDetail;
