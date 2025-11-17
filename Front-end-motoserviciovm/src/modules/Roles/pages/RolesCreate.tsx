import { PiUsersDuotone } from "react-icons/pi";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { RolInitialState, type RolType } from "../../../types/rolType";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rolSchema } from "../../../zod/rol.schema";
import { errorToast, successToast } from "../../../utils/toast";
import { postRol } from "../../../services/rol.services";
import FormEstructure from "../../../components/utils/FormEstructure";
import { Button, Divider, Grid } from "@mui/material";
import { InputsForm } from "../components/index";
import { useGoTo } from "../../../hooks/useGoTo";

const RolesCreate = () => {
    const goTo = useGoTo()

    const breadcrumbsData = [
        { label: "Roles", icon: <PiUsersDuotone fontSize="inherit" />, href: "/admin/roles" },
        { label: "Crear Rol", icon: <PiUsersDuotone fontSize="inherit" />, href: "/admin/roles/create" },
    ];

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        control,
    } = useForm<RolType>({
        resolver: zodResolver(rolSchema) as unknown as Resolver<RolType>,
        mode: "onSubmit",
        defaultValues: RolInitialState
    })

    const handlerSubmitRol: SubmitHandler<RolType> = async (data) => {
        try {
            const response = await postRol(data)
            successToast("Rol creado: " + response)
            reset()
            goTo("/admin/roles")
        }
        catch (err: any) {
            console.log(err)
            errorToast(err.message)
        }
    }

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />
            <FormEstructure handleSubmit={handleSubmit(handlerSubmitRol)}>
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
                        {isSubmitting ? "Cargando..." : "Crear Rol"}
                    </Button>
                </Grid>
            </FormEstructure>
        </>
    )
}

export default RolesCreate;