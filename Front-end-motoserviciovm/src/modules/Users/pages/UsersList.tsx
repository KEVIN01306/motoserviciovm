import { useEffect, useState } from "react";
import { getUsers, patchUserActive } from "../../../services/users.services";
import type { UserGetType, UserType } from "../../../types/userType";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import TableCustom from "../../../components/Table/Table";
import { Chip, Fab, Grid, type ChipProps } from "@mui/material";
import type { Column } from "../../../components/Table/Table";
import { useGoTo } from "../../../hooks/useGoTo";
import AddIcon from '@mui/icons-material/Add';
import { RiEdit2Line } from "react-icons/ri";
import { PiUserCheckBold } from "react-icons/pi";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { successToast } from "../../../utils/toast";
import Search from "../../../components/utils/Search";


type ChipColor = ChipProps['color'];

const UsersList = () => {
    const [users, setUsers] = useState<UserGetType[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const goTo = useGoTo()

    const getUsersList = async () => {
        try {
            setLoading(true)
            const response = await getUsers()
            setUsers(response)

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUsersList()
    }, [])

    const changeChip = (value: UserType['activo']) => {
        let color: ChipColor
        let label: string

        if (value) {
            color = 'success';
            label = 'Activo';
        } else {
            color = 'error';
            label = 'Inactivo';
        }

        return <Chip label={label} color={color} variant="outlined" />

    }

    const changeActive = async (id: UserType['id']) => {
        try {
            const response = await patchUserActive(id)
            successToast(`change Status: ${response?.activo ? "Activo" : "Inactivo"} - User: ${response?.email}`)
            getUsersList()
        } catch (err: any) {

        }
    }

    const columns: Column<UserGetType>[] = [
        { id: "primerNombre", label: "First Name", minWidth: 150 },
        { id: "segundoNombre", label: "second Name", minWidth: 100 },
        { id: "email", label: "Email", minWidth: 100 },
        { id: "activo", label: "Estado", minWidth: 100, format: (value: any) => changeChip(value) },
        {
            id: "actions",
            label: "Acciones",
            actions: [
                { label: (<><RiEdit2Line /> <span className="ml-1.5">edit</span> </>), onClick: (row: UserGetType) => goTo(String(row.id + '/edit')) },
                { label: (<><PiUserCheckBold /> <span className="ml-1.5">Profile</span> </>), onClick: (row: UserGetType) => goTo(String(row.id)) },
                { label: (<><HiOutlineLockClosed /> <span className="ml-1.5">Disable / Enable</span></>), onClick: (row: UserGetType) => changeActive(row.id) },
            ],
        },
    ];




    if (loading) return <Loading />

    if (error) return <ErrorCard errorText={error} restart={getUsersList} />;


    return (
        <>
            <Grid container spacing={2} flexGrow={1} size={12} width={"100%"}>
                <Grid flexGrow={1} container p={1} gap={2} justifyContent={{ sm: "center", md: "flex-end" }}>
                    <Grid size={{ xs: 8, md: 8 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"} >
                        <Search />
                    </Grid>
                    <Grid size={{ xs: 1, md: 1 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"} >
                        <Fab size="small" color="primary" aria-label="add" onClick={() => goTo('create')} >
                            <AddIcon />
                        </Fab>
                    </Grid>
                </Grid>
                <Grid size={12}>
                    <TableCustom<UserGetType> columns={columns} rows={users} />
                </Grid>
            </Grid>

        </>
    )
}

export default UsersList;