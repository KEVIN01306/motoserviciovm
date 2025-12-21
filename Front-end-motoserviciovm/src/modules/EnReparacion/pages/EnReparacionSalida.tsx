import { Grid, Divider, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGoTo } from "../../../hooks/useGoTo";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { RiBikeFill } from "react-icons/ri";
import FormEstructure from "../../../components/utils/FormEstructure";
import SalidaForm from "../components/SalidaForm";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { getEnReparacion, putEnReparacionSalida } from "../../../services/enReparacion.services";
import { successToast, errorToast } from "../../../utils/toast";
import { enReparacionSchema } from "../../../zod/enReparacion.schema";
import type { EnReparacionType, EnReparacionGetType } from "../../../types/enReparacionType";
import { mergeEnReparacionDataWithDefaults } from "../../../types/enReparacionType";

const EnReparacionSalida = () => {
  const { id } = useParams();
  const goTo = useGoTo();
  const [item, setItem] = useState<EnReparacionGetType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, reset, formState, register } = useForm<Partial<EnReparacionType>>({
    resolver: zodResolver(enReparacionSchema) as any,
    defaultValues: {},
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        if (id) {
          const data: EnReparacionGetType = await getEnReparacion(Number(id));
          setItem(data);
          const merged = mergeEnReparacionDataWithDefaults(data as Partial<EnReparacionType>);
          reset(merged as any);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const onSubmit = async (data: Partial<EnReparacionType>) => {
    if (!id) return;
    try {
      const payload: Partial<EnReparacionType> = { ...data };
      if (payload.total !== undefined && payload.total !== null) {
        const n = Number((payload.total as unknown) as string);
        payload.total = Number.isNaN(n) ? undefined : n;
      }

      await putEnReparacionSalida(Number(id), payload);
      successToast("Salida registrada");
      goTo("/admin/enreparacion");
    } catch (err: any) {
      errorToast(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={() => window.location.reload()} />;

  return (
    <>
      <BreadcrumbsRoutes
        items={[
          { label: "En Reparación", icon: <RiBikeFill fontSize="inherit" />, href: "/admin/enreparacion" },
          { label: "Salida", icon: <RiBikeFill fontSize="inherit" /> },
        ]}
      />

      <FormEstructure handleSubmit={handleSubmit(onSubmit)}>
        <SalidaForm control={control} errors={formState.errors} readOnlyValues={item ?? undefined} register={register} />

        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid size={12}>
          <Button type="submit" variant="contained" disabled={formState.isSubmitting} fullWidth>
            {formState.isSubmitting ? "Guardando..." : "Registrar Salida"}
          </Button>
        </Grid>
      </FormEstructure>
    </>
  );
};

export default EnReparacionSalida;
