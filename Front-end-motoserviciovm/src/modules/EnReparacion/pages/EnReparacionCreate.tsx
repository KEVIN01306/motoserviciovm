import { Grid, Divider, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoTo } from "../../../hooks/useGoTo";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { RiBikeFill } from "react-icons/ri";
import FormEstructure from "../../../components/utils/FormEstructure";
import InputsForm from "../components/InputsForm";
import { postEnReparacion } from "../../../services/enReparacion.services";
import { successToast, errorToast } from "../../../utils/toast";
import { enReparacionSchema } from "../../../zod/enReparacion.schema";
import { EnReparacionInitialState, type EnReparacionType } from "../../../types/enReparacionType";

const EnReparacionCreate = () => {
  const goTo = useGoTo();
  const { register, handleSubmit, reset, control, formState } = useForm<EnReparacionType>({
    resolver: zodResolver(enReparacionSchema) as any,
    defaultValues: EnReparacionInitialState as any,
  });

  const { isSubmitting } = formState;

  const handlerSubmit = async (data: EnReparacionType) => {
    try {
      await postEnReparacion(data);
      successToast("Registro creado");
      reset(EnReparacionInitialState as any);
      goTo("/admin/enreparacion");
    } catch (err: any) {
      errorToast(err.message);
    }
  };

  return (
    <>
      <BreadcrumbsRoutes
        items={[
          { label: "En Reparación", icon: <RiBikeFill fontSize="inherit" />, href: "/admin/enreparacion" },
          { label: "Crear", icon: <RiBikeFill fontSize="inherit" /> },
        ]}
      />

      <FormEstructure handleSubmit={handleSubmit(handlerSubmit)}>
        <InputsForm register={register} errors={formState.errors} control={control} />

        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid size={12}>
          <Button type="submit" variant="contained" disabled={isSubmitting} fullWidth>
            {isSubmitting ? "Guardando..." : "Crear Registro"}
          </Button>
        </Grid>
      </FormEstructure>
    </>
  );
};

export default EnReparacionCreate;
