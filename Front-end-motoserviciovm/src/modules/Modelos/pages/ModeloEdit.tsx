import { Button, Divider, Grid } from "@mui/material";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { modeloInitialState, type modeloGetType, type modeloType, mergeModeloDataWithDefaults } from "../../../types/modeloType";
import { modeloSchema } from "../../../zod/modelo.schema";
import { errorToast, successToast } from "../../../utils/toast";
import { getModelo, putModelo } from "../../../services/modelo.services";
import FormEstructure from "../../../components/utils/FormEstructure";
import { InputsForm } from "../components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { useGoTo } from "../../../hooks/useGoTo";
import { RiEBikeLine } from "react-icons/ri";
import { EditNoteOutlined } from "@mui/icons-material";

const ModeloEdit = () => {
    const { id } = useParams();
    const goTo = useGoTo();

    const [modelo, setModelo] = useState<modeloGetType | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<modeloType>({
        resolver: zodResolver(modeloSchema) as unknown as Resolver<modeloType>,
        mode: "onSubmit",
        defaultValues: modeloInitialState,
    });

    const handlerSubmit: SubmitHandler<modeloType> = async (data) => {
        try {
            const payload = { ...data, estadoId: 1 } as modeloType;
            const response = await putModelo(id as any, payload);
            successToast("Modelo actualizado: " + response);
            goTo("/admin/modelos");
        } catch (err: any) {
            errorToast(err.message);
        }
    };

    const breadcrumbsData = [
        { label: "Modelos", icon: <RiEBikeLine fontSize="inherit" />, href: "/admin/modelos" },
        { label: modelo?.modelo ?? "Modelo", icon: <RiEBikeLine fontSize="inherit" />, href: "/admin/modelos/" + id },
        { label: "Editar Modelo", icon: <EditNoteOutlined fontSize="inherit" />, href: "/admin/modelos/" + id },
    ];

    const getModeloOne = async () => {
        try {
            setLoading(true);
            const response = await getModelo(id as any);
            setModelo(response);

            const dataFormat = mergeModeloDataWithDefaults(response as any);
            reset(dataFormat as any);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getModeloOne();
    }, []);

    if (loading) return <Loading />;
    if (error) return <ErrorCard errorText={error} restart={getModeloOne} />;

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />
            <FormEstructure handleSubmit={handleSubmit(handlerSubmit)}>
                <InputsForm register={register} control={control} errors={errors} />
                <Grid size={12}>
                    <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid size={12}>
                    <Button type="submit" variant="contained" disabled={isSubmitting} fullWidth>
                        {isSubmitting ? "Cargando..." : "Actualizar Modelo"}
                    </Button>
                </Grid>
            </FormEstructure>
        </>
    );
};

export default ModeloEdit;
