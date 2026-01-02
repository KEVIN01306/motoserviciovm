import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  Box, 
  Typography, 
  Button, 
  Fade,
  Paper
} from '@mui/material';
import { 
  PhotoLibrary as PhotoIcon, 
  Close as CloseIcon,
  Collections as CollectionsIcon 
} from '@mui/icons-material';


const API_URL = import.meta.env.VITE_DOMAIN;
/**
 * Componente de Galería Adaptable
 * @param {Array} imagenes - Lista de objetos con id, imagen y descripcion
 */
const ImageGallery = ({ imagenes = [] }) => {
  const [isVisible, setIsVisible] = useState(false);

  // REGLA: Si la lista está vacía, no se muestra nada (ni el botón)
  if (!imagenes || imagenes.length === 0) return null;

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
            {imagenes.map((item) => (
              // PC: md={6} (mitad de pantalla) | Móvil: xs={12} (tamaño completo)
              <Grid size={{ xs: 12, md: 6 }} md={6} key={item.id} >
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
                  <CardMedia
                    component="img"
                    height="350"
                    image={`${API_URL}/${item.imagen}`} // Placeholder funcional. Reemplazar con item.imagen en tu app
                    alt={item.descripcion}
                    sx={{ 
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=Imagen+no+disponible";
                    }}
                  />
                  
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
    </Box>
  );
};


export default ImageGallery;