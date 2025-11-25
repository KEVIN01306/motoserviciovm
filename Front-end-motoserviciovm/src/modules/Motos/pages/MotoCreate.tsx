import { Button, Divider, Grid } from "@mui/material";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import FormEstructure from "../../../components/utils/FormEstructure";
import { InputsForm } from "../components";
import { MotoInitialState, type motoType } from "../../../types/motoType";
import { motoSchema } from "../../../zod/moto.schema";
import { postMoto } from "../../../services/moto.services";
import { errorToast, successToast } from "../../../utils/toast";
import { RiBikeFill } from "react-icons/ri";
import { PiPlus } from "react-icons/pi";

const MotoCreate = () => {
    const breadcrumbsData = [
        { label: "Motos", icon: <RiBikeFill fontSize="inherit" />, href: "/admin/motos" },
        { label: "Crear Moto", icon: <PiPlus fontSize="inherit" />, href: "/admin/motos/create" },
    ];

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

    const handlerSubmit = async (data: motoType) => {
        try {
            const payload = { ...data, estadoId: 1 } as motoType;
            const response = await postMoto(payload);
            successToast(`Moto creada: ${response || payload.placa}`);
            reset(MotoInitialState);
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
                        {isSubmitting ? "Guardando..." : "Crear Moto"}
                    </Button>
                </Grid>
            </FormEstructure>
        </>
    );
};

export default MotoCreate;
