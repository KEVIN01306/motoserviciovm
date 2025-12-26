import { Box, Card, CardContent, Typography, IconButton, Tooltip } from '@mui/material';
import { FaArrowUp, FaArrowDown, FaInfoCircle } from 'react-icons/fa';

interface KpiCardProps {
  title: string;
  value: number | string;
  trend?: 'up' | 'down';
  trendValue: number;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, trend, trendValue, icon: Icon, color }) => {
  const isPositive = trend === 'up';

  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box 
            sx={{ 
              backgroundColor: `${color}15`, 
              color: color,
              p: 1.5,
              borderRadius: 2.5,
              display: 'flex'
            }}
          >
            <Icon size={24} />
          </Box>
          
          <Tooltip title="Más información">
            <IconButton size="small">
              <FaInfoCircle size={18} color="#9e9e9e" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="overline" color="text.secondary">
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h4">
              {value}
            </Typography>
            
            {trendValue && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: isPositive ? 'success.main' : 'error.main',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                {isPositive ? <FaArrowUp size={16} /> : <FaArrowDown size={16} />}
                <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 'inherit' }}>
                  {trendValue}%
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KpiCard;