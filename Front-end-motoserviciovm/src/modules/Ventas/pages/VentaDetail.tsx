import { useEffect, useState } from 'react';
import { cancelarVenta, finalizarVenta, getVenta } from '../../../services/ventas.services';
import { useParams } from 'react-router-dom';
import { Box, Typography, Divider, Button, Container, Card, CardContent, Grid, Chip } from '@mui/material';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { RiProductHuntLine } from 'react-icons/ri';
import { formatDate } from '../../../utils/formatDate';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';
import { useAuthStore } from '../../../store/useAuthStore';
import { useGoTo } from '../../../hooks/useGoTo';
import ProductsTable from '../../../components/Table/ProductsTable';
import type { VentaProductoGetType, VentaGetType } from '../../../types/ventaType';
import { estados } from '../../../utils/estados';
import LinkStylesNavigate from '../../../components/utils/links';

const VentaDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<VentaGetType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);
  const goTo = useGoTo();
  const userlogged = useAuthStore(state => state.user);

  const getVentaOne = async () => {
    try {
      setLoading(true);
      const response = await getVenta(Number(id));
      setData(response);
    } catch (err: any) {
      setError(err.message || 'Error cargando venta');
    } finally {
      setLoading(false);
    }
  };


  const chipColorByEstado = (id: number) => {
    switch (id) {
      case estados().enEspera:
        return "warning";
      case estados().confirmado:
        return "success";
      case estados().cancelado:
        return "error";
      default:
        return "primary";
    }
  };

  useEffect(() => { getVentaOne(); }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={getVentaOne} />;
  if (!data) return <ErrorCard errorText="Venta no encontrada" restart={getVentaOne} />;

  const breadcrumbsData = [
    { label: 'Ventas', icon: <RiProductHuntLine fontSize="inherit" />, href: '/admin/ventas' },
    { label: `Venta #${data.id}`, icon: <RiProductHuntLine fontSize="inherit" /> },
  ];


  return (
    <>
      <BreadcrumbsRoutes items={breadcrumbsData} />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                {`Venta #${data.id}`}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ minWidth: 120, color: '#6b7280', fontWeight: 600 }}>Vendedor</Typography>
                    <LinkStylesNavigate
                      label={
                        data.usuario
                          ? `${data.usuario.primerNombre} ${data.usuario.primerApellido ?? ''}`.trim()
                          : '-'
                      }
                      onClick={() => goTo(`/admin/users/${data.usuario?.id}`)}
                      variant="body1"
                    />                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ minWidth: 120, color: '#6b7280', fontWeight: 600 }}>Fecha</Typography>
                    <Typography>{formatDate(data.createdAt as any)}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ minWidth: 120, color: '#6b7280', fontWeight: 600 }}>Sucursal</Typography>
                    <Typography>{data.sucursal.nombre ?? '-'}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ minWidth: 120, color: '#6b7280', fontWeight: 600 }}>Total</Typography>
                    <Typography>{data.total}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ minWidth: 120, color: '#6b7280', fontWeight: 600 }}>Estado</Typography>
                    <Typography><Chip variant='outlined' label={data.estado?.estado ?? ''} color={chipColorByEstado(data.estadoId ?? 0)} /></Typography>
                  </Box>
                  {
                    data.servicioId && (
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography sx={{ minWidth: 120, color: '#6b7280', fontWeight: 600 }}>Servicio</Typography>
                        <LinkStylesNavigate label={String(data.servicioId) ?? '-'} onClick={() => goTo(`/admin/servicios/${data.servicioId}`)} variant="body1" />
                      </Box>
                    )
                  }
                  {data.reparacionId && (
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Typography sx={{ minWidth: 120, color: '#6b7280', fontWeight: 600 }}>Reparación</Typography>
                      <LinkStylesNavigate label={String(data.reparacionId) ?? '-'} onClick={() => goTo(`/admin/enreparacion/${data.reparacionId}`)} variant="body1" />
                    </Box>
                  )
                  }

                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>Productos</Typography>
            <ProductsTable
              columns={[
                { id: 'producto', label: 'Producto', minWidth: 180, format: (_: any, row: VentaProductoGetType) => row.producto?.nombre ?? '' },
                { id: 'precio', label: 'Precio', minWidth: 100, align: 'right', format: (_v: any, row: VentaProductoGetType) => `Q ${Number(row.producto?.precio ?? 0).toFixed(2)}` },
                { id: 'cantidad', label: 'Cantidad', minWidth: 80, align: 'center', format: (v: any) => String(v) },
                { id: 'totalProducto', label: 'Total', minWidth: 100, align: 'right', format: (v: any) => `Q ${Number(v ?? 0).toFixed(2)}` },
              ] as any}
              rows={data.productos ?? []}
              headerColor="#1565c0"
            />

            <Divider sx={{ my: 3 }} />
            <Grid container spacing={2}>
              {
                userlogged?.permisos.includes('ventas:cancel') && data.estadoId === estados().enEspera && (
                  <Grid size={{ xs: 5, md: 2 }} textAlign="center">
                    <Button variant="outlined" color="error" onClick={async () => {
                      if (!window.confirm(`¿Cancelar la venta #${data.id}?`)) return;
                      try {
                        await cancelarVenta(data.id ? data.id : 0);
                        alert('Venta cancelada');
                        getVentaOne();
                      } catch (err: any) {
                        alert(err?.message ?? 'Error al cancelar');
                      }
                    }}>Cancelar</Button>
                  </Grid>
                )
              }
              {
                userlogged?.permisos.includes('ventas:finalize') && data.estadoId === estados().enEspera && (
                  <Grid size={{ xs: 5, md: 2 }} textAlign="center">
                    <Button variant="outlined" color="success" onClick={async () => {
                      if (!window.confirm(`¿Finalizar la venta #${data.id}?`)) return;
                      try {
                        await finalizarVenta(data.id ? data.id : 0);
                        alert('Venta finalizada');
                        getVentaOne();
                      } catch (err: any) {
                        alert(err?.message ?? 'Error al finalizar');
                      }
                    }}>Finalizar</Button>
                  </Grid>
                )
              }
              {userlogged?.permisos.includes('ventas:edit') && data.estadoId === estados().enEspera && (
                <Grid size={{ xs: 5, md: 2 }} textAlign="center">
                  <Button variant="contained" onClick={() => goTo(String('edit'))}>Editar</Button>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default VentaDetail;
