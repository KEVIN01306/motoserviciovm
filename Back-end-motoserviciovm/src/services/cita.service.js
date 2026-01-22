import prisma from "../configs/db.config.js";

const includeAll = {
  tipoServicio: true,
  cliente: true,
  estado: true,
  moto: true,
  sucursal: true,
};


const includeBasic = {
  tipoServicio: { select: { id: true, tipo: true, tipoHorarioId: true } },
  cliente: { select: { id: true, primerNombre: true, primerApellido: true } },
  estado: { select: { id: true, estado: true } },
  moto: { select: { id: true, placa: true } },
  sucursal: { select: { id: true, nombre: true } },
};

const getCitas = async (filters = {}) => {
  const where = {};

  if (filters.sucursalId) {
    where.sucursalId = filters.sucursalId;
  }
  if (filters.estadoIds && Array.isArray(filters.estadoIds) && filters.estadoIds.length > 0) {
    where.estadoId = { in: filters.estadoIds };
  } else if (filters.estadoId) {
    where.estadoId = filters.estadoId;
  }
  if (filters.clienteId) {
    where.clienteId = filters.clienteId;
  }
  if (filters.tipoServicioId) {
    where.tipoServicioId = filters.tipoServicioId;
  }

  // Filtro por rango de fechas de creación
  if (filters.fechaInicio || filters.fechaFin) {
    where.createdAt = {};
    if (filters.fechaInicio) {
      where.createdAt.gte = new Date(filters.fechaInicio);
    }
    if (filters.fechaFin) {
      where.createdAt.lte = new Date(filters.fechaFin);
    }
  }

  // Filtro por fecha específica de cita
  if (filters.fechaCita) {
    const fechaCitaDate = new Date(filters.fechaCita);
    const inicioDia = new Date(fechaCitaDate.setHours(0, 0, 0, 0));
    const finDia = new Date(fechaCitaDate.setHours(23, 59, 59, 999));
    where.fechaCita = {
      gte: inicioDia,
      lte: finDia
    };
  }

  const citas = await prisma.cita.findMany({
    where,
    include: includeBasic,
    orderBy: { fechaCita: 'desc' },
  });
  return citas;
};

const getCita = async (id) => {
  const cita = await prisma.cita.findUnique({
    where: { id },
    include: includeAll,
  });
  if (!cita) {
    const error = new Error('DATA_NOT_FOUND');
    error.code = 'DATA_NOT_FOUND';
    throw error;
  }
  return cita;
};

const postCita = async (data) => {
  const { sucursalId, clienteId, tipoServicioId, motoId, estadoId, ...base } = data;

  const createData = {
    ...base,
    sucursal: { connect: { id: sucursalId } },
    tipoServicio: { connect: { id: tipoServicioId } },
    estado: { connect: { id: estadoId } },
  };

  if (clienteId) {
    createData.cliente = { connect: { id: clienteId } };
  }
  if (motoId) {
    createData.moto = { connect: { id: motoId } };
  }

  const newCita = await prisma.cita.create({
    data: createData,
    include: includeAll,
  });
  return newCita;
};

const putCita = async (id, data) => {
  const cita = await prisma.cita.findUnique({
    where: { id },
  });
  if (!cita) {
    const error = new Error('DATA_NOT_FOUND');
    error.code = 'DATA_NOT_FOUND';
    throw error;
  }

  const { sucursalId, clienteId, tipoServicioId, motoId, estadoId, ...base } = data;

  const updateData = { ...base };

  if (sucursalId !== undefined) {
    updateData.sucursal = { connect: { id: sucursalId } };
  }
  if (tipoServicioId !== undefined) {
    updateData.tipoServicio = { connect: { id: tipoServicioId } };
  }
  if (estadoId !== undefined) {
    updateData.estado = { connect: { id: estadoId } };
  }
  if (clienteId !== undefined) {
    updateData.cliente = clienteId ? { connect: { id: clienteId } } : { disconnect: true };
  }
  if (motoId !== undefined) {
    updateData.moto = motoId ? { connect: { id: motoId } } : { disconnect: true };
  }

  const updatedCita = await prisma.cita.update({
    where: { id },
    data: updateData,
    include: includeAll,
  });
  return updatedCita;
};

const deleteCita = async (id) => {
  const cita = await prisma.cita.findUnique({
    where: { id },
  });
  if (!cita) {
    const error = new Error('DATA_NOT_FOUND');
    error.code = 'DATA_NOT_FOUND';
    throw error;
  }
  await prisma.cita.delete({
    where: { id },
  });
};


const patchEstado = async (id, estadoId) => {
  const cita = await prisma.cita.findUnique({
    where: { id },
  });
  if (!cita) {
    const error = new Error('DATA_NOT_FOUND');
    error.code = 'DATA_NOT_FOUND';
    throw error;
  }
  const updatedCita = await prisma.cita.update({
    where: { id },
    data: { estadoId },
    include: includeAll,
  });
  return updatedCita;
}

export { getCitas, getCita, postCita, putCita, deleteCita, patchEstado };
