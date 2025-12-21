import { useEffect, useRef, useState } from "react";
import { Grid, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Box, TextField, Button, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { repuestoReparacionSchema } from "../../../zod/repuestosReparacion.schema";
import type { repuestoReparacionType } from "../../../types/repuestoReparacionType";
import { repuestoReparacionInitialState } from "../../../types/repuestoReparacionType";
import { postRepuestoReparacion, deleteRepuestoReparacion, setCheckedRepuestoReparacion } from "../../../services/repuestoReparacion.services";
import { getEnReparacion as getEnReparacionService } from "../../../services/enReparacion.services";
import ModalConfirm from "../../../components/utils/modals/ModalConfirm";
import { errorToast, successToast } from "../../../utils/toast";
import CardForm from "../../../components/utils/cards/CardForm";
import FormEstructure from "../../../components/utils/FormEstructure";
import Checkbox from "@mui/material/Checkbox";
import MoreVertIcon from '@mui/icons-material/MoreVert';

type Props = {
  reparacionId: number;
  initial?: repuestoReparacionType[];
  editable?: boolean; // when false, only show list (no create/delete)
};

const RepuestosTable = ({ reparacionId, initial = [], editable = true }: Props) => {
  const [items, setItems] = useState<repuestoReparacionType[]>(initial);
  const [loading, setLoading] = useState(false);
  const [toDelete, setToDelete] = useState<repuestoReparacionType | null>(null);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: {isSubmitting,errors},} = useForm<repuestoReparacionType>({
    resolver: zodResolver(repuestoReparacionSchema) as any,
    mode: "onSubmit",

    defaultValues: repuestoReparacionInitialState as any,
  });

  // load items from API
  const loadItems = async () => {
    try {
      setLoading(true);
      const en = await getEnReparacionService(reparacionId);
      const data = Array.isArray((en as any).repuestos) ? (en as any).repuestos : [];
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // fetch on mount or when reparacionId changes
  useEffect(() => {
    // always load to get freshest data
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reparacionId]);

  const onSubmit = async (data: repuestoReparacionType) => {
    try {
      const payload = { ...data, reparacionId } as repuestoReparacionType;
      // leave File as-is so the service can send multipart/form-data
      await postRepuestoReparacion(payload);
      reset(repuestoReparacionInitialState as any);
        successToast("Repuesto agregado");
        await loadItems();
    } catch (err: any) {
      errorToast("Error al agregar repuesto: " + err.message);
      errorToast(err.message);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteRepuestoReparacion(toDelete.id as number);
      setToDelete(null);
      await loadItems();
    } catch (err) {
      console.error(err);
    }
  };

  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [actionForId, setActionForId] = useState<number | null>(null);

  const openActionMenu = (e: React.MouseEvent<HTMLElement>, id: number) => {
    setActionAnchor(e.currentTarget);
    setActionForId(id);
  };

  const closeActionMenu = () => {
    setActionAnchor(null);
    setActionForId(null);
  };

  const handleMarkDelivered = async () => {
    if (!actionForId) return;
    try {
      await setCheckedRepuestoReparacion(actionForId, true);
      successToast('Repuesto marcado como entregado');
      closeActionMenu();
      await loadItems();
    } catch (err: any) {
      errorToast(err.message || 'Error al marcar entregado');
    }
  };

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resized = await resizeFile(file, 1024, 0.8);
      setValue("imagen", resized as any, { shouldValidate: true, shouldDirty: true });
    } catch (err) {
      console.error(err);
    }
  };

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
      setValue("imagen", resized as any, { shouldValidate: true, shouldDirty: true });
    }, 'image/jpeg', 0.8);
    setCameraModalOpen(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  return (
    <>
      {editable && (
        <FormEstructure handleSubmit={handleSubmit(onSubmit)} pGrid={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              {...register("descripcion")}
              label="Descripción"
              placeholder="Ej: Reparación luces traseras"
              fullWidth
              variant="standard"
              error={!!errors.descripcion}
              helperText={errors.descripcion?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              {...register("nombre")}
              label="Nombre"
              placeholder="Ej: Tornillo"
              fullWidth
              variant="standard"
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
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

          <Grid size={{ xs: 12, sm: 4 }}>
            {/* Imagen: preview + file inputs (camera or file) */}
            {(() => {
              const imgVal = watch("imagen");
              let srcToShow: string | undefined = undefined;
              if (imgVal instanceof File) {
                try {
                  srcToShow = URL.createObjectURL(imgVal);
                } catch (e) {
                  srcToShow = undefined;
                }
              } else if (typeof imgVal === 'string' && imgVal?.trim()) {
                const v = String(imgVal).trim();
                if (v.startsWith('data:')) srcToShow = v;
                else if (v.startsWith('http://') || v.startsWith('https://')) srcToShow = v;
                else srcToShow = `${import.meta.env.VITE_DOMAIN}${v}`;
              }

              return (
                <Box display="flex" alignItems="center" gap={1}>
                  {srcToShow ? (
                    <Box sx={{ width: 80, height: 50, overflow: 'hidden', borderRadius: 1 }}>
                      <img src={srcToShow} alt="img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ) : null}

                  <input
                    accept="image/*"
                    capture="environment"
                    id="repuesto-imagen-input-camera"
                    ref={cameraInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <input
                    accept="image/*"
                    id="repuesto-imagen-input-file"
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />

                  <Button startIcon={<CloudUploadIcon />} variant="outlined" onClick={(e) => setAnchorEl(e.currentTarget)}>
                    Imagen
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
                  {errors.imagen && (
                    <Box component="span" color="error.main" fontSize={12}>
                      {errors.imagen?.message}
                    </Box>
                  )}
                </Box>
              );
            })()}
          </Grid>

          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              {...register("refencia")}
              error={!!errors.refencia}
              variant="standard"
              fullWidth
              label="Referencia"
              helperText={errors.refencia?.message}
            />
          </Grid>

          <Divider />

          <Grid size={{ xs: 12 }}>
            <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
              Crear repuesto
            </Button>
          </Grid>
        </FormEstructure>
      )}

      <CardForm sx={{ padding: 2 }}>
        <Box sx={{ width: '100%', maxHeight: { xs: 300, sm: 420 }, overflow: 'auto', px: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Ref.</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Imagen</TableCell>
                <TableCell>Entregado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>Sin repuestos</TableCell>
                </TableRow>
              ) : (
                items.map((it) => {
                  const ref = String(it.refencia || '').trim();
                  const href = ref ? (ref.startsWith('http://') || ref.startsWith('https://') ? ref : `${import.meta.env.VITE_DOMAIN}${ref}`) : '';
                  return (
                    <TableRow key={it.id} sx={{ '& td': { verticalAlign: 'top' } }}>
                      <TableCell>{it.nombre}</TableCell>
                      <TableCell style={{ maxWidth: 240, whiteSpace: 'normal', wordBreak: 'break-word' }}>{it.descripcion}</TableCell>
                      <TableCell>
                        {href ? (
                          <a href={href} target="_blank" rel="noreferrer" style={{ color: '#1976d2', textDecoration: 'underline' }}>Ver referencia</a>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{it.cantidad}</TableCell>
                      <TableCell>
                        {it.imagen ? (
                          <Box sx={{ width: 80, height: 50 }}>
                            <img src={String(it.imagen).startsWith('data:') ? String(it.imagen) : `${import.meta.env.VITE_DOMAIN}${it.imagen}`} alt="img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </Box>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={!!it.checked} disabled color="primary" />
                      </TableCell>
                      <TableCell>
                        {it.checked ? (
                          '-'
                        ) : (
                          <>
                            <IconButton aria-label="actions" onClick={(e) => openActionMenu(e, it.id as number)}>
                              <MoreVertIcon />
                            </IconButton>
                            <Menu anchorEl={actionAnchor} open={Boolean(actionAnchor) && actionForId === it.id} onClose={closeActionMenu}>
                              <MenuItem onClick={() => { setToDelete(it); closeActionMenu(); }}>Eliminar</MenuItem>
                              <MenuItem onClick={handleMarkDelivered}>Marcar como entregado</MenuItem>
                            </Menu>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>
      </CardForm>

      <ModalConfirm
        open={!!toDelete}
        title="Eliminar repuesto"
        text={`¿Seguro que deseas eliminar el repuesto "${toDelete?.nombre}"?`}
        cancel={{ name: "Cancelar", cancel: () => setToDelete(null), color: "primary" }}
        confirm={{ name: "Eliminar", confirm: handleDelete, color: "error" }}
        onClose={() => setToDelete(null)}
      />

      <Dialog open={cameraModalOpen} onClose={() => setCameraModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Tomar foto</DialogTitle>
        <DialogContent>La captura desde cámara se abre en navegadores móviles; usa "Imagen" para elegir archivo.</DialogContent>
        <DialogActions>
          <Button onClick={() => setCameraModalOpen(false)}>Cerrar</Button>
          <Button variant="contained" onClick={handleTakePhoto}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RepuestosTable;
