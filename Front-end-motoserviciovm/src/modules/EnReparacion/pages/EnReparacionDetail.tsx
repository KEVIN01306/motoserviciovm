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
import { Grid, Button, Link, Checkbox } from "@mui/material";
import type { EnReparacionGetType } from "../../../types/enReparacionType";
import ProductsTable from "../../../components/Table/ProductsTable";

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

              {/* 2. El botón ahora queda fuera de DetailData */}
              {!isEntregado(item) && user?.permisos?.includes("enreparacion:salida") && (
                <Grid size={12} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RiEdit2Line />}
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
                  { id: 'repuesto', label: 'Repuesto', minWidth: 120, format: (row: any) => row.nombre ?? '' },
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
