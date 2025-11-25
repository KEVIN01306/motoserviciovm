import { Grid, TextField, Autocomplete, Box, IconButton, Button, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Controller, type Control, type UseFormRegister } from "react-hook-form";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState, useRef } from "react";
import type { motoType } from "../../../types/motoType";
import type { UserGetType } from "../../../types/userType";
import type { modeloGetType } from "../../../types/modeloType";
import { getUsers } from "../../../services/users.services";
import { getModelos } from "../../../services/modelo.services";

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
        videoRef.current.srcObject = null;
      }
    };
  }, [cameraModalOpen]);

  const handleTakePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const base64Only = dataUrl.replace(/^data:.*;base64,/, '');
    if (currentFieldRef.current) currentFieldRef.current.onChange(base64Only);
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
  // nothing else at component level; per-field camera modal state lives inside Controller render

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
            // keep a reference to the current field so modal handlers can set the value
            currentFieldRef.current = field;
            const fileToBase64 = (file: File) =>
              new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const result = String(reader.result || "");
                  const base64Only = result.replace(/^data:.*;base64,/, "");
                  resolve(base64Only);
                };
                reader.onerror = (e) => reject(e);
                reader.readAsDataURL(file);
              });

            const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const base64 = await fileToBase64(file);
                field.onChange(base64);
              } catch (err) {
                console.error(err);
              }
            };

            const srcToShow = field.value
              ? (String(field.value).trim().startsWith('data:') ? String(field.value).trim() : `data:image/jpeg;base64,${String(field.value).trim()}`)
              : undefined;

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
                    <>
                      <input
                        accept="image/*"
                        capture="environment"
                        id="moto-avatar-input-camera"
                        ref={cameraInputRef}
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                      <input
                        accept="image/*"
                        id="moto-avatar-input-file"
                        ref={fileInputRef}
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
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
                              // on mobile, trigger the input with capture; browser will usually open camera
                              cameraInputRef.current?.click();
                            } else {
                              // on desktop, open an in-page camera dialog
                              setCameraModalOpen(true);
                            }
                          }}
                        >
                          Tomar foto
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setAnchorEl(null);
                            // open file picker
                            fileInputRef.current?.click();
                          }}
                        >
                          Elegir archivo
                        </MenuItem>
                      </Menu>
                    </>
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

      <Grid size={12}>
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
