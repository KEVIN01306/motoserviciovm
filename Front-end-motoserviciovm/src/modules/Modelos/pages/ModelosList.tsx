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
import type { modeloGetType } from "../../../types/modeloType";
import { deleteModelo, getModelos } from "../../../services/modelo.services";
import { successToast, errorToast } from "../../../utils/toast";
import ModalConfirm from "../../../components/utils/modals/ModalConfirm";

type ModeloTableRow = modeloGetType & { estadoLabel: string };

const ModelosList = () => {
    const user = useAuthStore((state) => state.user);
    const [modelos, setModelos] = useState<ModeloTableRow[]>([]);
    const [filteredModelos, setFilteredModelos] = useState<ModeloTableRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [modeloToDelete, setModeloToDelete] = useState<ModeloTableRow | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const goTo = useGoTo();

    const getModelosList = async () => {
        try {
            setLoading(true);
            const response = await getModelos();
            const normalized = response.map((modelo) => ({
                ...modelo,
                estadoLabel: `Estado #${modelo.estadoId}`,
            }));
            setModelos(normalized);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getModelosList();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredModelos(modelos);
            return;
        }

        const lowerSearchTerm = searchTerm.toLowerCase();
        const filtered = modelos.filter((m) => {
            return (
                String(m.id ?? "").toLowerCase().includes(lowerSearchTerm) ||
                (m.modelo ?? "").toLowerCase().includes(lowerSearchTerm) ||
                (m.marca?.marca ?? "").toLowerCase().includes(lowerSearchTerm) ||
                (m.linea?.linea ?? "").toLowerCase().includes(lowerSearchTerm) ||
                (m.cilindrada?.cilindrada ?? "").toString().toLowerCase().includes(lowerSearchTerm) ||
                (m.estadoLabel ?? "").toLowerCase().includes(lowerSearchTerm)
            );
        });

        setFilteredModelos(filtered);
    }, [searchTerm, modelos]);

    const handleDeleteModelo = async () => {
        if (!modeloToDelete || isDeleting) return;
        try {
            setIsDeleting(true);
            const response = await deleteModelo(modeloToDelete.id);
            successToast(`Modelo eliminado: ${response || modeloToDelete.modelo}`);
            setModeloToDelete(null);
            getModelosList();
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
                onClick: (row: ModeloTableRow) => goTo(`${row.id}/edit`),
                permiso: "modelos:edit",
            },
            {
                label: (
                    <>
                        <PiDeviceTabletFill /> <span className="ml-1.5">Detalle</span>
                    </>
                ),
                onClick: (row: ModeloTableRow) => goTo(`${row.id}`),
                permiso: "modelos:detail",
            },
            {
                label: (
                    <>
                        <HiOutlineTrash /> <span className="ml-1.5">Eliminar</span>
                    </>
                ),
                onClick: (row: ModeloTableRow) => setModeloToDelete(row),
                permiso: "modelos:delete",
            },
        ];

        return allActions.filter((action) => user?.permisos?.includes(action.permiso));
    };

    const getTableColumns = (): Column<ModeloTableRow>[] => {
        const baseColumns: Column<ModeloTableRow>[] = [
            { id: "modelo", label: "Modelo", minWidth: 150 },
            { id: "marca", label: "Marca", minWidth: 120, format: (v) => (v ? (v as any).marca : "-") },
            { id: "linea", label: "Línea", minWidth: 120, format: (v) => (v ? (v as any).linea : "-") },
            { id: "cilindrada", label: "Cilindrada", minWidth: 100, format: (v) => (v ? String((v as any).cilindrada) : "-") },
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
    if (error) return <ErrorCard errorText={error} restart={getModelosList} />;

    const columns = getTableColumns();

    return (
        <>
            <Grid container spacing={2} flexGrow={1} size={12} width={"100%"}>
                <Grid flexGrow={1} container p={1} gap={2} justifyContent={{ sm: "center", md: "flex-end" }}>
                    <Grid size={{ xs: 8, md: 8 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
                        <Search onSearch={setSearchTerm} placeholder="Buscar modelos..." />
                    </Grid>
                    {user?.permisos?.includes("modelos:create") && (
                        <Grid size={{ xs: 1, md: 1 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
                            <Fab size="small" color="primary" aria-label="add" onClick={() => goTo("create")}>
                                <AddIcon />
                            </Fab>
                        </Grid>
                    )}
                </Grid>
                <Grid size={12}>
                    <TableCustom<ModeloTableRow> columns={columns} rows={filteredModelos} />
                </Grid>
            </Grid>

            <ModalConfirm
                open={!!modeloToDelete}
                title="Eliminar modelo"
                text={`¿Seguro que deseas eliminar el modelo "${modeloToDelete?.modelo}"? Esta acción desactivará el registro.`}
                cancel={{
                    name: "Cancelar",
                    cancel: () => setModeloToDelete(null),
                    color: "primary",
                }}
                confirm={{
                    name: isDeleting ? "Eliminando..." : "Eliminar",
                    confirm: handleDeleteModelo,
                    color: "error",
                }}
                onClose={() => setModeloToDelete(null)}
            />
        </>
    );
};

export default ModelosList;
