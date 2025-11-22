
import { PiCylinderBold } from "react-icons/pi";
import { Button, Divider, Grid } from "@mui/material";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import FormEstructure from "../../../components/utils/FormEstructure";
import { InputsForm } from "../components";
import { CilindradaInitialState, type CilindradaType } from "../../../types/cilindradaType";
import { cilindradaSchema } from "../../../zod/cilindrada.schema";
import { postCilindrada } from "../../../services/cilindrada.services";
import { errorToast, successToast } from "../../../utils/toast";
import { useGoTo } from "../../../hooks/useGoTo";
import { TbCylinderPlus } from "react-icons/tb";

const CilindradaCreate = () => {
    const breadcrumbsData = [
        { label: "Cilindradas", icon: <PiCylinderBold fontSize="inherit" />, href: "/admin/cilindrada" },
        { label: "Crear Cilindrada", icon: <TbCylinderPlus fontSize="inherit" />, href: "/admin/cilindrada/create" },
    ];

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CilindradaType>({
        resolver: zodResolver(cilindradaSchema) as unknown as Resolver<CilindradaType>,
        mode: "onSubmit",
        defaultValues: CilindradaInitialState,
    });

    const goTo = useGoTo();

    const handlerSubmitCilindrada = async (data: CilindradaType) => {
        try {
            const payload = { cilindrada: data.cilindrada, estadoId: 1 } as unknown as CilindradaType;
            const response = await postCilindrada(payload);
            successToast(`Cilindrada creada: ${response || data.cilindrada}`);
            reset(CilindradaInitialState);
            goTo("/admin/cilindrada");
        } catch (err: any) {
            errorToast(err.message);
        }
    };

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />
            <FormEstructure handleSubmit={handleSubmit(handlerSubmitCilindrada)}>
                <InputsForm register={register} errors={errors} />
                <Grid size={12}>
                    <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid size={12}>
                    <Button type="submit" variant="contained" disabled={isSubmitting} fullWidth>
                        {isSubmitting ? "Guardando..." : "Crear Cilindrada"}
                    </Button>
                </Grid>
            </FormEstructure>
        </>
    );
};

export default CilindradaCreate;
