import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import FormEstructure from '../../../components/utils/FormEstructure';
import { citaCreateSchema } from '../../../zod/cita.schema';
import { getCita, putCita } from '../../../services/citas.services';
import { useGoTo } from '../../../hooks/useGoTo';
import { successToast, errorToast } from '../../../utils/toast';
import InputsForm from '../components/InputsForm';

const CitasEdit = () => {
  const { id } = useParams();
  const goTo = useGoTo();

  const { register, handleSubmit, setValue, watch, formState, control } = useForm({ resolver: zodResolver(citaCreateSchema) as any });

  useEffect(() => { (async ()=>{ if (!id) return; try{ const c = await getCita(Number(id)); for (const k in c) { try{ setValue(k as any, (c as any)[k]); }catch(e){} } }catch(e){} })(); }, [id]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        descripcion: data.descripcion ?? '',
        fechaCita: data.fechaCita,
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
      <FormEstructure handleSubmit={handleSubmit(onSubmit)}>
        <InputsForm register={register} control={control} watch={watch} setValue={setValue} errors={formState.errors as any} />
        <button type='submit' disabled={formState.isSubmitting}>Guardar</button>
      </FormEstructure>
    </>
  );
};

export default CitasEdit;
