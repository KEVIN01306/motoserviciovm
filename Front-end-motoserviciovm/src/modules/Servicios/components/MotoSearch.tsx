import React from 'react';
import { Grid, TextField, Button } from '@mui/material';

interface MotoSearchProps {
  placaInput: string;
  setPlacaInput: (v: string) => void;
  onBuscar: () => void;
  buscandoPlaca: boolean;
  motoSedected: any;
  motoNoExiste: boolean;
  onCrearMoto: () => void;
  onCambiarPlaca: () => void;
}

const MotoSearch: React.FC<MotoSearchProps> = ({
  placaInput,
  setPlacaInput,
  onBuscar,
  buscandoPlaca,
  motoSedected,
  motoNoExiste,
  onCrearMoto,
  onCambiarPlaca,
}) => (
  <Grid size={{ xs: 12, sm: 8 }} display={'flex'} alignItems={'center'} gap={2}>
    <TextField
      label="Placa"
      value={placaInput}
      onChange={e => setPlacaInput(e.target.value.toUpperCase())}
      inputProps={{ maxLength: 7 }}
      variant="standard"
      fullWidth
      disabled={!!motoSedected}
    />
    <Button
      variant="contained"
      onClick={onBuscar}
      disabled={buscandoPlaca || !!motoSedected || !placaInput || placaInput.length !== 7}
    >Buscar</Button>
    {motoNoExiste && (
      <Button color="secondary" variant="outlined" onClick={onCrearMoto}>Crear moto</Button>
    )}
    {motoSedected && (
      <Button color="error" variant="outlined" onClick={onCambiarPlaca}>Cambiar placa</Button>
    )}
  </Grid>
);

export default MotoSearch;
