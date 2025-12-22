import React from 'react';
import { Container, Card, CardContent } from '@mui/material';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { RiToolsLine } from 'react-icons/ri';
import ServicioForm from '../components/ServicioForm';
import { postServicio } from '../../../services/servicios.services';
import { useGoTo } from '../../../hooks/useGoTo';
import { useAuthStore } from '../../../store/useAuthStore';
import { successToast, errorToast } from '../../../utils/toast';

const ServicioCreate = () => {
  const goTo = useGoTo();
  const user = useAuthStore(s => s.user);
  const [draft, setDraft] = React.useState<any | null>(null);

  React.useEffect(() => {
    const raw = localStorage.getItem('servicio.create.draft');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // ask user if they want to continue with draft
        if (window.confirm('Hay un borrador guardado. ¿Deseas continuar con los datos guardados?')) {
          setDraft(parsed);
        } else {
          localStorage.removeItem('servicio.create.draft');
        }
      } catch (e) { console.error(e); }
    }
  }, []);

  const handleSubmit = async (payload: any) => {
    try {
      // set mecanicoId as logged user
      const mecanicoId = user?.id ?? 0;
      const body = { ...payload, mecanicoId };
      await postServicio(body);
      successToast('Servicio creado');
      goTo('/admin/servicios');
    } catch (err: any) {
      errorToast(err?.message ?? 'Error al crear');
    }
  };

  const breadcrumbs = [
    { label: 'Servicios', href: '/admin/servicios', icon: <RiToolsLine fontSize="inherit" /> },
    { label: 'Crear Servicio', icon: <RiToolsLine fontSize="inherit" /> }
  ];

  return (
    <>
      <BreadcrumbsRoutes items={breadcrumbs} />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Card>
          <CardContent>
            <ServicioForm onSubmit={handleSubmit} initial={draft ?? undefined} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default ServicioCreate;
