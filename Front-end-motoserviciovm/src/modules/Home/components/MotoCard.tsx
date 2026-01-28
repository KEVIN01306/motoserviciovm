import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Box, 
  Divider,
  Button
} from '@mui/material';

import type { motoGetType } from '../../../types/motoType';
import GuatemalaMotorcyclePlate from '../../../components/utils/PlacaView';

/**
 * Componente MotoCard
 * @param {Object} data - Objeto de la moto con placa, avatar, modelo y estado.
 */

type MotoCardProps = {
  data: motoGetType;
  onclikkHistorial?: () => void;
};
const MotoCard = ({ data, onclikkHistorial }: MotoCardProps) => {
  if (!data) return null;

  // Función para procesar la URL de la imagen/avatar
  // Nota: Si usas una URL base de API, concaténala aquí

  const statusColor = data.estado?.estado?.toLowerCase() === 'activo' ? 'success' : 'error';

  return (
    <Card sx={{ 
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 3, 
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      overflow: 'hidden',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateY(-4px)' }
    }}>
      {/* Imagen / Avatar */}
      <Box sx={{ position: 'relative', width: '100%' }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f5f5f5' }}>
            <GuatemalaMotorcyclePlate plate={data.placa} />
        </Box>
        <Chip 
          label={data.estado?.estado || 'Desconocido'} 
          color={statusColor}
          size="small" 
          sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12, 
            fontWeight: 'bold',
            backdropFilter: 'blur(4px)',
            backgroundColor: statusColor === 'success' ? 'rgba(46, 125, 50, 0.9)' : 'rgba(211, 47, 47, 0.9)',
            color: 'white'
          }}
        />
      </Box>
      <CardContent sx={{ p: 3 }}>
        {/* Información del Modelo */}
        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold', letterSpacing: 1.2 }}>
          Modelo
        </Typography>
        <Typography variant="h6" component="div" sx={{ fontWeight: 800, mb: 2, color: '#1a1a1a' }}>
          {data.modelo?.modelo || 'Modelo no especificado'}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Detalles: Placa y Año */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          

          <Button variant="outlined" onClick={onclikkHistorial} fullWidth sx={{ textTransform: 'none', borderRadius: 2, borderColor: '#1976d2', color: '#1976d2' }}>
                Ver Historial
          </Button>

        </Box>
      </CardContent>
    </Card>
  );
};

export default MotoCard;