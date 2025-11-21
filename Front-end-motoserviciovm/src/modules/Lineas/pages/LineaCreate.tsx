import { PiListNumbersBold, PiPlus } from "react-icons/pi";
import { Button, Divider, Grid } from "@mui/material";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import FormEstructure from "../../../components/utils/FormEstructure";
import { InputsForm } from "../components";
import { LineaInitialState, type LineaType } from "../../../types/lineaType";
import { lineaSchema } from "../../../zod/linea.schema";
import { postLinea } from "../../../services/linea.services";
import { errorToast, successToast } from "../../../utils/toast";

const LineaCreate = () => {
    const breadcrumbsData = [
        { label: "Líneas", icon: <PiListNumbersBold fontSize="inherit" />, href: "/admin/lineas" },
        { label: "Crear Línea", icon: <PiPlus fontSize="inherit" />, href: "/admin/lineas/create" },
    ];

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

    const handlerSubmitLinea = async (data: LineaType) => {
        try {
            const response = await postLinea(data);
            successToast(`Línea creada: ${response || data.linea}`);
            reset(LineaInitialState);
        } catch (err: any) {
            errorToast(err.message);
        }
    };

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
                        {isSubmitting ? "Guardando..." : "Crear Línea"}
                    </Button>
                </Grid>
            </FormEstructure>
        </>
    );
};

export default LineaCreate;

