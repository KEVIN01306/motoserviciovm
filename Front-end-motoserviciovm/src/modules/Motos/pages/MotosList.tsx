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
import type { motoGetType } from "../../../types/motoType";
import { deleteMoto, getMotos } from "../../../services/moto.services";
import { successToast, errorToast } from "../../../utils/toast";
import ModalConfirm from "../../../components/utils/modals/ModalConfirm";


const MotosList = () => {
    const user = useAuthStore((state) => state.user);
    const [motos, setMotos] = useState<motoGetType[]>([]);
    const [filteredMotos, setFilteredMotos] = useState<motoGetType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [motoToDelete, setMotoToDelete] = useState<motoGetType | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const goTo = useGoTo();

    const getMotosList = async () => {
        try {
            setLoading(true);
            const response = await getMotos();

            setMotos(response);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMotosList();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredMotos(motos);
            return;
        }

        const lowerSearchTerm = searchTerm.toLowerCase();
        const filtered = motos.filter((m) => {
            return (
                String(m.id ?? "").toLowerCase().includes(lowerSearchTerm) ||
                (m.placa ?? "").toLowerCase().includes(lowerSearchTerm) ||
                (m.modelo?.modelo ?? "").toLowerCase().includes(lowerSearchTerm) ||
                (m.modelo?.marca?.marca ?? "").toLowerCase().includes(lowerSearchTerm) ||
                (m.modelo?.linea?.linea ?? "").toLowerCase().includes(lowerSearchTerm) ||
                (m.modelo?.cilindrada?.cilindrada ?? "").toString().toLowerCase().includes(lowerSearchTerm)
            );
        });

        setFilteredMotos(filtered);
    }, [searchTerm, motos]);

    const handleDeleteMoto = async () => {
        if (!motoToDelete || isDeleting) return;
        try {
            setIsDeleting(true);
            const response = await deleteMoto(motoToDelete.id);
            successToast(`Moto eliminada: ${response || motoToDelete.placa}`);
            setMotoToDelete(null);
            getMotosList();
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
                onClick: (row: motoGetType) => goTo(`${row.id}/edit`),
                permiso: "motos:edit",
            },
            {
                label: (
                    <>
                        <PiDeviceTabletFill /> <span className="ml-1.5">Detalle</span>
                    </>
                ),
                onClick: (row: motoGetType) => goTo(`${row.id}`),
                permiso: "motos:detail",
            },
            {
                label: (
                    <>
                        <HiOutlineTrash /> <span className="ml-1.5">Eliminar</span>
                    </>
                ),
                onClick: (row: motoGetType) => setMotoToDelete(row),
                permiso: "motos:delete",
            },
        ];

        return allActions.filter((action) => user?.permisos?.includes(action.permiso));
    };

    const getTableColumns = (): Column<motoGetType>[] => {
        const baseColumns: Column<motoGetType>[] = [
            { id: "placa", label: "Placa", minWidth: 150 },
            { id: "modelo", label: "Modelo", minWidth: 120, format: (v) => (v ? (v as any).modelo : "-") },
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
    if (error) return <ErrorCard errorText={error} restart={getMotosList} />;

    const columns = getTableColumns();

    return (
        <>
            <Grid container spacing={2} flexGrow={1} size={12} width={"100%"}>
                <Grid flexGrow={1} container p={1} gap={2} justifyContent={{ sm: "center", md: "flex-end" }}>
                    <Grid size={{ xs: 8, md: 8 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
                        <Search onSearch={setSearchTerm} placeholder="Buscar motos..." />
                    </Grid>
                    {user?.permisos?.includes("motos:create") && (
                        <Grid size={{ xs: 1, md: 1 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
                            <Fab size="small" color="primary" aria-label="add" onClick={() => goTo("create")}>
                                <AddIcon />
                            </Fab>
                        </Grid>
                    )}
                </Grid>
                <Grid size={12}>
                    <TableCustom<motoGetType> columns={columns} rows={filteredMotos} />
                </Grid>
            </Grid>

            <ModalConfirm
                open={!!motoToDelete}
                title="Eliminar moto"
                text={`¿Seguro que deseas eliminar la moto "${motoToDelete?.placa}"? Esta acción desactivará el registro.`}
                cancel={{
                    name: "Cancelar",
                    cancel: () => setMotoToDelete(null),
                    color: "primary",
                }}
                confirm={{
                    name: isDeleting ? "Eliminando..." : "Eliminar",
                    confirm: handleDeleteMoto,
                    color: "error",
                }}
                onClose={() => setMotoToDelete(null)}
            />
        </>
    );
};

export default MotosList;
