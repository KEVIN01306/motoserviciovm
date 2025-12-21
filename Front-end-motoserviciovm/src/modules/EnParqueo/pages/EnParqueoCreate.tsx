import { Grid, Divider, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoTo } from "../../../hooks/useGoTo";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { RiBikeFill } from "react-icons/ri";
import FormEstructure from "../../../components/utils/FormEstructure";
import InputsForm from "../components/InputsForm";
import { postEnParqueo } from "../../../services/enParqueo.services";
import { successToast, errorToast } from "../../../utils/toast";
import { enParqueoSchema } from "../../../zod/enParqueo.schema";
import { EnParqueoInitialState, type EnParqueoType } from "../../../types/enParqueoType";

const EnParqueoCreate = () => {
  const goTo = useGoTo();
  const { register, handleSubmit, reset, control, formState } = useForm<EnParqueoType>({
    resolver: zodResolver(enParqueoSchema) as any,
    defaultValues: EnParqueoInitialState as any,
  });

  const { isSubmitting } = formState;

  const handlerSubmit = async (data: EnParqueoType) => {
    try {
      await postEnParqueo(data);
      successToast("Registro creado");
      reset(EnParqueoInitialState as any);
      goTo("/admin/enparqueo");
    } catch (err: any) {
      errorToast(err.message);
    }
  };

  return (
    <>
      <BreadcrumbsRoutes
        items={[
          { label: "En Parqueo", icon: <RiBikeFill fontSize="inherit" />, href: "/admin/enparqueo" },
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

export default EnParqueoCreate;