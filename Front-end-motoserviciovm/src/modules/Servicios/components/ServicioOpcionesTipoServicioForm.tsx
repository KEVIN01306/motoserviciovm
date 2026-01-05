// ServicioOpcionesTipoServicioForm.tsx
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Checkbox, TextField, Paper, Button, TableContainer } from '@mui/material';
import type { ProgresoItemGetType, ProgresoItemType } from '../../../types/servicioType';

interface Props {
  initial: ProgresoItemGetType[];
  onSubmit: (data: ProgresoItemType[]) => void;
  loading?: boolean;
}

const ServicioOpcionesTipoServicioForm: React.FC<Props> = ({ initial, onSubmit, loading }) => {
  const [rows, setRows] = useState<ProgresoItemGetType[]>(initial);

  const handleCheck = (idx: number, checked: boolean) => {
    setRows(arr => arr.map((item, i) => i === idx ? { ...item, checked } : item));
  };

  const handleObs = (idx: number, observaciones: string) => {
    setRows(arr => arr.map((item, i) => i === idx ? { ...item, observaciones } : item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only send the required fields for update
    onSubmit(rows.map(({ servicioId, opcionServicioId, checked, observaciones }) => ({
      servicioId, opcionServicioId, checked, observaciones
    })));
  };

  return (
    <Paper sx={{ p: 2, mb: 2,  }} component="form" onSubmit={handleSubmit}>
      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Opción</TableCell>
            <TableCell>Realizado</TableCell>
            <TableCell>Observaciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={row.opcionServicioId}>
              <TableCell>{row.opcionServicio?.opcion ?? ''}</TableCell>
              <TableCell>
                <Checkbox
                  checked={!!row.checked}
                  onChange={e => handleCheck(idx, e.target.checked)}
                  color="primary"
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={row.observaciones ?? ''}
                  onChange={e => handleObs(idx, e.target.value)}
                  size="small"
                  fullWidth
                  variant="standard"
                  placeholder="Observaciones"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>Guardar Cambios</Button>
    </TableContainer>
    </Paper>
  );
};

export default ServicioOpcionesTipoServicioForm;
