import { Box, TextField } from '@mui/material';
import dayjs from 'dayjs';

interface Props {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

const HistorialServicioFiltros = ({ startDate, endDate, onChange }: Props) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
      <TextField
        label="Fecha inicio"
        type="date"
        size="small"
        value={startDate}
        onChange={e => onChange(e.target.value, endDate)}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Fecha fin"
        type="date"
        size="small"
        value={endDate}
        onChange={e => onChange(startDate, e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  );
};

export default HistorialServicioFiltros;
