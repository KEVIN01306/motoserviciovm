import React, { useState, useEffect } from 'react';
import { Button, TextField, Paper, Box, Avatar, Modal } from '@mui/material';
import type { SlideType } from '../../../../types/slideType';

interface Props {
  open: boolean;
  initial?: SlideType;
  onClose?: () => void;
  onSaved?: (s: SlideType) => void;
  saveFn: (id: number | undefined, payload: FormData) => Promise<SlideType>;
}

const URL_DOMAIN = import.meta.env.VITE_DOMAIN;

const SlideForm: React.FC<Props> = ({ open, initial, onClose, onSaved, saveFn }) => {
  const [slide, setSlide] = useState<SlideType>(initial ?? {} as SlideType);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(initial?.image);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSlide(initial ?? {} as SlideType);
    setPreview(initial?.image);
    setFile(null);
  }, [open, initial]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleChange = (k: keyof SlideType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlide(s => ({ ...s, [k]: e.target.value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      if (file) fd.append('image', file);
      if (slide.tag) fd.append('tag', slide.tag);
      if (slide.promo) fd.append('promo', slide.promo);
      if (slide.subtitle) fd.append('subtitle', slide.subtitle);
      const res = await saveFn(slide.id as number | undefined, fd);
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
      <Paper sx={{ p: 3, mx: 'auto', mt: 10, maxWidth: 500 }}>
        <h2>{initial?.id ? 'Editar Slide' : 'Nuevo Slide'}</h2>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <Avatar variant="rounded" src={initial?.image ? URL_DOMAIN + initial.image : preview} sx={{ width: 120, height: 70 }} />
            <Box sx={{ flex: 1 }}>
              <Button variant="outlined" component="label">
                Cargar imagen
                <input hidden accept="image/*" type="file" onChange={handleFile} />
              </Button>
            </Box>
          </Box>
          <TextField label="Tag" value={slide.tag ?? ''} onChange={handleChange('tag')} variant='standard' fullWidth sx={{ mb: 1 }} />
          <TextField label="Promo" value={slide.promo ?? ''} onChange={handleChange('promo')} variant='standard' fullWidth sx={{ mb: 1 }} />
          <TextField label="Subtitle" value={slide.subtitle ?? ''} onChange={handleChange('subtitle')} variant='standard' fullWidth sx={{ mb: 2 }} />
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

export default SlideForm;
