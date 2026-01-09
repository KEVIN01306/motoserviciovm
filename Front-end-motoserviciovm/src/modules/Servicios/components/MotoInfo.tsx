import React from 'react';
import { Box, Button } from '@mui/material';

interface MotoInfoProps {
  motoSedected: any;
  onCrearUser: () => void;
}

const MotoInfo: React.FC<MotoInfoProps> = ({ motoSedected, onCrearUser }) => {
  if (!motoSedected) return null;
  return (
    <Box sx={{ my: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <div><b>Placa:</b> {motoSedected.placa}</div>
      <div><b>Modelo:</b> {motoSedected.modelo?.modelo}</div>
      <div><b>Usuarios:</b> {motoSedected.users && motoSedected.users.length > 0 ? `${motoSedected.users[0].primerNombre} ${motoSedected.users[0].primerApellido}` : 'Sin usuarios asociados'}</div>
      {motoSedected.users && motoSedected.users.length === 0 && (
        <Button color="secondary" variant="outlined" onClick={onCrearUser}>Crear usuario y asociar</Button>
      )}
    </Box>
  );
};

export default MotoInfo;
