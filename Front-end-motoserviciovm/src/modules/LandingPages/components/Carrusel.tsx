import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, useTheme, Fade, ThemeProvider, createTheme } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// --- INTERFACES Y DATOS ---

// Interfaz para definir la estructura de un elemento de imagen
interface ImageItem {
  label: string;
  imgPath: string;
}

const IMAGES: ImageItem[] = [
  {
    label: 'Vista de la ciudad de noche',
    imgPath: '/public/carrusel/carrusel_1.png',
  },
  {
    label: 'Montañas y naturaleza',
    imgPath: '/public/carrusel/carrusel_1.png',
  },
  {
    label: 'Espacio y estrellas',
    imgPath: '/public/carrusel/carrusel_1.png',
  },
  {
    label: 'Playa al atardecer',
    imgPath: '/public/carrusel/carrusel_1.png',
  },
];

// -----------------------------------------------------------
// Componente 1: CarouselItem (Muestra la imagen con transición)
// -----------------------------------------------------------
interface CarouselItemProps {
  image: ImageItem;
  isActive: boolean;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ image, isActive }) => {
  return (
    <Fade in={isActive} timeout={1000}>
      <Box
        component="img"
        sx={{
          objectFit: 'cover',
          width: '100%',
          height: 'auto', 
          maxHeight: '80vh',
          display: isActive ? 'block' : 'none',
        }}
        src={image.imgPath}
        alt={image.label}
        // Tipado explícito para el evento de error
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
          (e.target as HTMLImageElement).onerror = null; 
          (e.target as HTMLImageElement).src = 'https://placehold.co/1200x500/808080/white?text=Error+de+Carga'; 
        }}
      />
    </Fade>
  );
};

// -----------------------------------------------------------
// Componente 2: NavigationDots (Muestra los indicadores inferiores)
// -----------------------------------------------------------
interface NavigationDotsProps {
  totalSteps: number;
  activeStep: number;
  handleDotClick: (index: number) => void;
}

const NavigationDots: React.FC<NavigationDotsProps> = ({ totalSteps, activeStep, handleDotClick }) => {
  const theme = useTheme();

  return (
    <Box sx={{ position: 'absolute', bottom: 16, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 10 }}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <IconButton
          key={index}
          onClick={() => handleDotClick(index)}
          size="small"
          sx={{
            padding: 0.5,
            color: index === activeStep
              ? theme.palette.primary.main
              : 'rgba(255, 255, 255, 0.7)',
            filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.8))', 
          }}
        >
          <FiberManualRecordIcon fontSize="small" />
        </IconButton>
      ))}
    </Box>
  );
};


// -----------------------------------------------------------
// Componente 3: FullScreenCarousel (Lógica principal, auto-play y navegación)
// -----------------------------------------------------------
interface FullScreenCarouselProps {
  images: ImageItem[];
  autoPlayInterval?: number;
}

const FullScreenCarousel: React.FC<FullScreenCarouselProps> = ({ images, autoPlayInterval = 4000 }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const maxSteps: number = images.length;

  // Función para pasar a la siguiente imagen (con ciclo infinito)
  const handleNext = useCallback(() => {
    setActiveIndex((prevActiveIndex) => (prevActiveIndex + 1) % maxSteps);
  }, [maxSteps]);

  // Función para volver a la imagen anterior (con ciclo infinito)
  const handleBack = useCallback(() => {
    setActiveIndex((prevActiveIndex) => (prevActiveIndex - 1 + maxSteps) % maxSteps);
  }, [maxSteps]);

  // Lógica de Auto-Play: Se ejecuta cada 'autoPlayInterval'
  useEffect(() => {
    if (maxSteps <= 1) return; 

    // Uso de window.setInterval para asegurar el tipo correcto
    const intervalId: number = window.setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => window.clearInterval(intervalId);
  }, [handleNext, autoPlayInterval, maxSteps]);

  return (
    <Box 
      sx={{ 
        width: '100%', 
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      {/* -------------------- Contenedor de Imágenes -------------------- */}
      <Box sx={{ position: 'relative', minHeight: { xs: 200, sm: 300 } }}>
        {images.map((image, index) => (
          <Box 
            key={index} 
            // Controlamos la posición para que solo una ocupe espacio relativo, 
            // pero todas las demás estén superpuestas (absolute).
            sx={{ position: index === activeIndex ? 'relative' : 'absolute', top: 0, width: '100%' }}
          >
            <CarouselItem 
              image={image} 
              isActive={index === activeIndex} 
            />
          </Box>
        ))}
      </Box>

      {/* -------------------- Botón Izquierda (Atrás) -------------------- */}
      <IconButton
        onClick={handleBack}
        size="large"
        disabled={maxSteps <= 1}
        sx={{
          position: 'absolute',
          top: '50%',
          left: 8,
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
          zIndex: 10,
        }}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>

      {/* -------------------- Botón Derecha (Siguiente) -------------------- */}
      <IconButton
        onClick={handleNext}
        size="large"
        disabled={maxSteps <= 1}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 8,
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
          zIndex: 10,
        }}
      >
        <KeyboardArrowRightIcon />
      </IconButton>
      
      {/* -------------------- Puntos de Navegación -------------------- */}
      <NavigationDots 
        totalSteps={maxSteps} 
        activeStep={activeIndex} 
        handleDotClick={setActiveIndex} 
      />
    </Box>
  );
};


// -----------------------------------------------------------
// Componente Principal: Carrusel (Contenedor de estilo y ejecución)
// -----------------------------------------------------------

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// El componente principal, ahora exportado como default, cumple con el requisito
export default function Carrusel() {
  return (
    <ThemeProvider theme={theme}>
      <Box className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
        <Box sx={{ width: '100%', maxWidth: '1400px' }}>
          {/* Pasamos el array IMAGES al componente FullScreenCarousel */}
          <FullScreenCarousel images={IMAGES} autoPlayInterval={4000} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}