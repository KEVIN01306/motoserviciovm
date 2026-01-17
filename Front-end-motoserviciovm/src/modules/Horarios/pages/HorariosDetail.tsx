import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Divider,
  Chip,
  Paper,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from "@mui/icons-material";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import type { TipoServicioHorario } from "../../../types/tipoServicioHorarioType";
import { tipoServicioHorarioServices } from "../../../services/tipoServicioHorario.services";

const HorariosDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [horario, setHorario] = useState<TipoServicioHorario | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await tipoServicioHorarioServices.getTipoServicioHorario(parseInt(id));
        setHorario(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={() => window.location.reload()} />;
  if (!horario) return <ErrorCard errorText="Horario no encontrado" restart={() => window.location.reload()} />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Detalle del Horario</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            startIcon={<EditIcon />}
            variant="contained"
            onClick={() => navigate(`/admin/horarios/${id}/edit`)}
          >
            Editar
          </Button>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/horarios")}>
            Volver
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información General
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ID
                </Typography>
                <Typography variant="body1">{horario.id}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Tipo de Horario
                </Typography>
                <Typography variant="body1">{horario.tipoHorario?.tipo || "N/A"}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Sucursal
                </Typography>
                <Typography variant="body1">{horario.sucursal?.nombre || "N/A"}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Fecha de Vigencia
                </Typography>
                <Typography variant="body1">
                  {new Date(horario.fechaVijencia).toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configuración de Días
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {horario.diasConfig && horario.diasConfig.length > 0 ? (
                  horario.diasConfig.map((diaConfig) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={diaConfig.id}>
                      <Paper elevation={2} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          {diaConfig.dia?.dia || "N/A"}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Personal:
                          </Typography>
                          <Typography variant="body1">{diaConfig.cantidadPersonal}</Typography>
                        </Box>
                        {diaConfig.horas && diaConfig.horas.length > 0 && (
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Horarios:
                            </Typography>
                            {diaConfig.horas.map((hora, idx) => (
                              <Chip
                                key={idx}
                                label={`${hora.horaInicio} - ${hora.horaFin}`}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  ))
                ) : (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">
                      No hay días configurados
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HorariosDetail;
