import React, { useEffect, useState } from 'react';
import { getOpciones } from '../../../services/opcionServicio.services';
import { Grid, TextField, Autocomplete, Paper, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Checkbox, FormControlLabel, Typography, Box } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ImagenesEditorInput from '../../../components/utils/ImagenesEditorInput';
import SignatureField from '../../../components/utils/SignatureField';

const API_URL = import.meta.env.VITE_DOMAIN;

const ServicioDataForm = ({
  register,
  productosCliente,
  productoTmp,
  setProductoTmp,
  addProductoCliente,
  removeProductoCliente,
  sucursalesList,
  sucursalSelected,
  setSucursalSelected,
  setValue,
  mecanicos,
  mecanicoSelected,
  setMecanicoSelected,
  clientes,
  clienteSelected,
  setClienteSelected,
  tiposServicio,
  tipoServicioSelected,
  setTipoServicioSelected,
  servicioItems,
  inventarioItems,
  toggleServicioItem,
  updateServicioItem,
  imagenesFiles,
  imagenesMeta,
  handleImagenesChange,
  seHaranVentas,
  changeSeHaranVentas,
  isSubmitting,
  submitLabel,
  imagenGuardada,
  setImagenGuardada,
  watch,
}) => {
  const [opcionesServicio, setOpcionesServicio] = useState<any[]>([]);
  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<number[]>([]);

  useEffect(() => {
    if (tipoServicioSelected && tipoServicioSelected.cantidadOpcionesServicio === 0) {
      getOpciones().then(setOpcionesServicio).catch(() => setOpcionesServicio([]));
    } else {
      setOpcionesServicio([]);
      setOpcionesSeleccionadas([]);
    }
  }, [tipoServicioSelected]);

  useEffect(() => {
    setValue('opcionesServicioManual', opcionesSeleccionadas);
  }, [opcionesSeleccionadas, setValue]);

  const handleCheckOpcion = (id: number, checked: boolean) => {
    setOpcionesSeleccionadas(prev => checked ? [...prev, id] : prev.filter(i => i !== id));
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField {...register('descripcion' as any)} label="Descripción" fullWidth variant="standard" />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField {...register('total' as any, { valueAsNumber: true })} label="Total" fullWidth variant="standard" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField {...register('kilometraje' as any, { valueAsNumber: true })} label="Kilometraje" type="number" fullWidth variant="standard" />
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
      <Grid size={{ xs: 12, sm: 6 }} display={'flex'} flexDirection={'row'}>
        <Grid size={{ xs: 10, sm: 10 }}>
          <Autocomplete
            options={clientes}
            getOptionLabel={(opt: any) => `${opt?.primerNombre} ${opt?.primerApellido} - ${opt?.dpi || opt?.nit || ""}`}
            value={clienteSelected}
            onChange={(_, newVal) => {
              setClienteSelected(newVal ?? null);
              setValue('clienteId' as any, newVal?.id ?? null);
            }}
            isOptionEqualToValue={(option: any, value: any) => Number(option?.id) === Number(value?.id)}
            renderInput={(params) => <TextField {...params} label="Cliente" variant="standard" fullWidth />}
          />
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Autocomplete
          options={tiposServicio}
          getOptionLabel={(opt: any) => opt?.tipo ?? `Tipo Servicio ${opt?.id}`}
          value={tipoServicioSelected}
          onChange={(_, newVal) => {
            setTipoServicioSelected(newVal ?? null);
            setValue('tipoServicioId' as any, newVal?.id ?? 0);
          }}
          isOptionEqualToValue={(option: any, value: any) => Number(option?.id) === Number(value?.id)}
          renderInput={(params) => <TextField {...params} label="Tipo Servicio" variant="standard" fullWidth />}
        />
      </Grid>
      {/* Opciones de servicio manual: Autocomplete múltiple con checkboxes */}
      {tipoServicioSelected?.cantidadOpcionesServicio === 0 && opcionesServicio.length > 0 && (
        <Grid size={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Opciones de Servicio</Typography>
            <Autocomplete
              multiple
              options={opcionesServicio}
              disableCloseOnSelect
              getOptionLabel={(opt: any) => opt?.opcion ?? ''}
              value={opcionesSeleccionadas.map(id => opcionesServicio.find(o => o.id === id)).filter(Boolean) as any}
              onChange={(_e, newValue: any[]) => {
                const ids = newValue.map(v => v.id);
                setOpcionesSeleccionadas(ids);
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.opcion}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Opciones de servicio"
                  placeholder="Seleccionar opciones"
                />
              )}
            />
          </Paper>
        </Grid>
      )}
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
      {tipoServicioSelected?.servicioCompleto && (
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
        </Grid>
      )}
      <Grid size={{ xs: 12 }}>
      </Grid>
      {seHaranVentas != null && (
        <Grid size={{ xs: 12 }}>
          <FormControlLabel label="Se haran ventas?" control={
            <Checkbox checked={seHaranVentas} onChange={(e: any) => changeSeHaranVentas(e.target.checked)} />
          }/>
        </Grid>
      )}
      <Grid size={{ xs: 12 }}>
        <ImagenesEditorInput
          value={{ files: imagenesFiles, metas: imagenesMeta }}
          onChange={({ files, metas }) => handleImagenesChange(files, metas)}
        />
      </Grid>
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
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField {...register('nombreClienteMoto' as any)} label="Nombre quien deja la moto (opcional)" fullWidth variant="standard" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField {...register('dpiClienteMoto' as any)} label="DPI / NIT quien deja la moto (opcional)" fullWidth variant="standard" />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>{submitLabel}</Button>
      </Grid>
    </Grid>
  );
};

export default ServicioDataForm;
