import { useEffect, useState } from "react";
import { Grid, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { RiEdit2Line } from "react-icons/ri";
import { PiDeviceTabletFill } from "react-icons/pi";
import { HiOutlineTrash } from "react-icons/hi2";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import TableCustom from "../../../components/Table/Table";
import type { Column } from "../../../components/Table/Table";
import Search from "../../../components/utils/Search";
import { useGoTo } from "../../../hooks/useGoTo";
import { useAuthStore } from "../../../store/useAuthStore";
import type { CilindradaType } from "../../../types/cilindradaType";
import { deleteCilindrada, getCilindradas } from "../../../services/cilindrada.services";
import { successToast, errorToast } from "../../../utils/toast";
import ModalConfirm from "../../../components/utils/modals/ModalConfirm";


const CilindradaList = () => {
    const user = useAuthStore((state) => state.user);
    const [cilindradas, setCilindradas] = useState<CilindradaType[]>([]);
    const [filteredCilindradas, setFilteredCilindradas] = useState<CilindradaType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [cilindradaToDelete, setCilindradaToDelete] = useState<CilindradaType | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const goTo = useGoTo();

    const getCilindradasList = async () => {
        try {
            setLoading(true);
            const response = await getCilindradas();

            setCilindradas(response);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCilindradasList();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredCilindradas(cilindradas);
            return;
        }
        const lowerSearchTerm = searchTerm.toLowerCase();
        const filtered = cilindradas.filter((cilindrada) => {
            return (
                String(cilindrada.id ?? "").toLowerCase().includes(lowerSearchTerm) ||
                String(cilindrada.cilindrada).toLowerCase().includes(lowerSearchTerm)
            );
        });
        setFilteredCilindradas(filtered);
    }, [searchTerm, cilindradas]);

    const handleDeleteCilindrada = async () => {
        if (!cilindradaToDelete || isDeleting) return;
        try {
            setIsDeleting(true);
            const response = await deleteCilindrada(cilindradaToDelete.id);
            successToast(`Cilindrada eliminada: ${response || cilindradaToDelete.cilindrada}`);
            setCilindradaToDelete(null);
            getCilindradasList();
        } catch (err: any) {
            errorToast(err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const getTableActions = () => {
        const allActions = [
            {
                label: (
                    <>
                        <RiEdit2Line /> <span className="ml-1.5">Editar</span>
                    </>
                ),
                onClick: (row: CilindradaType) => goTo(`${row.id}/edit`),
                permiso: "cilindradas:edit",
            },
            {
                label: (
                    <>
                        <PiDeviceTabletFill /> <span className="ml-1.5">Detalle</span>
                    </>
                ),
                onClick: (row: CilindradaType) => goTo(`${row.id}`),
                permiso: "cilindradas:detail",
            },
            {
                label: (
                    <>
                        <HiOutlineTrash /> <span className="ml-1.5">Eliminar</span>
                    </>
                ),
                onClick: (row: CilindradaType) => setCilindradaToDelete(row),
                permiso: "cilindradas:delete",
            },
        ];
        return allActions.filter((action) => user?.permisos?.includes(action.permiso));
    };

    const getTableColumns = (): Column<CilindradaType>[] => {
        const baseColumns: Column<CilindradaType>[] = [
            { id: "cilindrada", label: "Cilindrada", minWidth: 150 },
            {
                id: "createdAt",
                label: "Creado el",
                minWidth: 150,
                format: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
            },
            {
                id: "updatedAt",
                label: "Actualizado el",
                minWidth: 150,
                format: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
            },
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

    if (loading) return <Loading />;
    if (error) return <ErrorCard errorText={error} restart={getCilindradasList} />;

    const columns = getTableColumns();

    return (
        <>
            <Grid container spacing={2} flexGrow={1} size={12} width={"100%"}>
                <Grid flexGrow={1} container p={1} gap={2} justifyContent={{ sm: "center", md: "flex-end" }}>
                    <Grid size={{ xs: 8, md: 8 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
                        <Search onSearch={setSearchTerm} placeholder="Buscar cilindradas..." />
                    </Grid>
                    {user?.permisos?.includes("cilindradas:create") && (
                        <Grid size={{ xs: 1, md: 1 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
                            <Fab size="small" color="primary" aria-label="add" onClick={() => goTo("/admin/cilindrada/create")}>
                                <AddIcon />
                            </Fab>
                        </Grid>
                    )}
                </Grid>
                <Grid size={12}>
                    <TableCustom<CilindradaType> columns={columns} rows={filteredCilindradas} />
                </Grid>
            </Grid>

            <ModalConfirm
                open={!!cilindradaToDelete}
                title="Eliminar cilindrada"
                text={`¿Seguro que deseas eliminar la cilindrada "${cilindradaToDelete?.cilindrada}"? Esta acción desactivará el registro.`}
                cancel={{
                    name: "Cancelar",
                    cancel: () => setCilindradaToDelete(null),
                    color: "primary",
                }}
                confirm={{
                    name: isDeleting ? "Eliminando..." : "Eliminar",
                    confirm: handleDeleteCilindrada,
                    color: "error",
                }}
                onClose={() => setCilindradaToDelete(null)}
            />
        </>
    );
};

export default CilindradaList;
