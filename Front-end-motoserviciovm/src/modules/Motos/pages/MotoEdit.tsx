import { Button, Divider, Grid } from "@mui/material";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { MotoInitialState, type motoGetType, type motoType, mergeMotoDataWithDefaults } from "../../../types/motoType";
import { motoSchema } from "../../../zod/moto.schema";
import { errorToast, successToast } from "../../../utils/toast";
import { getMoto, putMoto } from "../../../services/moto.services";
import FormEstructure from "../../../components/utils/FormEstructure";
import { InputsForm } from "../components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { useGoTo } from "../../../hooks/useGoTo";
import { RiBikeFill } from "react-icons/ri";
import { EditNoteOutlined } from "@mui/icons-material";

const MotoEdit = () => {
    const { id } = useParams();
    const goTo = useGoTo();

    const [moto, setMoto] = useState<motoGetType | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<motoType>({
        resolver: zodResolver(motoSchema) as unknown as Resolver<motoType>,
        mode: "onSubmit",
        defaultValues: MotoInitialState,
    });

    const handlerSubmit: SubmitHandler<motoType> = async (data) => {
        try {
            const payload = { ...data, estadoId: 1 } as motoType;
            const response = await putMoto(id as any, payload);
            successToast("Moto actualizada: " + String(response));
            goTo("/admin/motos");
        } catch (err: any) {
            errorToast(err.message);
        }
    };

    const breadcrumbsData = [
        { label: "Motos", icon: <RiBikeFill fontSize="inherit" />, href: "/admin/motos" },
        { label: moto?.placa ?? "Moto", icon: <RiBikeFill fontSize="inherit" />, href: "/admin/motos/" + id },
        { label: "Editar Moto", icon: <EditNoteOutlined fontSize="inherit" />, href: "/admin/motos/" + id },
    ];

    const getMotoOne = async () => {
        try {
            setLoading(true);
            const response = await getMoto(id as any);
            setMoto(response);

            const dataFormat = mergeMotoDataWithDefaults(response as any);
            reset(dataFormat as any);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMotoOne();
    }, []);

    if (loading) return <Loading />;
    if (error) return <ErrorCard errorText={error} restart={getMotoOne} />;

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
                        {isSubmitting ? "Cargando..." : "Actualizar Moto"}
                    </Button>
                </Grid>
            </FormEstructure>
        </>
    );
};

export default MotoEdit;
