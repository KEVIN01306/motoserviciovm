import React, { useEffect, useState } from 'react';
import IngresosEgresosForm from '../components/IngresosEgresosForm';
import { getIngresoEgreso, putIngresoEgreso } from '../../../services/ingresosEgresos.services';
import { useParams, useNavigate } from 'react-router-dom';
import { successToast, errorToast } from '../../../utils/toast';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';

const IngresoEgresoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    { label: 'Ingresos/Egresos', icon: <RiMoneyDollarCircleLine fontSize="inherit" />, href: '/admin/ingresos-egresos' },
    { label: 'Editar', icon: <RiMoneyDollarCircleLine fontSize="inherit" />, href: `/admin/ingresos-egresos/${id}/edit` },
  ];

  const handleSubmit = async (payload:any) => {
    try {
      await putIngresoEgreso(Number(id), payload);
      successToast('Actualizado');
      navigate('..');
    } catch (err:any) { errorToast(err.message || 'Error'); }
  };

  return (
    <>
      <BreadcrumbsRoutes items={breadcrumbsData} />
      <IngresosEgresosForm initial={data} onSubmit={handleSubmit} submitLabel="Actualizar" />
    </>
  );
};

export default IngresoEgresoEdit;
