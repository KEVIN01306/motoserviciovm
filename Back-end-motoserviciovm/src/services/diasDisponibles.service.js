import prisma from "../configs/db.config.js";

const getDiasDisponibles = async () => {
  const items = await prisma.diasDisponible.findMany({
    orderBy: { id: 'asc' }
  });
  return items;
};

const getDiaDisponible = async (id) => {
  const item = await prisma.diasDisponible.findUnique({ where: { id } });
  if (!item) {
    const error = new Error("DATA_NOT_FOUND");
    error.code = "DATA_NOT_FOUND";
    throw error;
  }
  return item;
};

export { getDiasDisponibles, getDiaDisponible };
