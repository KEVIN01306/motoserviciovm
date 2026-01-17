import prisma from "../configs/db.config.js";

const includeAll = {
  tipoHorario: true,
  sucursal: true,
  diasConfig: {
    include: {
      dia: true,
      horas: true,
    },
  },
};

const getTipoServicioHorarios = async (filters = {}) => {
  const where = {};
  if (filters.sucursalId && Number.isInteger(filters.sucursalId)) {
    where.sucursalId = filters.sucursalId;
  }
  if (filters.tipoHorarioId && Number.isInteger(filters.tipoHorarioId)) {
    where.tipoHorarioId = filters.tipoHorarioId;
  }
  const items = await prisma.tipoServicioHorario.findMany({ where, include: includeAll });
  return items;
};

const getTipoServicioHorario = async (id) => {
  const item = await prisma.tipoServicioHorario.findUnique({ where: { id }, include: includeAll });
  if (!item) {
    const error = new Error("DATA_NOT_FOUND");
    error.code = "DATA_NOT_FOUND";
    throw error;
  }
  return item;
};

const postTipoServicioHorario = async (data) => {
  const { diasConfig = [], ...core } = data;

  const created = await prisma.$transaction(async (tx) => {
    const createdTSH = await tx.tipoServicioHorario.create({ data: { ...core } });

    for (const d of diasConfig) {
      const pivot = await tx.tipoServicioHorarioDia.create({
        data: {
          tipoServicioHorarioId: createdTSH.id,
          diaId: d.diaId,
          cantidadPersonal: d.cantidadPersonal,
        },
      });

      if (d.horas && d.horas.length > 0) {
        await tx.horasDisponible.createMany({
          data: d.horas.map((h) => ({
            horaInicio: h.horaInicio,
            horaFin: h.horaFin,
            tipoServicioHorarioDiaId: pivot.id,
          })),
        });
      }
    }

    return createdTSH;
  });
  
  const full = await prisma.tipoServicioHorario.findUnique({ where: { id: created.id }, include: includeAll });
  return full;
};

const putTipoServicioHorario = async (id, data) => {
  const existing = await prisma.tipoServicioHorario.findUnique({ where: { id } });
  if (!existing) {
    const error = new Error("DATA_NOT_FOUND");
    error.code = "DATA_NOT_FOUND";
    throw error;
  }

  const { diasConfig = [], ...core } = data;

  await prisma.$transaction(async (tx) => {
    await tx.tipoServicioHorario.update({ where: { id }, data: { ...core } });

    const existingPivots = await tx.tipoServicioHorarioDia.findMany({
      where: { tipoServicioHorarioId: id },
      select: { id: true },
    });
    const pivotIds = existingPivots.map((p) => p.id);

    if (pivotIds.length > 0) {
      await tx.horasDisponible.deleteMany({ where: { tipoServicioHorarioDiaId: { in: pivotIds } } });
      await tx.tipoServicioHorarioDia.deleteMany({ where: { id: { in: pivotIds } } });
    }

    for (const d of diasConfig) {
      const pivot = await tx.tipoServicioHorarioDia.create({
        data: {
          tipoServicioHorarioId: id,
          diaId: d.diaId,
          cantidadPersonal: d.cantidadPersonal,
        },
      });

      if (d.horas && d.horas.length > 0) {
        await tx.horasDisponible.createMany({
          data: d.horas.map((h) => ({
            horaInicio: h.horaInicio,
            horaFin: h.horaFin,
            tipoServicioHorarioDiaId: pivot.id,
          })),
        });
      }
    }
  });

  const full = await prisma.tipoServicioHorario.findUnique({ where: { id }, include: includeAll });
  return full;
};

const upsertTipoServicioHorarioDia = async (tipoServicioHorarioId, diaConfig) => {
  const { diaId, cantidadPersonal, horas = [] } = diaConfig;

  const result = await prisma.$transaction(async (tx) => {
    let pivot = await tx.tipoServicioHorarioDia.findUnique({
      where: { tipoServicioHorarioId_diaId: { tipoServicioHorarioId, diaId } },
    });

    if (!pivot) {
      pivot = await tx.tipoServicioHorarioDia.create({
        data: { tipoServicioHorarioId, diaId, cantidadPersonal },
      });
    } else {
      pivot = await tx.tipoServicioHorarioDia.update({
        where: { id: pivot.id },
        data: { cantidadPersonal },
      });
      await tx.horasDisponible.deleteMany({ where: { tipoServicioHorarioDiaId: pivot.id } });
    }

    if (horas.length > 0) {
      await tx.horasDisponible.createMany({
        data: horas.map((h) => ({
          horaInicio: h.horaInicio,
          horaFin: h.horaFin,
          tipoServicioHorarioDiaId: pivot.id,
        })),
      });
    }

    return pivot.id;
  });

  const full = await prisma.tipoServicioHorarioDia.findUnique({
    where: { id: result },
    include: { dia: true, horas: true },
  });
  return full;
};

export {
  getTipoServicioHorarios,
  getTipoServicioHorario,
  postTipoServicioHorario,
  putTipoServicioHorario,
  upsertTipoServicioHorarioDia,
};
