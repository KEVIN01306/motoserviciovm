import { useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { getOpcion } from "../../../services/opcionServicio.services";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import DetailData from "../components/DetailData";
import type { OpcionServicioType } from "../../../types/opcionServicioType";
import { useGoTo } from "../../../hooks/useGoTo";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { PiDeviceTabletFill } from "react-icons/pi";
import { RiEdit2Line } from "react-icons/ri";
import { useAuthStore } from "../../../store/useAuthStore";

const OpcionesServiciosDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<OpcionServicioType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const goTo = useGoTo();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getOpcion(id);
        setItem(res);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={() => window.location.reload()} />;
  if (!item) return <ErrorCard errorText={'Opción no encontrada'} restart={() => window.location.reload()} />;

  const breadcrumbsData = [
    { label: "Opciones de servicio", icon: <PiDeviceTabletFill fontSize="inherit" />, href: "/admin/opcionservicio" },
    { label: `${item?.opcion ?? "Detalle"}`, icon: <PiDeviceTabletFill fontSize="inherit" />, href: `/admin/opcionservicio/${id}` },
  ];

  return (
    <>
      <BreadcrumbsRoutes items={breadcrumbsData} />
      <Grid container spacing={2}>
        <DetailData opcion={item} />
        {user?.permisos?.includes("opcioneservicios:edit") && (
          <Grid size={12}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RiEdit2Line />}
              onClick={() => goTo(`/admin/opcionservicio/${id}/edit`)}
              fullWidth
            >
              Editar Opción
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default OpcionesServiciosDetail;
