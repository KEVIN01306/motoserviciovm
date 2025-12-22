import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, CardContent } from '@mui/material';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { RiToolsLine } from 'react-icons/ri';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';
import ServicioForm from '../components/ServicioForm';
import { getServicio, putServicio } from '../../../services/servicios.services';
import { useGoTo } from '../../../hooks/useGoTo';
import { successToast, errorToast } from '../../../utils/toast';

const ServicioEdit = () => {
  const { id } = useParams();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const goTo = useGoTo();

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await getServicio(id);
      setData(res);
    } catch (err: any) {
      setError(err?.message ?? 'Error cargando servicio');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [id]);

  const handleSubmit = async (payload: any) => {
    try {
      await putServicio(id, payload);
      successToast('Servicio actualizado');
      goTo('/admin/servicios');
    } catch (err: any) {
      errorToast(err?.message ?? 'Error al actualizar');
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={fetch} />;
  if (!data) return <ErrorCard errorText={'Servicio no encontrado'} restart={fetch} />;

  const breadcrumbs = [
    { label: 'Servicios', href: '/admin/servicios', icon: <RiToolsLine fontSize="inherit" /> },
    { label: `Editar Servicio #${data.id}`, icon: <RiToolsLine fontSize="inherit" /> },
  ];

  return (
    <>
      <BreadcrumbsRoutes items={breadcrumbs} />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Card>
          <CardContent>
            <ServicioForm initial={data} onSubmit={handleSubmit} submitLabel="Actualizar" />
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default ServicioEdit;
