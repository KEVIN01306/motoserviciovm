import { useEffect, useState } from "react";
import { Grid, Divider, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import FormEstructure from "../../../components/utils/FormEstructure";
import InputsForm from "../components/InputsForm";
import { TipoServicioInitialState, type TipoServicioType } from "../../../types/tipoServicioType";
import { tipoServicioSchema } from "../../../zod/tipoServicio.schema";
import { postTipo } from "../../../services/tipoServicio.services";
import { successToast, errorToast } from "../../../utils/toast";
import { useGoTo } from "../../../hooks/useGoTo";
import { getOpciones } from "../../../services/opcionServicio.services";
import type { OpcionServicioType } from "../../../types/opcionServicioType";
import { PiDeviceTabletFill, PiPlus } from "react-icons/pi";

const TiposServiciosCreate = () => {
  const goTo = useGoTo();
  const [opciones, setOpciones] = useState<OpcionServicioType[]>([]);

  const { register, handleSubmit, reset, control, formState, watch, setValue } = useForm<TipoServicioType>({
    resolver: zodResolver(tipoServicioSchema) as any,
    defaultValues: TipoServicioInitialState as any,
  });

  const { isSubmitting } = formState;

  useEffect(() => {
    const fetchOpciones = async () => {
      try {
        const res = await getOpciones();
        setOpciones(res);
      } catch (err) {
        // ignore or could show toast
      }
    };
    fetchOpciones();
  }, []);

  const handlerSubmit = async (data: TipoServicioType) => {
    try {
      await postTipo(data);
      successToast(`Tipo creado: ${data.tipo}`);
      reset(TipoServicioInitialState as any);
    } catch (err: any) {
      errorToast(err.message);
    }
  };

  return (
    <>
      <BreadcrumbsRoutes
        items={[
          { label: "Tipos de servicio", icon: <PiDeviceTabletFill/>, href: "/admin/tiposervicio" },
          { label: "Crear Tipo", icon: <PiPlus/>, href: "/admin/tiposervicio/create" },
        ]}
      />

      <FormEstructure handleSubmit={handleSubmit(handlerSubmit)}>
        <InputsForm register={register} errors={formState.errors as any} control={control} watch={watch} setValue={setValue} opciones={opciones} />

        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid size={12}>
          <Button type="submit" variant="contained" disabled={isSubmitting} fullWidth>
            {isSubmitting ? "Guardando..." : "Crear Tipo"}
          </Button>
        </Grid>
      </FormEstructure>
    </>
  );
};

export default TiposServiciosCreate;
