import { useEffect, useState } from 'react';
import { getOpciones, postOpcion } from '../../../services/opcionServicio.services';
import { Grid, TextField, Autocomplete, Paper, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Checkbox, FormControlLabel, Typography, Box } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ImagenesEditorInput from '../../../components/utils/ImagenesEditorInput';
import SignatureField from '../../../components/utils/SignatureField';
import type { TipoServicioGetType } from '../../../types/tipoServicioType';
import { estados } from '../../../utils/estados';

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
}: any) => {
  const [opcionesServicio, setOpcionesServicio] = useState<any[]>([]);
  const [opcionesServicioExtras, setOpcionesServicioExtras] = useState<any[]>([]);
  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<number[]>([]);
  const [opcionesSeleccionadasExtras, setOpcionesSeleccionadasExtras] = useState<number[]>([]);
  const [opcionInput, setOpcionInput] = useState<string>('');
  const [opcionExtrasInput, setOpcionExtrasInput] = useState<string>('');
  const [isCreatingOpcion, setIsCreatingOpcion] = useState<boolean>(false);
  const [opcionError, setOpcionError] = useState<string>('');
  const [opcionExtrasError, setOpcionExtrasError] = useState<string>('');

  useEffect(() => {
    if (tipoServicioSelected ) {
      getOpciones().then(setOpcionesServicio).catch(() => setOpcionesServicio([]));
      console.log(tipoServicioSelected)
    } else {
      setOpcionesServicio([]);
      setOpcionesSeleccionadas([]);
    }
  }, [tipoServicioSelected]);

  useEffect(() => {
    if (tipoServicioSelected ) {
      getOpciones()
      .then((data) => {
        const idsEnTipo = tipoServicioSelected.opcionServicios.map((os: TipoServicioGetType) => os.id );        
        const opcionesExtras = data.filter((opcion) => !idsEnTipo.includes(opcion.id));

        setOpcionesServicioExtras(opcionesExtras);
      })
      .catch(() => setOpcionesServicioExtras([]));
    } else {
      setOpcionesSeleccionadas([]);
      setOpcionesSeleccionadasExtras([]);
    }
  }, [tipoServicioSelected]);


  useEffect(() => {
    setValue('opcionesServicioManual', opcionesSeleccionadas);
  }, [opcionesSeleccionadas, setValue]);

  useEffect(() => {
    setValue('opcionesServicioExtras', opcionesSeleccionadasExtras);
  }, [opcionesSeleccionadasExtras, setValue]);

  const crearOpcionDesdeInput = async () => {
    const opcionTexto = opcionInput?.trim();
    if (!opcionTexto) {
      setOpcionError('El texto no puede estar vacío');
      return;
    }

    if (opcionesServicio.some((o) => o.opcion?.toLowerCase() === opcionTexto.toLowerCase())) {
      setOpcionError('La opción ya existe');
      return;
    }

    setOpcionError('');
    setIsCreatingOpcion(true);

    try {
      const created = await postOpcion({ opcion: opcionTexto, estadoId: estados().activo } as any);
      const allOpciones = await getOpciones();
      setOpcionesServicio(allOpciones);

      if (tipoServicioSelected) {
        const tipoIds = tipoServicioSelected.opcionServicios?.map((os: any) => os.id) ?? [];
        setOpcionesServicioExtras(allOpciones.filter((opcion) => !tipoIds.includes(opcion.id)));
      }

      if (created?.id != null) {
        const createdId = Number(created.id);
        if (!Number.isNaN(createdId)) {
          setOpcionesSeleccionadas((prev) => Array.from(new Set([...prev, createdId])));
        }
      }

      setOpcionInput('');
    } catch (error: any) {
      setOpcionError(error?.message ?? 'Error creando opción');
    } finally {
      setIsCreatingOpcion(false);
    }
  };

  const crearOpcionExtrasDesdeInput = async () => {
    const opcionTexto = opcionExtrasInput?.trim();
    if (!opcionTexto) {
      setOpcionExtrasError('El texto no puede estar vacío');
      return;
    }

    if (opcionesServicio.some((o) => o.opcion?.toLowerCase() === opcionTexto.toLowerCase())) {
      setOpcionExtrasError('La opción ya existe');
      return;
    }

    setOpcionExtrasError('');
    setIsCreatingOpcion(true);

    try {
      const created = await postOpcion({ opcion: opcionTexto, estadoId: estados().activo } as any);
      const allOpciones = await getOpciones();
      setOpcionesServicio(allOpciones);

      if (tipoServicioSelected) {
        const tipoIds = tipoServicioSelected.opcionServicios?.map((os: any) => os.id) ?? [];
        setOpcionesServicioExtras(allOpciones.filter((opcion) => !tipoIds.includes(opcion.id)));
      }

      if (created?.id != null) {
        const createdId = Number(created.id);
        if (!Number.isNaN(createdId)) {
          setOpcionesSeleccionadasExtras((prev) => Array.from(new Set([...prev, createdId])));
        }
      }

      setOpcionExtrasInput('');
    } catch (error: any) {
      setOpcionExtrasError(error?.message ?? 'Error creando opcion extra');
    } finally {
      setIsCreatingOpcion(false);
    }
  };

  const canCrearOpcion = Boolean(
    opcionInput.trim() &&
      !opcionesServicio.some((o) => o.opcion?.toLowerCase() === opcionInput.trim().toLowerCase())
  );

  const canCrearOpcionExtras = Boolean(
    opcionExtrasInput.trim() &&
      !opcionesServicio.some((o) => o.opcion?.toLowerCase() === opcionExtrasInput.trim().toLowerCase())
  );

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
      {tipoServicioSelected?.cantidadOpcionesServicio === 0 && (
        <Grid size={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Opciones de Servicio</Typography>
            <Autocomplete
              multiple
              freeSolo
              disableCloseOnSelect
              openOnFocus
              options={opcionesServicio}
              getOptionLabel={(opt: any) => opt?.opcion ?? ''}
              value={opcionesSeleccionadas.map(id => opcionesServicio.find(o => o.id === id)).filter(Boolean) as any}
              inputValue={opcionInput}
              onInputChange={(_event, newInputValue) => {
                setOpcionInput(newInputValue);
                setOpcionError('');
              }}
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
            {canCrearOpcion && (
              <Box display="flex" gap={1} alignItems="center" mt={1}>
                <Typography variant="body2">No existe '{opcionInput}' en la lista.</Typography>
                <Button size="small" variant="contained" onClick={crearOpcionDesdeInput} disabled={isCreatingOpcion}>
                  {isCreatingOpcion ? 'Creando...' : `Crear "${opcionInput}"`}
                </Button>
              </Box>
            )}
            {opcionError && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {opcionError}
              </Typography>
            )}
          </Paper>
        </Grid>
      )}
      {/* Opciones de servicio Extras: Autocomplete múltiple con checkboxes */}
      {Number(tipoServicioSelected?.cantidadOpcionesServicio) > 0 && (
        <Grid size={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Opciones de Servicios Adicionales</Typography>
            <Autocomplete
              multiple
              freeSolo
              disableCloseOnSelect
              openOnFocus
              options={opcionesServicioExtras}
              getOptionLabel={(opt: any) => opt?.opcion ?? ''}
              value={opcionesSeleccionadasExtras.map(id => opcionesServicio.find(o => o.id === id)).filter(Boolean) as any}
              inputValue={opcionExtrasInput}
              onInputChange={(_event, newInputValue) => {
                setOpcionExtrasInput(newInputValue);
                setOpcionExtrasError('');
              }}
              onChange={(_e, newValue: any[]) => {
                const ids = newValue.map(v => v.id);
                setOpcionesSeleccionadasExtras(ids);
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
            {canCrearOpcionExtras && (
              <Box display="flex" gap={1} alignItems="center" mt={1}>
                <Typography variant="body2">No existe '{opcionExtrasInput}' en la lista.</Typography>
                <Button size="small" variant="contained" onClick={crearOpcionExtrasDesdeInput} disabled={isCreatingOpcion}>
                  {isCreatingOpcion ? 'Creando...' : `Crear "${opcionExtrasInput}"`}
                </Button>
              </Box>
            )}
            {opcionExtrasError && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {opcionExtrasError}
              </Typography>
            )}
          </Paper>
        </Grid>
      )}
      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Producto cliente" variant="standard" fullWidth value={productoTmp.nombre} onChange={(e) => setProductoTmp((s: any) => ({ ...s, nombre: e.target.value }))} />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField label="Cantidad" type="number" value={productoTmp.cantidad} onChange={(e) => setProductoTmp((s: any) => ({ ...s, cantidad: Number(e.target.value) }))} fullWidth variant="standard" />
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
                {productosCliente.map((p: any, idx: number) => (
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
                  {servicioItems.map((it: any, idx: number) => {
                    const inv = inventarioItems.find((i: any) => i.id === it.inventarioId);
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
