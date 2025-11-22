import { PiUsersDuotone } from "react-icons/pi";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { RolInitialState, type RolGetType, type RolType, mergeRolDataWithDefaults } from "../../../types/rolType";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rolSchema } from "../../../zod/rol.schema";
import { errorToast, successToast } from "../../../utils/toast";
import { getRol, putRol } from "../../../services/rol.services";
import FormEstructure from "../../../components/utils/FormEstructure";
import { Button, Divider, Grid } from "@mui/material";
import { InputsForm } from "../components/index";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { useGoTo } from "../../../hooks/useGoTo";

const RolesEdit = () => {
    const { id } = useParams()
    const goTo = useGoTo()

    const [, setRol] = useState<RolGetType | undefined>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

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
        console.log(data)
        try {
            const response = await putRol(id, data)
            successToast("Rol actualizado: " + response)
            goTo("/admin/roles")
        }
        catch (err: any) {
            console.log(err)
            errorToast(err.message)
        }
    }

    const breadcrumbsData = [
        { label: "Roles", icon: <PiUsersDuotone fontSize="inherit" />, href: "/admin/roles" },
        //{ label: rol?.rol ? rol?.rol : "", icon: <PiUsersDuotone fontSize="inherit" />, href: `/admin/roles/${id}` },
        { label: "Editar Rol", icon: <PiUsersDuotone fontSize="inherit" />, href: "/admin/roles/"+id },
    ];

    const getRolOne = async () => {
        try {
            setLoading(true)
            const response = await getRol(id);
            setRol(response);
            console.log(response)

            const dataFormat = mergeRolDataWithDefaults(response);
            console.log(dataFormat)

            reset(dataFormat);

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getRolOne()
    }, [])

    if (loading) return <Loading />

    if (error) return <ErrorCard errorText={error} restart={getRolOne} />;

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
                        {isSubmitting ? "Cargando..." : "Actualizar Rol"}
                    </Button>
                </Grid>
            </FormEstructure>
        </>
    )
}

export default RolesEdit;
