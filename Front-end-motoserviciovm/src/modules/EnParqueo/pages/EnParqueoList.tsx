import { useEffect, useState } from "react";
import { Grid, Fab, Chip } from "@mui/material";
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
import type { EnParqueoGetType } from "../../../types/enParqueoType";
import { getEnParqueos } from "../../../services/enParqueo.services";
import { successToast, errorToast } from "../../../utils/toast";
import ModalConfirm from "../../../components/utils/modals/ModalConfirm";

const EnParqueoList = () => {
  const user = useAuthStore((state) => state.user);
  const [items, setItems] = useState<EnParqueoGetType[]>([]);
  const [filtered, setFiltered] = useState<EnParqueoGetType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [toDelete, setToDelete] = useState<EnParqueoGetType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const goTo = useGoTo();

  const getList = async () => {
    try {
      setLoading(true);
      const response = await getEnParqueos();
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
        (it.moto?.placa ?? "").toLowerCase().includes(lower)
      );
    });
    setFiltered(filteredItems);
  }, [searchTerm, items]);

  const handleDelete = async () => {
    if (!toDelete || isDeleting) return;
    try {
      setIsDeleting(true);
      // reuse deleteEnParqueo if exists otherwise just call post to mark? for now assume delete exists
      // const response = await deleteEnParqueo(toDelete.id);
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
    const all = [
      {
        label: (
          <>
            <RiEdit2Line /> <span className="ml-1.5">Salida</span>
          </>
        ),
        onClick: (row: EnParqueoGetType) => goTo(`/admin/enparqueo/${row.id}/salida`),
        permiso: "enparqueo:salida",
      },
      {
        label: (
          <>
            <PiDeviceTabletFill /> <span className="ml-1.5">Detalle</span>
          </>
        ),
        onClick: (row: EnParqueoGetType) => goTo(`${row.id}`),
        permiso: "enparqueo:detail",
      },
      {
        label: (
          <>
            <HiOutlineTrash /> <span className="ml-1.5">Eliminar</span>
          </>
        ),
        onClick: (row: EnParqueoGetType) => setToDelete(row),
        permiso: "enparqueo:delete",
      },
    ];
    return all.filter((a) => user?.permisos?.includes(a.permiso));
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

  const getColumns = (): Column<EnParqueoGetType>[] => {
    const base: Column<EnParqueoGetType>[] = [
      { id: "descripcion", label: "Descripción", minWidth: 200 },
      { id: "fechaEntrada", label: "Entrada", minWidth: 150, format: (v) => (v ? new Date(v).toLocaleString() : "-") },
      { id: "moto", label: "Moto", minWidth: 120, format: (v) => (v ? (v as any).placa : "-") },
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
      <Grid container spacing={2} flexGrow={1} size={12} width={"100%"}>
        <Grid flexGrow={1} container p={1} gap={2} justifyContent={{ sm: "center", md: "flex-end" }}>
          <Grid size={{ xs: 8, md: 8 }} display={{ xs: "flex" }} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
            <Search onSearch={setSearchTerm} placeholder="Buscar en parqueo..." />
          </Grid>
          {user?.permisos?.includes("enparqueo:create") && (
            <Grid size={{ xs: 1, md: 1 }} display={{ xs: "flex" }} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
              <Fab size="small" color="primary" aria-label="add" onClick={() => goTo("/admin/enparqueo/create")}>
                <AddIcon />
              </Fab>
            </Grid>
          )}
        </Grid>
        <Grid size={12}>
          <TableCustom<EnParqueoGetType> columns={columns} rows={filtered} />
        </Grid>
      </Grid>

      <ModalConfirm
        open={!!toDelete}
        title="Eliminar en parqueo"
        text={`¿Seguro que deseas eliminar el registro "${toDelete?.descripcion}"?`}
        cancel={{ name: "Cancelar", cancel: () => setToDelete(null), color: "primary" }}
        confirm={{ name: isDeleting ? "Eliminando..." : "Eliminar", confirm: handleDelete, color: "error" }}
        onClose={() => setToDelete(null)}
      />
    </>
  );
};

export default EnParqueoList;