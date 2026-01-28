import { useEffect, useState } from 'react';
import { Grid, TextField, Button, Box, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Checkbox, Fab, FormControlLabel, Typography, Alert, FormControl, RadioGroup, Radio, Divider, Chip, Link } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../../store/useAuthStore';
import FormEstructure from '../../../components/utils/FormEstructure';
import { type ServicioType, ServicioInitialState, type ServicioItemType, type ServicioGetType, type servicioProductoProximoType } from '../../../types/servicioType';
import { ServicioProductoProximoInitialState } from '../../../types/servicioType';
import { getInventarios } from '../../../services/inventario.services';
import { getProductos } from '../../../services/producto.services';
import { getMotos } from '../../../services/moto.services';
import { getSucursales } from '../../../services/sucursal.services';
import { getUsers, getUsersMecanicos } from '../../../services/users.services';
import type { TipoServicioGetType } from '../../../types/tipoServicioType';
import { getTipos } from '../../../services/tipoServicio.services';
import type { SucursalType } from '../../../types/sucursalType';
import type { UserGetType } from '../../../types/userType';
import SignatureField from '../../../components/utils/SignatureField';
import { estados } from '../../../utils/estados';
import ProductsTable from '../../../components/Table/ProductsTable';
import LinkStylesNavigate from '../../../components/utils/links';
import { useGoTo } from '../../../hooks/useGoTo';
import type { repuestoReparacionType } from '../../../types/repuestoReparacionType';
const API_URL = import.meta.env.VITE_DOMAIN;

type Props = {
  initial?: Partial<ServicioGetType>;
  onSubmit: (payload: Partial<ServicioType> & { imagenesFiles?: File[] }) => Promise<void>;
  submitLabel?: string;
  seHaranVentas?: boolean;
  changeSeHaranVentas?: (value: boolean) => void;
};

const ServicioFormSalida = ({ initial, onSubmit, submitLabel = 'Guardar' }: Props) => {
  const { register, handleSubmit, setValue, formState: { isSubmitting }, watch } = useForm<ServicioType>({ defaultValues: { ...(initial ?? ServicioInitialState) } as any });
  // Estado para servicioProductoProximoType
  const [servicioProductoProximo, setServicioProductoProximo] = useState<servicioProductoProximoType[]>(initial?.proximoServicioItems ?? []);
  const [servicioProductoProximoTmp, setServicioProductoProximoTmp] = useState<{ nombre: string }>(ServicioProductoProximoInitialState);
  const [, setProductosList] = useState<any[]>([]);
  const [imagenesMeta,] = useState<Array<{ descripcion?: string; preview?: string }>>(initial?.imagenesMeta?.map((m: any) => ({ descripcion: m.descripcion ?? '', preview: undefined })) ?? []);
  const [, setInventarioItems] = useState<any[]>([]);
  const [, setMotosList] = useState<any[]>([]);
  const [, setSucursalesList] = useState<any[]>([]);
  const [, setSucursalSelected] = useState<SucursalType | null>(initial?.sucursal ?? null);
  const user = useAuthStore(state => state.user);
  const [, setUsersList] = useState<any[]>([]);
  const [servicioItems, setServicioItems] = useState<ServicioItemType[]>(initial?.servicioItems ?? []);
  const [, setTiposServicio] = useState<TipoServicioGetType[]>([]);
  const [, setMecanicos] = useState<UserGetType[]>([])
  // Puede ser File (nuevo) o string (url existente)
  const [imagenGuardada, setImagenGuardada] = useState<any>(initial?.firmaSalida ? initial.firmaSalida : null);
  const goTo = useGoTo();

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
    // Solo enviar los campos requeridos para la salida
    let firmaSalidaFile: File | undefined = undefined;
    if (imagenGuardada) {
      if (imagenGuardada instanceof File) {
        firmaSalidaFile = imagenGuardada;
      } else if (typeof imagenGuardada === 'string' && imagenGuardada.startsWith('data:image')) {
        // Convertir base64 a File
        const arr = imagenGuardada.split(',');

        // 1. Agregamos el operador '?' y un valor por defecto para evitar el error TS2531
        const match = arr[0].match(/:(.*?);/);
        const mime = match ? match[1] : 'image/jpeg';

        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);

        const file = new File([u8arr], 'firma.jpg', { type: mime });
        firmaSalidaFile = file;
      }
    }
    const payload = {
      total: data.total,
      observaciones: data.observaciones,
      proximaFechaServicio: data.proximaFechaServicio,
      descripcionProximoServicio: data.descripcionProximoServicio,
      firmaSalidaFile,
      kilometrajeProximoServicio: data.kilometrajeProximoServicio,
      proximoServicioItems: servicioProductoProximo.length > 0 ? servicioProductoProximo : undefined,
      accionSalida: data.accionSalida,
      totalSalidaAnticipado: data.totalSalidaAnticipado,
      descripcionAccion: data.descripcionAccion
    };
    await onSubmit(payload);
  };

  const total = watch('total')

  const totalVentasDescuentos = initial?.ventas
    ?.filter(venta => venta.estadoId === estados().confirmado) // Filtra solo las confirmadas
    ?.reduce((acc, venta) => {
      return acc + (venta.descuentoTotal || 0); // Suma el descuento acumulado
    }, 0) || 0;

  const ventasValidas = initial?.ventas?.filter(v => v.estadoId == estados().confirmado) ?? [];

  const totalVentas = (ventasValidas.reduce((acc, venta) => acc + (venta.total || 0), 0) || 0);


  const isVentasPendientes = (initial?.ventas && initial.ventas.map(v => v.estadoId).includes(estados().enEspera)) ?? false;

  const dataTableTotales = [
    { label: 'Total Reparacion', value: `Q ${initial?.enReparaciones?.[0]?.total ? initial.enReparaciones[0].total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}` },
    { label: 'Total Parqueo', value: `Q ${initial?.enParqueos?.[0]?.total ? initial.enParqueos[0].total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}` },
    { label: 'Total Servicio', value: `Q ${Number(total)?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}` },
    { label: 'Total Ventas', value: `Q ${((totalVentas - totalVentasDescuentos).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })) ?? '0.00'}` },
    { label: 'Gran Total', value: `Q ${((totalVentas + (Number(total) + (initial?.enReparaciones?.[0]?.total ?? 0)) + (initial?.enParqueos?.[0]?.total ?? 0) - totalVentasDescuentos).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}` },
  ]

  const chipColorByEstado = (id: number) => {
    switch (id) {
      case estados().enEspera:
        return "warning";
      case estados().confirmado:
        return "success";
      case estados().cancelado:
        return "error";
      default:
        return "primary";
    }
  };

  const accionSalida = watch('accionSalida');
  return (
    <FormEstructure handleSubmit={handleSubmit(internalSubmit)} pGrid={2}>
      <Typography variant="h6" sx={{ gridColumn: 'span 12' }}>{`Placa: ${initial?.moto?.placa}`}</Typography>
      <Typography variant="h6" sx={{ gridColumn: 'span 12' }}>{`Kilometraje de recepcion: ${initial?.kilometraje}`}</Typography>
      <Grid size={{ xs: 12, sm: 12 }}>
        <TextField {...register('observaciones' as any)} label="Observaciones" fullWidth variant="standard" />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField {...register('total' as any)} label="Total Servicio" type='number' fullWidth variant="standard" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField {...register('kilometrajeProximoServicio' as any, { valueAsNumber: true })} label="Kilometraje del próximo servicio" type='number' fullWidth variant="standard" />
      </Grid>
      {
        initial?.tipoServicio?.servicioCompleto && (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField {...register('proximaFechaServicio' as any)} label="Fecha Proximo servicio" focused={true} type="datetime-local" fullWidth variant="standard" />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField {...register('descripcionProximoServicio' as any)} label="Descripcion del proximo servicio" fullWidth variant="standard" />
            </Grid>

          </>
        )
      }

      {
        isVentasPendientes && (
          <Alert severity="warning">Aun hay ventas pendientes (La suma del total solo se hara con las ventas confirmadas).
            <LinkStylesNavigate label=" Ver ventas pendientes" onClick={() => { goTo('/admin/servicios/' + initial?.id + '#ventas') }} variant="body2" />
          </Alert>
        )
      }
      <Grid size={{ xs: 12, md: 6 }}>
        <ProductsTable
          columns={[
            { id: 'label', label: 'Indicador', minWidth: 180 },
            { id: 'value', label: 'Total', minWidth: 180 },
          ] as any}
          rows={dataTableTotales ?? []}
          headerColor="#1565c0"
        />
      </Grid>

      {/* Tabla y formulario para servicioProductoProximoType */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Proximo servicio</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Nombre del producto"
            value={servicioProductoProximoTmp.nombre}
            onChange={e => setServicioProductoProximoTmp(s => ({ ...s, nombre: e.target.value }))}
            size="small"
            fullWidth
            variant='outlined'
          />
          <Fab
            color="primary"
            size="small"
            onClick={() => {
              if (servicioProductoProximoTmp.nombre.trim()) {
                setServicioProductoProximo(arr => [...arr, { nombre: servicioProductoProximoTmp.nombre.trim() }]);
                setServicioProductoProximoTmp(ServicioProductoProximoInitialState);
              }
            }}
            aria-label="Agregar producto próximo"
          >
            <AddIcon />
          </Fab>
        </Box>
        {servicioProductoProximo.length > 0 && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicioProductoProximo.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <TextField
                      value={row.nombre}
                      onChange={e => {
                        const val = e.target.value;
                        setServicioProductoProximo(arr => arr.map((item, i) => i === idx ? { ...item, nombre: val } : item));
                      }}
                      size="small"
                      fullWidth
                      variant="standard"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="error" onClick={() => setServicioProductoProximo(arr => arr.filter((_, i) => i !== idx))}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h6' textAlign={'center'} marginBottom={4}>
          Firma del cliente
        </Typography>
        <SignatureField
          onSaveSignature={(data: any) => setImagenGuardada(data)}
          initialValue={typeof imagenGuardada === 'string' ? `${API_URL}/${imagenGuardada}` : undefined}
          text={'Firma de Salida'}
        />
      </Grid>
      {/* Nota: campos nombreClienteMoto y dpiClienteMoto sólo se capturan en la entrada (ServicioDataForm) */}

      {
        initial?.enReparaciones && initial.enReparaciones.length > 0 && (
          <>
            <Divider sx={{ width: '100%', my: 2 }} />
            <Grid size={{ xs: 12 }} textAlign="center" >
              <Typography variant="h4" >
                EN REPARACION
              </Typography>
              <Typography variant="body1" >
                {initial.enReparaciones[0].descripcion}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                {`Total Reparacion ${initial.enReparaciones[0].total ? `Q ${initial.enReparaciones[0].total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Q 0.00'}`}
              </Typography>
              <Grid container justifyContent="center" sx={{ my: 2 }}>
                <Chip label={initial.enReparaciones[0]?.estado.estado ?? ''} color={chipColorByEstado(initial.enReparaciones[0]?.estado.id)} sx={{ mb: 2 }} variant='outlined' />
                <Grid spacing={2} display={'flex'} flexDirection={'row'} gap={2} size={{ xs: 12, md: 8 }}>
                  <Grid size={6}>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => { goTo('/admin/enreparacion/' + (initial ? initial.enReparaciones?.[0]?.id : '') ) }}>
                      Ver Detalle
                    </Button>
                  </Grid>
                  {
                    initial.enReparaciones[0]?.estado.id !== estados().entregado && (
                      <Grid size={6}>
                        <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={() => { goTo('/admin/enreparacion/' + (initial ? initial.enReparaciones?.[0]?.id : '') + '/salida') }}>
                          Reparada
                        </Button>
                      </Grid>
                    )

                  }
                  {
                    initial.enReparaciones[0]?.estado.id !== estados().entregado && (
                      <Grid size={6}>
                        <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={() => { goTo('/admin/enreparacion/' + (initial ? initial.enReparaciones?.[0]?.id : '') + '/edit') }}>
                          Editar
                        </Button>
                      </Grid>
                    )

                  }


                </Grid>
              </Grid>
              {/* Aqui van los repuestos */}
              {
                initial.enReparaciones[0]?.repuestos && initial.enReparaciones[0].repuestos.length > 0 && (
                  <ProductsTable
                    columns={[
                      { id: 'repuesto', label: 'Repuesto', minWidth: 120, format: (_: any, row: repuestoReparacionType) => row.nombre ?? '' },
                      { id: 'descripcion', label: 'Descripción', minWidth: 180, format: (_: any, row: repuestoReparacionType) => row.descripcion ?? '' },
                      { id: 'refencia', label: 'Referencia', minWidth: 100, format: (_: any, row: repuestoReparacionType) => row.refencia ? (<Link href={row.refencia} target="_blank" rel="noopener noreferrer" underline="hover" >Link</Link>) : 'No hay' },
                      { id: 'checked', label: 'Entregado', minWidth: 100, format: (_: any, row: repuestoReparacionType) => <Checkbox color="primary" checked={!!row.checked} disabled /> },
                      { id: 'cantidad', label: 'Cantidad', minWidth: 80, align: 'center', format: (v: any) => String(v) },
                    ] as any}
                    rows={initial.enReparaciones[0].repuestos ?? []}
                    maxHeight={'none'}
                    headerColor="#1565c0"
                  />
                )
              }
            </Grid>
          </>
        )
      }
      {
        initial?.enParqueos && initial.enParqueos.length > 0 && (
          <>
            <Divider sx={{ width: '100%', my: 2 }} />
            <Grid size={{ xs: 12 }} textAlign="center" >
              <Typography variant="h4" >
                EN PARQUEO
              </Typography>
              <Typography variant="body1" >
                {initial.enParqueos[0].descripcion}
              </Typography>
              <Typography variant="body2" >
                Parqueo desde: {new Date(initial.enParqueos[0].createdAt ? initial.enParqueos[0].createdAt : '').toLocaleString()}
              </Typography>
              <Typography variant="body2" >
                Dias en parqueo: {new Date().getDate() - new Date(initial.enParqueos[0].createdAt ? initial.enParqueos[0].createdAt : '').getDate()}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                {`Total Parqueo ${initial.enParqueos[0].total ? `Q ${initial.enParqueos[0].total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Q 0.00'}`}
              </Typography>
              <Grid container justifyContent="center" sx={{ my: 2 }}>
                <Chip label={initial.enParqueos[0]?.estado.estado ?? ''} color={chipColorByEstado(initial.enParqueos[0]?.estado.id)} sx={{ mb: 2 }} variant='outlined' />
                <Grid spacing={2} display={'flex'} flexDirection={'row'} gap={2} size={{ xs: 12, md: 8 }}>
                  <Grid size={6}>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => { goTo('/admin/enparqueo/' + ( initial ? initial?.enParqueos?.[0]?.id : '')) }}>
                      Ver Detalle
                    </Button>
                  </Grid>
                  {
                    initial.enParqueos[0]?.estado.id !== estados().entregado && (
                      <Grid size={6}>
                        <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={() => { goTo('/admin/enparqueo/' + ( initial ? initial?.enParqueos?.[0]?.id : '') + '/salida') }}>
                          Parqueo Finalizado
                        </Button>
                      </Grid>
                    )
                  }


                </Grid>
              </Grid>
            </Grid>
          </>
        )
      }

      <FormControl required component="fieldset" sx={{ mb: 2 }}>
        <RadioGroup
          row
          onChange={e => setValue('accionSalida', e.target.value as any)}
        >
          {
            !initial?.enReparaciones || (initial?.enReparaciones && initial.enReparaciones.length == 0) && (
              <FormControlLabel value="REPARAR" control={<Radio />} label="REPARAR" />
            )
          }

          {
            !initial?.enParqueos || (initial?.enParqueos && initial.enParqueos.length == 0) && (
              <FormControlLabel value="PARQUEAR" control={<Radio />} label="PARQUEAR" />
            )
          }
          <FormControlLabel value="SOLOSALIDA" control={<Radio />} label="SOLO SALIDA" />
        </RadioGroup>
      </FormControl>
      {
        accionSalida === 'REPARAR' && initial?.enReparaciones && initial.enReparaciones.length == 0 && (
          <>
            <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
              El servicio se marcará para reparación. Por favor, asegúrese de que todos los detalles estén correctos.
            </Alert>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField {...register('descripcionAccion' as any)} label="Descripcion de la reparacion" type="text" fullWidth variant="standard" />
              <TextField {...register('totalSalidaAnticipado' as any)} label="Costo de reparacion" type="text" fullWidth variant="standard" />
            </Grid>
          </>
        )
      }
      {
        accionSalida === 'PARQUEAR' && (
          <>
            <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
              El vehículo se marcará para parqueo. Por favor, asegúrese de que todos los detalles estén correctos.
            </Alert>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField {...register('descripcionAccion' as any)} label="Descripcion del Parqueo" type="text" fullWidth variant="standard" />
            </Grid>
          </>
        )
      }

      {
        initial?.enReparaciones && initial.enReparaciones.length > 0 && initial.enReparaciones[0].estadoId == estados().activo && (
          <Alert severity="warning" sx={{ width: '100%' }}>
            Este servicio tiene reparaciones activas. Asegúrese de completar o cerrar las reparaciones antes de proceder.
          </Alert>
        )
      }

      <Grid container size={{ xs: 12 }}>
        <Grid size={12}>
          <Button type="submit" variant="contained" color='primary' fullWidth disabled={isSubmitting}>{submitLabel}</Button>
        </Grid>
      </Grid>

    </FormEstructure>
  );
};

export default ServicioFormSalida;