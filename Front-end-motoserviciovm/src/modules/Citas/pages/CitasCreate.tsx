import { useEffect, useState } from 'react';
import { Grid, Button } from '@mui/material';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import FormEstructure from '../../../components/utils/FormEstructure';
import { citaCreateSchema } from '../../../zod/cita.schema';
import { CitaInitialState } from '../../../types/citaType';
import { postCita } from '../../../services/citas.services';
import { successToast, errorToast } from '../../../utils/toast';
import { useGoTo } from '../../../hooks/useGoTo';
import InputsForm from '../components/InputsForm';

const CitasCreate = () => {
  const goTo = useGoTo();

  const { register, handleSubmit, control, formState, setValue, watch } = useForm({
    resolver: zodResolver(citaCreateSchema) as any,
    defaultValues: CitaInitialState as any,
  });
  const { isSubmitting } = formState;
  const [serverErrors, setServerErrors] = useState<string[] | null>(null);

  const onSubmit = async (data: any) => {
    try {
      setServerErrors(null);
      const payload = {
        descripcion: data.descripcion ?? '',
        fechaCita: data.fechaCita,
        horaCita: data.horaCita,
        dpiNit: data.dpiNit,
        nombreContacto: data.nombreContacto,
        telefonoContacto: data.telefonoContacto,
        sucursalId: data.sucursalId ? Number(data.sucursalId) : undefined,
        tipoServicioId: data.tipoServicioId ? Number(data.tipoServicioId) : undefined,
        placa: data.placa ?? '',
        estadoId: data.estadoId ?? 1,
      };
      console.log('POST /citas payload:', payload);
      await postCita(payload);
      successToast('Cita creada');
      goTo('/admin/citas');
    } catch (e: any) {
      console.error('Error creating cita:', e);
      // intentar extraer errores de validación
      const errs = e?.errors ?? e?.response?.data?.errors ?? null;
      if (Array.isArray(errs) && errs.length>0) setServerErrors(errs.map((x:any)=>String(x)));
      else setServerErrors([e?.message ?? 'Error creando cita']);
      errorToast(e?.message ?? 'Error creando cita');
    }
  };

  return (
    <>
      <BreadcrumbsRoutes items={[{ label: 'Citas', href: '/admin/citas' }, { label: 'Crear' }]} />
      <FormEstructure handleSubmit={handleSubmit(onSubmit)}>
        {serverErrors && serverErrors.length>0 && (
          <Grid size={12}><ErrorCard errorText={serverErrors.join('; ')} restart={() => setServerErrors(null)} /></Grid>
        )}
        <InputsForm register={register} control={control} watch={watch} setValue={setValue} errors={formState.errors as any} />
        <Grid size={12}>
          <Button type='submit' variant='contained' disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Crear Cita'}</Button>
        </Grid>
      </FormEstructure>
    </>
  );
};

export default CitasCreate;
