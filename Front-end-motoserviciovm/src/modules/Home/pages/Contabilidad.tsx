import React, { useEffect, useState } from 'react';
import { getContabilidad } from '../../../services/contabilidad.services';
import ProductsTable from '../../../components/Table/ProductsTable';
import type { contabilidadTotalesType } from '../../../types/contabilidad';
import { useAuthStore } from '../../../store/useAuthStore';
import type { Column } from '../../../components/Table/Table';
import KpiCard from '../components/KpiCard';
import { FaDollarSign, FaShoppingCart, FaChartLine } from 'react-icons/fa';
import { Box, Grid, TextField, Checkbox, Autocomplete, Button, Typography } from '@mui/material';
import type { ServicioGetType, SucursalGetType } from '../../../types/servicioType';
import type { VentaGetType } from '../../../types/ventaType';
import type { IngresosEgresosGetType } from '../../../types/ingresosEgresos.Type';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';

const Contabilidad: React.FC = () => {
  const [data, setData] = useState<contabilidadTotalesType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const today = new Date();
  const defaultFechaInicio = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')} 00:00:00`;
  const defaultFechaFin = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')} 23:59:59`;

  const [fechaInicio, setFechaInicio] = useState<string>(defaultFechaInicio);
  const [fechaFin, setFechaFin] = useState<string>(defaultFechaFin);
  const [selectedSucursales, setSelectedSucursales] = useState<SucursalGetType[]>([]);

  const fetchContabilidad = async () => {
    if (!user || !user.sucursales || user.sucursales.length === 0) return;

    const sucursalIds = selectedSucursales.map((sucursal) => sucursal.id);
    if (sucursalIds.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getContabilidad({
        fechaInicio,
        fechaFin,
        sucursalIds,
      });
      setData(data);
    } catch (error: any) {
      setError(error.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContabilidad();
  }, []);

  const columnsServicios: Column<ServicioGetType>[] = [
    {
      id: 'placa' as keyof ServicioGetType,
      label: 'Placa',
      format: (value: ServicioGetType) => (value && value.moto) ? value.moto.placa : 'N/A',
    },
    { id: 'updatedAt', label: 'Fecha', format: (value: ServicioGetType) => value?.updatedAt ? value.updatedAt.toString() : 'N/A' },
    { id: 'total', label: 'Total' },
  ];

  const columnsVentas: Column<VentaGetType>[] = [
    { id: 'id', label: 'Código' },
    { id: 'updatedAt', label: 'Fecha', format: (value: VentaGetType) => value?.updatedAt ? value.updatedAt.toString() : 'N/A' },
    { id: 'total', label: 'Monto Total' },
  ];

  const columnsIngresosEgresos: Column<IngresosEgresosGetType>[] = [
    { id: 'descripcion', label: 'Descripción' },
    { id: 'tipo', label: 'Tipo', format: (value: IngresosEgresosGetType) => value.tipoId},
    { id: 'monto', label: 'Monto' },
  ];

  const metrics = [
    {
      title: 'Total Servicios',
      value: data?.totalServicios || 0,
      //trend: 'up' as 'up',
      //trendValue: 5.2,
      icon: FaChartLine,
      color: '#10b981',
    },
    {
      title: 'Total Ventas',
      value: data?.totalVentas || 0,
      //trend: 'down' as 'down',
      //trendValue: 3.1,
      icon: FaShoppingCart,
      color: '#f59e0b',
    },
    {
      title: 'Total Gastos',
      value: data?.totalGastos || 0,
      //trend: 'down' as 'down',
      //trendValue: 2.8,
      icon: FaDollarSign,
      color: '#ef4444',
    },
    {
      title: 'Total Ingresos',
      value: data?.totalIngresos || 0,
      //trend: 'up' as 'up',
      //trendValue: 4.5,
      icon: FaDollarSign,
      color: '#3b82f6',
    },
  ];

  return (
    <Box p={3} width={'100%'}>
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="Fecha Inicio"
            type="datetime-local"
            variant='standard'
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            label="Fecha Fin"
            type="datetime-local"
            variant='standard'
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Autocomplete
            multiple
            id="checkboxes-sucursales-tags"
            options={user?.sucursales || []} // Ensure all user branches are included
            disableCloseOnSelect
            getOptionLabel={(sucursal) => sucursal.nombre || ''}
            value={selectedSucursales}
            onChange={(event, newValue) => setSelectedSucursales(newValue)}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.nombre}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Sucursales"
                placeholder="Seleccionar sucursales"
                fullWidth
              />
            )}
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchContabilidad}
        >
          Aplicar Filtros
        </Button>
      </Box>

      {loading && <Loading />}
      {error && <ErrorCard errorText={error} restart={fetchContabilidad} />}

      {!loading && !error && data && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {metrics.map((metric, index) => (
              <Grid size={{ md: 3, xs: 12 }} key={index}>
                <KpiCard {...metric} />
              </Grid>
            ))}
          </Grid>

            <Typography variant="h6" gutterBottom>
            Servicios
          </Typography>
          <ProductsTable
            rows={data.servicios}
            columns={columnsServicios}
            footerRow={{
              placa: 'Totales',
              total: data.servicios.reduce((sum, row) => sum + (row.total || 0), 0),
            }}
          />

          <Box mt={4} /> {/* Add spacing between tables */}

        <Typography variant="h6" gutterBottom>
            Ventas
          </Typography>
          <ProductsTable
            rows={data.ventas}
            columns={columnsVentas}
            footerRow={{
              id: 'Totales',
              total: data.ventas.reduce((sum, row) => sum + (row.total || 0), 0),
            }}
          />

          <Box mt={4} /> {/* Add spacing between tables */}
            <Typography variant="h6" gutterBottom>
            Ingresos/Egresos
          </Typography>
          <ProductsTable
            rows={data.ingresosEgresos}
            columns={columnsIngresosEgresos}
            footerRow={{
              descripcion: 'Totales',
              monto: data.ingresosEgresos.reduce((sum, row) => sum + (row.monto || 0), 0),
            }}
          />
        </>
      )}
    </Box>
  );
};

export default Contabilidad;