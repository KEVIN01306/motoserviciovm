import { useState, useRef } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Save as SaveIcon, 
  Close as CloseIcon 
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: { main: '#2563eb' },
  },
  shape: { borderRadius: 8 },
});

const SignatureField = ({ onSaveSignature }) => {
  const [open, setOpen] = useState(false);
  const [internalSignature, setInternalSignature] = useState(null); 
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }, 100);
  };

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const save = () => {
    const canvas = canvasRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCtx.fillStyle = '#fff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);
    
    const jpgBase64 = tempCanvas.toDataURL('image/jpeg', 0.8);
    
    // Guardamos localmente para mostrar la vista previa
    setInternalSignature(jpgBase64);
    
    // Pasamos la variable al componente padre si la prop existe
    if (onSaveSignature) {
      onSaveSignature(jpgBase64);
    }
    
    setOpen(false);
  };

  const clear = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const removeSignature = () => {
    setInternalSignature(null);
    if (onSaveSignature) onSaveSignature(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {!internalSignature ? (
        <Button 
          variant="outlined" 
          startIcon={<EditIcon />} 
          onClick={handleOpen}
          sx={{ textTransform: 'none' }}
        >
          Firmar Hoja de recepcion
        </Button>
      ) : (
        <Paper variant="outlined" sx={{ p: 1, position: 'relative', bgcolor: '#fff' }}>
          <img src={internalSignature} alt="Firma" style={{ maxHeight: 80, display: 'block' }} />
          <IconButton 
            size="small" 
            onClick={removeSignature}
            sx={{ 
              position: 'absolute', 
              top: -12, 
              right: -12, 
              bgcolor: 'error.main', 
              color: 'white', 
              '&:hover': { bgcolor: 'error.dark' } 
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Paper>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Realice su firma</Typography>
          <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: 250, bgcolor: '#f5f5f5', touchAction: 'none' }}>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={() => setIsDrawing(false)}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={() => setIsDrawing(false)}
            style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={clear} startIcon={<DeleteIcon />} color="inherit">Limpiar</Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={save} variant="contained" startIcon={<SaveIcon />}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SignatureField;