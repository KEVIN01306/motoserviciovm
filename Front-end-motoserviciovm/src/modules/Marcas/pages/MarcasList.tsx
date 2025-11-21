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
import type { MarcaType } from "../../../types/marcaType";
import { deleteMarca, getMarcas } from "../../../services/marca.services";
import { errorToast, successToast } from "../../../utils/toast";
import ModalConfirm from "../../../components/utils/modals/ModalConfirm";

type MarcaTableRow = MarcaType & { estadoLabel: string };

const MarcasList = () => {
    const user = useAuthStore((state) => state.user);
    const [marcas, setMarcas] = useState<MarcaTableRow[]>([]);
    const [filteredMarcas, setFilteredMarcas] = useState<MarcaTableRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [marcaToDelete, setMarcaToDelete] = useState<MarcaTableRow | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const goTo = useGoTo();

    const getMarcasList = async () => {
        try {
            setLoading(true);
            const response = await getMarcas();
            const normalized = response.map((marca) => ({
                ...marca,
                estadoLabel: marca.estado?.estado ?? `Estado #${marca.estadoId}`,
            }));
            setMarcas(normalized);
            setFilteredMarcas(normalized);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMarcasList();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredMarcas(marcas);
            return;
        }

        const lowerSearchTerm = searchTerm.toLowerCase();
        const filtered = marcas.filter((marca) => {
            return (
                String(marca.id ?? "").toLowerCase().includes(lowerSearchTerm) ||
                marca.marca.toLowerCase().includes(lowerSearchTerm) ||
                marca.estadoLabel.toLowerCase().includes(lowerSearchTerm)
            );
        });

        setFilteredMarcas(filtered);
    }, [searchTerm, marcas]);

    const handleDeleteMarca = async () => {
        if (!marcaToDelete || isDeleting) return;
        try {
            setIsDeleting(true);
            const response = await deleteMarca(marcaToDelete.id);
            successToast(`Marca eliminada: ${response || marcaToDelete.marca}`);
            setMarcaToDelete(null);
            getMarcasList();
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
                onClick: (row: MarcaTableRow) => goTo(`${row.id}/edit`),
                permiso: "marcas:edit",
            },
            {
                label: (
                    <>
                        <PiDeviceTabletFill /> <span className="ml-1.5">Detalle</span>
                    </>
                ),
                onClick: (row: MarcaTableRow) => goTo(`${row.id}`),
                permiso: "marcas:detail",
            },
            {
                label: (
                    <>
                        <HiOutlineTrash /> <span className="ml-1.5">Eliminar</span>
                    </>
                ),
                onClick: (row: MarcaTableRow) => setMarcaToDelete(row),
                permiso: "marcas:delete",
            },
        ];

        return allActions.filter((action) => user?.permisos?.includes(action.permiso));
    };

    const getTableColumns = (): Column<MarcaTableRow>[] => {
        const baseColumns: Column<MarcaTableRow>[] = [
            { id: "marca", label: "Marca", minWidth: 150 },
            {
                id: "estadoLabel",
                label: "Estado",
                minWidth: 120,
            },
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
    if (error) return <ErrorCard errorText={error} restart={getMarcasList} />;

    const columns = getTableColumns();

    return (
        <>
            <Grid container spacing={2} flexGrow={1} size={12} width={"100%"}>
                <Grid flexGrow={1} container p={1} gap={2} justifyContent={{ sm: "center", md: "flex-end" }}>
                    <Grid size={{ xs: 8, md: 8 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
                        <Search onSearch={setSearchTerm} placeholder="Buscar marcas..." />
                    </Grid>
                    {user?.permisos?.includes("marcas:create") && (
                        <Grid size={{ xs: 1, md: 1 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
                            <Fab size="small" color="primary" aria-label="add" onClick={() => goTo("create")}>
                                <AddIcon />
                            </Fab>
                        </Grid>
                    )}
                </Grid>
                <Grid size={12}>
                    <TableCustom<MarcaTableRow> columns={columns} rows={filteredMarcas} />
                </Grid>
            </Grid>

            <ModalConfirm
                open={!!marcaToDelete}
                title="Eliminar marca"
                text={`¿Seguro que deseas eliminar la marca "${marcaToDelete?.marca}"? Esta acción desactivará el registro.`}
                cancel={{
                    name: "Cancelar",
                    cancel: () => setMarcaToDelete(null),
                    color: "primary",
                }}
                confirm={{
                    name: isDeleting ? "Eliminando..." : "Eliminar",
                    confirm: handleDeleteMarca,
                    color: "error",
                }}
                onClose={() => setMarcaToDelete(null)}
            />
        </>
    );
};

export default MarcasList;

