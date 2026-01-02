import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button, MenuItem, Box, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Paper, Checkbox, Autocomplete, Fab, FormControlLabel, Typography, TableContainer } from '@mui/material';
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
import { getUsers, getUsersClientes, getUsersMecanicos } from '../../../services/users.services';
import { errorToast } from '../../../utils/toast';
import type { TipoServicioGetType } from '../../../types/tipoServicioType';
import { getTipos } from '../../../services/tipoServicio.services';
import type { SucursalType } from '../../../types/sucursalType';
import type { UserGetType } from '../../../types/userType';
import SignatureField from '../../../components/utils/SignatureField';
import { ModalForm } from '../../Motos/components';


const API_URL = import.meta.env.VITE_DOMAIN;

type Props = {
  initial?: Partial<ServicioGetType>;
  onSubmit: (payload: Partial<ServicioType> & { imagenesFiles?: File[] }) => Promise<void>;
  submitLabel?: string;
  seHaranVentas?: boolean;
  changeSeHaranVentas? : (value: boolean) => void;
};

const LOCAL_KEY = 'servicio.create.draft';

const ServicioForm = ({ initial, onSubmit, submitLabel = 'Guardar', seHaranVentas, changeSeHaranVentas }: Props) => {
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
  const [clientes,setClientes] = useState<UserGetType[]>([])
  const [clienteSelected,setClienteSelected] = useState<UserGetType|null>(initial?.cliente? initial.cliente : null )
  // Puede ser File (nuevo) o string (url/base64)
  const [imagenGuardada, setImagenGuardada] = useState<any>(initial?.firmaEntrada ? initial.firmaEntrada : null);
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

  const getUpdateMotos = async () => {
        const m = await getMotos();
        setMotosList(m);
  }
  useEffect(() => {
    (async () => {
      try {
        getUpdateMotos();
        const inv = await getInventarios();
        setInventarioItems(inv);
        const suc = await getSucursales();
        setSucursalesList(suc);
        const ts = await getTipos();
        setTiposServicio(ts);
        const mn = await getUsersMecanicos();
        setMecanicos(mn)
        const cl = await getUsersClientes();
        setClientes(cl)
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
  const addProductoCliente = () => {
    if (!productoTmp.nombre) return errorToast('Ingrese nombre');
    setProductosCliente(s => [...s, { ...productoTmp }]);
    setProductoTmp(ServicioProductoClienteInitialState);
  };

  const toggleServicioItem = (idx: number, checked: boolean) => {
    setServicioItems(s => s.map((it, i) => i === idx ? { ...it, checked, itemDescripcion: checked ? '' : (it.itemDescripcion ?? '') } : it));
  };

  const updateServicioItem = (idx: number, patch: Partial<ServicioItemType>) => {
    setServicioItems(s => s.map((it, i) => i === idx ? { ...it, ...patch } : it));
  };

  const removeProductoCliente = (idx: number) => setProductosCliente(s => s.filter((_, i) => i !== idx));

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    // revoke previous previews
    imagenesMeta.forEach(m => { if (m.preview) URL.revokeObjectURL(m.preview); });
    const arr = Array.from(files);
    setImagenesFiles(arr);
    // initialize meta entries aligned with files and create previews
    const metas = arr.map(f => ({ descripcion: '', preview: URL.createObjectURL(f) }));
    setImagenesMeta(metas);
  };

  const removeImage = (idx: number) => {
    setImagenesFiles(s => s.filter((_, i) => i !== idx));
    setImagenesMeta(prev => {
      const next = prev.filter((_, i) => i !== idx);
      return next;
    });
  };

  useEffect(() => {
    return () => {
      // cleanup previews
      imagenesMeta.forEach(m => { if (m.preview) URL.revokeObjectURL(m.preview); });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const internalSubmit = async (data: ServicioType) => {
    const normalizedServicioItems = (servicioItems ?? []).map(it => ({ ...it, itemDescripcion: it.itemDescripcion ?? '', notas: it.notas ?? '' }));
    const payload: Partial<ServicioType> & { imagenesFiles?: File[], firmaEntradaFile?: File } = {
      ...data,
      productosCliente,
      servicioItems: normalizedServicioItems,
      imagenesMeta: imagenesMeta.map(m => ({ descripcion: m.descripcion ?? '' })),
      imagenesFiles,
    };
    if (imagenGuardada) {
      if (imagenGuardada instanceof File) {
        payload.firmaEntradaFile = imagenGuardada;
      } else if (typeof imagenGuardada === 'string' && imagenGuardada.startsWith('data:image')) {
        // Convertir base64 a File
        const arr = imagenGuardada.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        const file = new File([u8arr], 'firma.jpg', { type: mime });
        payload.firmaEntradaFile = file;
      }
    }
    await onSubmit(payload);
  };
  
  return (
    <FormEstructure handleSubmit={handleSubmit(internalSubmit)} pGrid={2}>
      <Grid size={{ xs: 12 }}>
        <TextField {...register('descripcion' as any)} label="Descripción" fullWidth variant="standard" />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }} display={'flex'} flexDirection={'row'}>
        <Grid size={{ xs: 10, sm: 10 }}>
          <Autocomplete
          options={motosList}
          getOptionLabel={(opt: any) => opt?.placa ?? `Moto ${opt?.id}`}
          value={motoSedected}
          onChange={(_, newVal) => {
            setMotoSelected(newVal ?? null);
            setValue('motoId' as any, newVal?.id ?? 0);
          }}
          isOptionEqualToValue={(option: any, value: any) => Number(option?.id) === Number(value?.id)}
          renderInput={(params) => <TextField {...params} label="Moto" variant="standard" fullWidth />}
        />
        </Grid>
          <ModalForm onFinish={getUpdateMotos} />
      </Grid>

       <Grid size={{ xs: 12, sm: 6 }}>
        <TextField {...register('kilometraje' as any, { valueAsNumber: true})} label="Kilometraje" type="number" fullWidth variant="standard" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Autocomplete
          options={sucursalesList}
          getOptionLabel={(opt: any) => opt?.nombre ?? `Sucursal ${opt?.id}`}
          value={sucursalSelected}
          onChange={(_, newVal) => {
            setSucursalSelected(newVal ?? null);
            setValue('sucursalId' as any, newVal?.id ?? 0);
          }}
          isOptionEqualToValue={(option: any, value: any) => Number(option?.id) === Number(value?.id)}
          renderInput={(params) => <TextField {...params} label="Sucursal" variant="standard" fullWidth />}
        />
      </Grid>

       <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
          options={mecanicos}
          getOptionLabel={(opt: any) => `${opt?.primerNombre} ${opt?.primerApellido} - ${opt?.dpi || opt?.nit || ""}`}
          value={mecanicoSelected}
          onChange={(_, newVal) => {
            setMecanicoSelected(newVal ?? null);
            setValue('mecanicoId' as any, newVal?.id ?? 0);
          }}
          isOptionEqualToValue={(option: any, value: any) => Number(option?.id) === Number(value?.id)}
          renderInput={(params) => <TextField {...params} label="Mecanico asignado" variant="standard" fullWidth />}
        />
        </Grid>

       <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
          options={clientes}
          getOptionLabel={(opt: any) => `${opt?.primerNombre} ${opt?.primerApellido} - ${opt?.dpi || opt?.nit || ""}`}
          value={clienteSelected}
          onChange={(_, newVal) => {
            setClienteSelected(newVal ?? null);
            setValue('clienteId' as any, newVal?.id ?? 0);
          }}
          isOptionEqualToValue={(option: any, value: any) => Number(option?.id) === Number(value?.id)}
          renderInput={(params) => <TextField {...params} label="Cliente" variant="standard" fullWidth />}
        />
        </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Autocomplete
          options={tiposServicio}
          getOptionLabel={(opt: TipoServicioGetType) => opt?.tipo ?? `Tipo Servicio ${opt?.id}`}
          value={tipoServicioSelected}
          onChange={(_, newVal) => {
            console.log('Selected tipo servicio:', newVal);
            setTipoServicioSelected(newVal ?? null);
            setValue('tipoServicioId' as any, newVal?.id ?? 0);
          }}
          isOptionEqualToValue={(option: any, value: any) => Number(option?.id) === Number(value?.id)}
          renderInput={(params) => <TextField {...params} label="Tipo Servicio" variant="standard" fullWidth />}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Producto cliente" variant="standard" fullWidth value={productoTmp.nombre} onChange={(e) => setProductoTmp(s => ({ ...s, nombre: e.target.value }))} />
                 
              </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField label="Cantidad" type="number" value={productoTmp.cantidad} onChange={(e) => setProductoTmp(s => ({ ...s, cantidad: Number(e.target.value) }))} fullWidth variant="standard" />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Button startIcon={<AddIcon />} variant="contained" onClick={addProductoCliente} fullWidth>Agregar</Button>
            </Grid>
          </Grid>
          
          <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>

          <Table size="small" sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productosCliente.map((p, idx) => (
                <TableRow key={idx}>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>{p.cantidad}</TableCell>
                  <TableCell><IconButton onClick={() => removeProductoCliente(idx)}><DeleteIcon /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
        </Paper>
      </Grid>
      {
        tipoServicioSelected?.servicioCompleto && (
          <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ mb: 1, fontWeight: 700 }}>Items de Inventario</Box>
          <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Presente</TableCell>
                <TableCell>Descripción (si no está presente)</TableCell>
                <TableCell>Notas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicioItems.map((it, idx) => {
                const inv = inventarioItems.find(i => i.id === it.inventarioId);
                return (
                  <TableRow key={idx}>
                    <TableCell>{inv?.item ?? `#${it.inventarioId}`}</TableCell>
                    <TableCell>
                      <Checkbox checked={!!it.checked} onChange={(e) => toggleServicioItem(idx, e.target.checked)} />
                    </TableCell>
                    <TableCell>
                      <TextField fullWidth variant="standard" value={it.itemDescripcion ?? ''} onChange={(e) => updateServicioItem(idx, { itemDescripcion: e.target.value })} disabled={!!it.checked} />
                    </TableCell>
                    <TableCell>
                      <TextField fullWidth variant="standard" value={it.notas ?? ''} onChange={(e) => updateServicioItem(idx, { notas: e.target.value })} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </TableContainer>
        </Paper>
      </Grid>)
      }
      {
        seHaranVentas != null && (
              <Grid size={{ xs: 12 }}>
                <FormControlLabel label="Se haran ventas?" control={
                  <Checkbox checked={seHaranVentas} onChange={(e: any) => changeSeHaranVentas(e.target.checked)} />
                }/>
              </Grid>
        )
      }
      
      <Grid size={{ xs: 12 }}>
        <Typography variant='h6' textAlign={'center'} marginBottom={4}>
          Firma del cliente
        </Typography>

        <SignatureField
          onSaveSignature={(data: any) => setImagenGuardada(data)}
          initialValue={typeof imagenGuardada === 'string' ? `${API_URL}/${imagenGuardada}` : undefined}
          text="Firmar Hoja de recepción"
        />
      </Grid>

        
      <Grid size={{ xs: 12 }}>
        <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>{submitLabel}</Button>
      </Grid>
    </FormEstructure>
  );
};

export default ServicioForm;


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