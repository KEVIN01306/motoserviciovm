import { PiUserCheck, PiUsersFill } from "react-icons/pi";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import {  UserInitialState, type UserGetType, type UserType, mergeUserDataWithDefaults } from "../../../types/userType";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../../../zod/user.schema";
import { errorToast, successToast } from "../../../utils/toast";
import { getUser, putUser } from "../../../services/users.services";
import FormEstructure from "../../../components/utils/FormEstructure";
import { Button, Divider, Grid } from "@mui/material";
import { InputsForm } from "../components/index";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { useGoTo } from "../../../hooks/useGoTo";
import { getRoles } from "../../../services/rol.services";
import type { RolGetType } from "../../../types/rolType";
import type { SucursalType } from "../../../types/sucursalType";
import { getSucursales } from "../../../services/sucursal.services";
import { getMotos } from "../../../services/moto.services";
import type { motoGetType } from "../../../types/motoType";



const UserEdit = () => {

    const [roles, setRoles] = useState<RolGetType[]>([])
    const [sucursales, setSucursales] = useState<SucursalType[]>([])
    const [motos, setMotos] = useState<motoGetType[]>([])
    const [tipoUser, setTipoUser] = useState<boolean>(true);

    const getMotosList = async () => {
        try {
            const response = await getMotos()
            setMotos(response)
            console.log(response)
        } catch (err: any) {
            console.log(err)
        }
    }
    const getRolesList = async () => {
        try {
            const response = await getRoles()
            setRoles(response)
            console.log(response)

        } catch (err: any) {
            console.log(err)
        }
    }
    

    const getSucursalesList = async () => {
        try {
            const response = await getSucursales()
            setSucursales(response)
            console.log(response)

        } catch (err: any) {
            console.log(err)
        }
    }

    useEffect(() => {
        getRolesList()
        getSucursalesList()
        getMotosList()
    }, [])

    const { id } = useParams()

    const goTo = useGoTo()

    const [user,setUser] = useState<UserGetType>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
     const {
            register,
            handleSubmit,
            formState: { errors, isSubmitting },
            reset,
            watch,
            control,
            setValue,
        } =
            useForm<UserType>({
                resolver: zodResolver(userSchema) as unknown as Resolver<UserType>,
                mode: "onSubmit",
                defaultValues: UserInitialState
            })


    const handlerSubmitUser: SubmitHandler<UserType> = async (data) => {
        console.log("users: data: ", data)
        try {
            const response = await putUser(id,data)
            successToast("User Update: " + response)
            console.log(data)
            goTo("/admin/users/"+id)
        }
        catch (err: any) {
            console.log(err)
            errorToast(err.message)
        }

    }

    const breadcrumbsData = [
        { label: "Users", icon: <PiUsersFill fontSize="inherit" />, href: "/admin/users" },
        { label: user?.primerNombre ? user?.primerNombre : "", icon: <PiUserCheck fontSize="inherit" />, href: `/admin/users/${id}` },
        { label: "Edit User", icon: <PiUserCheck fontSize="inherit" />, href: "/admin/users/"+id },
    ];

        const getUserOne = async () => {
        try {
            setLoading(true)
            const response = await getUser(id);
            setUser(response);
            setTipoUser(response.tipo == "" || response.tipo == undefined);
            console.log(response)

            const dataFormat = mergeUserDataWithDefaults(response);

            reset(dataFormat);
            
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUserOne()
    }, [])


    if (loading) return <Loading />

    if (error) return <ErrorCard errorText={error} restart={getUserOne} />;

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />
            <FormEstructure handleSubmit={handleSubmit(handlerSubmitUser)}>
                <InputsForm register={register} errors={errors} control={control} watch={watch} setValue={setValue} roles={roles} tipoUser={tipoUser} sucursales={sucursales} motos={motos} />
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

                        {isSubmitting ? "Cargando..." : "Guardar Usuario"}
                    </Button>
                </Grid>
            </FormEstructure>

        </>
    )
}

export default UserEdit;