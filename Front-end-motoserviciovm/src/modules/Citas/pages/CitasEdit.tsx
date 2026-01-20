import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';
import { zodResolver } from '@hookform/resolvers/zod';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import FormEstructure from '../../../components/utils/FormEstructure';
import { citaCreateSchema } from '../../../zod/cita.schema';
import { getCita, putCita } from '../../../services/citas.services';
import { mergeCitaDataWithDefaults } from '../../../types/citaType';
import { useGoTo } from '../../../hooks/useGoTo';
import { successToast, errorToast } from '../../../utils/toast';
import InputsForm from '../components/InputsForm';

const CitasEdit = () => {
  const { id } = useParams();
  const goTo = useGoTo();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<string[] | null>(null);

  const { register, handleSubmit, setValue, watch, formState, control, reset } = useForm({ resolver: zodResolver(citaCreateSchema) as any });
  

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        setLoading(true);
        const c = await getCita(Number(id));
        const dataFormat = mergeCitaDataWithDefaults(c as any);
        reset(dataFormat as any);
        setError(null);
      } catch (e:any) {
        console.error(e);
        setError(e?.message ?? 'Error cargando cita');
      } finally { setLoading(false); }
    })();
  }, [id]);

  const onSubmit = async (data: any) => {
    try {
      setServerErrors(null);
      const payload = {
        descripcion: data.descripcion ?? '',
        fechaCita: data.fechaCita,
        dpiNit: data.dpiNit,
        horaCita: data.horaCita,
        nombreContacto: data.nombreContacto,
        telefonoContacto: data.telefonoContacto,
        sucursalId: data.sucursalId ? Number(data.sucursalId) : undefined,
        tipoServicioId: data.tipoServicioId ? Number(data.tipoServicioId) : undefined,
        placa: data.placa ?? '',
        estadoId: data.estadoId ?? 1,
      };
      await putCita(Number(id), payload);
      successToast('Cita actualizada');
      goTo('/admin/citas');
    } catch (e:any) { errorToast(e?.message ?? 'Error actualizando cita'); }
  };

  return (
    <>
      <BreadcrumbsRoutes items={[{ label: 'Citas', href: '/admin/citas' }, { label: 'Editar' }]} />
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorCard errorText={error} restart={() => { setError(null); /* refetch */ const idn = id; if (idn) { (async ()=>{ setLoading(true); try{ const c = await getCita(Number(idn)); reset(c as any); setError(null);}catch(e:any){ setError(e?.message);} finally{ setLoading(false);} })(); } }} />
      ) : (
        <FormEstructure handleSubmit={handleSubmit(onSubmit)}>
          {serverErrors && serverErrors.length>0 && (<ErrorCard errorText={serverErrors.join('; ')} restart={() => setServerErrors(null)} />)}
          <InputsForm register={register} control={control} watch={watch} setValue={setValue} errors={formState.errors as any} />
          <Button type='submit' variant='contained' disabled={formState.isSubmitting}>{formState.isSubmitting ? 'Guardando...' : 'Guardar'}</Button>
        </FormEstructure>
      )}
    </>
  );
};

export default CitasEdit;
