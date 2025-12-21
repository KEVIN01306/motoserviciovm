import { useEffect, useState } from "react";
import { Grid, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { PiDeviceTabletFill } from "react-icons/pi";
import { HiOutlineTrash } from "react-icons/hi2";
import { RiEdit2Line } from "react-icons/ri";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import TableCustom from "../../../components/Table/Table";
import type { Column } from "../../../components/Table/Table";
import Search from "../../../components/utils/Search";
import { useGoTo } from "../../../hooks/useGoTo";
import { useAuthStore } from "../../../store/useAuthStore";
import type { ProductoGetType } from "../../../types/productoType";
import { deleteProducto, getProductos } from "../../../services/producto.services";
import { successToast, errorToast } from "../../../utils/toast";
import ModalConfirm from "../../../components/utils/modals/ModalConfirm";
import type { CategoriaProductoType } from "../../../types/categoriaProductoType";

const ProductosList = () => {
    const user = useAuthStore((state) => state.user);
    const [items, setItems] = useState<ProductoGetType[]>([]);
    const [filtered, setFiltered] = useState<ProductoGetType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [toDelete, setToDelete] = useState<ProductoGetType | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const goTo = useGoTo();

    const getList = async () => {
        try {
            setLoading(true);
            const response = await getProductos();
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
                (i.nombre ?? "").toLowerCase().includes(lower) ||
                (i.descripcion ?? "").toLowerCase().includes(lower) ||
                (i.categoria?.categoria ?? "").toLowerCase().includes(lower)
            );
        });

        setFiltered(filtered);
    }, [searchTerm, items]);

    const handleDelete = async () => {
        if (!toDelete || isDeleting) return;
        try {
            setIsDeleting(true);
            const res = await deleteProducto(toDelete.id);
            successToast(`Producto eliminado: ${res || toDelete.nombre}`);
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
                onClick: (row: ProductoGetType) => goTo(`${row.id}/edit`),
                permiso: "productos:edit",
            },
            {
                label: (
                    <>
                        <PiDeviceTabletFill /> <span className="ml-1.5">Detalle</span>
                    </>
                ),
                onClick: (row: ProductoGetType) => goTo(`${row.id}`),
                permiso: "productos:detail",
            },
            {
                label: (
                    <>
                        <HiOutlineTrash /> <span className="ml-1.5">Eliminar</span>
                    </>
                ),
                onClick: (row: ProductoGetType) => setToDelete(row),
                permiso: "productos:delete",
            },
        ];

        return all.filter((a) => user?.permisos?.includes(a.permiso));
    };

    const getColumns = (): Column<ProductoGetType>[] => {
        const base: Column<ProductoGetType>[] = [
            { id: "nombre", label: "Nombre", minWidth: 150 },
            { id: "categoria", label: "Categoría", minWidth: 120, format: (v) => (v ? (v as CategoriaProductoType).categoria : "-") },
            {
                id: "cantidad",
                label: "Cantidad",
                minWidth: 100,
                format: (v) => (v != null ? <p style={{color: v == 0 ? "red" : "inherit"}}>{ String(v)}</p> : "-"),
            },
            {
                id: "precio",
                label: "Precio",
                minWidth: 120,
                format: (v) => (v != null ? String(v) : "-"),
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
                        <Search onSearch={setSearchTerm} placeholder="Buscar productos..." />
                    </Grid>
                    {user?.permisos?.includes("productos:create") && (
                        <Grid size={{ xs: 1, md: 1 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
                            <Fab size="small" color="primary" aria-label="add" onClick={() => goTo("/admin/productos/create")}>
                                <AddIcon />
                            </Fab>
                        </Grid>
                    )}
                </Grid>
                <Grid size={12}>
                    <TableCustom<ProductoGetType> columns={columns} rows={filtered} />
                </Grid>
            </Grid>

            <ModalConfirm
                open={!!toDelete}
                title="Eliminar producto"
                text={`¿Seguro que deseas eliminar el producto "${toDelete?.nombre}"? Esta acción desactivará el registro.`}
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

export default ProductosList;
