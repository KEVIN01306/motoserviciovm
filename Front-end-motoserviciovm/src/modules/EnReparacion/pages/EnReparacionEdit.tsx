import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, TextField, Button, Divider } from "@mui/material";

import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { RiBikeFill } from "react-icons/ri";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";

import type { EnReparacionGetType } from "../../../types/enReparacionType";
import RepuestosTable from "../components/RepuestosTable";
import { getEnReparacion as getEnReparacionService } from "../../../services/enReparacion.services";
import CardForm from "../../../components/utils/cards/CardForm";
import { Padding } from "@mui/icons-material";
import FormEstructure from "../../../components/utils/FormEstructure";

const EnReparacionEdit = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<EnReparacionGetType | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getEnReparacionService(Number(id));
          setItem(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={() => window.location.reload()} />;

  return (
    <>
      <BreadcrumbsRoutes items={[{ label: "En Reparación", icon: <RiBikeFill fontSize="inherit" />, href: "/admin/enreparacion" }, { label: "Editar", icon: <RiBikeFill fontSize="inherit" /> }]} />
        <FormEstructure handleSubmit={() => {}} sx={{ padding: "10px" }}>
            <Grid container spacing={2} size={12} sx={{ padding: "10px" }}>
                <Grid size={12}>
                    <TextField variant="standard" label="Descripción" fullWidth value={item?.descripcion ?? ""} disabled />
                </Grid>

                <Grid size={12}>
                    <TextField variant="standard" fullWidth label="Fecha Entrada" type="date" InputLabelProps={{ shrink: true }} value={item?.fechaEntrada ? new Date(item.fechaEntrada).toISOString().slice(0, 10) : ""} disabled />
                </Grid>
            </Grid>
        </FormEstructure>

      <Grid size={12}>
        <Divider sx={{ my: 2 }} />
      </Grid>
      {item && (
          <RepuestosTable reparacionId={item.id as number} initial={item.repuestos ?? []} />
      )}
    </>
  );
};

export default EnReparacionEdit;
