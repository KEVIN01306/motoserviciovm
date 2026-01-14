import TableCustom from '../../../components/Table/Table';
import type { ServicioGetType } from '../../../types/servicioType';
import type { Column } from '../../../components/Table/Table';
import { Chip } from '@mui/material';
import { estados } from '../../../utils/estados';
import { formatDate } from '../../../utils/formatDate';
import type { EstadoType } from '../../../types/estadoType';
import { PiDeviceTabletFill, PiUserCheckBold } from 'react-icons/pi';
import { MdBikeScooter } from 'react-icons/md';
import { FaBarsProgress } from "react-icons/fa6";
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { useGoTo } from '../../../hooks/useGoTo';
import { useAuthStore } from '../../../store/useAuthStore';

const chipColorByEstado = (id: number) => {
    switch (id) {
        case estados().enEspera:
            return 'warning';
        case estados().confirmado:
            return 'success';
        case estados().cancelado:
            return 'error';
        default:
            return 'primary';
    }
};

const getTableActions = () => {
    const user = useAuthStore.getState().user;
    const goTo = useGoTo();
    return (row: ServicioGetType) => {
        const isEnEspera = row.estadoId === estados().enEspera;
        const actions: { label: any; onClick: (r: ServicioGetType) => void; permiso: string }[] = [];

        
        if (user?.permisos.includes('servicios:salidaDetalle')) {
            actions.push({ label: (<><MdBikeScooter /><span className="ml-1.5">Detalle Salida</span></>), onClick: (r) => goTo(`/admin/servicios/${r.id}/salidaDetalle`), permiso: 'servicios:salidaDetalle' });
        }
        
        if (user?.permisos.includes('servicios:repuestos') && row.estadoId == estados().enReparacion) {
            actions.push({ label: (<><PiDeviceTabletFill /><span className="ml-1.5">Repuestos</span></>), onClick: (r) => goTo(`/admin/servicios/${r.id}/repuestos`), permiso: 'servicios:detail' });
            return actions;
        }
        

        return actions.filter(a => user?.permisos.includes(a.permiso));
    };
};

const columns = (): Column<ServicioGetType>[] => {
    const base: Column<ServicioGetType>[] = [
        { id: 'id', label: 'Codigo', minWidth: 60 },
        { id: 'descripcion', label: 'Descripción', minWidth: 220 },
        { id: 'moto', label: 'Moto', minWidth: 120, format: (v) => v?.placa ?? '-' },
        { id: 'estado', label: 'Estado', minWidth: 100, format: (v: EstadoType) => <Chip variant='outlined' label={v?.estado ?? ''} color={chipColorByEstado(v?.id ?? 0)} /> },
        { id: 'createdAt', label: 'Creado', minWidth: 160, format: (v) => formatDate(v as any) },
    ];
    const actions = getTableActions();
    base.push({ id: 'actions', label: 'Acciones', actions });
    return base;
};

const ServiciosHistorialTable = ({ rows }: { rows: ServicioGetType[] }) => {
    return <TableCustom columns={columns()} rows={rows} />;
};

export default ServiciosHistorialTable;
