import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Button,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { TipoServicioHorarioDia } from "../../../types/tipoServicioHorarioType";
import type { DiaDisponible } from "../../../types/diaDisponibleType";

interface DiaCardProps {
  dia: DiaDisponible;
  diaConfig?: TipoServicioHorarioDia;
  onEdit: (dia: DiaDisponible, diaConfig?: TipoServicioHorarioDia) => void;
  onDelete?: (diaConfigId: number) => void;
  isConfigured: boolean;
}

export const DiaCard = ({ dia, diaConfig, onEdit, onDelete, isConfigured }: DiaCardProps) => {
  return (
    <Card
      sx={{
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        border: isConfigured ? "2px solid #1976d2" : "1px solid #e0e0e0",
        backgroundColor: isConfigured ? "#f0f7ff" : "#fff",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" component="div">
            {dia.dia}
          </Typography>
          {isConfigured && <Chip label="Configurado" color="primary" size="small" />}
        </Box>

        {diaConfig && (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Personal: {diaConfig.cantidadPersonal}
            </Typography>

            {diaConfig.horas && diaConfig.horas.length > 0 && (
              <Box sx={{ mt: 1 }}>
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
          </Box>
        )}

        {!isConfigured && (
          <Typography variant="body2" color="text.secondary">
            No configurado
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Button size="small" startIcon={<EditIcon />} onClick={() => onEdit(dia, diaConfig)}>
          {isConfigured ? "Editar" : "Configurar"}
        </Button>
        {isConfigured && diaConfig && onDelete && (
          <IconButton size="small" color="error" onClick={() => onDelete(diaConfig.id!)}>
            <DeleteIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};
