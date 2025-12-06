import { Button, Divider, Grid } from "@mui/material";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import FormEstructure from "../../../components/utils/FormEstructure";
import { InputsForm } from "../components";
import { ProductoInitialState, type ProductoType } from "../../../types/productoType";
import { productoSchema } from "../../../zod/producto.schema";
import { postProducto } from "../../../services/producto.services";
import { errorToast, successToast } from "../../../utils/toast";
import { PiPlus } from "react-icons/pi";
import { IoCubeSharp } from "react-icons/io5";

const ProductoCreate = () => {
    const breadcrumbsData = [
        { label: "Productos", icon: <IoCubeSharp fontSize="inherit" />, href: "/admin/productos" },
        { label: "Crear Producto", icon: <PiPlus fontSize="inherit" />, href: "/admin/productos/create" },
    ];

    const { register, control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProductoType>({
        resolver: zodResolver(productoSchema) as unknown as Resolver<ProductoType>,
        mode: "onSubmit",
        defaultValues: ProductoInitialState,
    });

    const handlerSubmit = async (data: ProductoType) => {
        try {
            const payload = { ...data } as ProductoType;
            const response = await postProducto(payload);
            successToast(`Producto creado: ${response || payload.nombre}`);
            reset(ProductoInitialState);
        } catch (err: any) {
            errorToast(err.message);
        }
    };

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
                        {isSubmitting ? "Guardando..." : "Crear Producto"}
                    </Button>
                </Grid>
            </FormEstructure>
        </>
    );
};

export default ProductoCreate;
