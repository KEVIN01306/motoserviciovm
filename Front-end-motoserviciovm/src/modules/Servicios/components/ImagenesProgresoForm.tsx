import React, { useState } from 'react';
import ImagenesEditorInput from '../../../components/utils/ImagenesEditorInput';
import { Button, Paper, Typography } from '@mui/material';

interface ImagenMeta {
  descripcion?: string;
  preview?: string;
}

interface Props {
  onSubmit: (data: { files: File[]; metas: ImagenMeta[] }) => void;
  loading?: boolean;
}

const ImagenesProgresoForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const [imagenes, setImagenes] = useState<{ files: File[]; metas: ImagenMeta[] }>({ files: [], metas: [] });

  // Solo enviar las descripciones tal cual, el prefijo se agrega en el servicio
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ files: imagenes.files, metas: imagenes.metas });
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }} component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ mb: 2 }}>Agregar imágenes al servicio</Typography>
      <ImagenesEditorInput value={imagenes} onChange={setImagenes} />
      <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading || imagenes.files.length === 0}>
        Subir imágenes
      </Button>
    </Paper>
  );
};

export default ImagenesProgresoForm;
