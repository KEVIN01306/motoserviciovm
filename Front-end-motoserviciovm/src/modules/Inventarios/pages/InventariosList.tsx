import { useEffect, useState } from "react";
import { Grid, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { RiEyeLine } from "react-icons/ri";
import { HiOutlineTrash } from "react-icons/hi2";
import { RiEdit2Line } from "react-icons/ri";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import TableCustom from "../../../components/Table/Table";
import type { Column } from "../../../components/Table/Table";
import Search from "../../../components/utils/Search";
import { useGoTo } from "../../../hooks/useGoTo";
import { useAuthStore } from "../../../store/useAuthStore";
import type { InventarioType } from "../../../types/inventarioType";
import { deleteInventario, getInventarios } from "../../../services/inventario.services";
import { successToast, errorToast } from "../../../utils/toast";
import ModalConfirm from "../../../components/utils/modals/ModalConfirm";

const InventariosList = () => {
    const user = useAuthStore((state) => state.user);
    const [items, setItems] = useState<InventarioType[]>([]);
    const [filtered, setFiltered] = useState<InventarioType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [toDelete, setToDelete] = useState<InventarioType | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const goTo = useGoTo();

    const getList = async () => {
        try {
            setLoading(true);
            const response = await getInventarios();
            setItems(response);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getList();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFiltered(items);
            return;
        }

        const lower = searchTerm.toLowerCase();
        const filtered = items.filter((i) => {
            return (
                String(i.id ?? "").toLowerCase().includes(lower) ||
                (i.item ?? "").toLowerCase().includes(lower) ||
                (i.descripcion ?? "").toLowerCase().includes(lower)
            );
        });

        setFiltered(filtered);
    }, [searchTerm, items]);

    const handleDelete = async () => {
        if (!toDelete || isDeleting) return;
        try {
            setIsDeleting(true);
            const res = await deleteInventario(toDelete.id);
            successToast(`Inventario eliminado: ${res || toDelete.item}`);
            setToDelete(null);
            getList();
        } catch (err: any) {
            errorToast(err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const getActions = () => {
        const all = [
            {
                label: (
                    <>
                        <RiEdit2Line /> <span className="ml-1.5">Editar</span>
                    </>
                ),
                onClick: (row: InventarioType) => goTo(`${row.id}/edit`),
                permiso: "inventarios:edit",
            },
            {
                label: (
                    <>
                        <RiEyeLine /> <span className="ml-1.5">Detalle</span>
                    </>
                ),
                onClick: (row: InventarioType) => goTo(`${row.id}`),
                permiso: "inventarios:detail",
            },
            {
                label: (
                    <>
                        <HiOutlineTrash /> <span className="ml-1.5">Eliminar</span>
                    </>
                ),
                onClick: (row: InventarioType) => setToDelete(row),
                permiso: "inventarios:delete",
            },
        ];

        return all.filter((a) => user?.permisos?.includes(a.permiso));
    };

    const getColumns = (): Column<InventarioType>[] => {
        const base: Column<InventarioType>[] = [
            { id: "item", label: "Item", minWidth: 150 },
            { id: "descripcion", label: "Descripción", minWidth: 200 },
            { id: "activo", label: "Activo", minWidth: 80, format: (v) => (v ? "Sí" : "No") },
            {
                id: "createdAt",
                label: "Creado el",
                minWidth: 150,
                format: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
            },
        ];

        const actions = getActions();
        if (actions.length > 0) base.push({ id: "actions", label: "Acciones", actions });

        return base;
    };

    if (loading) return <Loading />;
    if (error) return <ErrorCard errorText={error} restart={getList} />;

    const columns = getColumns();

    return (
        <>
            <Grid container spacing={2} flexGrow={1} size={12} width={"100%"}>
                <Grid flexGrow={1} container p={1} gap={2} justifyContent={{ sm: "center", md: "flex-end" }}>
                    <Grid size={{ xs: 8, md: 8 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
                        <Search onSearch={setSearchTerm} placeholder="Buscar inventarios..." />
                    </Grid>
                    {user?.permisos?.includes("inventarios:create") && (
                        <Grid size={{ xs: 1, md: 1 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
                            <Fab size="small" color="primary" aria-label="add" onClick={() => goTo("create")}>
                                <AddIcon />
                            </Fab>
                        </Grid>
                    )}
                </Grid>
                <Grid size={12}>
                    <TableCustom<InventarioType> columns={columns} rows={filtered} />
                </Grid>
            </Grid>

            <ModalConfirm
                open={!!toDelete}
                title="Eliminar inventario"
                text={`¿Seguro que deseas eliminar el inventario "${toDelete?.item}"? Esta acción desactivará el registro.`}
                cancel={{
                    name: "Cancelar",
                    cancel: () => setToDelete(null),
                    color: "primary",
                }}
                confirm={{
                    name: isDeleting ? "Eliminando..." : "Eliminar",
                    confirm: handleDelete,
                    color: "error",
                }}
                onClose={() => setToDelete(null)}
            />
        </>
    );
};

export default InventariosList;
