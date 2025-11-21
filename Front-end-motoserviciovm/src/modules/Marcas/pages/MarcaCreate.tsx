import { PiPlus, PiTrademarkRegisteredBold } from "react-icons/pi";
import { Button, Divider, Grid } from "@mui/material";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import FormEstructure from "../../../components/utils/FormEstructure";
import { InputsForm } from "../components";
import { MarcaInitialState, type MarcaType } from "../../../types/marcaType";
import { marcaSchema } from "../../../zod/marca.schema";
import { postMarca } from "../../../services/marca.services";
import { errorToast, successToast } from "../../../utils/toast";

const MarcaCreate = () => {
    const breadcrumbsData = [
        { label: "Marcas", icon: <PiTrademarkRegisteredBold fontSize="inherit" />, href: "/admin/marcas" },
        { label: "Crear Marca", icon: <PiPlus fontSize="inherit" />, href: "/admin/marcas/create" },
    ];

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

    const handlerSubmitMarca = async (data: MarcaType) => {
        try {
            const response = await postMarca(data);
            successToast(`Marca creada: ${response || data.marca}`);
            reset(MarcaInitialState);
        } catch (err: any) {
            errorToast(err.message);
        }
    };

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
                        {isSubmitting ? "Guardando..." : "Crear Marca"}
                    </Button>
                </Grid>
            </FormEstructure>
        </>
    );
};

export default MarcaCreate;

