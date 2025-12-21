import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { RiBikeFill, RiEdit2Line } from "react-icons/ri";
import { getEnParqueo } from "../../../services/enParqueo.services";
import DetailData from "../components/DetailData";
import { useGoTo } from "../../../hooks/useGoTo";
import { useAuthStore } from "../../../store/useAuthStore";
import { Button, Grid } from "@mui/material";

const EnParqueoDetail = () => {
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
          const data = await getEnParqueo(Number(id));
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
          { label: "En Parqueo", icon: <RiBikeFill fontSize="inherit" />, href: "/admin/enparqueo" },
          { label: "Detalle", icon: <RiBikeFill fontSize="inherit" />, href: `/admin/enparqueo/${id}` },
        ]}
      />
      {item ? (
        <DetailData item={item}>
          {/* show blue button linking to salida if user has permiso and registro not entregado */}
          {!isEntregado(item) && user?.permisos?.includes("enparqueo:salida") && (
            <Grid size={12}>
              <Button variant="contained" color="primary" startIcon={<RiEdit2Line />} fullWidth onClick={() => goTo(`/admin/enparqueo/${id}/salida`)}>
                Registrar Salida
              </Button>
            </Grid>
          )}
        </DetailData>
      ) : null}
    </>
  );
};

export default EnParqueoDetail;