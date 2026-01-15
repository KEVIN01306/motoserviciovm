import type { SucursalType } from './sucursalType';
import type { TipoHorarioType } from './tipoHorario';

// Tipo para las horas de un día
export interface TipoServicioHorarioDiaHora {
  id?: number;
  horaInicio: string;
  horaFin: string;
  tipoServicioHorarioDiaId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Tipo para días disponibles
export interface DiaDisponible {
  id: number;
  dia: string;
  createdAt: string;
  updatedAt: string;
}

// Tipo para la configuración de un día específico
export interface TipoServicioHorarioDia {
  id?: number;
  tipoServicioHorarioId?: number;
  diaId: number;
  cantidadPersonal: number;
  createdAt?: string;
  updatedAt?: string;
  dia?: DiaDisponible;
  horas: TipoServicioHorarioDiaHora[];
}

// Tipo principal para tipoServicioHorario
export interface TipoServicioHorario {
  id: number;
  createdAt: string;
  updatedAt: string;
  sucursalId: number;
  fechaVijencia: string;
  tipoHorarioId: number;
  tipoHorario?: TipoHorarioType;
  sucursal?: SucursalType;
  diasConfig: TipoServicioHorarioDia[];
}

// Tipo para crear un nuevo tipoServicioHorario
export interface CreateTipoServicioHorario {
  sucursalId: number;
  tipoHorarioId: number;
  fechaVijencia: string;
  diasConfig: Omit<TipoServicioHorarioDia, 'id' | 'tipoServicioHorarioId' | 'createdAt' | 'updatedAt' | 'dia'>[];
}

// Tipo para actualizar tipoServicioHorario
export interface UpdateTipoServicioHorario extends CreateTipoServicioHorario {
  id: number;
}

// Tipo para crear/actualizar un día específico
export interface UpsertTipoServicioHorarioDia {
  diaId: number;
  cantidadPersonal: number;
  horas: Omit<TipoServicioHorarioDiaHora, 'id' | 'tipoServicioHorarioDiaId' | 'createdAt' | 'updatedAt'>[];
}

// Tipo para los filtros del GET
export interface TipoServicioHorarioFilters {
  tipoHorarioId: number;
  sucursalId: number;
}
