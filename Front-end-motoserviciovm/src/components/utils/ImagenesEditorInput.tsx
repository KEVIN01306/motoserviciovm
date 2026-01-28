
import React, { useRef, useState } from 'react';
import { Box, Button, IconButton, Paper, TextField, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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

  // Redimensiona la imagen a 1280px antes de guardar, calidad mínima en móvil
  const resizeImage = (file: File, maxDim = 1280): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((maxDim / width) * height);
            width = maxDim;
          } else {
            width = Math.round((maxDim / height) * width);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No se pudo crear el contexto de canvas');
        ctx.drawImage(img, 0, 0, width, height);
        // Calidad mínima en móvil
        const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
        const quality = isMobile ? 0.3 : 0.8;
        canvas.toBlob(blob => {
          if (blob) {
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' }));
          } else {
            reject('No se pudo redimensionar la imagen');
          }
        }, 'image/jpeg', quality);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  // Maneja la selección de archivo desde input file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesArr = e.target.files ? Array.from(e.target.files) : [];
    if (filesArr.length === 0) return;
    metas.forEach(m => { if (m.preview) URL.revokeObjectURL(m.preview); });
    const f = filesArr[0];
    try {
      const resized = await resizeImage(f);
      const meta = { descripcion: '', preview: URL.createObjectURL(resized) };
      onChange({ files: [...files, resized], metas: [...metas, meta] });
    } catch {
      // fallback: usar original
      const meta = { descripcion: '', preview: URL.createObjectURL(f) };
      onChange({ files: [...files, f], metas: [...metas, meta] });
    }
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
      // Forzar capture sólo en móviles
      if (cameraInputRef.current) {
        cameraInputRef.current.setAttribute('capture', 'environment');
      }
      cameraInputRef.current?.click();
    } else {
      if (cameraInputRef.current) {
        cameraInputRef.current.removeAttribute('capture');
      }
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
      {/* Input para archivo o cámara, con capture sólo en móviles */}
      <input
        hidden
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <input
        hidden
        type="file"
        accept="image/*"
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