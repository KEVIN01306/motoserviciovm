
import React, { useRef, useState } from 'react';
import { Box, Button, IconButton, Paper, TextField, Typography, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

type ImagenMeta = {
  descripcion?: string;
  preview?: string;
};

type Props = {
  value: { files: File[]; metas: ImagenMeta[] };
  onChange: (val: { files: File[]; metas: ImagenMeta[] }) => void;
};


const ImagenesEditorInput: React.FC<Props> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const files = value.files;
  const metas = value.metas;

  // Maneja la selección de archivo desde input file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesArr = e.target.files ? Array.from(e.target.files) : [];
    if (filesArr.length === 0) return;
    // Solo una imagen a la vez
    metas.forEach(m => { if (m.preview) URL.revokeObjectURL(m.preview); });
    const f = filesArr[0];
    const meta = { descripcion: '', preview: URL.createObjectURL(f) };
    onChange({ files: [...files, f], metas: [...metas, meta] });
    e.target.value = '';
  };

  // Maneja la descripción
  const handleDescripcion = (idx: number, desc: string) => {
    const newMetas = metas.map((m, i) => i === idx ? { ...m, descripcion: desc } : m);
    onChange({ files, metas: newMetas });
  };

  // Elimina imagen
  const handleRemove = (idx: number) => {
    const newFiles = files.filter((_, i) => i !== idx);
    const newMetas = metas.filter((_, i) => i !== idx);
    if (metas[idx]?.preview) URL.revokeObjectURL(metas[idx].preview!);
    onChange({ files: newFiles, metas: newMetas });
  };

  // Abre menú para elegir cámara o archivo
  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  // Lógica para abrir cámara en PC
  const handleOpenCameraModal = async () => {
    setAnchorEl(null);
    setCameraModalOpen(true);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play();
      }
    } catch (err) {
      setCameraModalOpen(false);
      alert('No se pudo acceder a la cámara');
    }
  };

  // Captura foto desde cámara en PC
  const handleTakePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], `foto_${Date.now()}.jpg`, { type: 'image/jpeg' });
          const meta = { descripcion: '', preview: URL.createObjectURL(file) };
          onChange({ files: [...files, file], metas: [...metas, meta] });
        }
      }, 'image/jpeg');
    }
    handleCloseCameraModal();
  };

  // Cierra modal de cámara y libera recursos
  const handleCloseCameraModal = () => {
    setCameraModalOpen(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Lógica para menú: si es móvil, usar input con capture, si es PC, abrir modal
  const handleCameraOption = () => {
    setAnchorEl(null);
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile) {
      cameraInputRef.current?.click();
    } else {
      handleOpenCameraModal();
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 1 }}>Subir imágenes (una a una, cámara o archivo)</Box>
      <Button
        variant="outlined"
        startIcon={<AddPhotoAlternateIcon />}
        onClick={handleMenuClick}
      >
        Agregar imagen
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleCameraOption}>
          <PhotoCameraIcon sx={{ mr: 1 }} /> Tomar foto
        </MenuItem>
        <MenuItem onClick={() => { setAnchorEl(null); fileInputRef.current?.click(); }}>
          <CloudUploadIcon sx={{ mr: 1 }} /> Subir archivo
        </MenuItem>
      </Menu>
      {/* Input para archivo */}
      <input
        hidden
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {/* Input para cámara móvil */}
      <input
        hidden
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleFileChange}
      />

      {metas.length > 0 && (
        <Paper sx={{ mt: 2, p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {metas.map((m, idx) => (
              <Paper key={idx} sx={{ p: 1, width: 160 }}>
                {m.preview ? (
                  <img
                    src={m.preview}
                    alt={`img-${idx}`}
                    style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 4 }}
                  />
                ) : (
                  <Box sx={{ width: '100%', height: 90, bgcolor: '#f0f0f0' }} />
                )}
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Descripción"
                  value={m.descripcion}
                  onChange={e => handleDescripcion(idx, e.target.value)}
                  sx={{ mt: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <IconButton size="small" onClick={() => handleRemove(idx)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* Modal de cámara para PC */}
      <Dialog open={cameraModalOpen} onClose={handleCloseCameraModal} fullWidth maxWidth="sm">
        <DialogTitle>Capturar Fotografía</DialogTitle>
        <DialogContent>
          <Box sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'black', lineHeight: 0 }}>
            <video ref={videoRef} style={{ width: '100%', transform: 'scaleX(-1)' }} playsInline />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseCameraModal} color="inherit">Cancelar</Button>
          <Button variant="contained" startIcon={<PhotoCameraIcon />} onClick={handleTakePhoto}>Capturar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};



export default ImagenesEditorInput;