import { useState, useEffect } from "react";
import { Grid, Fab, Box, Autocomplete, TextField, Card, CardContent, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { RiEdit2Line } from "react-icons/ri";
import { PiDeviceTabletFill } from "react-icons/pi";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import TableCustom from "../../../components/Table/Table";
import type { Column } from "../../../components/Table/Table";
import { useGoTo } from "../../../hooks/useGoTo";
import { useAuthStore } from "../../../store/useAuthStore";
import type { TipoServicioHorario, TipoServicioHorarioFilters } from "../../../types/tipoServicioHorarioType";
import type { TipoHorarioType } from "../../../types/tipoHorario";
import type { SucursalType } from "../../../types/sucursalType";
import { tipoServicioHorarioServices } from "../../../services/tipoServicioHorario.services";
import { getTiposHorario } from "../../../services/tipoHorario.services";
import { getSucursales } from "../../../services/sucursal.services";
import { successToast, errorToast } from "../../../utils/toast";
import ModalConfirm from "../../../components/utils/modals/ModalConfirm";

const HorariosList = () => {
    const user = useAuthStore((state) => state.user);
    const [items, setItems] = useState<TipoServicioHorario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [toDelete, setToDelete] = useState<TipoServicioHorario | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const goTo = useGoTo();

    // Filtros
    const [tiposHorario, setTiposHorario] = useState<TipoHorarioType[]>([]);
    const [sucursales, setSucursales] = useState<SucursalType[]>([]);
    const [selectedTipoHorario, setSelectedTipoHorario] = useState<TipoHorarioType | null>(null);
    const [selectedSucursal, setSelectedSucursal] = useState<SucursalType | null>(null);

    useEffect(() => {
        const loadCatalogos = async () => {
            try {
                const [tiposHorarioData, sucursalesData] = await Promise.all([
                    getTiposHorario(),
                    getSucursales(),
                ]);
                setTiposHorario(tiposHorarioData);
                setSucursales(sucursalesData);
            } catch (err: any) {
                setError(err.message);
            }
        };
        loadCatalogos();
    }, []);

    useEffect(() => {
        if (selectedTipoHorario && selectedSucursal) {
            getList();
        } else {
            setItems([]);
            setLoading(false);
        }
    }, [selectedTipoHorario, selectedSucursal]);

    const getList = async () => {
        if (!selectedTipoHorario || !selectedSucursal) return;

        try {
            setLoading(true);
            const filters: TipoServicioHorarioFilters = {
                tipoHorarioId: Number(selectedTipoHorario.id),
                sucursalId: Number(selectedSucursal.id),
            };
            const response = await tipoServicioHorarioServices.getTiposServicioHorario(filters);
            setItems(response);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!toDelete || isDeleting) return;
        try {
            setIsDeleting(true);
            await tipoServicioHorarioServices.deleteTipoServicioHorario(toDelete.id);
            successToast(`Horario eliminado exitosamente`);
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
                onClick: (row: TipoServicioHorario) => goTo(`${row.id}/edit`),
            },
            {
                label: (
                    <>
                        <PiDeviceTabletFill /> <span className="ml-1.5">Detalle</span>
                    </>
                ),
                onClick: (row: TipoServicioHorario) => goTo(`${row.id}`),
            },

        ];
        return all;
    };

    const columns: Column<TipoServicioHorario>[] = [
        { id: "id", label: "ID", minWidth: 70 },
        {
            id: "tipoHorario",
            label: "Tipo Horario",
            minWidth: 150,
            format: (value: any) => value?.tipo || "N/A",
        },
        {
            id: "sucursal",
            label: "Sucursal",
            minWidth: 200,
            format: (value: any) => value?.nombre || "N/A",
        },
        {
            id: "fechaVijencia",
            label: "Fecha Vigencia",
            minWidth: 150,
            format: (value: any) => (value ? new Date(value).toLocaleDateString() : "N/A"),
        },
        {
            id: "diasConfig",
            label: "Días Configurados",
            minWidth: 100,
            align: "center",
            format: (value: any) => (Array.isArray(value) ? value.length : 0),
        },
        {
            id: "actions",
            label: "Acciones",
            minWidth: 100,
            align: "center",
            actions: getActions(),
        },
    ];

    if (error) return <ErrorCard errorText={error} restart={getList} />;

    return (
        <Grid container spacing={2} flexGrow={1} size={12} width={"100%"}>
            <Grid size={12}>
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Autocomplete
                                    options={sucursales}
                                    getOptionLabel={(option) => option.nombre}
                                    value={selectedSucursal}
                                    onChange={(_, newValue) => setSelectedSucursal(newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Seleccionar Sucursal" required />
                                    )}
                                    sx={{ width: "100%" }}
                                />

                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Autocomplete
                                    options={tiposHorario}
                                    getOptionLabel={(option) => option.tipo}
                                    value={selectedTipoHorario}
                                    onChange={(_, newValue) => setSelectedTipoHorario(newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Seleccionar Tipo de Horario" required />
                                    )}
                                    sx={{ minWidth: 300 }}
                                />
                            </Grid>
                            {user?.permisos?.includes("marcas:create") && (
                                <Grid size={{ xs: 1, md: 1 }} display={"flex"} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
                                    <Fab size="small" color="primary" aria-label="add" onClick={() => goTo("/admin/horarios/create")}>
                                        <AddIcon />
                                    </Fab>
                                </Grid>
                            )}

                        </Grid>
                    </CardContent>
                </Card>

                {loading ? (
                    <Loading />
                ) : selectedTipoHorario && selectedSucursal ? (
                    <TableCustom
                        columns={columns}
                        rows={items}
                    />
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                            Seleccione una sucursal y un tipo de horario para ver los resultados
                        </Typography>
                    </Box>
                )}

                {user?.permisos.some((p: any) => p.clave === "horarios:create") && (
                    <Fab
                        color="primary"
                        aria-label="add"
                        sx={{ position: "fixed", bottom: 16, right: 16 }}
                        onClick={() => goTo("create")}
                    >
                        <AddIcon />
                    </Fab>
                )}

                <ModalConfirm
                    open={!!toDelete}
                    title="Eliminar Horario"
                    text={`¿Está seguro que desea eliminar este horario?`}
                    confirm={{
                        name: "Eliminar",
                        confirm: handleDelete,
                        color: "error"
                    }}
                    cancel={{
                        name: "Cancelar",
                        cancel: () => setToDelete(null)
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default HorariosList;
