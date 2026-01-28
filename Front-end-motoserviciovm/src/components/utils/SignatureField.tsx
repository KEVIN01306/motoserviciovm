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
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Save as SaveIcon, 
  Close as CloseIcon 
} from '@mui/icons-material';


/**
 * Props:
 * - onSaveSignature: callback para enviar la firma (base64 o File)
 * - initialValue: string (url or base64) para mostrar firma inicial
 */
type SignatureFieldProps = {
  onSaveSignature: (signature: string | File | null) => void;
  initialValue?: string | null;
  text?: string;
};
const SignatureField = ({ onSaveSignature, initialValue, text }: SignatureFieldProps) => {
  const [open, setOpen] = useState(false);
  const [internalSignature, setInternalSignature] = useState(initialValue ?? null); 
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
      const canvas = canvasRef.current as unknown as HTMLCanvasElement;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        // Si hay firma inicial y es base64, dibujarla
        if (internalSignature && typeof internalSignature === 'string' && internalSignature.startsWith('data:image')) {
          const img = new window.Image();
          img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          img.src = internalSignature;
        }
      }
    }, 100);
  };

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();

    const clientX = (e as any).touches ? (e as any).touches[0].clientX : (e as any).clientX;
    const clientY = (e as any).touches ? (e as any).touches[0].clientY : (e as any).clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const { x, y } = getPos(e);
    const ctx = (canvasRef.current as unknown as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    const ctx = (canvasRef.current as unknown as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const save = () => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;
    tempCtx.fillStyle = '#fff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);
    const jpgBase64 = tempCanvas.toDataURL('image/jpeg', 0.8);
    setInternalSignature(jpgBase64);
    if (onSaveSignature) {
      // Si quieres enviar como File, descomenta lo siguiente:
      // const arr = jpgBase64.split(',');
      // const mime = arr[0].match(/:(.*?);/)[1];
      // const bstr = atob(arr[1]);
      // let n = bstr.length;
      // const u8arr = new Uint8Array(n);
      // while (n--) u8arr[n] = bstr.charCodeAt(n);
      // const file = new File([u8arr], 'firma.jpg', { type: mime });
      // onSaveSignature(file);
      onSaveSignature(jpgBase64);
    }
    setOpen(false);
  };

  const clear = () => {
    const ctx = (canvasRef.current as unknown as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, (canvasRef.current as unknown as HTMLCanvasElement).width, (canvasRef.current as unknown as HTMLCanvasElement).height);
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
          {text}
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