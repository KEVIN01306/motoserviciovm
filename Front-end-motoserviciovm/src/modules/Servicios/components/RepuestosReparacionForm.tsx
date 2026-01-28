import React, { useState } from 'react';
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { repuestoReparacionType } from '../../../types/repuestoReparacionType';
import { repuestoReparacionInitialState } from '../../../types/repuestoReparacionType';
import { putRepuestosReparacion } from '../../../services/enReparacion.services';

interface Props {
  initial?: { enReparaciones: { id: number|string, repuestos: Omit<repuestoReparacionType, 'imagen'>[] }[] };
}

const RepuestosReparacionForm: React.FC<Props> = ({ initial }) => {
  const [repuestos, setRepuestos] = useState<repuestoReparacionType[]>(initial?.enReparaciones?.[0]?.repuestos ?? []);
  const [tmp, setTmp] = useState<repuestoReparacionType>({ ...repuestoReparacionInitialState});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [success, setSuccess] = useState<string|null>(null);

  const handleAdd = () => {
    if (!tmp.nombre.trim()) return;
    setRepuestos(arr => [...arr, { ...tmp }]);
    setTmp({ ...repuestoReparacionInitialState });
  };

  const handleRemove = (idx: number) => {
    setRepuestos(arr => arr.filter((_, i) => i !== idx));
  };

  const handleChange = (idx: number, field: keyof Omit<repuestoReparacionType, 'imagen'>, value: any) => {
    setRepuestos(arr => arr.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleTmpChange = (field: keyof Omit<repuestoReparacionType, 'imagen'>, value: any) => {
    setTmp(t => ({ ...t, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const id = initial?.enReparaciones?.[0]?.id;
      if (!id) throw new Error('No se encontró el id de enReparacion');
      await putRepuestosReparacion(id, repuestos);
      setSuccess('Repuestos actualizados correctamente');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Repuestos de Reparación</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 2,
          alignItems: { sm: 'flex-end' },
        }}
      >
        <TextField variant='standard' label="Nombre" value={tmp.nombre} onChange={e => handleTmpChange('nombre', e.target.value)} size="small" fullWidth sx={{ minWidth: { xs: '100%', sm: 120 } }} />
        <TextField variant='standard' label="Descripción" value={tmp.descripcion} onChange={e => handleTmpChange('descripcion', e.target.value)} size="small" fullWidth sx={{ minWidth: { xs: '100%', sm: 120 } }} />
        <TextField variant='standard' label="Referencia" value={tmp.refencia ?? ''} onChange={e => handleTmpChange('refencia', e.target.value)} size="small" fullWidth sx={{ minWidth: { xs: '100%', sm: 100 } }} />
        <TextField variant='standard' label="Cantidad" type="number" value={tmp.cantidad} onChange={e => handleTmpChange('cantidad', Number(e.target.value))} size="small" sx={{ width: { xs: '100%', sm: 90 } }} />
        <Button variant="contained" color="primary" onClick={handleAdd} startIcon={<AddIcon />} sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }}>Agregar</Button>
      </Box>
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Referencia</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Entregado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {repuestos.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <TextField variant='standard' value={row.nombre} onChange={e => handleChange(idx, 'nombre', e.target.value)} size="small" fullWidth />
                </TableCell>
                <TableCell>
                  <TextField variant='standard' value={row.descripcion} onChange={e => handleChange(idx, 'descripcion', e.target.value)} size="small" fullWidth />
                </TableCell>
                <TableCell>
                  <TextField variant='standard' value={row.refencia ?? ''} onChange={e => handleChange(idx, 'refencia', e.target.value)} size="small" fullWidth />
                </TableCell>
                <TableCell>
                  <TextField variant='standard' type="number" value={row.cantidad} onChange={e => handleChange(idx, 'cantidad', Number(e.target.value))} size="small" fullWidth />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={!!row.checked}
                    onChange={e => handleChange(idx, 'checked', e.target.checked)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleRemove(idx)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading} sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }}>Guardar repuestos</Button>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">{success}</Typography>}
      </Box>
    </Paper>
  );
};

export default RepuestosReparacionForm;
