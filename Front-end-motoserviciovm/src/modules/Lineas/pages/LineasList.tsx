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
import type { LineaType } from "../../../types/lineaType";
import { deleteLinea, getLineas } from "../../../services/linea.services";
import { successToast, errorToast } from "../../../utils/toast";
import ModalConfirm from "../../../components/utils/modals/ModalConfirm";

type LineaTableRow = LineaType & { estadoLabel: string };

const LineasList = () => {
    const user = useAuthStore((state) => state.user);
    const [lineas, setLineas] = useState<LineaTableRow[]>([]);
    const [filteredLineas, setFilteredLineas] = useState<LineaTableRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [lineaToDelete, setLineaToDelete] = useState<LineaTableRow | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const goTo = useGoTo();

    const getLineasList = async () => {
        try {
            setLoading(true);
            const response = await getLineas();
            const normalized = response.map((linea) => ({
                ...linea,
                estadoLabel: (linea as any).estado?.estado ?? `Estado #${linea.estadoId}`,
            }));
            setLineas(normalized);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLineasList();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredLineas(lineas);
            return;
        }

        const lowerSearchTerm = searchTerm.toLowerCase();
        const filtered = lineas.filter((linea) => {
            return (
                String(linea.id ?? "").toLowerCase().includes(lowerSearchTerm) ||
                linea.linea.toLowerCase().includes(lowerSearchTerm) ||
                linea.estadoLabel.toLowerCase().includes(lowerSearchTerm)
            );
        });

        setFilteredLineas(filtered);
    }, [searchTerm, lineas]);

    const handleDeleteLinea = async () => {
        if (!lineaToDelete || isDeleting) return;
        try {
            setIsDeleting(true);
            const response = await deleteLinea(lineaToDelete.id);
            successToast(`Línea eliminada: ${response || lineaToDelete.linea}`);
            setLineaToDelete(null);
            getLineasList();
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
                onClick: (row: LineaTableRow) => goTo(`${row.id}/edit`),
                permiso: "lineas:edit",
            },
            {
                label: (
                    <>
                        <PiDeviceTabletFill /> <span className="ml-1.5">Detalle</span>
                    </>
                ),
                onClick: (row: LineaTableRow) => goTo(`${row.id}`),
                permiso: "lineas:detail",
            },
            {
                label: (
                    <>
                        <HiOutlineTrash /> <span className="ml-1.5">Eliminar</span>
                    </>
                ),
                onClick: (row: LineaTableRow) => setLineaToDelete(row),
                permiso: "lineas:delete",
            },
        ];

        return allActions.filter((action) => user?.permisos?.includes(action.permiso));
    };

    const getTableColumns = (): Column<LineaTableRow>[] => {
        const baseColumns: Column<LineaTableRow>[] = [
            { id: "linea", label: "Línea", minWidth: 150 },
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
    if (error) return <ErrorCard errorText={error} restart={getLineasList} />;

    const columns = getTableColumns();

    return (
        <>
            <Grid container spacing={2} flexGrow={1} size={12} width={"100%"}>
                <Grid flexGrow={1} container p={1} gap={2} justifyContent={{ sm: "center", md: "flex-end" }}>
                    <Grid size={{ xs: 8, md: 8 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
                        <Search onSearch={setSearchTerm} placeholder="Buscar líneas..." />
                    </Grid>
                    {user?.permisos?.includes("lineas:create") && (
                        <Grid size={{ xs: 1, md: 1 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
                                <Fab size="small" color="primary" aria-label="add" onClick={() => goTo("/admin/lineas/create")}>
                                <AddIcon />
                            </Fab>
                        </Grid>
                    )}
                </Grid>
                <Grid size={12}>
                    <TableCustom<LineaTableRow> columns={columns} rows={filteredLineas} />
                </Grid>
            </Grid>

            <ModalConfirm
                open={!!lineaToDelete}
                title="Eliminar línea"
                text={`¿Seguro que deseas eliminar la línea "${lineaToDelete?.linea}"? Esta acción desactivará el registro.`}
                cancel={{
                    name: "Cancelar",
                    cancel: () => setLineaToDelete(null),
                    color: "primary",
                }}
                confirm={{
                    name: isDeleting ? "Eliminando..." : "Eliminar",
                    confirm: handleDeleteLinea,
                    color: "error",
                }}
                onClose={() => setLineaToDelete(null)}
            />
        </>
    );
};

export default LineasList;

