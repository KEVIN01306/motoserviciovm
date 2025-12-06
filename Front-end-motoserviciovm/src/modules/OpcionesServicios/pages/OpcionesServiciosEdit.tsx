import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Divider, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OpcionServicioInitialState, mergeOpcionServicioDataWithDefaults, type OpcionServicioType } from "../../../types/opcionServicioType";
import { opcionesServicioSchema } from "../../../zod/opcionServicio.shema";
import { getOpcion, putOpcion } from "../../../services/opcionServicio.services";
import FormEstructure from "../../../components/utils/FormEstructure";
import InputsForm from "../components/InputsForm";
import { successToast, errorToast } from "../../../utils/toast";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { useGoTo } from "../../../hooks/useGoTo";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { PiDeviceTabletFill } from "react-icons/pi";
import { EditNoteOutlined } from "@mui/icons-material";

const OpcionesServiciosEdit = () => {
  const { id } = useParams();
  const goTo = useGoTo();

  const { register, handleSubmit, reset, formState } = useForm<OpcionServicioType>({
    resolver: zodResolver(opcionesServicioSchema) as any,
    defaultValues: OpcionServicioInitialState as any,
  });

  const [item, setItem] = useState<OpcionServicioType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getOpcion(String(id));
        setItem(res);
        const merged = mergeOpcionServicioDataWithDefaults(res as any) as any;
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
  if (!item) return <ErrorCard errorText={"Opción no encontrada"} restart={() => window.location.reload()} />;

  const onSubmit = async (data: OpcionServicioType) => {
    try {
      await putOpcion(String(id), data);
      successToast(`Opción actualizada: ${data.opcion}`);
      goTo('/admin/opcionservicio');
    } catch (err: any) {
      errorToast(err.message);
    }
  };

  return (
    <>
      <BreadcrumbsRoutes
        items={[
          { label: "Opciones de servicio", icon: <PiDeviceTabletFill fontSize="inherit" />, href: "/admin/opcionservicio" },
          { label: `${item?.opcion ?? "Detalle"}`, icon: <PiDeviceTabletFill fontSize="inherit" />, href: `/admin/opcionservicio/${id}` },
          { label: "Editar", icon: <EditNoteOutlined fontSize="inherit" />, href: `/admin/opcionservicio/${id}/edit` },
        ]}
      />

      <FormEstructure handleSubmit={handleSubmit(onSubmit)}>
        <InputsForm register={register} errors={formState.errors as any} />

        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid size={12}>
          <Button type="submit" variant="contained" disabled={formState.isSubmitting} fullWidth>
            {formState.isSubmitting ? "Guardando..." : "Actualizar Opción"}
          </Button>
        </Grid>
      </FormEstructure>
    </>
  );
};

export default OpcionesServiciosEdit;
