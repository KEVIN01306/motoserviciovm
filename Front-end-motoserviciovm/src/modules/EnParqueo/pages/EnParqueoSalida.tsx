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
import { getEnParqueo, putEnParqueoSalida } from "../../../services/enParqueo.services";
import { successToast, errorToast } from "../../../utils/toast";
import { enParqueoSchema } from "../../../zod/enParqueo.schema";
import type { EnParqueoType, EnParqueoGetType } from "../../../types/enParqueoType";
import { mergeEnParqueoDataForSubmission, mergeEnParqueoDataWithDefaults } from "../../../types/enParqueoType";

const EnParqueoSalida = () => {
  const { id } = useParams();
  const goTo = useGoTo();
  const [item, setItem] = useState<EnParqueoGetType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, reset, formState, register } = useForm<Partial<EnParqueoType>>({
    resolver: zodResolver(enParqueoSchema) as any,
    defaultValues: {} as Partial<EnParqueoType>,
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        if (id) {
          const data: EnParqueoGetType = await getEnParqueo(Number(id));
          setItem(data);
          const merged = mergeEnParqueoDataWithDefaults(data as Partial<EnParqueoType>);
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

  const onSubmit = async (data: Partial<EnParqueoType>) => {
    if (!id) return;
    try {
      const payload = mergeEnParqueoDataForSubmission(data);
      console.log("Submitting payload:", payload);
      await putEnParqueoSalida(Number(id), payload);
      successToast("Salida registrada");
      goTo(`/admin/enparqueo/${id}`);
    } catch (err: any) {
      console.error("Error during form submission:", err);
      errorToast(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={() => window.location.reload()} />;

  return (
    <>
      <BreadcrumbsRoutes
        items={[
          { label: "En Parqueo", icon: <RiBikeFill fontSize="inherit" />, href: "/admin/enparqueo" },
          { label: "Salida", icon: <RiBikeFill fontSize="inherit" /> },
        ]}
      />

      <FormEstructure
        handleSubmit={handleSubmit(
          onSubmit,
          (errors) => {
            console.error("Validation errors:", errors);
            errorToast("Por favor, revisa los campos del formulario.");
          }
        )}
      >
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

export default EnParqueoSalida;