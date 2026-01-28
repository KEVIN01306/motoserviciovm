import React, { useState } from 'react';
import { 
  Grid, 
  Card, 
  CardMedia, 
  Box, 
  Typography, 
  Button, 
  Fade,
  Dialog,
  IconButton
} from '@mui/material';
import { 
  PhotoLibrary as PhotoIcon, 
  Close as CloseIcon,
  ZoomIn as ZoomInIcon
} from '@mui/icons-material';
import TextField from '@mui/material/TextField';


const API_URL = import.meta.env.VITE_DOMAIN;
/**
 * Componente de Galería Adaptable
 * @param {Array} imagenes - Lista de objetos con id, imagen y descripcion
 */

type ImageGalleryProps = {
  imagenes: Array<{
    id: number | string;
    imagen: string;
    descripcion?: string;
  }>;
};

const ImageGallery = ({ imagenes = [] }: ImageGalleryProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [imagesPerRow, setImagesPerRow] = useState(3); // default 3 per row
  const [imagesPerRowInput, setImagesPerRowInput] = useState('3');

  // REGLA: Si la lista está vacía, no se muestra nada (ni el botón)
  if (!imagenes || imagenes.length === 0) return null;

  const handleImageClick = (idx: number) => {
    setSelectedIndex(idx);
    setModalOpen(true);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedIndex(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // Zoom con scroll
  const handleWheel = (e: React.WheelEvent<HTMLImageElement>) => {
    e.preventDefault();
    setZoom(z => Math.max(1, Math.min(4, z + (e.deltaY < 0 ? 0.2 : -0.2))));
  };

  // Arrastre para mover la imagen
  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    setDragging(true);
    setStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - start.x, y: e.clientY - start.y });
  };
  const handleMouseUp = () => setDragging(false);
  const handleMouseLeave = () => setDragging(false);

  // Touch para móvil
  const handleTouchStart = (e: React.TouchEvent<HTMLImageElement>) => {
    if (e.touches.length === 1) {
      setDragging(true);
      setStart({ x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y });
    }
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLImageElement>) => {
    if (!dragging || e.touches.length !== 1) return;
    setOffset({ x: e.touches[0].clientX - start.x, y: e.touches[0].clientY - start.y });
  };
  const handleTouchEnd = () => setDragging(false);

  // Calcular el size de Grid según imagesPerRow
  const gridSize = Math.max(1, Math.floor(12 / imagesPerRow));

  return (
    <Box sx={{ py: 4, textAlign: 'center' }}>
      {/* Botón de activación: Solo visible si la galería está cerrada */}
      {!isVisible && (
        <Button
          variant="contained"
          size="large"
          startIcon={<PhotoIcon />}
          onClick={() => setIsVisible(true)}
          sx={{
            borderRadius: '50px',
            textTransform: 'none',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 25px rgba(0,0,0,0.2)',
            },
            transition: 'all 0.3s'
          }}
        >
          Ver galería de imágenes ({imagenes.length})
        </Button>
      )}

      {/* Input para controlar imágenes por fila */}
      {isVisible && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <TextField
            type="number"
            label="Imágenes por fila"
            size="small"
            inputProps={{ min: 1, max: 6, step: 1 }}
            value={imagesPerRowInput}
            onChange={e => {
              const val = e.target.value;
              setImagesPerRowInput(val);
              const num = Number(val);
              if (!isNaN(num) && num >= 1 && num <= 6) setImagesPerRow(num);
            }}
            onBlur={() => {
              let num = Number(imagesPerRowInput);
              if (isNaN(num) || num < 1) num = 1;
              if (num > 6) num = 6;
              setImagesPerRow(num);
              setImagesPerRowInput(String(num));
            }}
            sx={{ width: 160 }}
          />
        </Box>
      )}

      {/* Contenedor de la Galería con animación Fade */}
      <Fade in={isVisible} unmountOnExit>
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Button 
              onClick={() => setIsVisible(false)} 
              variant="outlined" 
              color="error"
              startIcon={<CloseIcon />}
              sx={{ borderRadius: '20px' }}
            >
              Cerrar
            </Button>
          </Box>

          <Grid container spacing={3}>
            {imagenes.map((item, idx) => (
              <Grid size={gridSize} key={item.id} >
                <Card 
                  sx={{ 
                    borderRadius: 4, 
                    overflow: 'hidden', 
                    position: 'relative',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', cursor: 'zoom-in' }} onClick={() => handleImageClick(idx)}>
                    <CardMedia
                      component="img"
                      height="350"
                      image={`${API_URL}/${item.imagen}`}
                      alt={item.descripcion}
                      sx={{ objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as any).src= "https://via.placeholder.com/400x300?text=Imagen+no+disponible";
                      }}
                    />
                    <IconButton size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.4)', color: 'white', zIndex: 2 }}>
                      <ZoomInIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  {/* Overlay para la descripción */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      p: 2,
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {item.descripcion || "Sin descripción"}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Ref: #{item.id}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Fade>
      {/* Modal de imagen fullscreen con zoom y arrastre */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        fullScreen
        PaperProps={{ sx: { bgcolor: 'rgba(0,0,0,0.95)' } }}
      >
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
          <IconButton onClick={handleCloseModal} sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.3)' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        {selectedIndex !== null && (
          <Box
            sx={{
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              touchAction: 'none',
              cursor: dragging ? 'grabbing' : 'grab',
            }}
          >
            <img
              src={`${API_URL}/${imagenes[selectedIndex].imagen}`}
              alt={imagenes[selectedIndex].descripcion}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
                transition: dragging ? 'none' : 'transform 0.2s',
                userSelect: 'none',
                pointerEvents: 'auto',
              }}
              draggable={false}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </Box>
        )}
      </Dialog>
    </Box>
  );
};


export default ImageGallery;