import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Build as BuildIcon,
  AccessTime as TimeIcon,
  Event as EventIcon
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: { main: '#1a73e8' },
    background: { default: '#ffffff' },
    text: { primary: '#3c4043', secondary: '#70757a' },
  },
  typography: { fontFamily: '"Google Sans", Roboto, Arial, sans-serif' },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: 8 } } },
  },
});

// Datos de ejemplo (fallback)
const APPOINTMENTS_DATA = [
  {
    id: 3,
    fechaCita: '2026-01-27T00:00:00.000Z',
    horaCita: '13:00',
    nombreContacto: 'Juan Pérez',
    tipoServicio: { tipo: 'CAMBIO DE EMPAQUE CLOUTCH', tipoHorarioId: 1 }
  },
  {
    id: 4,
    fechaCita: '2026-01-27T00:00:00.000Z',
    horaCita: '13:00',
    nombreContacto: 'Kevin Sanchez',
    tipoServicio: { tipo: 'REVISIÓN ELÉCTRICA', tipoHorarioId: 2 }
  },
  {
    id: 6,
    fechaCita: '2026-01-27T00:00:00.000Z',
    horaCita: '09:00',
    nombreContacto: 'Daniel Sanchez',
    tipoServicio: { tipo: 'SERVICIO MAYOR', tipoHorarioId: 1 }
  }
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 60;

const AppointmentItem = ({ app, totalInSlot, indexInSlot, onClick }: any) => {
  const [hours, minutes] = app.horaCita.split(':').map((n: string) => Number(n));
  const top = (hours * HOUR_HEIGHT) + (minutes * (HOUR_HEIGHT / 60));
  const height = 55;
  const isType2 = app.tipoServicio?.tipoHorarioId === 2;
  const bgColor = isType2 ? '#7b1fa2' : '#039be5';
  const hoverColor = isType2 ? '#6a1b9a' : '#0288d1';
  const widthPercentage = 100 / totalInSlot;
  const leftPosition = indexInSlot * widthPercentage;

  return (
    <Tooltip title={`${app.horaCita} - ${app.nombreContacto}`} arrow>
      <Paper
        elevation={0}
        onClick={() => onClick(app)}
        sx={{
          position: 'absolute',
          top: `${top}px`,
          left: `${leftPosition}%`,
          width: `calc(${widthPercentage}% - 4px)`,
          height: `${height}px`,
          backgroundColor: bgColor,
          color: 'white',
          padding: '2px 6px',
          fontSize: '0.7rem',
          border: '1px solid rgba(255,255,255,0.4)',
          overflow: 'hidden',
          zIndex: 2,
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: hoverColor,
            zIndex: 10,
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            transform: 'scale(1.02)'
          },
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {app.tipoServicio?.tipo}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: '0.6rem', opacity: 0.9, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {app.nombreContacto}
        </Typography>
      </Paper>
    </Tooltip>
  );
};

interface CitasBoardProps {
  appointments?: any[];
}

export default function CitasBoard({ appointments }: CitasBoardProps) {
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const gridScrollRef = useRef<HTMLDivElement | null>(null);
  const headerScrollRef = useRef<HTMLDivElement | null>(null);

  const DATA = Array.isArray(appointments) && appointments.length > 0 ? appointments : APPOINTMENTS_DATA;

  const getDynamicDateRange = () => {
    if (DATA.length === 0) return [];
    // Use only the YYYY-MM-DD part from the ISO string and construct UTC dates
    const isoDates = Array.from(new Set(DATA.map(app => String(app.fechaCita).slice(0, 10))));
    isoDates.sort();
    const range: Date[] = [];
    if (isoDates.length === 0) return range;
    const minIso = isoDates[0];
    const maxIso = isoDates[isoDates.length - 1];
    let current = new Date(minIso + 'T00:00:00.000Z');
    const end = new Date(maxIso + 'T00:00:00.000Z');
    while (current <= end) {
      range.push(new Date(current));
      current = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate() + 1));
    }
    return range;
  };

  const dynamicDays = getDynamicDateRange();

  useEffect(() => {
    if (gridScrollRef.current) {
      gridScrollRef.current.scrollTop = 8 * HOUR_HEIGHT;
    }
  }, []);

  const handleGridScroll = (e: any) => {
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const isToday = (date: Date) => {
    // Compare by UTC YYYY-MM-DD to avoid timezone shifts
    const todayIso = new Date().toISOString().slice(0, 10);
    return date.toISOString().slice(0, 10) === todayIso;
  };

  const handleCloseDetail = () => setSelectedApp(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.default', overflow: 'hidden' }}>
        <Box 
          ref={headerScrollRef}
          sx={{ display: 'flex', ml: '65px', borderBottom: '1px solid #dadce0', overflow: 'hidden', bgcolor: 'white' }}
        >
          {dynamicDays.map((date, index) => {
            const active = isToday(date);
            const dias = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
            const weekday = dias[date.getUTCDay()];
            const dayNum = date.getUTCDate();
            return (
              <Box key={index} sx={{ flexShrink: 0, width: '200px', textAlign: 'center', py: 1.5, borderLeft: '1px solid #dadce0' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: active ? '#1a73e8' : '#70757a' }}>
                  {weekday}
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ mt: 0.5, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto', borderRadius: '50%', bgcolor: active ? '#1a73e8' : 'transparent', color: active ? 'white' : 'inherit', fontWeight: active ? 'bold' : 'normal', fontSize: '1.1rem' }}
                >
                  {dayNum}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Box ref={gridScrollRef} onScroll={handleGridScroll} sx={{ flex: 1, overflow: 'auto', position: 'relative', display: 'flex' }}>
          <Box sx={{ width: '65px', flexShrink: 0, bgcolor: 'background.default', borderRight: '1px solid #dadce0', position: 'sticky', left: 0, zIndex: 20 }}>
            {HOURS.map(hour => (
              <Box key={hour} sx={{ height: `${HOUR_HEIGHT}px`, position: 'relative' }}>
                <Typography variant="caption" sx={{ position: 'absolute', top: -8, right: 8, color: '#70757a', fontSize: '10px' }}>
                  {hour === 0 ? '' : `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', flex: 1 }}>
            {dynamicDays.map((date, dayIdx) => {
              const dateStr = date.toISOString().slice(0, 10);
              const dayAppointments = DATA.filter(app => String(app?.fechaCita || '').slice(0, 10) === dateStr);

              return (
                <Box key={dayIdx} sx={{ width: '200px', flexShrink: 0, position: 'relative', borderRight: '1px solid #dadce0', bgcolor: isToday(date) ? 'rgba(26, 115, 232, 0.03)' : 'transparent' }}>
                  {HOURS.map(hour => (
                    <Box key={hour} sx={{ height: `${HOUR_HEIGHT}px`, borderBottom: '1px solid #f1f3f4' }} />
                  ))}

                  {dayAppointments.map((app: any) => {
                    const sameSlotApps = dayAppointments.filter((a: any) => a.horaCita === app.horaCita);
                    const totalInSlot = sameSlotApps.length;
                    const indexInSlot = sameSlotApps.findIndex((a: any) => a.id === app.id);

                    return (
                      <AppointmentItem key={app.id} app={app} totalInSlot={totalInSlot} indexInSlot={indexInSlot} onClick={(data: any) => setSelectedApp(data)} />
                    );
                  })}
                </Box>
              );
            })}
          </Box>
        </Box>

        <Dialog open={Boolean(selectedApp)} onClose={handleCloseDetail} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ fontWeight: 'bold' }}>Detalles del Servicio</Box>
            <IconButton onClick={handleCloseDetail} size="small"><CloseIcon /></IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedApp && (
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: selectedApp.tipoServicio?.tipoHorarioId === 2 ? '#7b1fa2' : '#1a73e8' }}>
                    <BuildIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="textSecondary">Servicio</Typography>
                    <Typography variant="body2" fontWeight="bold">{selectedApp.tipoServicio?.tipo}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.light' }}><PersonIcon /></Avatar>
                  <Box>
                    <Typography variant="caption" color="textSecondary">Cliente</Typography>
                    <Typography variant="body2" fontWeight="bold">{selectedApp.nombreContacto}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#f1f3f4', color: 'black' }}><TimeIcon /></Avatar>
                  <Box>
                    <Typography variant="caption" color="textSecondary">Horario</Typography>
                    <Typography variant="body2">{
                      (() => {
                        const iso = String(selectedApp.fechaCita || '').slice(0, 10);
                        if (!iso) return `${selectedApp.horaCita}`;
                        const [y, m, d] = iso.split('-');
                        return `${Number(d)}/${Number(m)}/${y} - ${selectedApp.horaCita}`;
                      })()
                    }</Typography>
                  </Box>
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDetail} variant="contained" fullWidth sx={{ bgcolor: selectedApp?.tipoServicio?.tipoHorarioId === 2 ? '#7b1fa2' : '#1a73e8', '&:hover': { bgcolor: selectedApp?.tipoServicio?.tipoHorarioId === 2 ? '#6a1b9a' : '#1557b0' } }}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
