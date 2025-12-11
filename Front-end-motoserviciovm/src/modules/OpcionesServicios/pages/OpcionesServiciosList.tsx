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
import type { OpcionServicioType } from "../../../types/opcionServicioType";
import { deleteOpcion, getOpciones } from "../../../services/opcionServicio.services";
import { successToast, errorToast } from "../../../utils/toast";
import ModalConfirm from "../../../components/utils/modals/ModalConfirm";

const OpcionesServiciosList = () => {
  const user = useAuthStore((state) => state.user);
  const [items, setItems] = useState<OpcionServicioType[]>([]);
  const [filtered, setFiltered] = useState<OpcionServicioType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [toDelete, setToDelete] = useState<OpcionServicioType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const goTo = useGoTo();

  const getList = async () => {
    try {
      setLoading(true);
      const response = await getOpciones();
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
        (it.opcion ?? "").toLowerCase().includes(lower) ||
        (it.descripcion ?? "").toLowerCase().includes(lower)
      );
    });
    setFiltered(filteredItems);
  }, [searchTerm, items]);

  const handleDelete = async () => {
    if (!toDelete || isDeleting) return;
    try {
      setIsDeleting(true);
      const response = await deleteOpcion(toDelete.id);
      successToast(`Opción eliminada: ${response?.opcion || toDelete.opcion}`);
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
        onClick: (row: OpcionServicioType) => goTo(`${row.id}/edit`),
        permiso: "opcioneservicios:edit",
      },
      {
        label: (
          <>
            <PiDeviceTabletFill /> <span className="ml-1.5">Detalle</span>
          </>
        ),
        onClick: (row: OpcionServicioType) => goTo(`${row.id}`),
        permiso: "opcioneservicios:detail",
      },
      {
        label: (
          <>
            <HiOutlineTrash /> <span className="ml-1.5">Eliminar</span>
          </>
        ),
        onClick: (row: OpcionServicioType) => setToDelete(row),
        permiso: "opcioneservicios:delete",
      },
    ];
    return all.filter((a) => user?.permisos?.includes(a.permiso));
  };

  const getColumns = (): Column<OpcionServicioType>[] => {
    const base: Column<OpcionServicioType>[] = [
      { id: "opcion", label: "Opción", minWidth: 200 },
      { id: "descripcion", label: "Descripción", minWidth: 200 },
      { id: "createdAt", label: "Creado el", minWidth: 150, format: (v) => (v ? new Date(v).toLocaleDateString() : "-") },
      { id: "updatedAt", label: "Actualizado el", minWidth: 150, format: (v) => (v ? new Date(v).toLocaleDateString() : "-") },
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
            <Search onSearch={setSearchTerm} placeholder="Buscar opciones de servicio..." />
          </Grid>
          {user?.permisos?.includes("opcioneservicios:create") && (
            <Grid size={{ xs: 1, md: 1 }} display={{ xs: "flex" }} flexGrow={1} alignItems={"center"} justifyContent={"end"}>
              <Fab size="small" color="primary" aria-label="add" onClick={() => goTo("/admin/opcionservicio/create")}>
                <AddIcon />
              </Fab>
            </Grid>
          )}
        </Grid>
        <Grid size={12}>
          <TableCustom<OpcionServicioType> columns={columns} rows={filtered} />
        </Grid>
      </Grid>

      <ModalConfirm
        open={!!toDelete}
        title="Eliminar opción de servicio"
        text={`¿Seguro que deseas eliminar la opción "${toDelete?.opcion}"? Esta acción desactivará el registro.`}
        cancel={{ name: "Cancelar", cancel: () => setToDelete(null), color: "primary" }}
        confirm={{ name: isDeleting ? "Eliminando..." : "Eliminar", confirm: handleDelete, color: "error" }}
        onClose={() => setToDelete(null)}
      />
    </>
  );
};

export default OpcionesServiciosList;
