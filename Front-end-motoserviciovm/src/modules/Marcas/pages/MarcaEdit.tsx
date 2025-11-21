import { useEffect, useState } from "react";
import { Button, Divider, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PiTrademarkRegisteredBold } from "react-icons/pi";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import FormEstructure from "../../../components/utils/FormEstructure";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { InputsForm } from "../components";
import { MarcaInitialState, type MarcaType } from "../../../types/marcaType";
import { marcaSchema } from "../../../zod/marca.schema";
import { errorToast, successToast } from "../../../utils/toast";
import { getMarca, putMarca } from "../../../services/marca.services";
import { useGoTo } from "../../../hooks/useGoTo";

const MarcaEdit = () => {
    const { id } = useParams();
    const goTo = useGoTo();
    const [marca, setMarca] = useState<MarcaType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<MarcaType>({
        resolver: zodResolver(marcaSchema) as unknown as Resolver<MarcaType>,
        mode: "onSubmit",
        defaultValues: MarcaInitialState,
    });

    const breadcrumbsData = [
        { label: "Marcas", icon: <PiTrademarkRegisteredBold fontSize="inherit" />, href: "/admin/marcas" },
        { label: marca?.marca ?? "", icon: <PiTrademarkRegisteredBold fontSize="inherit" />, href: `/admin/marcas/${id}` },
        { label: "Editar", icon: <PiTrademarkRegisteredBold fontSize="inherit" />, href: `/admin/marcas/${id}/edit` },
    ];

    const getMarcaOne = async () => {
        try {
            setLoading(true);
            const response = await getMarca(id);
            setMarca(response);
            reset(response);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlerSubmitMarca = async (data: MarcaType) => {
        try {
            const response = await putMarca(id, data);
            successToast(`Marca actualizada: ${response || data.marca}`);
            goTo("/admin/marcas");
        } catch (err: any) {
            errorToast(err.message);
        }
    };

    useEffect(() => {
        getMarcaOne();
    }, []);

    if (loading) return <Loading />;
    if (error) return <ErrorCard errorText={error} restart={getMarcaOne} />;

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />
            <FormEstructure handleSubmit={handleSubmit(handlerSubmitMarca)}>
                <InputsForm register={register} errors={errors} />
                <Grid size={12}>
                    <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid size={12}>
                    <Button type="submit" variant="contained" disabled={isSubmitting} fullWidth>
                        {isSubmitting ? "Guardando..." : "Actualizar Marca"}
                    </Button>
                </Grid>
            </FormEstructure>
        </>
    );
};

export default MarcaEdit;

