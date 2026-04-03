import { useRef } from 'react';
import IngresosEgresosForm from '../components/IngresosEgresosForm';
import { postIngresoEgreso } from '../../../services/ingresosEgresos.services';
import { successToast, errorToast } from '../../../utils/toast';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { tiposContabilidad } from '../../../utils/tiposContabilidad';

const IngresoEgresoCreate = () => {
  const formRef = useRef<any>(null);

  const handleSubmit = async (payload: any) => {
  try {
    const final = { 
      ...payload,
      moduloTallerId: payload.moduloTallerId ? Number(payload.moduloTallerId) : null,
      tipoId: Number(payload.tipoId)
    };

    if (final.tipoId === tiposContabilidad().egreso && !final.moduloTallerId) {
      errorToast('El campo Módulo es obligatorio para Egresos');
      return;
    }

    await postIngresoEgreso(final);
    successToast('Creado con éxito');

    if (formRef.current) {
      formRef.current.reset();
    }
  } catch (err: any) {
    errorToast(err.message || 'Error');
  }
};
  const breadcrumbsData = [
    { label: 'Ingresos/Egresos', icon: <RiMoneyDollarCircleLine fontSize="inherit" />, href: '/admin/ingresos-egresos' },
    { label: 'Crear', icon: <RiMoneyDollarCircleLine fontSize="inherit" />, href: '/admin/ingresos-egresos/create' },
  ];

  return (
    <>
      <BreadcrumbsRoutes items={breadcrumbsData} />
      <IngresosEgresosForm ref={formRef} onSubmit={handleSubmit} />
    </>
  );
};

export default IngresoEgresoCreate;
