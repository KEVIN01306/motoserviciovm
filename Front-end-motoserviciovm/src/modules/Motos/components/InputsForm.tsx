import { Grid, TextField, Autocomplete, Box, IconButton, Button, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Controller, type Control, type UseFormRegister } from "react-hook-form";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState, useRef } from "react";
import type { motoType } from "../../../types/motoType";
import type { UserGetType } from "../../../types/userType";
import type { modeloGetType } from "../../../types/modeloType";
import { getUsers } from "../../../services/users.services";
import { getModelos } from "../../../services/modelo.services";
import ModalModeloCreate from "../../Modelos/components/ModalModeloCreate";

type Props = {
  control: Control<motoType, any>;
  register: UseFormRegister<motoType>;
  errors: any;
};

const InputsForm = ({ control, register, errors }: Props) => {
  const [usersOptions, setUsersOptions] = useState<UserGetType[]>([]);
  const [modelosOptions, setModelosOptions] = useState<modeloGetType[]>([]);
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
            const newFile = new File([blob], file.name || 'avatar.jpg', { type: 'image/jpeg' });
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
      // set File directly so submission can detect and send multipart/form-data
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
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
      const resized = await resizeFile(file, 1024, 0.8);
      if (currentFieldRef.current) currentFieldRef.current.onChange(resized);
    }, 'image/jpeg', 0.8);
    setCameraModalOpen(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const handleCloseCameraModal = () => {
    setCameraModalOpen(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const updateModelos = async () => {
    await setModelosOptions(await getModelos());
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [u, m] = await Promise.all([getUsers(), getModelos()]);
        setUsersOptions(u);
        setModelosOptions(m);
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
          {...register("placa")}
          label="Placa"
          placeholder="ABC123"
          fullWidth
          variant="standard"
          error={!!errors.placa}
          helperText={errors.placa?.message}
        />
      </Grid>

      <Dialog open={cameraModalOpen} onClose={handleCloseCameraModal} fullWidth maxWidth="sm">
        <DialogTitle>Tomar foto</DialogTitle>
        <DialogContent>
          <video ref={videoRef} style={{ width: '100%' }} playsInline />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCameraModal}>Cancelar</Button>
          <Button variant="contained" onClick={handleTakePhoto}>Capturar</Button>
        </DialogActions>
      </Dialog>


      <Grid size={12}>
        <Controller
          name="avatar"
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
                        alt="avatar"
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
                      id="moto-avatar-input-camera"
                      ref={cameraInputRef}
                      type="file"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileChange(e, field)}
                    />
                    <input
                      accept="image/*"
                      id="moto-avatar-input-file"
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
                {errors.avatar && (
                  <Box component="span" color="error.main" fontSize={12}>
                    {errors.avatar?.message}
                  </Box>
                )}
              </Box>
            );
          }}
        />
      </Grid>

      {/* Campo calcomania, igual que avatar pero acepta PDF y pregunta si tomar foto o elegir archivo */}
      <Grid size={12}>
        <Controller
          name="calcomania"
          control={control}
          render={({ field }) => {
            // Refs y estado para inputs y menú
            const calcomaniaCameraInputRef = React.useRef<HTMLInputElement>(null);
            const calcomaniaFileInputRef = React.useRef<HTMLInputElement>(null);
            const [calcomaniaAnchorEl, setCalcomaniaAnchorEl] = React.useState<null | HTMLElement>(null);
            const [calcomaniaCameraModalOpen, setCalcomaniaCameraModalOpen] = React.useState(false);
            const calcomaniaVideoRef = React.useRef<HTMLVideoElement | null>(null);
            const calcomaniaStreamRef = React.useRef<MediaStream | null>(null);
            const API_URL = import.meta.env.VITE_DOMAIN;
            let srcToShow: string | undefined = undefined;
            let isPdf = false;
            if (field.value instanceof File) {
              try {
                if (field.value.type === 'application/pdf') {
                  isPdf = true;
                  srcToShow = URL.createObjectURL(field.value);
                } else {
                  srcToShow = URL.createObjectURL(field.value);
                }
              } catch (e) {
                srcToShow = undefined;
              }
            } else if (typeof field.value === 'string' && field.value.trim()) {
              const v = String(field.value).trim();
              if (v.endsWith('.pdf') || v.startsWith('data:application/pdf')) {
                isPdf = true;
              }
              if (v.startsWith('data:')) {
                srcToShow = v;
              } else if (v.startsWith('http://') || v.startsWith('https://')) {
                srcToShow = v;
              } else {
                srcToShow = `${API_URL}${v}`;
              }
            }
            // Lógica para tomar foto (solo imagen)
            const handleCalcomaniaFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
              const file = e.target.files?.[0];
              if (!file) return;
              field.onChange(file);
            };

            // Modal/canvas para tomar foto en PC
            React.useEffect(() => {
              if (!calcomaniaCameraModalOpen) return;
              let cancelled = false;
              const start = async () => {
                try {
                  const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                  if (cancelled) {
                    s.getTracks().forEach((t) => t.stop());
                    return;
                  }
                  if (calcomaniaVideoRef.current) {
                    calcomaniaVideoRef.current.srcObject = s;
                    await calcomaniaVideoRef.current.play();
                  }
                  calcomaniaStreamRef.current = s;
                } catch (err) {
                  setCalcomaniaCameraModalOpen(false);
                }
              };
              start();
              return () => {
                cancelled = true;
                if (calcomaniaStreamRef.current) {
                  calcomaniaStreamRef.current.getTracks().forEach((t) => t.stop());
                  calcomaniaStreamRef.current = null;
                }
                if (calcomaniaVideoRef.current) {
                  try { calcomaniaVideoRef.current.pause(); } catch (e) {}
                  // @ts-ignore
                  calcomaniaVideoRef.current.srcObject = null;
                }
              };
            }, [calcomaniaCameraModalOpen]);

            const handleTakeCalcomaniaPhoto = (field: any) => {
              const video = calcomaniaVideoRef.current;
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
                const file = new File([blob], 'calcomania.jpg', { type: 'image/jpeg' });
                field.onChange(file);
              }, 'image/jpeg', 0.8);
              setCalcomaniaCameraModalOpen(false);
              if (calcomaniaStreamRef.current) {
                calcomaniaStreamRef.current.getTracks().forEach((t) => t.stop());
                calcomaniaStreamRef.current = null;
              }
            };

            const handleCloseCalcomaniaCameraModal = () => {
              setCalcomaniaCameraModalOpen(false);
              if (calcomaniaStreamRef.current) {
                calcomaniaStreamRef.current.getTracks().forEach((t) => t.stop());
                calcomaniaStreamRef.current = null;
              }
            };
            return (
              <Box display="flex" alignItems="center" gap={1}>
                {srcToShow ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    {isPdf ? (
                      <Button variant="outlined" onClick={() => window.open(srcToShow, '_blank')}>Ver PDF</Button>
                    ) : (
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
                          alt="calcomania"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    )}
                    <IconButton aria-label="eliminar archivo" onClick={() => field.onChange('')}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <input
                      accept="image/*"
                      capture="environment"
                      id="moto-calcomania-input-camera"
                      ref={calcomaniaCameraInputRef}
                      type="file"
                      style={{ display: 'none' }}
                      onChange={(e) => handleCalcomaniaFileChange(e, field)}
                    />
                    <input
                      accept="image/*,application/pdf"
                      id="moto-calcomania-input-file"
                      ref={calcomaniaFileInputRef}
                      type="file"
                      style={{ display: 'none' }}
                      onChange={(e) => handleCalcomaniaFileChange(e, field)}
                    />
                    <Button
                      variant="outlined"
                      component="button"
                      startIcon={<CloudUploadIcon />}
                      onClick={(e) => setCalcomaniaAnchorEl(e.currentTarget)}
                    >
                      Cargar calcomanía
                    </Button>
                    <Menu anchorEl={calcomaniaAnchorEl} open={Boolean(calcomaniaAnchorEl)} onClose={() => setCalcomaniaAnchorEl(null)}>
                      <MenuItem
                        onClick={() => {
                          setCalcomaniaAnchorEl(null);
                          const isMobile = /Mobi|Android/i.test(navigator.userAgent || '');
                          if (isMobile) {
                            calcomaniaCameraInputRef.current?.click();
                          } else {
                            setCalcomaniaCameraModalOpen(true);
                          }
                        }}
                      >
                        Tomar foto
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setCalcomaniaAnchorEl(null);
                          calcomaniaFileInputRef.current?.click();
                        }}
                      >
                        Elegir archivo
                      </MenuItem>
                    </Menu>

                    {/* Modal para tomar foto calcomania en PC */}
                    <Dialog open={calcomaniaCameraModalOpen} onClose={handleCloseCalcomaniaCameraModal} maxWidth="xs" fullWidth>
                      <DialogTitle>Tomar foto de calcomanía</DialogTitle>
                      <DialogContent>
                        <video ref={calcomaniaVideoRef} style={{ width: '100%' }} />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseCalcomaniaCameraModal}>Cancelar</Button>
                        <Button onClick={() => handleTakeCalcomaniaPhoto(field)} variant="contained">Tomar foto</Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )}
                {errors.calcomania && (
                  <Box component="span" color="error.main" fontSize={12}>
                    {errors.calcomania?.message}
                  </Box>
                )}
              </Box>
            );
          }}
        />
      </Grid>

      <Grid container size={12} alignItems="start">
        <Grid size={10}>
            <Controller
            name="modeloId"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={modelosOptions}
                getOptionLabel={(opt) => opt.modelo ?? ""}
                value={modelosOptions.find((m) => String(m.id) === String(field.value)) ?? null}
                onChange={(_, value) => field.onChange(value ? value.id : 0)}
                isOptionEqualToValue={(opt, val) => String(opt.id) === String((val as any)?.id)}
                renderInput={(params) => (
                  <TextField {...params} label="Modelo" variant="standard" />
                )}
              />
            )}
            />
        </Grid>
          <ModalModeloCreate onFinish={() => updateModelos()} />
      </Grid>

      <Grid size={12}>
        <Controller
          name="users"
          control={control}
          render={({ field }) => (
            <Autocomplete
              multiple
              options={usersOptions}
              getOptionLabel={(opt) => `${opt.primerNombre} ${opt.primerApellido} - ${opt.dpi || opt.nit || ""}`}
              value={(field.value || []).map((id: number) => usersOptions.find((u) => String(u.id) === String(id))).filter(Boolean) as UserGetType[]}
              onChange={(_, value) => field.onChange(value.map((v: UserGetType) => v.id))}
              isOptionEqualToValue={(opt, val) => String(opt.id) === String((val as any)?.id)}
              renderInput={(params) => (
                <TextField {...params} label="Usuarios" variant="standard" />
              )}
            />
          )}
        />
      </Grid>

    </>
  );
};

export default InputsForm;
