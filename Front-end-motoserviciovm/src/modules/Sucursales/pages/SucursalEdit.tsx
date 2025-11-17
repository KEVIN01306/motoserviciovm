import { PiStorefrontBold } from "react-icons/pi";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { SucursalInitialState, type SucursalType } from "../../../types/sucursalType";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sucursalSchema } from "../../../zod/sucursal.schema";
import { errorToast, successToast } from "../../../utils/toast";
import { getSucursal, putSucursal } from "../../../services/sucursal.services";
import FormEstructure from "../../../components/utils/FormEstructure";
import { Button, Divider, Grid } from "@mui/material";
import { InputsForm } from "../components/index";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { useGoTo } from "../../../hooks/useGoTo";

const SucursalEdit = () => {
    const { id } = useParams()
    const goTo = useGoTo()
    const [sucursal, setSucursal] = useState<SucursalType | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

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
            const response = await putSucursal(id, data)
            successToast("Sucursal actualizada: " + response)
            goTo("/admin/sucursales")
        }
        catch (err: any) {
            console.log(err)
            errorToast(err.message)
        }
    }

    const breadcrumbsData = [
        { label: "Sucursales", icon: <PiStorefrontBold fontSize="inherit" />, href: "/admin/sucursales" },
        { label: sucursal?.nombre ? sucursal.nombre : "", icon: <PiStorefrontBold fontSize="inherit" />, href: `/admin/sucursales/${id}` },
        { label: "Editar", icon: <PiStorefrontBold fontSize="inherit" />, href: `/admin/sucursales/${id}/edit` },
    ];

    const getSucursalOne = async () => {
        try {
            setLoading(true)
            const response = await getSucursal(id);
            setSucursal(response);
            reset(response);
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSucursalOne()
    }, [])

    if (loading) return <Loading />

    if (error) return <ErrorCard errorText={error} restart={getSucursalOne} />;

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
                        {isSubmitting ? "Cargando..." : "Actualizar Sucursal"}
                    </Button>
                </Grid>
            </FormEstructure>
        </>
    )
}

export default SucursalEdit
