import { PiUserCheck, PiUsersFill } from "react-icons/pi";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import {  UserInitialState, type UserType } from "../../../types/userType";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../../../zod/user.schema";
import { errorToast, successToast } from "../../../utils/toast";
import { postUser } from "../../../services/users.services";
import FormEstructure from "../../../components/utils/FormEstructure";
import { Button, Divider, Grid } from "@mui/material";
import { InputsForm } from "../components/index";
import { useEffect, useState } from "react";
import { getRoles } from "../../../services/rol.services";
import type { RolType } from "../../../types/rolType";



const UserCreate = () => {
    const [roles, setRoles] = useState<RolType[]>([])


    const getRolesList = async () => {
        try {
            const response = await getRoles()
            setRoles(response)
            console.log(response)

        } catch (err: any) {
            console.log(err)
        }
    }

    useEffect(() => {
        getRolesList()
    }, [])

    const breadcrumbsData = [
        { label: "Users", icon: <PiUsersFill fontSize="inherit" />, href: "/admin/users" },
        { label: "Create User", icon: <PiUserCheck fontSize="inherit" />, href: "/admin/users/create" },
    ];
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


    const handlerSubmitUser = async (data: UserType) => {
        try {
            const response = await postUser(data)
            successToast("User create: " + response)
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
            <FormEstructure handleSubmit={handleSubmit(handlerSubmitUser)}>
                <InputsForm register={register} errors={errors} control={control} watch={watch} setValue={setValue} roles={roles} />
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

                        {isSubmitting ? "Cargando..." : "Crear Usuario"}
                    </Button>
                </Grid>
            </FormEstructure>

        </>
    )
}

export default UserCreate;