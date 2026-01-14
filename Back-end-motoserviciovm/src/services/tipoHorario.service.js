import prisma from "../configs/db.config.js";

const getTiposHorario = async () => {
  const items = await prisma.tipoHorario.findMany({});
  return items;
};

export { getTiposHorario };
