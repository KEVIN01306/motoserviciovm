import z from 'zod';
import { citaSchema } from '../zod/cita.schema';

export type CitaType = z.infer<typeof citaSchema>;

export type CitaGetType = CitaType & {
  id: number;
  createdAt: string;
  updatedAt: string;
  tipoServicio?: any;
  cliente?: any;
  estado?: any;
  moto?: any;
  sucursal?: any;
};

export const CitaInitialState: Partial<CitaType> = {
  descripcion: '',
  fechaCita: '',
  horaCita: '',
  nombreContacto: '',
  telefonoContacto: '',
  sucursalId: undefined,
  clienteId: undefined,
  dpiNit: '',
  tipoServicioId: undefined,
  motoId: undefined,
  placa: '',
  estadoId: 1,
};

export const mergeCitaDataWithDefaults = (apiData: Partial<CitaGetType>): Partial<CitaType> => {
  return {
    descripcion: apiData.descripcion ?? '',
    fechaCita: apiData.fechaCita ? apiData.fechaCita.split('T')[0] : '',
    horaCita: apiData.horaCita ?? '',
    nombreContacto: apiData.nombreContacto ?? '',
    telefonoContacto: apiData.telefonoContacto ?? '',
    sucursalId: apiData.sucursalId ?? undefined,
    clienteId: apiData.clienteId ?? undefined,
    dpiNit: apiData.dpiNit ?? '',
    tipoServicioId: apiData.tipoServicioId ?? undefined,
    motoId: apiData.motoId ?? undefined,
    placa: apiData.placa ?? '',
    estadoId: apiData.estadoId ?? 1,
  };
};
