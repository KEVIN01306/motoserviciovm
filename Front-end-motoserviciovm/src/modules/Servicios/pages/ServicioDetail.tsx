import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Link from '@mui/material/Link';
import { Container, Card, CardContent, Box, Typography, Divider, Grid, Chip, Fab, Avatar, Button } from '@mui/material';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { RiToolsLine } from 'react-icons/ri';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';
import { getServicio } from '../../../services/servicios.services';
import type { ProgresoItemGetType, ServicioGetType } from '../../../types/servicioType';
import ProductsTable from '../../../components/Table/ProductsTable';
import { formatDate } from '../../../utils/formatDate';
import type { VentaProductoGetType } from '../../../types/ventaType';
import { estados } from '../../../utils/estados';
import { useGoTo } from '../../../hooks/useGoTo';
import LinkStylesNavigate from '../../../components/utils/links';
import Checkbox from '@mui/material/Checkbox';
import { PiExportDuotone } from 'react-icons/pi';
import ImageGallery from '../../../components/utils/GaleryImagenes';
import { useAuthStore } from '../../../store/useAuthStore';
import type { repuestoReparacionType } from '../../../types/repuestoReparacionType';

const API_URL = import.meta.env.VITE_DOMAIN;

const ServicioDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<ServicioGetType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const goTo = useGoTo();
  const { hash } = useLocation();
  const userlogged = useAuthStore(state => state.user);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await getServicio(id ?? '');
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
    { label: 'Servicios', href:  '/admin/servicios', icon: <RiToolsLine fontSize="inherit" /> },
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
  
  const totalVentasDescuentos = data.ventas?.map(venta =>
    venta.productos?.reduce((acc, producto) => {
      const descuento = producto.descuento ? producto.totalProducto : 0;
      return acc + (descuento);
    }, 0) || 0
  ).reduce((acc, curr) => acc + curr, 0) || 0;

  const totalServicio =( data.ventas?.reduce((acc, venta) => acc + (venta.total || 0), 0) || 0) + (data.total || 0) + (data.enReparaciones?.[0]?.total || 0) + (data.enParqueos?.[0]?.total || 0) - totalVentasDescuentos;

  const dataTableTotales = [
    { label: 'Total Reparacion', value: `Q ${data.enReparaciones?.[0]?.total ? data.enReparaciones[0].total.toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}` },
    { label: 'Total Parqueo', value: `Q ${data.enParqueos?.[0]?.total ? data.enParqueos[0].total.toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}` },
    { label: 'Total Servicio', value: `Q ${data.total?.toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}) ?? '0.00'}` },
    { label: 'Total Ventas', value: `Q ${(data.ventas?.reduce((acc, venta) => acc + (venta.total || 0) - totalVentasDescuentos, 0)).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}) ?? '0.00'}` },
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

            <Box >

                {/* Invocación del componente */}
                <ImageGallery imagenes={data.imagen ?? []} />
          </Box>

            {
              data.productosCliente?.length !== 0 &&
                <>
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
                      { id: 'producto', label: 'Producto', minWidth: 120, format: (_:any, row: VentaProductoGetType) => row.producto?.nombre ?? '' },
                      { id: 'precio', label: 'Precio', minWidth: 100, align: 'right', format: (_v:any, row: VentaProductoGetType) => `Q ${Number(row.producto?.precio ?? 0).toFixed(2)}` },
                      { id: 'cantidad', label: 'Cantidad', minWidth: 80, align: 'center', format: (v:any) => String(v) },
                      { id: 'descuento', label: 'Descuento', minWidth: 80, align: 'center', format: (v:any) => v ? 'Sí' : 'No' },
                      { id: 'totalProducto', label: 'Total', minWidth: 100, align: 'right', format: (v:any) => `Q ${Number(v).toFixed(2)}` },
                    ] as any}
                    rows={venta.productos ?? []}
                    headerColor="#1565c0"
                      />
                  </Box>
                ))
              )
            }

             {data.servicioOpcionesTipoServicio && data.servicioOpcionesTipoServicio.length > 0 && (

                  <Box  sx={{ mb: 4 }} >
                    <Typography variant="h6" gutterBottom>{data.tipoServicio?.tipo}</Typography>
                    <ProductsTable
                    columns={[
                      { id: 'opcion', label: 'Opcion', minWidth: 120, format: (_:any, row: ProgresoItemGetType) => row.opcionServicio.opcion ?? '' },
                      { id: 'checked', label: 'Check', minWidth: 100, align: 'right', format: (_: boolean, row: ProgresoItemGetType) => <Checkbox color="primary" checked={!!row.checked} disabled /> },
                      { id: 'observaciones', label: 'observaciones', minWidth: 80, align: 'center', format: (v: string) => v ?? '' },
                    ] as any}
                    rows={data.servicioOpcionesTipoServicio ?? []}
                    headerColor="#1565c0"
                      />
                  </Box>
                )}

            <Grid container spacing={2} mt={4} justifyContent="center" alignItems="center">
              <Grid size={{xs: 12, md: 6}} textAlign="center">
                <Avatar sx={{ width: 200, height: 120, mx: 'auto', borderRadius: 2, justifyContent: 'center', display: 'flex', alignItems: 'center' }}  src={`${API_URL}/${data.firmaEntrada ?? ''}`} alt="Firma Cliente Entrada" />
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
                {'firma cliente (Entrada)'}
              </Typography >
              {data.nombreClienteMoto && (
                <Typography variant="caption" m={1} color="textSecondary" align="center">{data.nombreClienteMoto}</Typography>
              )}
              {data.dpiClienteMoto && (
                <Typography variant="caption"  color="textSecondary" align="center">{data.dpiClienteMoto}</Typography>
              )}
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

             {
              data.enReparaciones && data.enReparaciones.length > 0 && (
                <>
                  <Box  sx={{ mb: 4, mt: 3 }} >
                    <Typography variant="h6" gutterBottom>En Reparación</Typography>
                    <Typography variant='body2' gutterBottom><Link href={`/admin/enreparacion/${data.enReparaciones[0].id}`}  rel="noopener noreferrer" underline="hover">{data.enReparaciones[0].descripcion}</Link></Typography>
                    <Typography variant='body2' >{data.enReparaciones[0].observaciones}</Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        {`Total Reparacion ${data.enReparaciones[0].total ? `Q ${data.enReparaciones[0].total.toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'Q 0.00'}`}
                    </Typography> 
                    <Chip label={data.enReparaciones[0]?.estado.estado ?? ''} color={chipColorByEstado(data.enReparaciones[0]?.estado.id)} sx={{ mb: 2 }} variant='outlined'/>
                  </Box>

                  <ProductsTable
                  columns={[
                    { id: 'repuesto', label: 'Repuesto', minWidth: 120, format: (_:any, row: repuestoReparacionType) => row.nombre ?? '' },
                    { id: 'descripcion', label: 'Descripción', minWidth: 180, format: (_:any, row: repuestoReparacionType) => row.descripcion ?? '' },
                    { id: 'refencia', label: 'Referencia', minWidth: 100, format: (_:any, row: repuestoReparacionType) => row.refencia ? ( <Link href={row.refencia} target="_blank" rel="noopener noreferrer"  underline="hover" >Link</Link>) : 'No hay' },
                    { id: 'cantidad', label: 'Cantidad', minWidth: 80, align: 'center', format: (v:any) => String(v) },
                  ] as any}
                  rows={data.enReparaciones[0].repuestos ?? []}
                  headerColor="#1565c0"
                    />
              </>
              )
            }

            {
              data.enParqueos && data.enParqueos.length > 0 && (
                <>
                  <Divider sx={{ my: 4 }} />
                  <Box  sx={{ mb: 2, mt: 3 }} >
                    <Typography textAlign={'center'} variant="h6" gutterBottom>En Parqueo</Typography>
                    <Typography textAlign={'center'} variant='body2' gutterBottom>{data.enParqueos[0].descripcion}</Typography>
                    <Typography textAlign={'center'} variant='body2' gutterBottom>{`Desde: ${data.enParqueos[0].fechaEntrada ? formatDate(data.enParqueos[0].fechaEntrada as any) : '-'}`}</Typography>
                    <Typography textAlign={'center'} variant='body2' gutterBottom>{`Fecha Salida: ${data.enParqueos[0].fechaSalida ? formatDate(data.enParqueos[0].fechaSalida as any) : '-'}`}</Typography>
                    <Typography variant="body2" >
                      Dias en parqueo: {new Date().getDate() - new Date(data.enParqueos[0].createdAt ? data.enParqueos[0].createdAt : '').getDate()}
                    </Typography>
                    
                    <Chip label={data.enParqueos[0]?.estado.estado ?? ''} color={chipColorByEstado(data.enParqueos[0]?.estado.id)} sx={{ mb: 2 }} variant='outlined'/>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        {`Total Parqueo ${data.enParqueos[0].total ? `Q ${data.enParqueos[0].total.toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'Q 0.00'}`}
                    </Typography>                  </Box>
                  <Divider sx={{ my: 4 }} />
                </>
              )
            }


            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2} justifyContent="center" alignItems="center">
            {
              userlogged?.permisos.includes('ventas:create') && (data.estadoId === estados().enServicio || data.estadoId === estados().enReparacion || data.estadoId === estados().enParqueo) && (
                  <Grid size={{xs: 5, md: 3}} textAlign="center">
                  <Button variant="contained" onClick={() => goTo(`/admin/ventas/create?servicioId=${data.id}`)}>Crear Venta</Button>
                  </Grid>
            )

            }
            {
              userlogged?.permisos.includes('servicios:salida') && (data.estadoId === estados().enServicio || data.estadoId === estados().enReparacion || data.estadoId === estados().enParqueo) && (
                  <Grid size={{xs: 5, md: 3}} textAlign="center">
                  <Button variant="outlined" color='success'  onClick={() => goTo(`/admin/servicios/${data.id}/salida`)}>Dar Salida</Button>
                  </Grid>
            )
            }
            </Grid>

          </CardContent>
        </Card>
      </Container>


    </>
  );
};

export default ServicioDetail;
