import { useEffect, useState } from "react";
import { Button, Divider, Grid } from "@mui/material";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import FormEstructure from "../../../components/utils/FormEstructure";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { InputsForm } from "../components";
import { CilindradaInitialState, mergeCilindradaDataWithDefaults, type CilindradaType } from "../../../types/cilindradaType";
import { cilindradaSchema } from "../../../zod/cilindrada.schema";
import { errorToast, successToast } from "../../../utils/toast";
import { getCilindrada, putCilindrada } from "../../../services/cilindrada.services";
import { useGoTo } from "../../../hooks/useGoTo";

const CilindradaEdit = () => {
    const { id } = useParams();
    const goTo = useGoTo();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CilindradaType>({
        resolver: zodResolver(cilindradaSchema) as unknown as Resolver<CilindradaType>,
        mode: "onSubmit",
        defaultValues: CilindradaInitialState,
    });
    const [cilindrada, setCilindrada] = useState<CilindradaType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCilindrada = async () => {
        setLoading(true);
        try {
            const response = await getCilindrada(String(id));
            setCilindrada(response);

            const mergedData = mergeCilindradaDataWithDefaults(response);

            console.log("Fetched cilindrada for edit:", response);
            reset(mergedData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCilindrada();
    }, []);


    const breadcrumbsData = [
        { label: "Cilindradas", href: "/admin/cilindrada" },
        { label: `${cilindrada?.cilindrada ?? ""}`, href: `/admin/cilindrada/${id}` },
        { label: "Editar", href: `/admin/cilindrada/${id}/edit` },
    ];

    const handlerSubmitCilindrada: SubmitHandler<CilindradaType> = async (data) => {
        try {
            const payload = { cilindrada: data.cilindrada, estadoId: 1 } as unknown as CilindradaType;
            const response = await putCilindrada(String(id), payload);
            successToast(`Cilindrada actualizada: ${response}`);
            goTo("/admin/cilindrada");
        } catch (err: any) {
            errorToast(err.message);
        }
    };

    if (loading) return <Loading />;
    if (error) return <ErrorCard errorText={error} restart={() => window.location.reload()} />;

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />

            <FormEstructure handleSubmit={handleSubmit(handlerSubmitCilindrada)}>
                <InputsForm register={register} errors={errors} />
                <Grid size={12}>
                    <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid size={12}>
                    <Button type="submit" variant="contained" disabled={isSubmitting} fullWidth>
                        {isSubmitting ? "Guardando..." : "Actualizar Cilindrada"}
                    </Button>
                </Grid>
            </FormEstructure>
        </>
    );
};
export default CilindradaEdit;
