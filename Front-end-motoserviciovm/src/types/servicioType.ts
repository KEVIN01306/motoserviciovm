import type z from "zod";
import { estados } from "../utils/estados";
import { servicioItemSchema, servicioOpcionesTipoServicio, servicioProductoProximoSchema, servicioSchema } from "../zod/servicio.schema";
import { servicioProductoClienteSchema } from "../zod/servicio.schema";
import { imagenMetaSchema } from "../zod/servicio.schema";
import type { motoGetType } from "./motoType";
import type { SucursalType } from "./sucursalType";
import type { TipoServicioGetType } from "./tipoServicioType";
import type { VentaGetType } from "./ventaType";
import type { EstadoType } from "./estadoType";
import type { UserGetType } from "./userType";
import type { OpcionServicioType } from "./opcionServicioType";
import type { EnReparacionGetType } from "./enReparacionType";
import type { EnParqueoGetType } from "./enParqueoType";

export type ServicioItemType = z.infer<typeof servicioItemSchema>;

export type ServicioProductoClienteType = z.infer<typeof servicioProductoClienteSchema>;

export type ImagenMetaType = z.infer<typeof imagenMetaSchema>

export type ImagenGetType = ImagenMetaType & {
  id: number;
  imagen: string;
  servicioId?: number;
  createdAt?: string;
  updatedAt?: string;
};



export type ServicioType = Omit<z.infer<typeof servicioSchema>, 'firmaSalida'> & {
  firmaSalida: string | File | null;
  accionSalida?: string;
  totalSalidaAnticipado?: number;
  descripcionAccion?: string;
}

export type ServicioGetType = ServicioType & {
  moto?: motoGetType;
  sucursal?: SucursalType;
  tipoServicio?: TipoServicioGetType;
  ventas: VentaGetType[];
  estado: EstadoType;
  mecanico: UserGetType;
  cliente: UserGetType
  fechaEntrada: Date;
  fechaSalida: Date,
  descuentosServicio?: number;
  proximoServicioItems?: servicioProductoProximoType[];
  servicioOpcionesTipoServicio?: ProgresoItemType[];
  enReparaciones?: EnReparacionGetType[];
  enParqueos?: EnParqueoGetType[];
  subtotal?: number;
  imagen?: ImagenGetType[];
};


export type ProgresoItemType = z.infer<typeof servicioOpcionesTipoServicio>;

export type ProgresoItemGetType = ProgresoItemType & {
  opcionServicio: OpcionServicioType
};

export const ProgresoItemInitialState: ProgresoItemType = {
  servicioId: 0,
  opcionServicioId: 0,
  checked: false,
  observaciones: '',
};


export const mergeProgresoItemType = (apiData: Partial<ProgresoItemType>): Partial<ProgresoItemType> => {
  return {
    servicioId: apiData.servicioId ?? ProgresoItemInitialState.servicioId,
    opcionServicioId: apiData.opcionServicioId ?? ProgresoItemInitialState.opcionServicioId,
    checked: apiData.checked ?? ProgresoItemInitialState.checked,
    observaciones: apiData.observaciones ?? ProgresoItemInitialState.observaciones,
  };
};


export type servicioProductoProximoType = z.infer<typeof servicioProductoProximoSchema>;

export const ServicioProductoProximoInitialState: servicioProductoProximoType = {
  nombre: ''
};

// Payload para la firma de salida (endpoint dedicado)
export type ServicioSalidaPayloadType = Pick<
  ServicioType,
  'total' | 'observaciones' | 'proximaFechaServicio' | 'descripcionProximoServicio' |'kilometrajeProximoServicio'
> & {
  firmaSalida: File;
  proximoServicioItems?: servicioProductoProximoType[];
  accionSalida?: string;
  totalSalidaAnticipado?: number;
  descripcionAccion?: string;
};

export const ServicioInitialState: ServicioType = {
  descripcion: '',
  kilometraje: 0,
  firmaEntrada: '',
  firmaSalida: null,
  total: 0,
  observaciones: "",
  proximaFechaServicio: undefined,
  descripcionProximoServicio: "",
  sucursalId: 0,
  motoId: 0,
  clienteId: null,
  mecanicoId: 0,
  tipoServicioId: 0,
  servicioItems: [],
  productosCliente: [],
  imagenesMeta: [],
  estadoId: estados().enServicio,
  kilometrajeProximoServicio: 0,
  opcionesServicioManual: [],
  dpiClienteMoto: null,
  nombreClienteMoto: null,
};

export const ServicioItemInitialState: ServicioItemType = {
  inventarioId: 0,
  checked: false,
  itemName: "",
  itemDescripcion: "",
  notas: "",
};

export const ServicioProductoClienteInitialState: ServicioProductoClienteType = {
  nombre: '',
  cantidad: 1,
};

export const ImagenMetaInitialState: ImagenMetaType = {
  descripcion: "",
};

export const mergeServicioDataWithDefaults = (apiData: Partial<ServicioType>): Partial<ServicioType> => {
  return {
    descripcion: apiData.descripcion ?? ServicioInitialState.descripcion,
    total: apiData.total ?? ServicioInitialState.total,
    observaciones: apiData.observaciones ?? ServicioInitialState.observaciones,
    proximaFechaServicio: apiData.proximaFechaServicio ?? ServicioInitialState.proximaFechaServicio,
    descripcionProximoServicio: apiData.descripcionProximoServicio ?? ServicioInitialState.descripcionProximoServicio,
    sucursalId: apiData.sucursalId ?? ServicioInitialState.sucursalId,
    motoId: apiData.motoId ?? ServicioInitialState.motoId,
    clienteId: apiData.clienteId ?? ServicioInitialState.clienteId,
    mecanicoId: apiData.mecanicoId ?? ServicioInitialState.mecanicoId,
    tipoServicioId: apiData.tipoServicioId ?? ServicioInitialState.tipoServicioId,
    estadoId: apiData.estadoId ?? ServicioInitialState.estadoId,
    servicioItems: apiData.servicioItems ?? ServicioInitialState.servicioItems,
    productosCliente: apiData.productosCliente ?? ServicioInitialState.productosCliente,
    imagenesMeta: apiData.imagenesMeta ?? ServicioInitialState.imagenesMeta,
    kilometraje: apiData.kilometraje ?? ServicioInitialState.kilometraje,
    opcionesServicioManual: apiData.opcionesServicioManual ?? ServicioInitialState.opcionesServicioManual,
    nombreClienteMoto: apiData.nombreClienteMoto ?? ServicioInitialState.nombreClienteMoto,
    dpiClienteMoto: apiData.dpiClienteMoto ?? ServicioInitialState.dpiClienteMoto,
  };
};

export const mergeServicioItemDataWithDefaults = (apiData: Partial<ServicioItemType>): Partial<ServicioItemType> => {
  return {
    inventarioId: apiData.inventarioId ?? ServicioItemInitialState.inventarioId,
    checked: apiData.checked ?? ServicioItemInitialState.checked,
    itemName: apiData.itemName ?? ServicioItemInitialState.itemName,
    itemDescripcion: apiData.itemDescripcion ?? ServicioItemInitialState.itemDescripcion,
    notas: apiData.notas ?? ServicioItemInitialState.notas,
  };
};

export const mergeServicioProductoClienteWithDefaults = (apiData: Partial<ServicioProductoClienteType>): Partial<ServicioProductoClienteType> => {
  return {
    nombre: apiData.nombre ?? ServicioProductoClienteInitialState.nombre,
    cantidad: apiData.cantidad ?? ServicioProductoClienteInitialState.cantidad,
  };
};

export const mergeImagenMetaDataWithDefaults = (apiData: Partial<ImagenMetaType>): Partial<ImagenMetaType> => {
  return {
    descripcion: apiData.descripcion ?? ImagenMetaInitialState.descripcion,
  };
};

export default {};
