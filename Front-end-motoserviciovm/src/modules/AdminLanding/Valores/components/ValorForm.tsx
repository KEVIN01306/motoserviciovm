import React, { useState, useEffect } from 'react';
import { Button, TextField, Paper, Box, Modal } from '@mui/material';
import type { ValorType } from '../../../../types/valorType';
import IconSelector, { getIconComponent } from './IconSelector';
import ColorSelector from './ColorSelector';

interface Props {
  open: boolean;
  initial?: ValorType;
  onClose?: () => void;
  onSaved?: (v: ValorType) => void;
  saveFn: (id: number | undefined, payload: ValorType) => Promise<ValorType>;
}

const ValorForm: React.FC<Props> = ({ open, initial, onClose, onSaved, saveFn }) => {
  const [valor, setValor] = useState<ValorType>(initial ?? {} as ValorType);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValor(initial ?? { title: '', desc: '', icon: 'Target', color: 'text-red-600' } as ValorType);
  }, [open, initial]);

  const handleChange = (k: keyof ValorType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValor(v => ({ ...v, [k]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await saveFn(valor.id as number | undefined, valor);
      onSaved?.(res);
      handleClose();
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper sx={{ p: 3, mx: 'auto', mt: 10, maxWidth: 500, maxHeight: '70vh', overflow: 'auto' }}>
        <h2>{initial?.id ? 'Editar Valor' : 'Nuevo Valor'}</h2>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField label="Título" value={valor.title ?? ''} onChange={handleChange('title')} fullWidth sx={{ mb: 2, mt: 2 }} required />
          <TextField label="Descripción" value={valor.desc ?? ''} onChange={handleChange('desc')} fullWidth sx={{ mb: 2 }} multiline rows={3} />
          
          <Box sx={{ mb: 2 }}>
            <IconSelector value={valor.icon} onChange={(icon) => setValor(v => ({ ...v, icon }))} />
          </Box>

          <Box sx={{ mb: 2 }}>
            <ColorSelector value={valor.color} onChange={(color) => setValor(v => ({ ...v, color }))} />
          </Box>

          <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, mb: 2 }}>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Preview:</p>
            <div className="bg-white dark:bg-black p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800">
              <div className="mb-3 bg-zinc-100 dark:bg-zinc-900 w-12 h-12 rounded-xl flex items-center justify-center">
                <div className={valor.color || 'text-red-600'}>
                  {getIconComponent(valor.icon)}
                </div>
              </div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter mb-1">{valor.title || 'Título'}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{valor.desc || 'Descripción'}</p>
            </div>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button variant="outlined" onClick={handleClose}>Cancelar</Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ValorForm;
