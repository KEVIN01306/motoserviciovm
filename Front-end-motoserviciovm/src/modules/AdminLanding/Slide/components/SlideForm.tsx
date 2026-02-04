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
  const [preview, setPreview] = useState<string | undefined>(initial?.image ? `${URL_DOMAIN}${initial.image}` : undefined);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSlide(initial ?? {} as SlideType);
    setPreview(initial?.image ? `${URL_DOMAIN}${initial.image}` : undefined);
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

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          let quality = 0.8;

          // Reducir dimensiones si es muy grande
          if (width > 2000 || height > 2000) {
            const ratio = Math.min(2000 / width, 2000 / height);
            width *= ratio;
            height *= ratio;
          }

          const ctx = canvas.getContext('2d')!;
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Reducir calidad hasta obtener < 300KB
          const compressToSize = (targetSize: number): void => {
            canvas.toBlob(
              (blob) => {
                if (blob && blob.size > targetSize && quality > 0.1) {
                  quality -= 0.1;
                  compressToSize(targetSize);
                } else if (blob) {
                  resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                }
              },
              'image/jpeg',
              quality
            );
          };

          compressToSize(300 * 1024); // 300 KB
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f) {
      const compressed = await compressImage(f);
      setFile(compressed);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      if (file) fd.append('image', file);
      fd.append('tag', slide.tag ?? '');
      fd.append('promo', slide.promo ?? '');
      fd.append('subtitle', slide.subtitle ?? '');
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
            <Avatar variant="rounded" src={preview} sx={{ width: 120, height: 70 }} />
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
