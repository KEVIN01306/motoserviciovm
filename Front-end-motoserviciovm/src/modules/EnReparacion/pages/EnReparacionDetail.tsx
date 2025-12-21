import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { getEnReparacion } from "../../../services/enReparacion.services";
import DetailData from "../components/DetailData";
import RepuestosTable from "../components/RepuestosTable";
import { useGoTo } from "../../../hooks/useGoTo";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { RiBikeFill, RiEdit2Line } from "react-icons/ri";
import { useAuthStore } from "../../../store/useAuthStore";
import { Grid, Button } from "@mui/material";

const EnReparacionDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<any | null>(null);
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
      {item ? (
        <>
          <DetailData item={item}>
            {!isEntregado(item) && user?.permisos?.includes("enreparacion:salida") && (
              <Grid size={12}>
                <Button variant="contained" color="primary" startIcon={<RiEdit2Line />} fullWidth onClick={() => goTo(`/admin/enreparacion/${id}/salida`)}>
                  Registrar Salida
                </Button>
              </Grid>
            )}
          </DetailData>
            <RepuestosTable reparacionId={item.id as number} initial={item.repuestos ?? []} editable={false} />
        </>
      ) : null}
    </>
  );
};

export default EnReparacionDetail;
