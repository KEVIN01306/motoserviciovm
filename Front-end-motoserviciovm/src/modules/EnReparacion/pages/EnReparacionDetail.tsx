import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { getEnReparacion } from "../../../services/enReparacion.services";
import DetailData from "../components/DetailData";
import { useGoTo } from "../../../hooks/useGoTo";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { RiBikeFill, RiEdit2Line } from "react-icons/ri";
import { useAuthStore } from "../../../store/useAuthStore";
import { Grid, Button, Link, Checkbox, Typography, Chip } from "@mui/material";
import type { EnReparacionGetType } from "../../../types/enReparacionType";
import ProductsTable from "../../../components/Table/ProductsTable";
import { Box } from "@mui/system";
import LinkStylesNavigate from "../../../components/utils/links";
import { estados } from "../../../utils/estados";
import type { VentaProductoGetType } from "../../../types/ventaType";
import { BikeScooterRounded } from "@mui/icons-material";

const EnReparacionDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<EnReparacionGetType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const goTo = useGoTo();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getEnReparacion(Number(id));
          setItem(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);


  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={() => window.location.reload()} />;

  const isEntregado = (row: any) => {
    const estadoLabel = (row?.estado?.estado ?? "").toLowerCase();
    return estadoLabel.includes("entreg") || estadoLabel.includes("salid") || estadoLabel.includes("salida");
  };

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

  const totalVentas = item?.ventas?.reduce((acc, venta) => acc + (venta.total || 0), 0) || 0;

  return (
    <>
      <BreadcrumbsRoutes
        items={[
          { label: "En Reparación", icon: <RiBikeFill fontSize="inherit" />, href: "/admin/enreparacion" },
          { label: "Detalle", icon: <RiBikeFill fontSize="inherit" />, href: `/admin/enreparacion/${id}` },
        ]}
      />
      <Grid container spacing={2} width={'100%'}>
        {item ? (
          <>
            <Grid size={12}>
               
              {/* 1. Cerramos DetailData aquí (autocierre />) */}
              <DetailData item={item} />

              {!isEntregado(item) && user?.permisos?.includes("enreparacion:edit") && (
                <Grid size={12} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RiEdit2Line />}
                    fullWidth
                    onClick={() => goTo(`/admin/enreparacion/${id}/edit`)}
                  >
                    Editar
                  </Button>
                </Grid>
              )}
              {
              item.ventas?.length === 0 ? (
                <Typography>No hay ventas asociadas a este servicio.</Typography>
              ) : (
                <>
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Ventas Asociadas (Total: Q {totalVentas.toFixed(2)})</Typography>
                {item.ventas?.map((venta) => (
                  <Box key={venta.id} sx={{ mb: 4, mt: 2 }} >
                    <LinkStylesNavigate label={`Venta #${venta.id}`} onClick={() => goTo(`/admin/ventas/${venta.id}`)} variant="h6" />
                    <Chip label={venta.estado?.estado ?? ''} color={chipColorByEstado(venta.estado?.id)} sx={{ mb: 2 }} variant='outlined'/>
                    <ProductsTable
                    columns={[
                      { id: 'producto', label: 'Producto', minWidth: 120, format: (_:any, row: VentaProductoGetType) => row.producto?.nombre ?? '' },
                      { id: 'precio', label: 'Precio', minWidth: 100, align: 'right', format: (_v:any, row: VentaProductoGetType) => `Q ${Number(row.producto?.precio ?? 0).toFixed(2)}` },
                      { id: 'cantidad', label: 'Cantidad', minWidth: 80, align: 'center', format: (v:any) => String(v) },
                      { id: 'descuento', label: 'Descuento', minWidth: 80, align: 'center', format: (v:any) => v ? 'Sí' : 'No' },
                      { id: 'totalProducto', label: 'Total', minWidth: 100, align: 'right', format: (v:any) => `Q ${Number(v).toFixed(2)}` },
                    ] as any}
                    rows={venta.productos ?? []}
                    headerColor="#1565c0"
                      />
                  </Box>
                ))}
                </>
              )
            }
              {
                user?.permisos?.includes("ventas:create")  && (
                  <Button variant="contained" color="secondary" sx={{ mt: 2, mr: 2 }} onClick={() => goTo('/admin/ventas/create?reparacionId=' + item.id)}>
                    Crear Venta
                  </Button>
                )
              }

              {/* 2. El botón ahora queda fuera de DetailData */}
              {!isEntregado(item) && user?.permisos?.includes("enreparacion:salida") && (
                <Grid size={{xs:12, md:3}} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<BikeScooterRounded />}
                    fullWidth
                    onClick={() => goTo(`/admin/enreparacion/${id}/salida`)}
                  >
                    Registrar Salida
                  </Button>
                </Grid>
              )}
              
            </Grid>
            

            <Grid size={12} sx={{ mt: 4 }}>
              <ProductsTable
                columns={[
                  { id: 'nombre', label: 'Repuesto', minWidth: 120},
                  { id: 'descripcion', label: 'Descripción', minWidth: 180, format: (row: any) => row.descripcion ?? '' },
                  { id: 'refencia', label: 'Referencia', minWidth: 100, format: (row: any) => row.refencia ? (<Link href={row.refencia} target="_blank" rel="noopener noreferrer" underline="hover" >Link</Link>) : 'No hay' },
                  { id: 'checked', label: 'Entregado', minWidth: 100, format: (row: any) => <Checkbox color="primary" checked={!!row.checked} disabled /> },
                  { id: 'cantidad', label: 'Cantidad', minWidth: 80, align: 'center', format: (row: any) => String(row.cantidad) },
                ] as any}
                rows={item.repuestos ?? []}
                headerColor="#1565c0"
              />
            </Grid>
          </>
        ) : null}

      </Grid>

    </>
  );
};

export default EnReparacionDetail;
