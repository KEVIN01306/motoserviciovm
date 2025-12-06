import { Grid, TextField, Autocomplete, Box, IconButton, Button, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Controller, type Control, type UseFormRegister } from "react-hook-form";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState, useRef } from "react";
import type { ProductoType } from "../../../types/productoType";
import type { CategoriaProductoType } from "../../../types/categoriaProductoType";
import { getCategorias } from "../../../services/categoriaProducto.services";

type Props = {
  control: Control<ProductoType, any>;
  register: UseFormRegister<ProductoType>;
  errors: any;
};

const InputsForm = ({ control, register, errors }: Props) => {
  const [categoriasOptions, setCategoriasOptions] = useState<CategoriaProductoType[]>([]);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const currentFieldRef = useRef<any>(null);

  useEffect(() => {
    if (!cameraModalOpen) return;
    let cancelled = false;
    const start = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error('No se pudo acceder a la cámara', err);
        setCameraModalOpen(false);
      }
    };
    start();
    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        try { videoRef.current.pause(); } catch (e) {}
        // @ts-ignore
        videoRef.current.srcObject = null;
      }
    };
  }, [cameraModalOpen]);

  const resizeFile = (file: File, maxWidth = 1024, quality = 0.8) =>
    new Promise<File>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width: w, height: h } = img;
          if (w > maxWidth) {
            const ratio = maxWidth / w;
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(file);
          ctx.drawImage(img, 0, 0, w, h);
          canvas.toBlob((blob) => {
            if (!blob) return resolve(file);
            const newFile = new File([blob], file.name || 'imagen.jpg', { type: 'image/jpeg' });
            resolve(newFile);
          }, 'image/jpeg', quality);
        };
        img.onerror = () => resolve(file);
        img.src = String(reader.result || '');
      };
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resized = await resizeFile(file, 1024, 0.8);
      field.onChange(resized);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTakePhoto = async () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    const maxWidth = 1024;
    let drawW = w;
    let drawH = h;
    if (w > maxWidth) {
      const ratio = maxWidth / w;
      drawW = Math.round(w * ratio);
      drawH = Math.round(h * ratio);
    }
    canvas.width = drawW;
    canvas.height = drawH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, drawW, drawH);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'imagen.jpg', { type: 'image/jpeg' });
      const resized = await resizeFile(file, 1024, 0.8);
      if (currentFieldRef.current) currentFieldRef.current.onChange(resized);
    }, 'image/jpeg', 0.8);
    setCameraModalOpen(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const c = await getCategorias();
        setCategoriasOptions(c);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <>
      <Grid size={12}>
        <TextField
          {...register("nombre")}
          label="Nombre"
          placeholder="Nombre del producto"
          fullWidth
          variant="standard"
          error={!!errors.nombre}
          helperText={errors.nombre?.message}
        />
      </Grid>

      <Grid size={12}>
        <TextField
          {...register("descripcion")}
          label="Descripción"
          placeholder="Descripción"
          fullWidth
          variant="standard"
          multiline
          minRows={3}
          error={!!errors.descripcion}
          helperText={errors.descripcion?.message}
        />
      </Grid>

      <Grid size={12}>
        <TextField
          {...register("precio", { valueAsNumber: true })}
          label="Precio"
          placeholder="0.00"
          fullWidth
          variant="standard"
          type="number"
          error={!!errors.precio}
          helperText={errors.precio?.message}
        />
      </Grid>

      <Grid size={12}>
        <Controller
          name="imagen"
          control={control}
          render={({ field }) => {
            currentFieldRef.current = field;
            const API_URL = import.meta.env.VITE_DOMAIN;
            let srcToShow: string | undefined = undefined;

            if (field.value instanceof File) {
              try {
                srcToShow = URL.createObjectURL(field.value);
              } catch (e) {
                srcToShow = undefined;
              }
            } else if (typeof field.value === 'string' && field.value.trim()) {
              const v = String(field.value).trim();
              if (v.startsWith('data:')) {
                srcToShow = v;
              } else if (v.startsWith('http://') || v.startsWith('https://')) {
                srcToShow = v;
              } else {
                srcToShow = `${API_URL}${v}`;
              }
            }

            return (
              <Box display="flex" alignItems="center" gap={1}>
                {srcToShow ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 160,
                        height: 90,
                        borderRadius: 1,
                        overflow: 'hidden',
                        bgcolor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img
                        src={srcToShow}
                        alt="imagen"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                    <IconButton aria-label="eliminar imagen" onClick={() => field.onChange('')}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <input
                      accept="image/*"
                      capture="environment"
                      id="producto-imagen-input-camera"
                      ref={cameraInputRef}
                      type="file"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileChange(e, field)}
                    />
                    <input
                      accept="image/*"
                      id="producto-imagen-input-file"
                      ref={fileInputRef}
                      type="file"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileChange(e, field)}
                    />

                    <Button
                      variant="outlined"
                      component="button"
                      startIcon={<CloudUploadIcon />}
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                      Cargar imagen
                    </Button>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                      <MenuItem
                        onClick={() => {
                          setAnchorEl(null);
                          const isMobile = /Mobi|Android/i.test(navigator.userAgent || '');
                          if (isMobile) {
                            cameraInputRef.current?.click();
                          } else {
                            setCameraModalOpen(true);
                          }
                        }}
                      >
                        Tomar foto
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setAnchorEl(null);
                          fileInputRef.current?.click();
                        }}
                      >
                        Elegir archivo
                      </MenuItem>
                    </Menu>
                  </>
                )}
                {errors.imagen && (
                  <Box component="span" color="error.main" fontSize={12}>
                    {errors.imagen?.message}
                  </Box>
                )}
              </Box>
            );
          }}
        />
      </Grid>

      <Dialog open={cameraModalOpen} onClose={() => setCameraModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Tomar foto</DialogTitle>
        <DialogContent>
          <video ref={videoRef} style={{ width: '100%' }} playsInline />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCameraModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleTakePhoto}>Capturar</Button>
        </DialogActions>
      </Dialog>

      <Grid size={12}>
        <Controller
          name="categoriaId"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={categoriasOptions}
              getOptionLabel={(opt) => opt.categoria ?? ""}
              value={categoriasOptions.find((m) => String(m.id) === String(field.value)) ?? null}
              onChange={(_, value) => field.onChange(value ? value.id : undefined)}
              isOptionEqualToValue={(opt, val) => String(opt.id) === String((val as any)?.id)}
              renderInput={(params) => (
                <TextField {...params} label="Categoría" variant="standard" />
              )}
            />
          )}
        />
      </Grid>

      <Grid size={12}>
        <TextField
          {...register("cantidad", { valueAsNumber: true })}
          label="Cantidad"
          placeholder="0"
          fullWidth
          variant="standard"
          type="number"
          error={!!errors.cantidad}
          helperText={errors.cantidad?.message}
        />
      </Grid>
    </>
  );
};

export default InputsForm;
