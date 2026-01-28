import { useState } from 'react';
import { Container } from '@mui/material';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { RiToolsLine } from 'react-icons/ri';
import ServicioForm from '../components/ServicioForm';
import { postServicio } from '../../../services/servicios.services';
import { useGoTo } from '../../../hooks/useGoTo';
import { successToast, errorToast } from '../../../utils/toast';

const ServicioCreate = () => {
  const goTo = useGoTo();
  const [draft, ] = useState<any | null>(null);
  const [seHaranVentas,setSeHaranVentas]=useState<boolean>(false);

  const changeSeHaranVentas = (value: boolean) => {
    setSeHaranVentas(value);
  }
 /*
  useEffect(() => {
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

  */

  const handleSubmit = async (payload: any) => {
    try {
      const body = { ...payload };
      console.log('Creating servicio with data:', body);
      const response = await postServicio(body);
      successToast('Servicio creado');
      if (seHaranVentas) {
        goTo('/admin/ventas/create?servicioId=' +( response.id ?? ''));
      }else{
        goTo('/admin/servicios');
      }
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
      <Container sx={{width: '100%', display: 'flex' , justifyContent: 'center'}} >
            <ServicioForm onSubmit={handleSubmit} initial={draft ?? undefined} seHaranVentas={seHaranVentas} changeSeHaranVentas={changeSeHaranVentas} />
      </Container>
    </>
  );
};

export default ServicioCreate;
