import VentaForm from '../components/VentaForm';
import { postVenta } from '../../../services/ventas.services';
import { useNavigate } from 'react-router-dom';
import { successToast, errorToast } from '../../../utils/toast';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { RiProductHuntLine } from 'react-icons/ri';
import { useAuthStore } from '../../../store/useAuthStore';
import { useEffect } from 'react';

const VentaCreate = () => {
  const navigate = useNavigate();

  const auth = useAuthStore();

  const handleSubmit = async (payload:any) => {
    try {
      const usuarioId = auth.user?.id ?? payload.usuarioId ?? 0;
      const productos = (payload.productos || []).map((p: any) => ({ productoId: p.productoId, cantidad: p.cantidad, totalProducto: p.totalProducto }));
      const finalPayload = { ...payload, usuarioId, productos };
      const data = await postVenta(finalPayload);
      successToast('Venta creada');
      navigate('..');
    } catch (err:any) {
      errorToast(err.message || 'Error');
    }
  };

  const breadcrumbsData = [
    { label: 'Ventas', icon: <RiProductHuntLine fontSize="inherit" />, href: '/admin/ventas' },
    { label: 'Crear Venta', icon: <RiProductHuntLine fontSize="inherit" />, href: '/admin/ventas/create' },
  ];

  return (
    <>
      <BreadcrumbsRoutes items={breadcrumbsData} />
      <VentaForm onSubmit={handleSubmit} />
    </>
  );
};

export default VentaCreate;
