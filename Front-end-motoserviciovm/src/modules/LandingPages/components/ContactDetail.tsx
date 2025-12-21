import React from 'react';
import Typography from '@mui/material/Typography';

const ContactDetail: React.FC<{ Icon: any; title: string; value: string }> = ({ Icon, title, value }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
    <Icon style={{ color: 'var(--accent-red, #c62828)', fontSize: 20, marginTop: 4 }} />
    <div>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--accent-contrast, #000)' }}>{title}</Typography>
      <Typography variant="body2" sx={{ color: '#9ca3af' }}>{value}</Typography>
    </div>
  </div>
);

export default ContactDetail;
