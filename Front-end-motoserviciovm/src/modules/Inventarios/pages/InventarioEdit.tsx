import { Button, Divider, Grid } from "@mui/material";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import FormEstructure from "../../../components/utils/FormEstructure";
import { InputsForm } from "../components";
import { InventarioInitialState, mergeInventarioDataWithDefaults, type InventarioType } from "../../../types/inventarioType";
import { inventarioSchema } from "../../../zod/inventario.schema";
import { getInventario, putInventario } from "../../../services/inventario.services";
import { errorToast, successToast } from "../../../utils/toast";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { RiBox1Fill } from "react-icons/ri";
import { EditNoteOutlined } from "@mui/icons-material";

const InventarioEdit = () => {
    const { id } = useParams();
    const [item, setItem] = useState<InventarioType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<InventarioType>({
        resolver: zodResolver(inventarioSchema) as unknown as Resolver<InventarioType>,
        mode: "onSubmit",
        defaultValues: InventarioInitialState,
    });

    const getOne = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getInventario(id as any);
            const merged = mergeInventarioDataWithDefaults(res as any) as any;
            setItem(res as any);
            reset(merged as any);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOne();
    }, [id]);

    const onSubmit = async (data: InventarioType) => {
        try {
            const response = await putInventario(id as any, data);
            successToast(`Inventario actualizado: ${response || data.item}`);
        } catch (err: any) {
            errorToast(err.message);
        }
    };

    const breadcrumbsData = [
        { label: "Inventarios", icon: <RiBox1Fill fontSize="inherit" />, href: "/admin/inventarios" },
        { label: item?.item ?? "Detalle", icon: <RiBox1Fill fontSize="inherit" />, href: `/admin/inventarios/${id}` },
        { label: "Editar", icon: <EditNoteOutlined fontSize="inherit" />, href: `/admin/inventarios/${id}/edit` },
    ];

    if (loading) return <Loading />;
    if (error) return <ErrorCard errorText={error} restart={getOne} />;

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />
            <FormEstructure handleSubmit={handleSubmit(onSubmit)}>
                <InputsForm register={register} errors={errors} />
                <Grid size={12}>
                    <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid size={12}>
                    <Button type="submit" variant="contained" disabled={isSubmitting} fullWidth>
                        {isSubmitting ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </Grid>
            </FormEstructure>
        </>
    );
};

export default InventarioEdit;
