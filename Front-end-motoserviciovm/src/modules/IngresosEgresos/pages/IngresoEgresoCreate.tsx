import React from 'react';
import IngresosEgresosForm from '../components/IngresosEgresosForm';
import { postIngresoEgreso } from '../../../services/ingresosEgresos.services';
import { useNavigate } from 'react-router-dom';
import { successToast, errorToast } from '../../../utils/toast';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { useAuthStore } from '../../../store/useAuthStore';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';

const IngresoEgresoCreate = () => {
  const navigate = useNavigate();
  const auth = useAuthStore();

  const handleSubmit = async (payload:any) => {
    try {
      const final = { ...payload};
      await postIngresoEgreso(final);
      successToast('Ingresos/Egreso creado');
    } catch (err:any) {
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
      <IngresosEgresosForm onSubmit={handleSubmit} />
    </>
  );
};

export default IngresoEgresoCreate;
