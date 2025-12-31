import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, CardContent, Box, Typography, Divider, Grid } from '@mui/material';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { RiToolsLine } from 'react-icons/ri';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';
import { getServicio } from '../../../services/servicios.services';
import type { ServicioGetType, ServicioItemType } from '../../../types/servicioType';
import ProductsTable from '../../../components/Table/ProductsTable';
import { formatDate } from '../../../utils/formatDate';
import type { VentaProductoGetType } from '../../../types/ventaType';

const ServicioDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<ServicioGetType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await getServicio(id);
      setData(res);
    } catch (err: any) {
      setError(err?.message ?? 'Error cargando servicio');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={fetch} />;
  if (!data) return <ErrorCard errorText={'Servicio no encontrado'} restart={fetch} />;

  const breadcrumbs = [
    { label: 'Servicios', href: '/admin/servicios', icon: <RiToolsLine fontSize="inherit" /> },
    { label: `Servicio #${data.id}`, icon: <RiToolsLine fontSize="inherit" /> },
  ];

  return (
    <>
      <BreadcrumbsRoutes items={breadcrumbs} />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{`Servicio #${data.id}`}</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Descripción</Typography><Typography>{data.descripcion}</Typography></Box>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Fecha Entrada</Typography><Typography>{formatDate(data.fechaEntrada as any)}</Typography></Box>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Fecha Salida</Typography><Typography>{data.fechaSalida ? formatDate(data.fechaSalida as any) : '-'}</Typography></Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Mecánico</Typography><Typography>{data.mecanico.primerNombre + " " +  data.mecanico.primerApellido ?? '-'}</Typography></Box>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Cliente</Typography><Typography>{(data.cliente?.primerNombre + " " + data.cliente?.primerApellido )?? '-'}</Typography></Box>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Total</Typography><Typography>{data.total ?? '-'}</Typography></Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>Productos del cliente</Typography>
            <ProductsTable
              columns={[
                { id: 'nombre', label: 'Nombre', minWidth: 180, format: (v:any) => v ?? '' },
                { id: 'cantidad', label: 'Cantidad', minWidth: 80, align: 'center', format: (v:any) => String(v) }
              ] as any}
              rows={data.productosCliente ?? []}
              headerColor="#1565c0"
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>Inventario</Typography>
            <ProductsTable
              columns={[
                { id: 'itemName', label: 'Inventario', minWidth: 120, format: (v:any) => v ?? '' },
                { id: 'checked', label: 'Presente', minWidth: 80, align: 'center', format: (v:any) => v ? 'Sí' : 'No' },
                { id: 'itemDescripcion', label: 'Descripción', minWidth: 180, format: (v:any) => v ?? '' },
                { id: 'notas', label: 'Notas', minWidth: 180, format: (v:any) => v ?? '' },
              ] as any}
              rows={data.servicioItems ?? []}
              headerColor="#1565c0"
            />

            <Typography variant="h4" textAlign={'center'} mt={3} gutterBottom>VENTAS</Typography>
            {
              data.ventas?.length === 0 ? (
                <Typography>No hay ventas asociadas a este servicio.</Typography>
              ) : (
                data.ventas?.map((venta) => (
                  <Box key={venta.id} sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>{`Venta #${venta.id}`}</Typography>
                    <ProductsTable
                    columns={[
                      { id: 'producto', label: 'Producto', minWidth: 120, format: (v:any, row: VentaProductoGetType) => row.producto?.nombre ?? '' },
                      { id: 'precio', label: 'Precio', minWidth: 100, align: 'right', format: (_v:any, row: VentaProductoGetType) => `Q ${Number(row.producto?.precio ?? 0).toFixed(2)}` },
                      { id: 'cantidad', label: 'Cantidad', minWidth: 80, align: 'center', format: (v:any) => String(v) },
                      { id: 'totalProducto', label: 'Total', minWidth: 100, align: 'right', format: (v:any) => `Q ${Number(v).toFixed(2)}` },
                    ] as any}
                    rows={venta.productos ?? []}
                    headerColor="#1565c0"
                      />
                  </Box>
                ))
              )
            }
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default ServicioDetail;
