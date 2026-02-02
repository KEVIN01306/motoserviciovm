import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from '@mui/material';
import { Edit, Trash2, Plus } from 'lucide-react';
import ValorForm from '../components/ValorForm';
import * as valorSvc from '../../../../services/valor.services';
import type { ValorType } from '../../../../types/valorType';
import { getIconComponent } from '../components/IconSelector';
import LoadingMoto from '../../../../components/utils/LoadginMoto';
import { successToast } from '../../../../utils/toast';

const ValoresPage: React.FC = () => {
  const [valores, setValores] = useState<ValorType[]>([]);
  const [selectedValor, setSelectedValor] = useState<ValorType | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchValores();
  }, []);

  const fetchValores = async () => {
    setLoading(true);
    try {
      const res = await valorSvc.getValores();
      setValores(res || []);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (valor?: ValorType) => {
    setSelectedValor(valor ?? null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedValor(null);
  };

  const handleSaved = async () => {
    await fetchValores();
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm('¿Eliminar este valor?')) return;
    try {
      await valorSvc.deleteValor(id);
        successToast('Valor eliminado con éxito');
      await fetchValores();
    } catch (error) {
      console.error('Error eliminando valor:', error);
    }
  };

  const saveFn = async (id: number | undefined, valor: ValorType) => {
    if (id) {
      const result = await valorSvc.putValor(id, valor);
      successToast('Valor actualizado con éxito');
      return result;
    } else {
      const result = await valorSvc.postValor(valor);
      successToast('Valor creado con éxito');
      return result;
    }
  };

  return (
    <Box sx={{ p: 2 }} width={'100%'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Valores
        </Typography>
        <Button variant="contained" startIcon={<Plus size={20} />} onClick={() => handleOpenForm()}>
          Nuevo Valor
        </Button>
      </Box>

      {loading ? (
        <LoadingMoto />
      ) : valores.length === 0 ? (
        <Typography>No hay valores aún. Crea uno nuevo.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: 800, width: '100%', overflowX: 'auto', m: 2 }}>
          <Table sx={{ minWidth: 650 }} stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Preview</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Icono</TableCell>
                <TableCell>Color</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {valores.map((valor) => (
                <TableRow key={valor.id}>
                  <TableCell>
                    <div className="bg-white dark:bg-black p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-w-[200px]">
                      <div className="mb-2 bg-zinc-100 dark:bg-zinc-900 w-10 h-10 rounded-lg flex items-center justify-center">
                        <div className={valor.color || 'text-red-600'}>
                          {getIconComponent(valor.icon)}
                        </div>
                      </div>
                      <h4 className="text-sm font-black uppercase italic">{valor.title}</h4>
                      <p className="text-xs text-zinc-500">{valor.desc}</p>
                    </div>
                  </TableCell>
                  <TableCell>{valor.title ?? '-'}</TableCell>
                  <TableCell>{valor.desc ?? '-'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getIconComponent(valor.icon)}
                      <span>{valor.icon}</span>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <span className={valor.color || ''}>{valor.color}</span>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenForm(valor)} title="Editar">
                      <Edit size={18} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(valor.id)} color="error" title="Eliminar">
                      <Trash2 size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ValorForm open={formOpen} initial={selectedValor ?? undefined} onClose={handleCloseForm} onSaved={handleSaved} saveFn={saveFn} />
    </Box>
  );
};

export default ValoresPage;
