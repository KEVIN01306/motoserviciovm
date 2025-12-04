import { Grid, Divider, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import FormEstructure from "../../../components/utils/FormEstructure";
import InputsForm from "../components/InputsForm";
import { CategoriaProductoInitialState, type CategoriaProductoType } from "../../../types/categoriaProductoType";
import { categoriaProductoSchema } from "../../../zod/categoriaProducto.schema";
import { postCategoria } from "../../../services/categoriaProducto.services";
import { successToast, errorToast } from "../../../utils/toast";
import { useGoTo } from "../../../hooks/useGoTo";
import { TbCategory, TbCategoryPlus } from "react-icons/tb";

const CategoriaProductoCreate = () => {
  const goTo = useGoTo();

  const { register, handleSubmit, reset, formState } = useForm<CategoriaProductoType>({
    resolver: zodResolver(categoriaProductoSchema) as any,
    defaultValues: CategoriaProductoInitialState as any,
  });

  const { isSubmitting } = formState;

  const handlerSubmit = async (data: CategoriaProductoType) => {
    try {
      await postCategoria(data);
      successToast(`Categoría creada: ${data.categoria}`);
      reset(CategoriaProductoInitialState as any);
      goTo("/admin/categoriaproducto");
    } catch (err: any) {
      errorToast(err.message);
    }
  };

  return (
    <>
      <BreadcrumbsRoutes
        items={[
          { label: "Categorías de producto", icon: <TbCategory/>, href: "/admin/categoriaproducto" },
          { label: "Crear Categoría", icon: <TbCategoryPlus/>, href: "/admin/categoriaproducto/create" },
        ]}
      />

      <FormEstructure handleSubmit={handleSubmit(handlerSubmit)}>
        <InputsForm register={register} errors={formState.errors as any} />

        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid size={12}>
          <Button type="submit" variant="contained" disabled={isSubmitting} fullWidth>
            {isSubmitting ? "Guardando..." : "Crear Categoría"}
          </Button>
        </Grid>
      </FormEstructure>
    </>
  );
};

export default CategoriaProductoCreate;
