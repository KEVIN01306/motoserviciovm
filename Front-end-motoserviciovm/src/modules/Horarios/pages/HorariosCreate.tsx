import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { successToast, errorToast } from "../../../utils/toast";
import { DiaCard } from "../components/DiaCard";
import { DiaConfigModal } from "../components/DiaConfigModal";
import type { TipoHorarioType } from "../../../types/tipoHorario";
import type { SucursalType } from "../../../types/sucursalType";
import type { DiaDisponible } from "../../../types/diaDisponibleType";
import type {
  TipoServicioHorarioDia,
  TipoServicioHorarioDiaHora,
  CreateTipoServicioHorario,
} from "../../../types/tipoServicioHorarioType";
import { getTiposHorario } from "../../../services/tipoHorario.services";
import { getSucursales } from "../../../services/sucursal.services";
import { diaDisponibleServices } from "../../../services/diaDisponible.services";
import { tipoServicioHorarioServices } from "../../../services/tipoServicioHorario.services";

const HorariosCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Catálogos
  const [tiposHorario, setTiposHorario] = useState<TipoHorarioType[]>([]);
  const [sucursales, setSucursales] = useState<SucursalType[]>([]);
  const [diasDisponibles, setDiasDisponibles] = useState<DiaDisponible[]>([]);

  // Selecciones
  const [selectedTipoHorario, setSelectedTipoHorario] = useState<TipoHorarioType | null>(null);
  const [selectedSucursal, setSelectedSucursal] = useState<SucursalType | null>(null);
  const [fechaVigencia, setFechaVigencia] = useState("");

  // Configuración de días
  const [diasConfig, setDiasConfig] = useState<TipoServicioHorarioDia[]>([]);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDia, setSelectedDia] = useState<DiaDisponible | null>(null);
  const [editingDiaConfig, setEditingDiaConfig] = useState<TipoServicioHorarioDia | null>(null);

  useEffect(() => {
    const loadCatalogos = async () => {
      try {
        setLoading(true);
        const [tiposHorarioData, sucursalesData, diasData] = await Promise.all([
          getTiposHorario(),
          getSucursales(),
          diaDisponibleServices.getDiasDisponibles(),
        ]);
        setTiposHorario(tiposHorarioData);
        setSucursales(sucursalesData);
        setDiasDisponibles(diasData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCatalogos();
  }, []);

  const handleEditDia = (dia: DiaDisponible, diaConfig?: TipoServicioHorarioDia) => {
    setSelectedDia(dia);
    setEditingDiaConfig(diaConfig || null);
    setModalOpen(true);
  };

  const handleSaveDiaConfig = (cantidadPersonal: number, horas: TipoServicioHorarioDiaHora[]) => {
    if (!selectedDia) return;

    const newDiaConfig: TipoServicioHorarioDia = {
      diaId: selectedDia.id,
      cantidadPersonal,
      horas,
      dia: selectedDia,
    };

    const existingIndex = diasConfig.findIndex((dc) => dc.diaId === selectedDia.id);
    if (existingIndex >= 0) {
      // Actualizar existente
      const updated = [...diasConfig];
      updated[existingIndex] = newDiaConfig;
      setDiasConfig(updated);
    } else {
      // Agregar nuevo
      setDiasConfig([...diasConfig, newDiaConfig]);
    }
    setModalOpen(false);
  };

  const handleDeleteDia = (diaId: number) => {
    setDiasConfig(diasConfig.filter((dc) => dc.diaId !== diaId));
  };

  const handleSubmit = async () => {
    if (!selectedTipoHorario || !selectedSucursal || !fechaVigencia) {
      errorToast("Debe seleccionar tipo de horario, sucursal y fecha de vigencia");
      return;
    }

    if (diasConfig.length === 0) {
      errorToast("Debe configurar al menos un día");
      return;
    }

    try {
      setSaving(true);
      const data: CreateTipoServicioHorario = {
        sucursalId: Number(selectedSucursal.id),
        tipoHorarioId: Number(selectedTipoHorario.id),
        fechaVijencia: fechaVigencia,
        diasConfig: diasConfig.map((dc) => ({
          diaId: dc.diaId,
          cantidadPersonal: dc.cantidadPersonal,
          horas: dc.horas.map((h) => ({
            horaInicio: h.horaInicio,
            horaFin: h.horaFin,
          })),
        })),
      };

      await tipoServicioHorarioServices.createTipoServicioHorario(data);
      successToast("Horario creado exitosamente");
      navigate("/admin/horarios");
    } catch (err: any) {
      errorToast(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={() => window.location.reload()} />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Crear Horario</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin/horarios")}>
          Volver
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                options={sucursales}
                getOptionLabel={(option) => option.nombre}
                value={selectedSucursal}
                onChange={(_, newValue) => setSelectedSucursal(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Sucursal" required fullWidth />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                options={tiposHorario}
                getOptionLabel={(option) => option.tipo}
                value={selectedTipoHorario}
                onChange={(_, newValue) => setSelectedTipoHorario(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Tipo de Horario" required fullWidth />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Fecha de Vigencia"
                type="date"
                fullWidth
                required
                value={fechaVigencia}
                onChange={(e) => setFechaVigencia(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Configuración de Días
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {diasDisponibles.map((dia) => {
          const diaConfig = diasConfig.find((dc) => dc.diaId === dia.id);
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={dia.id}>
              <DiaCard
                dia={dia}
                diaConfig={diaConfig}
                onEdit={handleEditDia}
                onDelete={() => handleDeleteDia(dia.id)}
                isConfigured={!!diaConfig}
              />
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate("/admin/horarios")}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSubmit}
          disabled={saving}
        >
          Guardar
        </Button>
      </Box>

      {modalOpen && selectedDia && (
        <DiaConfigModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveDiaConfig}
          diaName={selectedDia.dia}
          initialCantidadPersonal={editingDiaConfig?.cantidadPersonal || 1}
          initialHoras={editingDiaConfig?.horas || []}
        />
      )}
    </Box>
  );
};

export default HorariosCreate;
