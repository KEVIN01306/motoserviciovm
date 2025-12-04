import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Divider, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import FormEstructure from "../../../components/utils/FormEstructure";
import InputsForm from "../components/InputsForm";
import { CategoriaProductoInitialState, mergeCategoriaProductoDataWithDefaults, type CategoriaProductoType } from "../../../types/categoriaProductoType";
import { categoriaProductoSchema } from "../../../zod/categoriaProducto.schema";
import { getCategoria, putCategoria } from "../../../services/categoriaProducto.services";
import { successToast, errorToast } from "../../../utils/toast";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { useGoTo } from "../../../hooks/useGoTo";
import { TbCategory } from "react-icons/tb";
import { EditNoteOutlined } from "@mui/icons-material";

const CategoriaProductoEdit = () => {
  const { id } = useParams();
  const goTo = useGoTo();

  const { register, handleSubmit, reset, formState } = useForm<CategoriaProductoType>({
    resolver: zodResolver(categoriaProductoSchema) as any,
    defaultValues: CategoriaProductoInitialState as any,
  });

  const [item, setItem] = useState<CategoriaProductoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getCategoria(String(id));
        setItem(res);
        const merged = mergeCategoriaProductoDataWithDefaults(res as any) as any;
        reset(merged);
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
  if (!item) return <ErrorCard errorText={"Categoría no encontrada"} restart={() => window.location.reload()} />;

  const onSubmit = async (data: CategoriaProductoType) => {
    try {
      await putCategoria(String(id), data);
      successToast(`Categoría actualizada: ${data.categoria}`);
      goTo('/admin/categoriaproducto');
    } catch (err: any) {
      errorToast(err.message);
    }
  };

  return (
    <>
      <BreadcrumbsRoutes
        items={[
          { label: "Categorías de producto", icon: <TbCategory />, href: "/admin/categoriaproducto" },
          { label: `${item?.categoria ?? "Detalle"}`, icon: <TbCategory />, href: `/admin/categoriaproducto/${id}` },
          { label: "Editar", icon: <EditNoteOutlined />, href: `/admin/categoriaproducto/${id}/edit` },
        ]}
      />

      <FormEstructure handleSubmit={handleSubmit(onSubmit)}>
        <InputsForm register={register} errors={formState.errors as any} />

        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid size={12}>
          <Button type="submit" variant="contained" disabled={formState.isSubmitting} fullWidth>
            {formState.isSubmitting ? "Guardando..." : "Actualizar Categoría"}
          </Button>
        </Grid>
      </FormEstructure>
    </>
  );
};

export default CategoriaProductoEdit;
