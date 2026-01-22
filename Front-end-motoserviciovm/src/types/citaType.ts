import z from 'zod';
import { citaSchema } from '../zod/cita.schema';
import { estados } from '../utils/estados';

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
  descripcion: null,
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
  estadoId: estados().enEspera,
};

export const mergeCitaDataWithDefaults = (apiData: Partial<CitaGetType>): Partial<CitaType> => {
  return {
    descripcion: apiData.descripcion ?? CitaInitialState.descripcion,
    fechaCita: apiData.fechaCita ? apiData.fechaCita.split('T')[0] : CitaInitialState.fechaCita,
    horaCita: apiData.horaCita ?? CitaInitialState.horaCita,
    nombreContacto: apiData.nombreContacto ?? CitaInitialState.nombreContacto,
    telefonoContacto: apiData.telefonoContacto ?? CitaInitialState.telefonoContacto,
    sucursalId: apiData.sucursalId ?? CitaInitialState.sucursalId,
    clienteId: apiData.clienteId ?? CitaInitialState.clienteId,
    dpiNit: apiData.dpiNit ?? CitaInitialState.dpiNit,
    tipoServicioId: apiData.tipoServicioId ?? CitaInitialState.tipoServicioId,
    motoId: apiData.motoId ?? CitaInitialState.motoId,
    placa: apiData.placa ?? CitaInitialState.placa,
    estadoId: apiData.estadoId ?? CitaInitialState.estadoId,
  };
};
