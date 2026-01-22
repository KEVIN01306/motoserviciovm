import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  ThemeProvider,
  createTheme,
  styled,
  Tooltip,
  Zoom,
  Fade,
} from '@mui/material';
import { FiAlertCircle, FiClock, FiCheckCircle } from 'react-icons/fi';

type HoraSlot = {
  id: number | string;
  horaInicio: string; // e.g. "09:00"
  horaFin?: string;
  capacity?: number;
};

type Cita = {
  id?: number | string;
  horaCita?: string; // could be "09:00" or ISO datetime
};

type TimePickerProps = {
  dataHoras: HoraSlot[];
  citas?: Cita[];
  selectedId?: number | string | null;
  onSelectionChange?: (slot: HoraSlot | null) => void;
  excludeCitaId?: number | string | null;
};

// Theme
const theme = createTheme({
  palette: {
    primary: { main: '#2563eb' },
    secondary: { main: '#10b981' },
    error: { main: '#f43f5e' },
    background: { default: '#f8fafc', paper: '#ffffff' },
  },
  shape: { borderRadius: 24 },
  typography: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif' },
});

const TimeButton = styled(ToggleButton, {
  shouldForwardProp: (prop) => prop !== 'isOccupied',
})<{ isOccupied?: boolean }>(({ theme, isOccupied }) => ({
  backgroundColor: isOccupied ? '#fff1f2' : '#ffffff',
  color: isOccupied ? '#e11d48' : '#475569',
  border: `1px solid ${isOccupied ? '#ffe4e6' : '#e2e8f0'} !important`,
  borderRadius: '10px !important',
  padding: '24px 16px',
  fontWeight: 600,
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  height: '95px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  cursor: isOccupied ? 'not-allowed' : 'pointer',
  position: 'relative',
  overflow: 'visible',

  '&:hover': {
    backgroundColor: isOccupied ? '#fff1f2' : '#ffffff',
    transform: isOccupied ? 'none' : 'translateY(-6px)',
    boxShadow: isOccupied ? 'none' : '0 15px 30px -10px rgba(37, 99, 235, 0.15)',
    borderColor: isOccupied ? '#ffe4e6' : theme.palette.primary.main + ' !important',
  },

  '&.Mui-selected': {
    backgroundColor: '#eff6ff !important',
    color: '#1d4ed8 !important',
    borderColor: '#3b82f6 !important',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.15)',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 10,
      right: 10,
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: '#2563eb',
      border: '2px solid #ffffff',
      boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)',
      animation: 'scaleIn 0.3s ease-out',
    },
  },

  '@keyframes scaleIn': {
    '0%': { transform: 'scale(0)' },
    '100%': { transform: 'scale(1)' },
  },

  '&.Mui-disabled': {
    opacity: 0.9,
  },
}));

function extractTime(value?: string) {
  if (!value) return '';
  // If ISO datetime, extract HH:mm
  const isoMatch = value.match(/T(\d{2}:\d{2})/);
  if (isoMatch) return isoMatch[1];
  // If contains time like 09:00, return first occurrence
  const timeMatch = value.match(/(\d{2}:\d{2})/);
  if (timeMatch) return timeMatch[1];
  return value;
}

const TimePicker: React.FC<TimePickerProps> = ({ dataHoras, citas = [], selectedId: controlledSelectedId = null, onSelectionChange, excludeCitaId = null }) => {
  const [internalSelected, setInternalSelected] = useState<number | string | null>(controlledSelectedId ?? null);

  // Sync controlled prop if provided
  React.useEffect(() => {
    if (controlledSelectedId !== undefined && controlledSelectedId !== internalSelected) {
      setInternalSelected(controlledSelectedId ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledSelectedId]);


  // Precompute effective citas excluding the current cita id (if provided)
  const effectiveCitas = useMemo(() => {
    if (!excludeCitaId) return citas;
    return citas.filter(c => String(c.id) !== String(excludeCitaId));
  }, [citas, excludeCitaId]);

  const isTimeOccupied = (horaInicio: string, capacity?: number) => {
    const t = extractTime(horaInicio);
    const count = effectiveCitas.filter(c => extractTime(c.horaCita) === t).length;
    if (typeof capacity === 'number') return count >= capacity;
    return count > 0;
  };

  const getCountFor = (horaInicio: string) => {
    const t = extractTime(horaInicio);
    return effectiveCitas.filter(c => extractTime(c.horaCita) === t).length;
  };

  const handleSelection = (_event: React.MouseEvent<HTMLElement>, newId: number | string | null) => {
    if (newId === null) {
      setInternalSelected(null);
      if (onSelectionChange) onSelectionChange(null);
      return;
    }

    const selectedSlot = dataHoras.find(h => String(h.id) === String(newId)) ?? null;
    const isSelectedNow = selectedSlot && String(selectedSlot.id) === String(internalSelected);
    if (selectedSlot && (!isTimeOccupied(selectedSlot.horaInicio, selectedSlot.capacity) || isSelectedNow)) {
      setInternalSelected(selectedSlot.id);
      if (onSelectionChange) onSelectionChange(selectedSlot);
    }
  };

  const currentSelection = dataHoras.find(h => String(h.id) === String(internalSelected)) ?? null;

  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          width: '100%',
          maxWidth: 850,
          borderRadius: '10px',
          //boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        
        <ToggleButtonGroup
          value={internalSelected}
          exclusive
          onChange={handleSelection}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2.5,
            width: '100%',
            '& .MuiToggleButtonGroup-grouped': { border: 'none', margin: 0 },
          }}
        >
          {dataHoras.map((hora, index) => {
            const occupied = isTimeOccupied(hora.horaInicio, hora.capacity);
            const count = getCountFor(hora.horaInicio);
            const capacity = typeof hora.capacity === 'number' ? hora.capacity : undefined;
            const tooltip = capacity ? `${count}/${capacity} ocupadas` : (occupied ? `${count} reservas` : '');
            const isSelectedNow = String(internalSelected) === String(hora.id);
            const disabled = occupied && !isSelectedNow;

            return (
              <Zoom in style={{ transitionDelay: `${index * 50}ms` }} key={hora.id}>
                <Box>
                  <Tooltip title={tooltip} arrow TransitionComponent={Fade}>
                    <Box>
                      <TimeButton value={hora.id} disabled={disabled} isOccupied={occupied}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          {hora.horaInicio}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.6 }}>
                          {capacity ? `${count}/${capacity}` : (occupied ? 'OCUPADO' : `Fin: ${hora.horaFin ?? '-'}`)}
                        </Typography>

                        {occupied && (
                          <FiAlertCircle size={14} style={{ position: 'absolute', bottom: 12, right: 12, opacity: 0.5 }} />
                        )}
                      </TimeButton>
                    </Box>
                  </Tooltip>
                </Box>
              </Zoom>
            );
          })}
        </ToggleButtonGroup>

        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Fade in={!!currentSelection}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'secondary.main' }}>
              <FiCheckCircle size={18} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Has seleccionado las {currentSelection?.horaInicio}
              </Typography>
            </Box>
          </Fade>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, opacity: 0.8, mt: 1 }}>
            {[
              { label: 'Libre', color: '#e2e8f0' },
              { label: 'Elegido', color: '#2563eb' },
              { label: 'Reservado', color: '#f43f5e' },
            ].map((item) => (
              <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default TimePicker;
