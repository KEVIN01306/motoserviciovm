import { useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { RiEdit2Line } from "react-icons/ri";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { getTipo } from "../../../services/tipoServicio.services";
import type { TipoServicioGetType } from "../../../types/tipoServicioType";
import DetailData from "../components/DetailData";
import { useGoTo } from "../../../hooks/useGoTo";
import { PiDeviceTabletFill } from "react-icons/pi";
import { useAuthStore } from "../../../store/useAuthStore";

const TiposServiciosDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<TipoServicioGetType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const goTo = useGoTo();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getTipo(id);
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
  if (!item) return <ErrorCard errorText={'Tipo no encontrado'} restart={() => window.location.reload()} />;

  const breadcrumbsData = [
    { label: "Tipos de servicio", icon: <PiDeviceTabletFill fontSize="inherit" />, href: "/admin/tiposervicio" },
    { label: `${item?.tipo ?? "Detalle"}`, icon: <PiDeviceTabletFill fontSize="inherit" />, href: `/admin/tiposervicio/${id}` },
  ];

  return (
    <>
      <BreadcrumbsRoutes items={breadcrumbsData} />
      <DetailData item={item} />
        {user?.permisos?.includes("tiposervicios:edit") && (
        <div className="mt-4 flex justify-end">
          <Button variant="contained" color="primary" startIcon={<RiEdit2Line />} onClick={() => goTo(`/admin/tiposervicio/${id}/edit`)} fullWidth>
            Editar Tipo
          </Button>
        </div>
      )}
    </>
  );
};

export default TiposServiciosDetail;
