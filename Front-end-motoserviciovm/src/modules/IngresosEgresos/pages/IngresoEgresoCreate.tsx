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
      const final = { ...payload };
      if (final.tipoId === tiposContabilidad().egreso && !final.moduloTallerId) {
        throw new Error('El campo Módulo Taller es obligatorio para Egresos');
      }
      if (final.tipoId === tiposContabilidad().ingreso) {
        final.moduloTallerId = null;
      }
      await postIngresoEgreso(final);
      successToast('Ingresos/Egreso creado');
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
