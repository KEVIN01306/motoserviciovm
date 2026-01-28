import { useEffect, useState } from 'react';
import VentaForm from '../components/VentaForm';
import { getVenta, putVenta } from '../../../services/ventas.services';
import { useParams } from 'react-router-dom';
import { successToast, errorToast } from '../../../utils/toast';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { RiProductHuntLine } from 'react-icons/ri';
import { useAuthStore } from '../../../store/useAuthStore';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';
import { useGoTo } from '../../../hooks/useGoTo';
import { mergeVentaDataWithDefaults, type VentaProductoType } from '../../../types/ventaType';

const VentaEdit = () => {
  const { id } = useParams();
  const goTo = useGoTo();
  const auth = useAuthStore();
  const [initial, setInitial] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getVenta(Number(id));
        setInitial(data as any);
      } catch (e: any) {
        setError(e.message || 'Error cargando venta');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (payload:any) => {
    try {
        console.log('Submitting venta edit with payload:', payload);
      const usuarioId = auth.user?.id ?? payload.usuarioId ?? 0;
      const productos = (payload.productos || []).map((p: VentaProductoType) => ({ productoId: p.productoId, cantidad: p.cantidad, totalProducto: p.totalProducto,descuento: p.descuento }));
      const finalPayload = { ...payload, usuarioId, productos };
        console.log('Submitting venta edit with payload:', finalPayload);

      await putVenta(Number(id), finalPayload);
      successToast('Venta actualizada');
      goTo('/admin/ventas');
    } catch (err:any) {
      errorToast(err.message || 'Error');
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={() => { if (id) getVenta(Number(id)); }} />;
  if (!initial) return null;

  const breadcrumbsData = [
    { label: 'Ventas', icon: <RiProductHuntLine fontSize="inherit" />, href: '/admin/ventas' },
    { label: 'Editar', icon: <RiProductHuntLine fontSize="inherit" /> },
  ];

  const initialFormatted = {
    ...(mergeVentaDataWithDefaults(initial as any) as any),
    usuario: initial?.usuario ?? null,
    productos: initial?.productos ?? [],
  };

  return (
    <>
      <BreadcrumbsRoutes items={breadcrumbsData} />
      <VentaForm initial={initialFormatted as any} onSubmit={handleSubmit} submitLabel="Actualizar venta" />
    </>
  );
};

export default VentaEdit;
