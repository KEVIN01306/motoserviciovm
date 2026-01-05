import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, TextField, Paper, Button, Fab, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { servicioProductoProximoType } from '../../../types/servicioType';

interface Props {
  initial: servicioProductoProximoType[];
  onSubmit: (data: servicioProductoProximoType[]) => void;
  loading?: boolean;
}

const ProximoServicioItemsForm: React.FC<Props> = ({ initial, onSubmit, loading }) => {
  const [rows, setRows] = useState<servicioProductoProximoType[]>(initial);
  const [tmp, setTmp] = useState<{ nombre: string }>({ nombre: '' });

  const handleAdd = () => {
    if (tmp.nombre.trim()) {
      setRows(arr => [...arr, { nombre: tmp.nombre.trim() }]);
      setTmp({ nombre: '' });
    }
  };

  const handleChange = (idx: number, nombre: string) => {
    setRows(arr => arr.map((item, i) => i === idx ? { ...item, nombre } : item));
  };

  const handleDelete = (idx: number) => {
    setRows(arr => arr.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rows);
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }} component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ mb: 2 }}>Próximo servicio</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Nombre del producto"
          value={tmp.nombre}
          onChange={e => setTmp({ nombre: e.target.value })}
          size="small"
          fullWidth
          variant='outlined'
        />
        <Fab color="primary" size="small" onClick={handleAdd} aria-label="Agregar producto próximo">
          <AddIcon />
        </Fab>
      </Box>
      {rows.length > 0 && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <TextField
                    value={row.nombre}
                    onChange={e => handleChange(idx, e.target.value)}
                    size="small"
                    fullWidth
                    variant="standard"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="error" onClick={() => handleDelete(idx)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>Guardar Cambios</Button>
    </Paper>
  );
};

export default ProximoServicioItemsForm;
