import React, { useEffect, useMemo, useState } from 'react';
import { Grid, TextField, Button, MenuItem, Box, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Autocomplete, FormControlLabel, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Controller, useForm } from 'react-hook-form';
import FormEstructure from '../../../components/utils/FormEstructure';
import { errorToast } from '../../../utils/toast';
import type { VentaType, VentaProductoType, VentaProductoGetType } from '../../../types/ventaType';
import { VentaInitialState, VentaProductoInitialState, mergeVentaDataWithDefaults, mergeVentaProductoDataWithDefaults } from '../../../types/ventaType';
import { getProductos } from '../../../services/producto.services';
import { getSucursales } from '../../../services/sucursal.services';
import { useAuthStore } from '../../../store/useAuthStore';
import type { ProductoGetType } from '../../../types/productoType';
import { useSearchParams } from 'react-router-dom';

type Props = {
  initial?: Partial<VentaType> & { productos?: VentaProductoType[] };
  onSubmit: (payload: VentaType & { productos: VentaProductoType[] }) => Promise<void>;
  submitLabel?: string;
};

const VentaForm = ({ initial, onSubmit, submitLabel = 'Guardar' }: Props) => {
  const { register, handleSubmit, setValue, formState: {isSubmitting} } = useForm<VentaType>({ defaultValues: { ...(initial ?? VentaInitialState) } as any });
  const [productosList, setProductosList] = useState<ProductoGetType[]>([]);
  const [linea, setLinea] = useState<VentaProductoGetType>(VentaProductoInitialState as any);
  const [items, setItems] = useState<VentaProductoGetType[]>((initial?.productos as VentaProductoGetType[]) ?? []);

  useEffect(() => {
    (async () => {
      try {
        const p = await getProductos();
        setProductosList(p);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const user = useAuthStore(state => state.user);
  console.log('Logged user in VentaForm:', user);
  const [sucursalesList, setSucursalesList] = useState<any[]>([]);
  const [sucursalSelected, setSucursalSelected] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await getSucursales();
        setSucursalesList(s);
        // default sucursal: prefer initial.sucursalId, otherwise use first sucursal of logged user (if any)
        const defaultId = (initial && initial.sucursalId) ? initial.sucursalId : undefined;
        if (defaultId) {
          const foundInit = s.find((x: any) => Number(x.id) === Number(defaultId));
          if (foundInit) {
            setSucursalSelected(foundInit);
            setValue('sucursalId' as any, foundInit.id);
          }
        } else {
          const userSucArr = Array.isArray(user?.sucursales) ? user!.sucursales : [];
          if (userSucArr.length > 0) {
            const first = userSucArr[0];
            const candidateId = typeof first === 'object' ? first?.id : Number(first);
            const found = s.find((x: any) => Number(x.id) === Number(candidateId));
            if (found) {
              setSucursalSelected(found);
              setValue('sucursalId' as any, found.id);
            }
          }
        }
      } catch (e) { console.error(e); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addLinea = () => {
    if (!linea.productoId || linea.productoId === 0) {
      errorToast('Selecciona un producto antes de agregar');
      return;
    }
    if (items.some((it) => it.productoId === linea.productoId)) {
      errorToast('Ese producto ya fue agregado a la venta');
      return;
    }
    // compute totalProducto from selected product precio * cantidad
    const prod = productosList.find((p) => p.id === linea.productoId);
    const precio = Number(prod?.precio ?? 0);
    const cantidad = Number(linea.cantidad ?? 0);
    const totalCalc = precio * cantidad;
    const lineaToAdd: VentaProductoGetType = { ...(linea as any), totalProducto: totalCalc, producto: prod, descuento: linea.descuento } as any;
    setItems((s) => [...s, lineaToAdd]);
    setLinea(VentaProductoInitialState);
  };

  const removeLinea = (idx: number) => {
    setItems((s) => s.filter((_, i) => i !== idx));
  };

    const [searhParams]= useSearchParams();
    const servicioId = searhParams.get('servicioId');

    useEffect (() => {
      if (servicioId){
        setValue('servicioId' as any, Number(servicioId));
      }
    },[servicioId, setValue]);


  const updateLinea = (idx: number, patch: Partial<VentaProductoType>) => {
    // prevent changing productoId to one that already exists in another row
    if (patch.productoId && items.some((it, i) => i !== idx && it.productoId === patch.productoId)) {
      errorToast('Ese producto ya está en otra línea');
      return;
    }

    setItems((s) =>
      s.map((it, i) => {
        if (i !== idx) return it;
        const updated: any = { ...it, ...patch };
        // if productoId changed, update nested producto
        if (patch.productoId) {
          updated.producto = productosList.find((p) => p.id === patch.productoId) ?? undefined;
        }
        if (patch.descuento !== undefined) {
          updated.descuento = patch.descuento;
        }

        // compute totalProducto if productoId or cantidad changed
        const prodId = updated.productoId ?? it.productoId;
        const cantidad = Number(updated.cantidad ?? it.cantidad ?? 0);
        const prod = productosList.find((p) => p.id === prodId) ?? updated.producto;
        const precio = Number(prod?.precio ?? 0);
        updated.totalProducto = precio * cantidad;
        return updated as VentaProductoGetType;
      })
    );
  };

  const total = useMemo(() => items.reduce((acc, it) => acc + Number(it.totalProducto || 0), 0), [items]);

  useEffect(() => {
    setValue('total', total as any);
  }, [total, setValue]);

  const internalSubmit = async (data: VentaType) => {
    // merge with defaults to avoid sending unwanted nested fields
    const merged = mergeVentaDataWithDefaults(data) as VentaType;
    // normalize productos to VentaProductoType shape expected by API
    
    const productosPayload: VentaProductoType[] = items.map((it) => {
      const base = mergeVentaProductoDataWithDefaults({
        ventaId: it.ventaId,
        productoId: it.productoId,
        cantidad: it.cantidad,
        totalProducto: it.totalProducto,
        descuento: it.descuento,
      }) as VentaProductoType;

      console.log('Mapping producto for payload:', it, 'to', base);
      return base;
    });
    console.log('Submitting Venta with productos:', { ...(merged as any), productos: productosPayload });
    await onSubmit({ ...(merged as any), productos: productosPayload } as any);
  };

  return (
    <FormEstructure handleSubmit={handleSubmit(internalSubmit)} pGrid={2}>
      <Grid size={{ xs: 12 }}>
        <TextField label="Usuario" value={initial?.usuario?.primerNombre ?? ''} fullWidth variant="standard" disabled />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField {...register('servicioId' as any)} label="Servicio (omitido)" fullWidth variant="standard" disabled />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField label="Total" value={total} fullWidth variant="standard" disabled />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Autocomplete
          options={sucursalesList}
          getOptionLabel={(o: any) => o?.nombre ?? `Sucursal ${o?.id}`}
          value={sucursalSelected}
          onChange={(_, n) => { setSucursalSelected(n ?? null); setValue('sucursalId' as any, n?.id ?? 0); }}
          isOptionEqualToValue={(a: any, b: any) => Number(a?.id) === Number(b?.id)}
          renderInput={(params) => <TextField {...params} label="Sucursal" variant="standard" fullWidth />}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, sm: 3 }}>
            <Autocomplete
              options={productosList}
              getOptionLabel={(o: any) => o?.nombre ?? ''}
              onChange={(_, val) => {
                const prodId = val ? Number(val.id) : 0;
                const prod = productosList.find(p => p.id === prodId);
                const precio = Number(prod?.precio ?? 0);
                const cantidad = Number(linea.cantidad ?? 0);
                setLinea({ ...linea, productoId: prodId, totalProducto: precio * cantidad });
              }}
              renderInput={(params) => <TextField {...params} label="Producto" variant="standard" fullWidth />}
              isOptionEqualToValue={(a: any, b: any) => Number(a?.id) === Number(b?.id)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 1 }}>
            <TextField label="Stock" value={productosList.find(p => p.id === linea.productoId)?.cantidad ?? ''} fullWidth variant="standard" disabled />
          </Grid>

          <Grid size={{ xs: 12, sm: 1 }}>
            <TextField label="Cantidad" type="number" variant="standard" value={linea.cantidad} onChange={(e) => {
              const cantidad = Number(e.target.value);
              const prod = productosList.find(p => p.id === linea.productoId);
              const precio = Number(prod?.precio ?? 0);
              setLinea({ ...linea, cantidad, totalProducto: precio * cantidad });
            }} fullWidth />
          </Grid>

          <Grid size={{ xs: 12, sm: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!linea.descuento}
                  onChange={e => setLinea({ ...linea, descuento: e.target.checked })}
                />
              }
              label="Descuento"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 2 }}>
            <Button startIcon={<AddIcon />} variant="contained" onClick={addLinea} fullWidth>Agregar</Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((it, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <TextField select value={it.productoId} onChange={(e) => updateLinea(idx, { productoId: Number(e.target.value) })} variant="standard">
                    {productosList.map((p) => (
                      <MenuItem key={p.id} value={p.id} disabled={items.some((it2, i2) => i2 !== idx && it2.productoId === p.id)}>{p.nombre}</MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  {(() => {
                    const prod = productosList.find(p => p.id === it.productoId);
                    return prod ? `Q ${Number(prod.precio ?? 0).toFixed(2)}` : '-';
                  })()}
                </TableCell>
                <TableCell>
                  <TextField type="number" value={it.cantidad} onChange={(e) => updateLinea(idx, { cantidad: Number(e.target.value) })} variant="standard" />
                </TableCell>
                <TableCell>
                  <TextField type="number" value={it.totalProducto} variant="standard" disabled />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={!!it.descuento}
                    onChange={e => updateLinea(idx, { descuento: e.target.checked })}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => removeLinea(idx)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>{submitLabel}</Button>
      </Grid>
    </FormEstructure>
  );
};

export default VentaForm;
