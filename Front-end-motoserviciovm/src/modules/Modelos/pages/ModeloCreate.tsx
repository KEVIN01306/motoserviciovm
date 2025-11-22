import { PiPlus } from "react-icons/pi";
import { Button, Divider, Grid } from "@mui/material";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import FormEstructure from "../../../components/utils/FormEstructure";
import { InputsForm } from "../components";
import { modeloInitialState, type modeloType } from "../../../types/modeloType";
import { modeloSchema } from "../../../zod/modelo.schema";
import { postModelo } from "../../../services/modelo.services";
import { errorToast, successToast } from "../../../utils/toast";
import { RiEBikeLine } from "react-icons/ri";

const ModeloCreate = () => {
    const breadcrumbsData = [
        { label: "Modelos", icon: <RiEBikeLine fontSize="inherit" />, href: "/admin/modelos" },
        { label: "Crear Modelo", icon: <PiPlus fontSize="inherit" />, href: "/admin/modelos/create" },
    ];

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

    const handlerSubmit = async (data: modeloType) => {
        try {
            // Ensure estadoId is set to 1 as requested
            const payload = { ...data, estadoId: 1 } as modeloType;
            const response = await postModelo(payload);
            successToast(`Modelo creado: ${response || `${payload.año}`}`);
            reset(modeloInitialState);
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
                        {isSubmitting ? "Guardando..." : "Crear Modelo"}
                    </Button>
                </Grid>
            </FormEstructure>
        </>
    );
};

export default ModeloCreate;
