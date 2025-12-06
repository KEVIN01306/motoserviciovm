import { Grid, Divider, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoTo } from "../../../hooks/useGoTo";
import { OpcionServicioInitialState, type OpcionServicioType } from "../../../types/opcionServicioType";
import { opcionesServicioSchema } from "../../../zod/opcionServicio.shema";
import FormEstructure from "../../../components/utils/FormEstructure";
import InputsForm from "../components/InputsForm";
import { postOpcion } from "../../../services/opcionServicio.services";
import { successToast, errorToast } from "../../../utils/toast";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { PiDeviceTabletFill, PiPlus } from "react-icons/pi";

const OpcionesServiciosCreate = () => {
  const goTo = useGoTo();

  const { register, handleSubmit, reset, formState } = useForm<OpcionServicioType>({
    resolver: zodResolver(opcionesServicioSchema) as any,
    defaultValues: OpcionServicioInitialState as any,
  });

  const { isSubmitting } = formState;

  const handlerSubmit = async (data: OpcionServicioType) => {
    try {
      const payload = { opcion: data.opcion, descripcion: data.descripcion, estadoId: data.estadoId } as unknown as OpcionServicioType;
      await postOpcion(payload);
      successToast(`Opción creada: ${data.opcion}`);
      reset(OpcionServicioInitialState as any);
      goTo("/admin/opcionservicio");
    } catch (err: any) {
      errorToast(err.message);
    }
  };

  return (
    <>
      <BreadcrumbsRoutes
        items={[
          { label: "Opciones de servicio", icon: <PiDeviceTabletFill fontSize="inherit" />, href: "/admin/opcionservicio" },
          { label: "Crear Opción", icon: <PiPlus fontSize="inherit" />, href: "/admin/opcionservicio/create" },
        ]}
      />

      <FormEstructure handleSubmit={handleSubmit(handlerSubmit)}>
        <InputsForm register={register} errors={formState.errors as any} />

        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid size={12}>
          <Button type="submit" variant="contained" disabled={isSubmitting} fullWidth>
            {isSubmitting ? "Guardando..." : "Crear Opción"}
          </Button>
        </Grid>
      </FormEstructure>
    </>
  );
};

export default OpcionesServiciosCreate;
