import prisma from "../configs/db.config.js";

const includeAll = {
  tipoServicio: true,
  cliente: true,
  estado: true,
  moto: true,
  sucursal: true,
};

const getCitas = async (filters = {}) => {
  const where = {};
  
  if (filters.sucursalId) {
    where.sucursalId = filters.sucursalId;
  }
  if (filters.estadoId) {
    where.estadoId = filters.estadoId;
  }
  if (filters.clienteId) {
    where.clienteId = filters.clienteId;
  }
  if (filters.tipoServicioId) {
    where.tipoServicioId = filters.tipoServicioId;
  }

  const citas = await prisma.cita.findMany({
    where,
    include: includeAll,
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

export { getCitas, getCita, postCita, putCita, deleteCita };
