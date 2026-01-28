import { Button, Divider, Grid } from "@mui/material";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import FormEstructure from "../../../components/utils/FormEstructure";
import { InputsForm } from "../components";
import { ProductoInitialState, mergeProductoDataWithDefaults, type ProductoType } from "../../../types/productoType";
import { productoSchema } from "../../../zod/producto.schema";
import { getProducto, putProducto } from "../../../services/producto.services";
import { errorToast, successToast } from "../../../utils/toast";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { IoCubeSharp } from "react-icons/io5";
import { EditNoteOutlined } from "@mui/icons-material";

const ProductoEdit = () => {
    const { id } = useParams();
    const [item, setItem] = useState<ProductoType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { register, control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProductoType>({
        resolver: zodResolver(productoSchema) as unknown as Resolver<ProductoType>,
        mode: "onSubmit",
        defaultValues: ProductoInitialState,
    });

    const getOne = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getProducto(id as any);
            const merged = mergeProductoDataWithDefaults(res as any) as any;
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

    const onSubmit = async (data: ProductoType) => {
        try {
            const response = await putProducto(id as any, data);
            successToast(`Producto actualizado: ${response || data.nombre}`);
        } catch (err: any) {
            errorToast(err.message);
        }
    };

    const breadcrumbsData = [
        { label: "Productos", icon: <IoCubeSharp fontSize="inherit" />, href: "/admin/productos" },
        { label: item?.nombre ?? "Detalle", icon: <IoCubeSharp fontSize="inherit" />, href: `/admin/productos/${id}` },
        { label: "Editar", icon: <EditNoteOutlined fontSize="inherit" />, href: `/admin/productos/${id}/edit` },
    ];

    if (loading) return <Loading />;
    if (error) return <ErrorCard errorText={error} restart={getOne} />;

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />
            <FormEstructure handleSubmit={handleSubmit(onSubmit)}>
                <InputsForm register={register} control={control} errors={errors} />
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

export default ProductoEdit;
