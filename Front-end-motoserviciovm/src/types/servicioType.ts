import type z from "zod";
import { estados } from "../utils/estados";
import { servicioItemSchema, servicioSchema } from "../zod/servicio.schema";
import { servicioProductoClienteSchema } from "../zod/servicio.schema";
import { imagenMetaSchema } from "../zod/servicio.schema";
import type { motoGetType } from "./motoType";
import type { SucursalType } from "./sucursalType";
import type { TipoServicioGetType } from "./tipoServicioType";
import type { VentaGetType } from "./ventaType";

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

export type ServicioType = z.infer<typeof servicioSchema>

export type ServicioGetType = ServicioType & {
  moto?: motoGetType;
  sucursal?: SucursalType;
  tipoServicio?: TipoServicioGetType
  ventas: VentaGetType[]
};

export const ServicioInitialState: ServicioType = {
  descripcion: '',
  fechaEntrada: new Date(),
  fechaSalida: null,
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
  estadoId: estados().enEspera,
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
    fechaEntrada: apiData.fechaEntrada ?? ServicioInitialState.fechaEntrada,
    fechaSalida: apiData.fechaSalida ?? ServicioInitialState.fechaSalida,
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
