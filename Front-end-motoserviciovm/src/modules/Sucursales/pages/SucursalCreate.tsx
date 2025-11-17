import { PiStorefrontBold, PiPlus } from "react-icons/pi";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { SucursalInitialState, type SucursalType } from "../../../types/sucursalType";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sucursalSchema } from "../../../zod/sucursal.schema";
import { errorToast, successToast } from "../../../utils/toast";
import { postSucursal } from "../../../services/sucursal.services";
import FormEstructure from "../../../components/utils/FormEstructure";
import { Button, Divider, Grid } from "@mui/material";
import { InputsForm } from "../components/index";

const SucursalCreate = () => {
    const breadcrumbsData = [
        { label: "Sucursales", icon: <PiStorefrontBold fontSize="inherit" />, href: "/admin/sucursales" },
        { label: "Crear Sucursal", icon: <PiPlus fontSize="inherit" />, href: "/admin/sucursales/create" },
    ];

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        control,
    } = useForm<SucursalType>({
        resolver: zodResolver(sucursalSchema) as unknown as Resolver<SucursalType>,
        mode: "onSubmit",
        defaultValues: SucursalInitialState
    })

    const handlerSubmitSucursal = async (data: SucursalType) => {
        try {
            const response = await postSucursal(data)
            successToast("Sucursal creada: " + response)
            reset()
        }
        catch (err: any) {
            console.log(err)
            errorToast(err.message)
        }
    }

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />
            <FormEstructure handleSubmit={handleSubmit(handlerSubmitSucursal)}>
                <InputsForm register={register} errors={errors} control={control} />
                <Grid size={12}>
                    <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid size={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        fullWidth
                    >
                        {isSubmitting ? "Cargando..." : "Crear Sucursal"}
                    </Button>
                </Grid>
            </FormEstructure>
        </>
    )
}

export default SucursalCreate
