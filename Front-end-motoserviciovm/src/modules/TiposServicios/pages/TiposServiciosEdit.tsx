import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Divider, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import FormEstructure from "../../../components/utils/FormEstructure";
import InputsForm from "../components/InputsForm";
import { TipoServicioInitialState, mergeTipoServicioDataWithDefaults, type TipoServicioType,type TipoServicioGetType } from "../../../types/tipoServicioType";
import { tipoServicioSchema } from "../../../zod/tipoServicio.schema";
import { getTipo, putTipo } from "../../../services/tipoServicio.services";
import { successToast, errorToast } from "../../../utils/toast";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { useGoTo } from "../../../hooks/useGoTo";
import { getOpciones } from "../../../services/opcionServicio.services";
import type { OpcionServicioType } from "../../../types/opcionServicioType";
import { PiDeviceTabletFill } from "react-icons/pi";
import { EditNoteOutlined } from "@mui/icons-material";
import { getTiposHorario } from "../../../services/tipoHorario.services";
import type { TipoHorarioType } from "../../../types/tipoHorario";

const TiposServiciosEdit = () => {
  const { id } = useParams();
  const goTo = useGoTo();

  const { register, handleSubmit, reset, formState, control, watch, setValue } = useForm<TipoServicioType>({
    resolver: zodResolver(tipoServicioSchema) as any,
    defaultValues: TipoServicioInitialState as any,
  });

  const [item, setItem] = useState<TipoServicioGetType | null>(null);
  const [opciones, setOpciones] = useState<OpcionServicioType[]>([]);
  const [tiposHorario, setTiposHorario] = useState<TipoHorarioType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fecthTiposHorarios = async () => {
    try {
      const res = await getTiposHorario();
      setTiposHorario(res);
      console.log(res);
    } catch (err) {
      // ignore or could show toast
    }
  };

  useEffect(() => {
    fecthTiposHorarios();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const [resOpciones, res] = await Promise.all([getOpciones(), getTipo(String(id))]);
        setOpciones(resOpciones);
        console.log('Fetched tipo servicio:', res);
        setItem(res);
        const merged = mergeTipoServicioDataWithDefaults(res as any) as any;
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
  if (!item) return <ErrorCard errorText={"Tipo no encontrado"} restart={() => window.location.reload()} />;

  const onSubmit = async (data: TipoServicioType) => {
    try {
      await putTipo(String(id), data);
      successToast(`Tipo actualizado: ${data.tipo}`);
      goTo('/admin/tiposervicio');
    } catch (err: any) {
      errorToast(err.message);
    }
  };

  return (
    <>
      <BreadcrumbsRoutes
        items={[
          { label: "Tipos de servicio", icon: <PiDeviceTabletFill/>, href: "/admin/tiposervicio" },
          { label: `${item?.tipo ?? "Detalle"}`, icon: <PiDeviceTabletFill/>, href: `/admin/tiposervicio/${id}` },
            { label: "Editar", icon: <EditNoteOutlined/>, href: `/admin/tiposervicio/${id}/edit` },
        ]}
      />

      <FormEstructure handleSubmit={handleSubmit(onSubmit)}>
        <InputsForm register={register} errors={formState.errors as any} control={control} watch={watch} setValue={setValue} opciones={opciones} tiposHorario={tiposHorario}/>

        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid size={12}>
          <Button type="submit" variant="contained" disabled={formState.isSubmitting} fullWidth>
            {formState.isSubmitting ? "Guardando..." : "Actualizar Tipo"}
          </Button>
        </Grid>
      </FormEstructure>
    </>
  );
};

export default TiposServiciosEdit;
