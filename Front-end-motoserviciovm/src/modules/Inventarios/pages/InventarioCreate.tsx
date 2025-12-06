import { Button, Divider, Grid } from "@mui/material";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import FormEstructure from "../../../components/utils/FormEstructure";
import { InputsForm } from "../components";
import { InventarioInitialState, type InventarioType } from "../../../types/inventarioType";
import { inventarioSchema } from "../../../zod/inventario.schema";
import { postInventario } from "../../../services/inventario.services";
import { errorToast, successToast } from "../../../utils/toast";
import { RiBox1Fill } from "react-icons/ri";
import { PiPlus } from "react-icons/pi";

const InventarioCreate = () => {
    const breadcrumbsData = [
        { label: "Inventarios", icon: <RiBox1Fill fontSize="inherit" />, href: "/admin/inventarios" },
        { label: "Crear Inventario", icon: <PiPlus fontSize="inherit" />, href: "/admin/inventarios/create" },
    ];

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<InventarioType>({
        resolver: zodResolver(inventarioSchema) as unknown as Resolver<InventarioType>,
        mode: "onSubmit",
        defaultValues: InventarioInitialState,
    });

    const handlerSubmit = async (data: InventarioType) => {
        try {
            const payload = { ...data } as InventarioType;
            const response = await postInventario(payload);
            successToast(`Inventario creado: ${response || payload.item}`);
            reset(InventarioInitialState);
        } catch (err: any) {
            errorToast(err.message);
        }
    };

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />
            <FormEstructure handleSubmit={handleSubmit(handlerSubmit)}>
                <InputsForm register={register} errors={errors} />
                <Grid size={12}>
                    <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid size={12}>
                    <Button type="submit" variant="contained" disabled={isSubmitting} fullWidth>
                        {isSubmitting ? "Guardando..." : "Crear Inventario"}
                    </Button>
                </Grid>
            </FormEstructure>
        </>
    );
};

export default InventarioCreate;
