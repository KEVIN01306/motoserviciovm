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
import { Edit, Delete, Plus } from 'lucide-react';
import SlideForm from '../components/SlideForm';
import * as slideSvc from '../../../../services/slide.services';
import type { SlideType } from '../../../../types/slideType';
import HeroSlider from '../../../LandingPages/components/HeroSlider';
import LoadingMoto from '../../../../components/utils/LoadginMoto';
import { successToast } from '../../../../utils/toast';


const URL_DOMAIN = import.meta.env.VITE_DOMAIN;

const SlidesPage: React.FC = () => {
  const [slides, setSlides] = useState<SlideType[]>([]);
  const [selectedSlide, setSelectedSlide] = useState<SlideType | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);


  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await slideSvc.getSlides();
      setSlides(res || []);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (slide?: SlideType) => {
    setSelectedSlide(slide ?? null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedSlide(null);
  };

  const handleSaved = async () => {
    await fetchSlides();
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm('¿Eliminar este slide?')) return;
    try {
      await slideSvc.deleteSlide(id);
      successToast('Slide eliminado con éxito');
      await fetchSlides();
    } catch (error) {
      console.error('Error eliminando slide:', error);
    }
  };

  const saveFn = async (id: number | undefined, fd: FormData) => {
    if (id) {
      const result = await slideSvc.putSlide(id, fd);
      successToast('Slide actualizado con éxito');
      return result;
    } else {
      const result = await slideSvc.postSlide(fd);
      successToast('Slide creado con éxito');
      return result;
    }
  };

  return (
    <Box sx={{ p: 2 }} width={'100%'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Administrar Slides
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => handleOpenForm()}
        >
          Nuevo Slide
        </Button>
      </Box>

      {loading ? (
        <LoadingMoto />
      ) : slides.length === 0 ? (
        <Typography>No hay slides aún. Crea uno nuevo.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: 800, width: '100%', overflowX: 'auto', m: 2 }} >
          <Table stickyHeader sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Imagen</TableCell>
                <TableCell>Tag</TableCell>
                <TableCell>Promo</TableCell>
                <TableCell>Subtitle</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slides.map(slide => (
                <TableRow key={slide.id}>
                  <TableCell>
                    {slide.image ? (
                      <img src={URL_DOMAIN + slide.image} alt="slide" style={{ maxWidth: 200, maxHeight: 150 }} />
                    ) : (
                      <Typography variant="caption" color="textSecondary">Sin imagen</Typography>
                    )}
                  </TableCell>
                  <TableCell>{slide.tag ?? '-'}</TableCell>
                  <TableCell>{slide.promo ?? '-'}</TableCell>
                  <TableCell>{slide.subtitle ?? '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenForm(slide)}
                      title="Editar"
                    >
                      <Edit size={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(slide.id)}
                      color="error"
                      title="Eliminar"
                    >
                      <Delete size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <HeroSlider currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} slides={slides.map(slide => ({...slide, image: URL_DOMAIN + slide.image }))} loading={loading} />

      <SlideForm
        open={formOpen}
        initial={selectedSlide ?? undefined}
        onClose={handleCloseForm}
        onSaved={handleSaved}
        saveFn={saveFn}
      />
    </Box>
  );
};

export default SlidesPage;
