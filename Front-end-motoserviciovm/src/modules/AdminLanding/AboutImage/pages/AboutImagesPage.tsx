import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, CircularProgress, IconButton, Card, CardMedia, CardActions } from '@mui/material';
import { Trash2, Upload, Plus } from 'lucide-react';
import * as aboutImageSvc from '../../../../services/aboutImage.services';
import type { AboutImageType } from '../../../../types/aboutImageType';
import LoadingMoto from '../../../../components/utils/LoadginMoto';
import { successToast } from '../../../../utils/toast';

const URL_DOMAIN = import.meta.env.VITE_DOMAIN;

const AboutImagesPage: React.FC = () => {
  const [images, setImages] = useState<AboutImageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await aboutImageSvc.getAboutImages();
      setImages(res || []);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, imageId?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('image', file);

    try {
      setUploading(imageId ?? -1);
      if (imageId) {
        await aboutImageSvc.putAboutImage(imageId, fd);
        successToast('Imagen actualizada con éxito');
      } else {
        await aboutImageSvc.postAboutImage(fd);
        successToast('Imagen creada con éxito');
      }
      await fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm('¿Eliminar esta imagen?')) return;
    try {
      await aboutImageSvc.deleteAboutImage(id);
      successToast('Imagen eliminada con éxito');
      await fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error al eliminar la imagen');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Imágenes About
        </Typography>
        <Button variant="contained" startIcon={<Plus size={20} />} component="label">
          Agregar Imagen
          <input hidden accept="image/*" type="file" onChange={(e) => handleFileChange(e)} />
        </Button>
      </Box>

      {loading ? (
        <LoadingMoto />
      ) : images.length === 0 ? (
        <Typography>No hay imágenes aún. Agrega una nueva.</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
          {images.map((img) => (
            <Card key={img.id} sx={{ position: 'relative' }}>
              {uploading === img.id && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              <CardMedia component="img" height="200" image={URL_DOMAIN + img.image} alt="About image" sx={{ objectFit: 'cover' }} />
              <CardActions sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
                <Button size="small" startIcon={<Upload size={16} />} component="label">
                  Actualizar
                  <input hidden accept="image/*" type="file" onChange={(e) => handleFileChange(e, img.id)} />
                </Button>
                <IconButton size="small" color="error" onClick={() => handleDelete(img.id)} title="Eliminar">
                  <Trash2 size={18} />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AboutImagesPage;
