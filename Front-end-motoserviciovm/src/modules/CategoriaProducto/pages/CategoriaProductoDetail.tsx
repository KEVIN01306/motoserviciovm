import { useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { RiEdit2Line } from "react-icons/ri";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { getCategoria } from "../../../services/categoriaProducto.services";
import type { CategoriaProductoType } from "../../../types/categoriaProductoType";
import DetailData from "../components/DetailData";
import { useGoTo } from "../../../hooks/useGoTo";
import { useAuthStore } from "../../../store/useAuthStore";
import { TbCategory } from "react-icons/tb";

const CategoriaProductoDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<CategoriaProductoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const goTo = useGoTo();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getCategoria(id);
        setItem(res as any);
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
  if (!item) return <ErrorCard errorText={'Categoría no encontrada'} restart={() => window.location.reload()} />;

  const breadcrumbsData = [
    { label: "Categorías de producto", icon: <TbCategory fontSize="inherit" />, href: "/admin/categoriaproducto" },
    { label: `${item?.categoria ?? "Detalle"}`, icon: <TbCategory fontSize="inherit" />, href: `/admin/categoriaproducto/${id}` },
  ];

  return (
    <>
      <BreadcrumbsRoutes items={breadcrumbsData} />
      <DetailData categoria={item} />
        <Grid size={12} sx={{ mt: 2 }}>
        {user?.permisos?.includes("categoriaproducto:edit") && (
          <Button variant="contained" color="primary" startIcon={<RiEdit2Line />} onClick={() => goTo(`/admin/categoriaproducto/${id}/edit`)} fullWidth>
            Editar Categoría
          </Button>
        )}
      </Grid>
    </>
  );
};

export default CategoriaProductoDetail;
