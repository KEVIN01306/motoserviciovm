import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const ServicePackageCard: React.FC<{ serviceName: string; description: string; items: string[]; isMajor: boolean }> = ({ serviceName, description, items, isMajor }) => {
  return (
    <Card sx={{ p: 2, borderTop: `8px solid ${isMajor ? 'var(--accent-contrast, #000)' : 'var(--accent-red, #c62828)'}` }}>
      <CardContent>
        <div className="text-center mb-4">
          <Typography variant="h5" component="div" sx={{ fontWeight: 800 }}>
            {serviceName}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {description}
          </Typography>
        </div>

        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>El servicio incluye:</Typography>
        <ul className="list-disc pl-6 text-sm">
          {items.map((it, i) => <li key={i} className="mb-1">{it}</li>)}
        </ul>
      </CardContent>
      <CardActions>
        <Button fullWidth variant="contained" sx={{ bgcolor: 'var(--accent-red, #c62828)', color: 'var(--accent-contrast, #000)' }} href="#contacto">
          Agendar {serviceName}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ServicePackageCard;
