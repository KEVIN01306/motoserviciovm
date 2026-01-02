import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Container, Card, CardContent, Box, Typography, Divider, Grid, Chip, Fab, Avatar } from '@mui/material';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { RiToolsLine } from 'react-icons/ri';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';
import { getServicio } from '../../../services/servicios.services';
import type { ServicioGetType, ServicioItemType } from '../../../types/servicioType';
import ProductsTable from '../../../components/Table/ProductsTable';
import { formatDate } from '../../../utils/formatDate';
import type { VentaProductoGetType } from '../../../types/ventaType';
import { estados } from '../../../utils/estados';
import { useGoTo } from '../../../hooks/useGoTo';
import LinkStylesNavigate from '../../../components/utils/links';
import { exportarAPDF } from '../../../utils/exportarPdf';
import { ExposureTwoTone } from '@mui/icons-material';
import { PiExportDuotone } from 'react-icons/pi';

const API_URL = import.meta.env.VITE_DOMAIN;

const ServicioDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<ServicioGetType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const goTo = useGoTo();
  const { hash } = useLocation();

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

  
  useEffect(() => {
    // Solo intentamos el scroll si no estamos cargando, hay data y hay un hash
    if (!loading && data && hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      
      if (element) {
        // Un pequeño delay de 100ms asegura que Material UI terminó de pintar
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [loading, data, hash]);

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={fetch} />;
  if (!data) return <ErrorCard errorText={'Servicio no encontrado'} restart={fetch} />;

  const breadcrumbs = [
    { label: 'Servicios', href: '/admin/servicios', icon: <RiToolsLine fontSize="inherit" /> },
    { label: `Servicio #${data.id}`, icon: <RiToolsLine fontSize="inherit" /> },
  ];

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

  const totalServicio =( data.ventas?.reduce((acc, venta) => acc + (venta.total || 0), 0) || 0) + (data.total || 0);

  const dataTableTotales = [
    { label: 'Total Servicio', value: `Q ${data.total?.toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}) ?? '0.00'}` },
    { label: 'Total Ventas', value: `Q ${data.ventas?.reduce((acc, venta) => acc + (venta.total || 0), 0).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}) ?? '0.00'}` },
    { label: 'Gran Total', value: `Q ${totalServicio.toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2})}` },
  ]
  
  return (
    <>
      <BreadcrumbsRoutes items={breadcrumbs} />
      <Grid size={{ xs: 1, md: 1 }} display={'flex'} flexGrow={1} alignItems={'center'} justifyContent={'end'}>
        <Fab size="small" color="primary" aria-label="Exportar" onClick={() => window.print()}>
          <PiExportDuotone />
        </Fab>
      </Grid>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }} id="servicio-detail-container">
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{`Servicio #${data.id}`}</Typography>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Mecánico</Typography><Typography> <LinkStylesNavigate label={`${data.mecanico.primerNombre} ${data.mecanico.primerApellido}` } onClick={() => goTo('/admin/users/'+data.mecanico.id)} variant='body2' /></Typography></Box>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Cliente</Typography><Typography> <LinkStylesNavigate label={`${data.cliente?.primerNombre} ${data.cliente?.primerApellido} - ${data.cliente?.dpi || data.cliente?.nit || ""}`} onClick={() => goTo('/admin/users/'+data.cliente?.id)} variant='body2' /></Typography></Box>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Placa de la moto</Typography><Typography>{data.moto?.placa ?? '-'}</Typography></Box>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Kilometraje</Typography><Typography>{data.kilometraje ?? '-'}</Typography></Box>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Estado</Typography><Typography><Chip label={data.estado?.estado ?? '-'} color={chipColorByEstado(data.estado?.id)} variant='outlined' /></Typography></Box>
              </Grid>
              <Grid size={6}>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Descripción</Typography><Typography>{data.descripcion}</Typography></Box>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Tipo de servicio</Typography><Typography>{data.tipoServicio?.tipo ?? '-'}</Typography></Box>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Fecha Entrada</Typography><Typography>{formatDate(data.fechaEntrada as any)}</Typography></Box>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Fecha Salida</Typography><Typography>{data.fechaSalida ? formatDate(data.fechaSalida as any) : '-'}</Typography></Box>
              </Grid>
            </Grid>

            <Box sx={{ mb: 2 }}>
              {dataTableTotales.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, borderTop: index === 0 ? '1px solid #e0e0e0' : 'none', pt: index === 0 ? 1 : 0 }}>
                  <Typography sx={{ color: '#6b7280', fontWeight: 600 }}>{item.label}</Typography>
                  <Typography>{item.value}</Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {
              data.productosCliente?.length !== 0 &&
                <>|
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
                </>
            }

            {
              data.tipoServicio?.servicioCompleto &&
              <>
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
              </>
            }

            <Typography variant="h4" textAlign={'center'} mt={3} gutterBottom id="ventas">VENTAS</Typography>
            {
              data.ventas?.length === 0 ? (
                <Typography>No hay ventas asociadas a este servicio.</Typography>
              ) : (
                data.ventas?.map((venta) => (
                  <Box key={venta.id} sx={{ mb: 4 }} >
                    <LinkStylesNavigate label={`Venta #${venta.id}`} onClick={() => goTo(`/admin/ventas/${venta.id}`)} variant="h6" />
                    <Chip label={venta.estado?.estado ?? ''} color={chipColorByEstado(venta.estado?.id)} sx={{ mb: 2 }} variant='outlined'/>
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

            <Grid container spacing={2} mt={4} justifyContent="center" alignItems="center">
              <Grid size={{xs: 12, md: 6}} textAlign="center">
                <Avatar sx={{ width: 200, height: 120, mx: 'auto', borderRadius: 2, justifyContent: 'center', display: 'flex', alignItems: 'center' }}  src={`${API_URL}/${data.firmaEntrada ?? ''}`} alt="Firma Cliente Entrada" />
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
                {'firma cliente (Entrada)'}
              </Typography>
              </Grid>

              {
                data.firmaSalida &&
              <Grid size={{xs: 12, md: 6}} textAlign="center">
                <Avatar sx={{ width: 200, height: 120, mx: 'auto', borderRadius: 2, justifyContent: 'center', display: 'flex', alignItems: 'center' }}  src={`${API_URL}/${data.firmaSalida ?? ''}`} alt="Firma Cliente Salida" />
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
                {'firma cliente (Salida)'}
              </Typography>
              </Grid>
              }
            </Grid>
          </CardContent>
        </Card>
      </Container>


    </>
  );
};

export default ServicioDetail;
