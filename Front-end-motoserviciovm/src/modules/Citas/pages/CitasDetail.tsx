import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { getCita } from "../../../services/citas.services";
import { Card, CardContent, Box, Typography, Grid, Button, Chip } from "@mui/material";
import { useGoTo } from "../../../hooks/useGoTo";
import type { CitaGetType } from "../../../types/citaType";
import { RiEBikeLine } from "react-icons/ri";
import { formatDate } from "../../../utils/formatDate";

const CitasDetail = () => {
  const { id } = useParams();
  const goTo = useGoTo();

  const [cita, setCita] = useState<CitaGetType | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbsData = [
    { label: "Citas", icon: <RiEBikeLine fontSize="inherit" />, href: "/admin/citas" },
    { label: "Detalle Cita", icon: <RiEBikeLine fontSize="inherit" />, href: "/admin/citas/" + id },
  ];

  const getOne = async () => {
    try {
      setLoading(true);
      const response = await getCita(id as any);
      setCita(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOne();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={getOne} />;

  return (
    <>
      <BreadcrumbsRoutes items={breadcrumbsData} />

      <Card>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {formatDate(cita?.fechaCita) ?? '-'}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>
                  {cita?.horaCita ?? '-'}
                </Typography>
                <Chip label={cita?.estado?.estado ?? 'Sin estado'} color="primary" sx={{ mt: 2 }} />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{cita?.nombreContacto ?? '-'}</Typography>
                  <Typography color="text.secondary">{cita?.telefonoContacto ?? '-'}</Typography>
                  <Typography sx={{ mt: 1 }}><strong>Placa:</strong> {cita?.placa ?? '-'}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography><strong>Sucursal:</strong> {cita?.sucursal?.nombre ?? '-'}</Typography>
                  <Typography><strong>Servicio:</strong> {cita?.tipoServicio?.tipo ?? '-'}</Typography>
                  <Typography sx={{ mt: 1 }} color="text.secondary">Creado: {formatDate(cita?.createdAt) ?? '-'}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={12}>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Descripción</Typography>
                <Typography>{cita?.descripcion ?? '-'}</Typography>
              </Box>
            </Grid>

            <Grid size={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={() => goTo("/admin/citas/" + id + "/edit")}>Editar</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default CitasDetail;