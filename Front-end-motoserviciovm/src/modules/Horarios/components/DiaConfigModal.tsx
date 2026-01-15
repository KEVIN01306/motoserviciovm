import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { TipoServicioHorarioDiaHora } from "../../../types/tipoServicioHorarioType";

interface DiaConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (cantidadPersonal: number, horas: TipoServicioHorarioDiaHora[]) => void;
  diaName: string;
  initialCantidadPersonal: number;
  initialHoras: TipoServicioHorarioDiaHora[];
}

export const DiaConfigModal = ({
  open,
  onClose,
  onSave,
  diaName,
  initialCantidadPersonal,
  initialHoras,
}: DiaConfigModalProps) => {
  const [cantidadPersonal, setCantidadPersonal] = useState(initialCantidadPersonal);
  const [horas, setHoras] = useState<TipoServicioHorarioDiaHora[]>(initialHoras);

  useEffect(() => {
    if (open) {
      setCantidadPersonal(initialCantidadPersonal);
      setHoras(initialHoras.length > 0 ? initialHoras : []);
    }
  }, [open, initialCantidadPersonal, initialHoras]);

  const handleAddHora = () => {
    setHoras([...horas, { horaInicio: "", horaFin: "" }]);
  };

  const handleRemoveHora = (index: number) => {
    setHoras(horas.filter((_, i) => i !== index));
  };

  const handleHoraChange = (index: number, field: "horaInicio" | "horaFin", value: string) => {
    const newHoras = [...horas];
    newHoras[index] = { ...newHoras[index], [field]: value };
    setHoras(newHoras);
  };

  const handleSave = () => {
    onSave(cantidadPersonal, horas);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configurar {diaName}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Cantidad de Personal"
            type="number"
            fullWidth
            value={cantidadPersonal}
            onChange={(e) => setCantidadPersonal(parseInt(e.target.value) || 0)}
            InputProps={{ inputProps: { min: 1 } }}
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle1" gutterBottom>
            Horarios
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {horas.map((hora, index) => (
            <Box key={index} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
              <TextField
                label="Hora Inicio"
                type="time"
                value={hora.horaInicio}
                onChange={(e) => handleHoraChange(index, "horaInicio", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
              <TextField
                label="Hora Fin"
                type="time"
                value={hora.horaFin}
                onChange={(e) => handleHoraChange(index, "horaFin", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
              <IconButton color="error" onClick={() => handleRemoveHora(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddHora}
            variant="outlined"
            fullWidth
            sx={{ mt: 1 }}
          >
            Agregar Horario
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
