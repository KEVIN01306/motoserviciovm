import React, { useEffect, useState } from 'react';
import { getContabilidad } from '../../../services/contabilidad.services';
import ProductsTable from '../../../components/Table/ProductsTable';
import type { contabilidadTotalesType } from '../../../types/contabilidad';
import { useAuthStore } from '../../../store/useAuthStore';
import type { Column } from '../../../components/Table/Table';
import KpiCard from '../components/KpiCard';
import { FaDollarSign, FaShoppingCart, FaChartLine } from 'react-icons/fa';
import { Box, Grid, TextField, Checkbox, Autocomplete, Button, Typography } from '@mui/material';
import type { ServicioGetType } from '../../../types/servicioType';
import type { SucursalType } from '../../../types/sucursalType';
import type { VentaGetType } from '../../../types/ventaType';
import type { IngresosEgresosGetType } from '../../../types/ingresosEgresos.Type';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';
import { formatDate } from '../../../utils/formatDate';
import { tiposContabilidad } from '../../../utils/tiposContabilidad';

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
  const [selectedSucursales, setSelectedSucursales] = useState<SucursalType[]>([]);

  const fetchContabilidad = async () => {
    if (!user || !user.sucursales || user.sucursales.length === 0) return;

    const sucursalIds = selectedSucursales.map((sucursal) => sucursal.id);
    if (sucursalIds.length === 0) return;

    console.log('Fetching contabilidad with params:', { fechaInicio, fechaFin, sucursalIds });

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

    console.log('Initial fetchContabilidad called: ', data);
  }, []);

  const columnsServicios: Column<ServicioGetType>[] = [
    {
      id: 'placa' as keyof ServicioGetType,
      label: 'Placa',
      format: (value, row) => row?.moto?.placa || '',
    },
    { id: 'updatedAt', label: 'Fecha', format: (value, row) => formatDate(row.updatedAt) },
    { id: 'total', label: 'Total', format: (value) => `Q ${(value).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2})}` },
  ];

  const columnsVentas: Column<VentaGetType>[] = [
    { id: 'id', label: 'Código' },
    { id: 'updatedAt', label: 'Fecha', format: (value, row) => formatDate(row.updatedAt) },
    { id: 'costo', label: 'Costo', format: (value) => `Q ${(value).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2})}` },
    { id: 'precioTotal', label: 'Precio', format: (value) => `Q ${(value).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2})}` },
    { id: 'gananciaTotal', label: 'Ganancia', format: (value) => `Q ${(value).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2})}` },
    { id: 'total', label: 'Monto Total', format: (value) => `Q ${(value).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2})}` },
  ];

  const columnsIngresosEgresos: Column<IngresosEgresosGetType>[] = [
    { id: 'descripcion', label: 'Descripción' },
    { id: 'updatedAt', label: 'Fecha', format: (value, row) => formatDate(row.updatedAt) },
    { id: 'tipo', label: 'Tipo', format: (value, row) => row.tipo?.tipo || '' },
    { id: 'monto', label: 'Monto', format(value, row) {
        return row?.tipoId == tiposContabilidad().ingreso ? `+ Q ${row.monto.toFixed(2)}` : `- Q ${row.monto.toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }, },
  ];
 /*
  const metrics = [
    {
      title: 'Total Servicios',
      value: "Q "+(data?.totalServicios || 0).toFixed(2),
      //trend: 'up' as 'up',
      //trendValue: 5.2,
      icon: FaChartLine,
      color: '#10b981',
    },
    {
      title: 'Total Ventas',
      value: "Q "+(data?.totalVentas || 0).toFixed(2),
      //trend: 'down' as 'down',
      //trendValue: 3.1,
      icon: FaShoppingCart,
      color: '#f59e0b',
    },
    {
      title: 'Total Gastos',
      value: "Q "+(data?.totalGastos || 0).toFixed(2),
      //trend: 'down' as 'down',
      //trendValue: 2.8,
      icon: FaDollarSign,
      color: '#ef4444',
    },
    {
      title: 'Total Ingresos',
      value: "Q "+(data?.totalIngresosGenerales || 0).toFixed(2),
      //trend: 'up' as 'up',
      //trendValue: 4.5,
      icon: FaDollarSign,
      color: '#3b82f6',
    },
  ];
  */

  const metricsRepuestos = [
    {
      title: 'Total Ventas',
      value: "Q "+(data?.totalVentasRepuestos || 0).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}),
      //trend: 'down' as 'down',
      //trendValue: 3.1,
      icon: FaShoppingCart,
      color: '#f59e0b',
    },
    {
      title: 'Total Ganancias Ventas',
      value: "Q "+(data?.totalGananciasVentas || 0).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}),
      //trend: 'up' as 'up',
      //trendValue: 5.2,
      icon: FaChartLine,
      color: '#10b981',
    },
    {
      title: 'Total Gastos',
      value: "Q "+(data?.totalGastosRepuestos || 0).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}),
      //trend: 'down' as 'down',
      //trendValue: 2.8,
      icon: FaDollarSign,
      color: '#ef4444',
    },
    {
      title: 'Total Caja Repuestos',
      value: "Q "+(data?.totalCajaRepuestos || 0).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}),
      //trend: 'up' as 'up',
      //trendValue: 4.5,
      icon: FaDollarSign,
      color: '#3b82f6',
    },

  ];

  const metricsTaller = [
    {
      title: 'Total Servicios Taller',
      value: "Q "+(data?.totalServiciosTaller || 0).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}),
      //trend: 'up' as 'up',
      //trendValue: 5.2,
      icon: FaChartLine,
      color: '#10b981',
    },
    {
      title: 'Total Gastos Taller',
      value: "Q "+(data?.totalGastosTaller || 0).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}),
      //trend: 'down' as 'down',
      //trendValue: 3.1,
      icon: FaDollarSign,
      color: '#ef4444',
    },
    {
      title: 'Total Caja Taller',
      value: "Q "+(data?.totalCajaTaller || 0).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}),
      //trend: 'down' as 'down',
      //trendValue: 2.8,
      icon: FaDollarSign,
      color: '#3b82f6',
    }
  ];

  const mretricsGenerales = [
    {
      title: 'Total Ingresos',
      value: "Q "+(data?.totalIngresos || 0).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}),
      //trend: 'up' as 'up',
      //trendValue: 5.2,
      icon: FaChartLine,
      color: '#10b981',
    },
    {
      title: 'Total Gastos',
      value: "Q "+(data?.totalGastos || 0).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}),
      //trend: 'down' as 'down',
      //trendValue: 3.1,
      icon: FaDollarSign,
      color: '#ef4444',
    },
    {
      title: 'Total Caja General',
      value: "Q "+ (data?.totalCajaGeneral || 0).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}),
      //trend: 'down' as 'down',
      //trendValue: 2.8,
      icon: FaDollarSign,
      color: '#3b82f6',
    },
  ]

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
            options={user?.sucursales || []} 
            disableCloseOnSelect
            getOptionLabel={(sucursal) => sucursal.nombre || ''}
            value={selectedSucursales}
            onChange={(event, newValue) => setSelectedSucursales(newValue)}
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option.id}>
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
          <Typography variant='h4' textAlign={'center'} gutterBottom>
              GENERAL
          </Typography>
        
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {mretricsGenerales.map((metric, index) => (
              <Grid size={{ md: 3, xs: 12 }} key={index}>
                <KpiCard {...metric} />
              </Grid>
            ))}
          </Grid>

          <Box mt={4} /> 
            <Typography variant="h6" gutterBottom>
            Ingresos/Egresos Generales
          </Typography>
          <ProductsTable
            rows={data.ingresosEgresosDetalle}
            columns={columnsIngresosEgresos}
            footerRow={{
              descripcion: 'Totales',
              monto: "Q " + (data.ingresosEgresosDetalle.reduce((sum, row) => sum + (row.monto || 0), 0)).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2})
            }}

          />

          <Typography variant='h4' marginTop={10} textAlign={'center'} gutterBottom>
              CONTROL TALLER
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {metricsTaller.map((metric, index) => (
              <Grid size={{ md: 3, xs: 12 }} key={index}>
                <KpiCard {...metric} />
              </Grid>
            ))}
          </Grid>


          <Typography variant="h6" gutterBottom>
            Detalle Servicios
          </Typography>
          <ProductsTable
            rows={data.serviciosDetalle}
            columns={columnsServicios}
            footerRow={{
              placa: 'Totales',
              total: "Q " + (data.serviciosDetalle.reduce((sum, row) =>  sum + (row.total || 0), 0)).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}),
            }}
          />

          <Box mt={4} /> 

          
          <Box mt={4} /> 
            <Typography variant="h6" gutterBottom>
            Ingresos/Egresos Taller
          </Typography>
          <ProductsTable
            rows={data.gastosTallerDetalle}
            columns={columnsIngresosEgresos}
            footerRow={{
              descripcion: 'Totales',
              monto: "Q " + (data.gastosTallerDetalle.reduce((sum, row) => sum + (row.monto || 0), 0)).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}),
            }}

          />

          <Typography variant='h4' marginTop={10} textAlign={'center'} gutterBottom>
              CONTROL REPUESTOS
          </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
            {metricsRepuestos.map((metric, index) => (
              <Grid size={{ md: 3, xs: 12 }} key={index}>
                <KpiCard {...metric} />
              </Grid>
            ))}
          </Grid>

        
        <Typography variant="h6" gutterBottom>
            Ventas
          </Typography>
          <ProductsTable
            rows={data.ventasDetalle}
            columns={columnsVentas}
            footerRow={{
              id: 'Totales',
                costo: "Q " + (data.ventasDetalle.reduce((sum, row) => sum + (row.costo || 0), 0)).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}),
                precioTotal: "Q " + (data.ventasDetalle.reduce((sum, row) => sum + (row.precioTotal || 0), 0)).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}),
                gananciaTotal: "Q " + (data.ventasDetalle.reduce((sum, row) => sum + (row.gananciaTotal || 0), 0)).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}),
              total: "Q " + (data.ventasDetalle.reduce((sum, row) => sum + (row.total || 0), 0)).toLocaleString('en-US',{minimumFractionDigits: 2, maximumFractionDigits: 2}),
            }}
          />
          
          <Box mt={4} /> 
            <Typography variant="h6" gutterBottom>
            Ingresos/Egresos Repuestos
          </Typography>
          <ProductsTable
            rows={data.gastosRepuestosDetalle}
            columns={columnsIngresosEgresos}
            footerRow={{
              descripcion: 'Totales',
              monto: "Q " + (data.gastosRepuestosDetalle.reduce((sum, row) => sum + (row.monto || 0), 0)).toFixed(2),
            }}

          />

          
        </>
        
      )}
    </Box>
  );
};

export default Contabilidad;