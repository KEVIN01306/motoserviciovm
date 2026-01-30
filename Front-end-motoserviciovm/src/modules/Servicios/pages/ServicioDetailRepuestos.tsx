import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Link from '@mui/material/Link';
import { Container, Card, CardContent, Box, Typography, Divider, Grid, Chip, Fab} from '@mui/material';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { RiToolsLine } from 'react-icons/ri';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';
import { getServicio } from '../../../services/servicios.services';
import type { ServicioGetType } from '../../../types/servicioType';
import ProductsTable from '../../../components/Table/ProductsTable';
import { estados } from '../../../utils/estados';
import Checkbox from '@mui/material/Checkbox';
import { PiExportDuotone } from 'react-icons/pi';
import { useAuthStore } from '../../../store/useAuthStore';
import type { repuestoReparacionType } from '../../../types/repuestoReparacionType';
import GuatemalaMotorcyclePlate from '../../../components/utils/PlacaView';


const ServicioDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<ServicioGetType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    { label: 'Servicios', href: userlogged?.tipo != "" ? `/admin/historial-servicio/${data.motoId}` : '/admin/servicios', icon: <RiToolsLine fontSize="inherit" /> },
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
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Cliente</Typography><Typography> {`${data.cliente?.primerNombre} ${data.cliente?.primerApellido} - ${data.cliente?.dpi || data.cliente?.nit || ""}`}</Typography></Box>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Kilometraje</Typography><Typography>{data.kilometraje ?? '-'}</Typography></Box>
                <Box sx={{ mb: 1 }}><Typography sx={{ color: '#6b7280', fontWeight: 600 }}>Estado</Typography><Typography><Chip label={data.estado?.estado ?? '-'} color={chipColorByEstado(data.estado?.id)} variant='outlined' /></Typography></Box>
              </Grid>
              <Grid size={{ xs: 10, md: 5 }}>
                  <GuatemalaMotorcyclePlate plate={data.moto?.placa || ""} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />




            {
              data.enReparaciones && data.enReparaciones.length > 0 && (
                <>
                  <Box  sx={{ mb: 2, mt: 3 }} >
                    <Typography textAlign={'center'} variant="h6" gutterBottom>En Reparación</Typography>
                    <Typography textAlign={'center'} variant='body2' gutterBottom>{data.enReparaciones[0].descripcion}</Typography>
                    <Chip label={data.enReparaciones[0]?.estado.estado ?? ''} color={chipColorByEstado(data.enReparaciones[0]?.estado.id)} sx={{ mb: 2 }} variant='outlined'/>
                  </Box>

                  <ProductsTable
                  columns={[
                    { id: 'repuesto', label: 'Repuesto', minWidth: 120, format: (_:any, row: repuestoReparacionType) => row.nombre ?? '' },
                    { id: 'descripcion', label: 'Descripción', minWidth: 180, format: (_:any, row: repuestoReparacionType) => row.descripcion ?? '' },
                    { id: 'refencia', label: 'Referencia', minWidth: 100, format: (_:any, row: repuestoReparacionType) => row.refencia ? ( <Link href={row.refencia} target="_blank" rel="noopener noreferrer"  underline="hover" >Link</Link>) : 'No hay' },
                    { id: 'checked', label: 'Entregado', minWidth: 100, format: (_:any, row: repuestoReparacionType) =>  <Checkbox color="primary" checked={!!row.checked} disabled />},
                    { id: 'cantidad', label: 'Cantidad', minWidth: 80, align: 'center', format: (v:any) => String(v) },
                  ] as any}
                  rows={data.enReparaciones[0].repuestos ?? []}
                  maxHeight={'none'}
                  headerColor="#1565c0"
                    />
              </>
              )
            }
            
          </CardContent>
        </Card>
      </Container>


    </>
  );
};

export default ServicioDetail;
