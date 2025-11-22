import { useEffect, useState } from "react";
import { Button, Divider, Grid } from "@mui/material";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { PiListNumbersBold } from "react-icons/pi";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import FormEstructure from "../../../components/utils/FormEstructure";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { InputsForm } from "../components";
import { LineaInitialState, mergeLineaDataWithDefaults, type LineaType } from "../../../types/lineaType";
import { lineaSchema } from "../../../zod/linea.schema";
import { errorToast, successToast } from "../../../utils/toast";
import { getLinea, putLinea } from "../../../services/linea.services";
import { useGoTo } from "../../../hooks/useGoTo";

const LineaEdit = () => {
    const { id } = useParams();
    const goTo = useGoTo();
    const [linea, setLinea] = useState<LineaType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<LineaType>({
        resolver: zodResolver(lineaSchema) as unknown as Resolver<LineaType>,
        mode: "onSubmit",
        defaultValues: LineaInitialState,
    });

    const breadcrumbsData = [
        { label: "Líneas", icon: <PiListNumbersBold fontSize="inherit" />, href: "/admin/lineas" },
        { label: linea?.linea ?? "", icon: <PiListNumbersBold fontSize="inherit" />, href: `/admin/lineas/${id}` },
        { label: "Editar", icon: <PiListNumbersBold fontSize="inherit" />, href: `/admin/lineas/${id}/edit` },
    ];

    const getLineaOne = async () => {
        try {
            setLoading(true);
            const response = await getLinea(id);
            const mergedData = mergeLineaDataWithDefaults(response);
            setLinea(response);
            reset(mergedData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlerSubmitLinea = async (data: LineaType) => {
        try {
            const response = await putLinea(id, data);
            console.log("Linea updated:", data);
            successToast(`Línea actualizada: ${response || data.linea}`);
            goTo("/admin/lineas");
        } catch (err: any) {
            errorToast(err.message);
        }
    };

    useEffect(() => {
        getLineaOne();
    }, []);

    if (loading) return <Loading />;
    if (error) return <ErrorCard errorText={error} restart={getLineaOne} />;

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />
            <FormEstructure handleSubmit={handleSubmit(handlerSubmitLinea)}>
                <InputsForm register={register} errors={errors} />
                <Grid size={12}>
                    <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid size={12}>
                    <Button type="submit" variant="contained" disabled={isSubmitting} fullWidth>
                        {isSubmitting ? "Guardando..." : "Actualizar Línea"}
                    </Button>
                </Grid>
            </FormEstructure>
        </>
    );
};

export default LineaEdit;

