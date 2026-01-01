import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button, MenuItem, Box, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Paper, Checkbox, Autocomplete, Fab, FormControlLabel, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../../store/useAuthStore';
import FormEstructure from '../../../components/utils/FormEstructure';
import { type ServicioType, ServicioInitialState, ServicioProductoClienteInitialState, type ServicioItemType, type ServicioGetType } from '../../../types/servicioType';
import { getInventarios } from '../../../services/inventario.services';
import { getProductos } from '../../../services/producto.services';
import { getMotos } from '../../../services/moto.services';
import { getSucursales } from '../../../services/sucursal.services';
import { getUsers, getUsersMecanicos } from '../../../services/users.services';
import { errorToast } from '../../../utils/toast';
import type { TipoServicioGetType } from '../../../types/tipoServicioType';
import { getTipos } from '../../../services/tipoServicio.services';
import type { SucursalType } from '../../../types/sucursalType';
import type { UserGetType } from '../../../types/userType';
import SignatureField from '../../../components/utils/SignatureField';

type Props = {
  initial?: Partial<ServicioGetType>;
  onSubmit: (payload: Partial<ServicioType> & { imagenesFiles?: File[] }) => Promise<void>;
  submitLabel?: string;
  seHaranVentas?: boolean;
  changeSeHaranVentas? : (value: boolean) => void;
};

const LOCAL_KEY = 'servicio.create.draft';

const ServicioFormSalida = ({ initial, onSubmit, submitLabel = 'Guardar', seHaranVentas, changeSeHaranVentas }: Props) => {
  const { register, handleSubmit, setValue, reset, formState: { isSubmitting }, watch } = useForm<ServicioType>({ defaultValues: { ...(initial ?? ServicioInitialState) } as any });
  const [productosCliente, setProductosCliente] = useState<Array<{ nombre: string; cantidad: number }>>(initial?.productosCliente ?? []);
  const [productoTmp, setProductoTmp] = useState(ServicioProductoClienteInitialState);
  const [productosList, setProductosList] = useState<any[]>([]);
  const [imagenesFiles, setImagenesFiles] = useState<File[]>([]);
  const [imagenesMeta, setImagenesMeta] = useState<Array<{ descripcion?: string; preview?: string }>>(initial?.imagenesMeta?.map((m:any) => ({ descripcion: m.descripcion ?? '', preview: undefined })) ?? []);
  const [inventarioItems, setInventarioItems] = useState<any[]>([]);
  const [motosList, setMotosList] = useState<any[]>([]);
  const [motoSedected, setMotoSelected] = useState<any>(initial?.moto ?? null);
  const [sucursalesList, setSucursalesList] = useState<any[]>([]);
  const [sucursalSelected, setSucursalSelected] = useState<SucursalType | null>(initial?.sucursal ?? null);
  const user = useAuthStore(state => state.user);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [servicioItems, setServicioItems] = useState<ServicioItemType[]>(initial?.servicioItems ?? []);
  const [tiposServicio,setTiposServicio]=useState<TipoServicioGetType[]>([]);
  const [tipoServicioSelected,setTipoServicioSelected]=useState<TipoServicioGetType|null>(initial?.tipoServicio ? initial.tipoServicio : null);
  const [mecanicos,setMecanicos] = useState<UserGetType[]>([])
  const [mecanicoSelected,setMecanicoSelected] = useState<UserGetType|null>(initial?.mecanico? initial.mecanico : null )
  const [imagenGuardada, setImagenGuardada] = useState(null);
  
/*
  useEffect(() => {
    // load draft from localStorage
    const draft = localStorage.getItem(LOCAL_KEY);
    if (draft && !initial) {
      try {
        const parsed = JSON.parse(draft);
        reset(parsed);
        setProductosCliente(parsed.productosCliente ?? []);
        setServicioItems(parsed.servicioItems ?? []);
        setImagenesMeta((parsed.imagenesMeta ?? []).map((m: any) => ({ descripcion: m.descripcion ?? '' })));
      } catch (e) { console.error(e); }
    }
  }, [initial, reset]);
*/
  useEffect(() => {
    (async () => {
      try {
        const m = await getMotos();
        setMotosList(m);
        const inv = await getInventarios();
        setInventarioItems(inv);
        const suc = await getSucursales();
        setSucursalesList(suc);
        const ts = await getTipos();
        setTiposServicio(ts);
        const mn = await getUsersMecanicos();
        setMecanicos(mn)
        // set default sucursal: prefer `initial.sucursalId`, otherwise use first sucursal of logged user (if any)
        const defaultId = (initial && initial.sucursalId) ? initial.sucursalId : undefined;
        if (defaultId) {
          const foundInit = suc.find((s: any) => Number(s.id) === Number(defaultId));
          if (foundInit) {
            setSucursalSelected(foundInit);
            setValue('sucursalId' as any, foundInit.id);
          }
        } else {
          const userSucArr = Array.isArray(user?.sucursales) ? user!.sucursales : [];
          if (userSucArr.length > 0) {
            const first = userSucArr[0];
            const candidateId = typeof first === 'object' ? first?.id : Number(first);
            const found = suc.find((s: any) => Number(s.id) === Number(candidateId));
            if (found) {
              setSucursalSelected(found);
              setValue('sucursalId' as any, found.id);
            }
          }
        }
        if (initial?.servicioItems && initial.servicioItems.length) {
          setServicioItems(initial.servicioItems as ServicioItemType[]);
        } else if (!servicioItems || servicioItems.length === 0) {
          setServicioItems(inv.map((it: any) => ({ inventarioId: it.id, checked: false, itemName: it.item ?? undefined, itemDescripcion: '' })));
        }

        const users = await getUsers();
        const prods = await getProductos();
        setProductosList(prods);
        setUsersList(users);
      } catch (e) { console.error(e); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
/*
  useEffect(() => {
    // persist draft: include form values, productosCliente and servicioItems
    const subscription = watch((values) => {
      try {
        const draft = { ...(values ?? {}), productosCliente, servicioItems, imagenesMeta: imagenesMeta.map(m => ({ descripcion: m.descripcion })) } as any;
        localStorage.setItem(LOCAL_KEY, JSON.stringify(draft));
      } catch (e) { console.error(e); }
    });
    return () => subscription.unsubscribe();
  }, [watch, productosCliente, servicioItems, imagenesMeta]);
  */
 

  useEffect(() => {
    return () => {
      // cleanup previews
      imagenesMeta.forEach(m => { if (m.preview) URL.revokeObjectURL(m.preview); });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const internalSubmit = async (data: ServicioType) => {
    const normalizedServicioItems = (servicioItems ?? []).map(it => ({ ...it, itemDescripcion: it.itemDescripcion ?? '', notas: it.notas ?? '' }));
    const payload: Partial<ServicioType> & { imagenesFiles?: File[] } = {
      ...data,
      productosCliente,
      servicioItems: normalizedServicioItems,
      imagenesMeta: imagenesMeta.map(m => ({ descripcion: m.descripcion ?? '' })),
      imagenesFiles,
    };
    await onSubmit(payload);
  };
  
  return (
    <FormEstructure handleSubmit={handleSubmit(internalSubmit)} pGrid={2}>

      <Grid size={{ xs: 12, sm: 12 }}>
        <TextField {...register('observaciones' as any)} label="Observaciones" fullWidth variant="standard" />
      </Grid>
        <Grid size={{ xs: 12 }}>
        <TextField {...register('total' as any)} label="Total" type='number' fullWidth variant="standard" />
      </Grid>
      {
        initial?.tipoServicio?.servicioCompleto && (
          <>
          <Grid size={{ xs: 12, sm: 6 }}> 
            <TextField {...register('proximaFechaServicio' as any)} label="Fecha Proximo servicio" focused={true} type="datetime-local"  fullWidth variant="standard" />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField {...register('descripcionProximoServicio' as any)} label="Descripcion del proximo servicio" fullWidth variant="standard" />
          </Grid>

          </>
        )
      }

      <Grid size={{ xs: 12 }}>
        <Typography variant='h6' textAlign={'center'} marginBottom={4}>
          Firma del cliente
      </Typography>
        <SignatureField onSaveSignature={(data: any) => setImagenGuardada(data)}/>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>{submitLabel}</Button>
      </Grid>

    </FormEstructure>
  );
};

export default ServicioFormSalida;


/*
      <Grid size={{ xs: 12 }}>
        <Box sx={{ mb: 1 }}>Subir imágenes (puede usar cámara en móviles)</Box>
        <Button variant="outlined" component="label">Seleccionar imágenes<input hidden multiple type="file" accept="image/*" capture onChange={onFiles} /></Button>

        {imagenesMeta.length > 0 && (
          <Paper sx={{ mt: 2, p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {imagenesMeta.map((m, idx) => (
                <Paper key={idx} sx={{ p: 1, width: 160 }}>
                  {m.preview ? <img src={m.preview} alt={`img-${idx}`} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 4 }} /> : <Box sx={{ width: '100%', height: 90, bgcolor: '#f0f0f0' }} />}
                  <TextField fullWidth size="small" placeholder="Descripción" value={m.descripcion} onChange={(e) => setImagenesMeta(s => s.map((it, i) => i === idx ? { ...it, descripcion: e.target.value } : it))} sx={{ mt: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <IconButton size="small" onClick={() => removeImage(idx)}><DeleteIcon fontSize="small" /></IconButton>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Paper>
        )}
      </Grid>*/