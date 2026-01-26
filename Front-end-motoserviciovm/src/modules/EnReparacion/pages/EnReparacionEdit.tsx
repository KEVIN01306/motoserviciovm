import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, TextField, Button, Divider } from "@mui/material";

import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { RiBikeFill } from "react-icons/ri";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";

import { EnReparacionInitialState, mergeEnReparacionDataForSubmissionEdit, type EnReparacionGetType, type EnReparacionType } from "../../../types/enReparacionType";
import RepuestosTable from "../components/RepuestosTable";
import { getEnReparacion as getEnReparacionService, putEnReparacion, putEnReparacionSalida } from "../../../services/enReparacion.services";
import CardForm from "../../../components/utils/cards/CardForm";
import { Padding } from "@mui/icons-material";
import FormEstructure from "../../../components/utils/FormEstructure";
import InputsForm from "../components/InputsForm";
import { enReparacionSchema } from "../../../zod/enReparacion.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { errorToast, successToast } from "../../../utils/toast";
import RepuestosReparacionForm from "../../Servicios/components/RepuestosReparacionForm";

const EnReparacionEdit = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EnReparacionGetType | null>(null);

  const { register, handleSubmit, reset, control, formState, getValues } = useForm<EnReparacionType>({
    resolver: zodResolver(enReparacionSchema) as any,
    defaultValues: EnReparacionInitialState as any,
  });

  const { isSubmitting } = formState;
  
  // Log RHF errors whenever they change to help debugging
  useEffect(() => {
    console.log('RHF formState.errors:', formState.errors);
  }, [formState.errors]);
  
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getEnReparacionService(Number(id));
          setData(data);
          reset(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const onSubmit = async (data: EnReparacionType) => {
    try {
      const dataClean  = mergeEnReparacionDataForSubmissionEdit(data);
      const response = await putEnReparacion(Number(id), dataClean);
      console.log("Response from update:", response.descripcion);
      
      successToast('Reparación actualizada');
    } catch (err: any) {
      errorToast(err?.message ?? 'Error al actualizar');
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={() => window.location.reload()} />;

  return (
    <>
      <BreadcrumbsRoutes items={[{ label: "En Reparación", icon: <RiBikeFill fontSize="inherit" />, href: "/admin/enreparacion" }, { label: "Editar", icon: <RiBikeFill fontSize="inherit" /> }]} />
        <FormEstructure handleSubmit={handleSubmit(onSubmit)} sx={{ padding: "10px" }}>
            <Grid container spacing={2} size={12} sx={{ padding: "10px" }}>
                <InputsForm register={register} errors={formState.errors} control={control} />
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid size={12} sx={{ mt: 2 }}>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    fullWidth
                    onClick={() => handleSubmit(onSubmit, (errs) => {
                      console.log('RHF validation errors callback:', errs);
                      try {
                        const vals = getValues();
                        const parsed = enReparacionSchema.safeParse(vals);
                        console.log('Zod safeParse result:', parsed);
                      } catch (e) {
                        console.error('Error parsing with zod:', e);
                      }
                    })()}
                >
                    {isSubmitting ? "Guardando..." : "Actualizar Reparación"}
                </Button>
            </Grid>
        </FormEstructure>
        <Divider sx={{ my: 4 }} />
        <Grid width={'100%'}>
          <RepuestosReparacionForm initial={{ enReparaciones: [{id: Number(data?.id), repuestos: data?.repuestos || []} ]}} />
        </Grid>
    </>
  );
};

export default EnReparacionEdit;
