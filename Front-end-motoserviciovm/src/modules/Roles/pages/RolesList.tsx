import { useEffect, useState } from "react";
import { patchUserActive } from "../../../services/users.services";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import TableCustom from "../../../components/Table/Table";
import { Fab, Grid } from "@mui/material";
import type { Column } from "../../../components/Table/Table";
import { useGoTo } from "../../../hooks/useGoTo";
import AddIcon from '@mui/icons-material/Add';
import { RiEdit2Line } from "react-icons/ri";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { successToast } from "../../../utils/toast";
import Search from "../../../components/utils/Search";
import { getRoles } from "../../../services/rol.services";
import type { RolGetType } from "../../../types/rolType";
import { useAuthStore } from "../../../store/useAuthStore";

const UsersList = () => {
    const user = useAuthStore(state => state.user)
    const [roles, setRoles] = useState<RolGetType[]>([])
    const [filteredRoles, setFilteredRoles ] = useState<RolGetType[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>("")
    const goTo = useGoTo()

    const getRolesList = async () => {
        try {
            setLoading(true)
            const response = await getRoles()
            setRoles(response)

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getRolesList()
    }, [])

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredRoles(roles);
            return;
        }

        const lowerSearchTerm = searchTerm.toLowerCase();
        const filtered = roles.filter((role) => {
            return (
                String(role.id).toLowerCase().includes(lowerSearchTerm) ||
                role.rol.toLowerCase().includes(lowerSearchTerm) ||
                (role.descripcion && role.descripcion.toLowerCase().includes(lowerSearchTerm))
            );
        });

        setFilteredRoles(filtered);
    }, [searchTerm, roles]);

    const changeActive = async (id: RolGetType['id']) => {
        try {
            const response = await patchUserActive(id)
            successToast(`change Status: ${response?.activo ? "Activo" : "Inactivo"} - User: ${response?.email}`)
                getRolesList()
        } catch (err: any) {

        }
    }

    const getTableActions = () => {
        const allActions = [
            { 
                label: (<><RiEdit2Line /> <span className="ml-1.5">Editar</span> </>), 
                onClick: (row: RolGetType) => goTo(String(row.id + '/edit')),
                permiso: 'roles:edit'
            },
            { 
                label: (<><HiOutlineLockClosed /> <span className="ml-1.5">Eliminar</span></>), 
                onClick: (row: RolGetType) => changeActive(row.id),
                permiso: 'roles:delete'
            },
        ];
        return allActions.filter(action => user?.permisos.includes(action.permiso));
    };

    const getTableColumns = (): Column<RolGetType>[] => {
        const baseColumns: Column<RolGetType>[] = [
            { id: "rol", label: "Rol", minWidth: 150 },
            { id: "descripcion", label: "Descripcion", minWidth: 100 },
            { id: "createdAt", label: "Creado el", minWidth: 100, format: (value) => new Date(value).toLocaleDateString() },
            { id: "updatedAt", label: "Actualiza el", minWidth: 100, format: (value) => new Date(value).toLocaleDateString() },
        ];

        const actions = getTableActions();

        if (actions.length > 0) {
            baseColumns.push({
                id: "actions",
                label: "Acciones",
                actions: actions,
            });
        }

        return baseColumns;
    };

    const columns = getTableColumns();




    if (loading) return <Loading />

    if (error) return <ErrorCard errorText={error} restart={getRolesList} />;


    return (
        <>
            <Grid container spacing={2} flexGrow={1} size={12} width={"100%"}>
                <Grid flexGrow={1} container p={1} gap={2} justifyContent={{ sm: "center", md: "flex-end" }}>
                    <Grid size={{ xs: 8, md: 8 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"} >
                        <Search onSearch={setSearchTerm} placeholder="Buscar roles..." />
                    </Grid>
                    {
                        user?.permisos.includes('roles:create') && (
                            <Grid size={{ xs: 1, md: 1 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"} >
                                <Fab size="small" color="primary" aria-label="add" onClick={() => goTo('/admin/roles/create')} >
                                    <AddIcon />
                                </Fab>
                            </Grid>
                        )
                    }
                </Grid>
                <Grid size={12}>
                    <TableCustom<RolGetType> columns={columns} rows={filteredRoles} />
                </Grid>
            </Grid>
        </>
    )
}

export default UsersList;