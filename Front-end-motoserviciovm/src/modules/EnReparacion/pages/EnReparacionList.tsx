import { useEffect, useState } from "react";
import { Grid, Fab, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { RiEdit2Line } from "react-icons/ri";
import { PiDeviceTabletFill } from "react-icons/pi";
import { HiOutlineTrash } from "react-icons/hi2";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { RiBikeFill } from "react-icons/ri";
import TableCustom from "../../../components/Table/Table";
import type { Column } from "../../../components/Table/Table";
import Search from "../../../components/utils/Search";
import { useGoTo } from "../../../hooks/useGoTo";
import { useAuthStore } from "../../../store/useAuthStore";
import type { EnReparacionGetType } from "../../../types/enReparacionType";
import { getEnReparaciones } from "../../../services/enReparacion.services";
import { successToast, errorToast } from "../../../utils/toast";
import ModalConfirm from "../../../components/utils/modals/ModalConfirm";
import { BikeScooter } from "@mui/icons-material";

const EnReparacionList = () => {
  const user = useAuthStore((state) => state.user);
  const [items, setItems] = useState<EnReparacionGetType[]>([]);
  const [filtered, setFiltered] = useState<EnReparacionGetType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [toDelete, setToDelete] = useState<EnReparacionGetType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const goTo = useGoTo();

  const getList = async () => {
    try {
      setLoading(true);
      const response = await getEnReparaciones();
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
    const filteredItems = items.filter((it) => {
      return (
        String(it.id ?? "").toLowerCase().includes(lower) ||
        (it.descripcion ?? "").toLowerCase().includes(lower) ||
        (it.servicio?.moto?.placa ?? "").toLowerCase().includes(lower)
      );
    });
    setFiltered(filteredItems);
  }, [searchTerm, items]);

  const handleDelete = async () => {
    if (!toDelete || isDeleting) return;
    try {
      setIsDeleting(true);
      successToast(`Registro eliminado`);
      setToDelete(null);
      getList();
    } catch (err: any) {
      errorToast(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const getActions = () => {
    // return a function so Table can compute actions per row
    return (row: EnReparacionGetType) => {
      const estadoLabel = (row?.estado?.estado ?? "").toLowerCase();
      const isActive = estadoLabel.includes("activo");
      const actions: { label: any; onClick: (r: EnReparacionGetType) => void }[] = [];

      // If not active, only allow detail (if user has permission)
      if (!isActive) {
        if (user?.permisos?.includes("enreparacion:detail")) {
          actions.push({ label: (<><PiDeviceTabletFill /> <span className="ml-1.5">Detalle</span></>), onClick: (r) => goTo(`${r.id}`) });
        }
        return actions;
      }

      // Active: add Salida if user has permiso
      if (user?.permisos?.includes("enreparacion:salida")) {
        actions.push({ label: (<><BikeScooter /> <span className="ml-1.5">Salida</span></>), onClick: (r) => goTo(`/admin/enreparacion/${r.id}/salida`) });
      }

      // Edit
      if (user?.permisos?.includes("enreparacion:edit")) {
        actions.push({ label: (<><RiEdit2Line /> <span className="ml-1.5">Editar</span></>), onClick: (r) => goTo(`/admin/enreparacion/${r.id}/edit`) });
      }

      // Detail (always include if permiso)
      if (user?.permisos?.includes("enreparacion:detail")) {
        actions.push({ label: (<><PiDeviceTabletFill /> <span className="ml-1.5">Detalle</span></>), onClick: (r) => goTo(`${r.id}`) });
      }

      // Delete (optional)
      if (user?.permisos?.includes("enreparacion:delete")) {
        actions.push({ label: (<><HiOutlineTrash /> <span className="ml-1.5">Eliminar</span></>), onClick: (r) => setToDelete(r) });
      }

      return actions;
    };
  };

  const chipColorByEstado = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "activo":
        return "success";
      case "inactivo":
        return "default";
      case "pendiente":
        return "warning";
      default:
        return "primary";
    }
  };

  const getColumns = (): Column<EnReparacionGetType>[] => {
    const base: Column<EnReparacionGetType>[] = [
      { id: "descripcion", label: "Descripción", minWidth: 200 },
      { id: "fechaEntrada", label: "Entrada", minWidth: 150, format: (v) => (v ? new Date(v).toLocaleString() : "-") },
      { id: "servicio", label: "Moto", minWidth: 120, format: (v) => (v ? (v as any).moto?.placa : "-") },
      { id: "estado", label: "Estado", minWidth: 100, format: (v) => (v ? <Chip label={(v as any).estado} color={chipColorByEstado((v as any).estado)} variant="outlined" /> : "-") },
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
      <BreadcrumbsRoutes items={[{ label: "En Reparación", icon: <RiBikeFill fontSize="inherit" />, href: "/admin/enreparacion" }]} />
      <Grid container spacing={2} flexGrow={1} size={12} width={"100%"}>
        <Grid flexGrow={1} container p={1} gap={2} justifyContent={{ sm: "center", md: "flex-end" }}>
          <Grid size={{ xs: 8, md: 8 }} display={{ xs: "flex" }} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
            <Search onSearch={setSearchTerm} placeholder="Buscar en reparación..." />
          </Grid>
          {user?.permisos?.includes("enreparacion:create") && (
            <Grid size={{ xs: 1, md: 1 }} display={{ xs: "flex" }} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
              <Fab size="small" color="primary" aria-label="add" onClick={() => goTo("/admin/enreparacion/create")}>
                <AddIcon />
              </Fab>
            </Grid>
          )}
        </Grid>
        <Grid size={12}>
          <TableCustom<EnReparacionGetType> columns={columns} rows={filtered} />
        </Grid>
      </Grid>

      <ModalConfirm
        open={!!toDelete}
        title="Eliminar en reparación"
        text={`¿Seguro que deseas eliminar el registro "${toDelete?.descripcion}"?`}
        cancel={{ name: "Cancelar", cancel: () => setToDelete(null), color: "primary" }}
        confirm={{ name: isDeleting ? "Eliminando..." : "Eliminar", confirm: handleDelete, color: "error" }}
        onClose={() => setToDelete(null)}
      />
    </>
  );
};

export default EnReparacionList;
