import { useEffect, useState } from "react";
import { getSucursales } from "../../../services/sucursal.services";
import type { SucursalType } from "../../../types/sucursalType";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import TableCustom from "../../../components/Table/Table";
import type { Column } from "../../../components/Table/Table";
import { Fab, Grid } from "@mui/material";
import { useGoTo } from "../../../hooks/useGoTo";
import AddIcon from '@mui/icons-material/Add';
import { RiEdit2Line } from "react-icons/ri";
import Search from "../../../components/utils/Search";
import { useAuthStore } from "../../../store/useAuthStore";
import { PiDeviceTabletFill, PiUserCheckBold } from "react-icons/pi";
import { DetailsOutlined } from "@mui/icons-material";

const SucursalesList = () => {
    const user = useAuthStore(state => state.user)
    const [sucursales, setSucursales] = useState<SucursalType[]>([])
    const [filteredSucursales, setFilteredSucursales] = useState<SucursalType[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>("")
    const goTo = useGoTo()

    const getSucursalesList = async () => {
        try {
            setLoading(true)
            const response = await getSucursales()
            setSucursales(response)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSucursalesList()
    }, [])

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredSucursales(sucursales);
            return;
        }

        const lowerSearchTerm = searchTerm.toLowerCase();
        const filtered = sucursales.filter((sucursal) => {
            return (
                String(sucursal.id).toLowerCase().includes(lowerSearchTerm) ||
                sucursal.nombre.toLowerCase().includes(lowerSearchTerm) ||
                sucursal.direccion.toLowerCase().includes(lowerSearchTerm) ||
                sucursal.telefono.toLowerCase().includes(lowerSearchTerm) ||
                (sucursal.email ?? "").toLowerCase().includes(lowerSearchTerm)
            );
        });

        setFilteredSucursales(filtered);
    }, [searchTerm, sucursales]);

    const getTableActions = () => {
        const allActions = [
            { 
                label: (<><RiEdit2Line /> <span className="ml-1.5">Editar</span> </>), 
                onClick: (row: SucursalType) => goTo(`/admin/sucursales/${row.id}/edit`),
                permiso: 'sucursales:edit'
            },
            { 
                label: (<><PiDeviceTabletFill /> <span className="ml-1.5">Detalle</span> </>), 
                onClick: (row: SucursalType) => goTo(`/admin/sucursales/${row.id}`),
                permiso: 'sucursales:detail'
            }
        ]
        return allActions.filter(action => user?.permisos?.includes(action.permiso));
    };

    const getTableColumns = (): Column<SucursalType>[] => {
        const baseColumns: Column<SucursalType>[] = [
            { id: "nombre", label: "Nombre", minWidth: 150 },
            { id: "telefono", label: "Teléfono", minWidth: 120 },
            { id: "email", label: "Email", minWidth: 150 },
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

    if (loading) return <Loading />
    if (error) return <ErrorCard errorText={error} restart={getSucursalesList} />

    const columns = getTableColumns();

    return (
        <>
            <Grid container spacing={2} flexGrow={1} size={12} width={"100%"}>
                <Grid flexGrow={1} container p={1} gap={2} justifyContent={{ sm: "center", md: "flex-end" }}>
                    <Grid size={{ xs: 8, md: 8 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"} >
                        <Search onSearch={setSearchTerm} placeholder="Buscar sucursales..." />
                    </Grid>
                    {
                        user?.permisos?.includes('sucursales:create') && (
                            <Grid size={{ xs: 1, md: 1 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"} >
                                <Fab size="small" color="primary" aria-label="add" onClick={() => goTo("/admin/sucursales/create")} >
                                    <AddIcon />
                                </Fab>
                            </Grid>
                        )
                    }
                </Grid>
                <Grid size={12}>
                    <TableCustom<SucursalType> columns={columns} rows={filteredSucursales} />
                </Grid>
            </Grid>
        </>
    )
}

export default SucursalesList;
