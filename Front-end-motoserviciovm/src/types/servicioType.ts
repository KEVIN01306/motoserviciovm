import { estados } from "../utils/estados";

export type ServicioItemType = {
  id?: number;
  servicioId?: number;
  inventarioId: number;
  checked?: boolean;
  itemName?: string | null;
  itemDescripcion?: string | null;
  notas?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ServicioProductoClienteType = {
  id?: number;
  nombre: string;
  cantidad: number;
  servicioId?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ImagenMetaType = {
  descripcion?: string | null;
};

export type ImagenGetType = {
  id: number;
  imagen: string;
  descripcion?: string | null;
  servicioId?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type MotoGetType = {
  id: number;
  placa?: string;
  avatar?: string | null;
  modeloId?: number;
  estadoId?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type SucursalGetType = {
  id: number;
  nombre?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
  estadoId?: number;
};

export type ServicioType = {
  id?: number;
  descripcion: string;
  fechaEntrada?: string;
  fechaSalida?: string | null;
  total?: number;
  observaciones?: string | null;
  proximaFechaServicio?: string | null;
  descripcionProximoServicio?: string | null;
  sucursalId: number;
  motoId: number;
  clienteId?: number | null;
  mecanicoId: number;
  tipoServicioId: number;
  estadoId: number;
  servicioItems?: ServicioItemType[];
  productosCliente?: ServicioProductoClienteType[];
  imagenesMeta?: ImagenMetaType[];
};

export type ServicioGetType = ServicioType & {
  createdAt?: string;
  updatedAt?: string;
  imagen?: ImagenGetType[];
  servicioItems?: ServicioItemType[];
  productosCliente?: ServicioProductoClienteType[];
  moto?: MotoGetType;
  sucursal?: SucursalGetType;
};

export const ServicioInitialState: ServicioType = {
  descripcion: '',
  fechaEntrada: undefined,
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
  estadoId: estados().activo,
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
