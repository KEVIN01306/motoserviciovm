import prisma from "../configs/db.config.js";
import { estados } from "../utils/estados.js";
import { deleteImage } from "../utils/fileUtils.js";

const getRepuestosReparacion = async () => {
  const items = await prisma.repuestosReparacion.findMany({
    where: { estadoId: { not: estados().inactivo } },
    orderBy: { id: 'asc' },
    include: { reparacion: true, estado: true },
  });
  if (!items) {
    const error = new Error('DATA_NOT_FOUND');
    error.code = 'DATA_NOT_FOUND';
    throw error;
  }
  return items;
};

const getRepuestoReparacion = async (id) => {
  const item = await prisma.repuestosReparacion.findUnique({
    where: { id, estadoId: { not: estados().inactivo } },
    include: { reparacion: true, estado: true },
  });
  if (!item) {
    const error = new Error('DATA_NOT_FOUND');
    error.code = 'DATA_NOT_FOUND';
    throw error;
  }
  return item;
};

const postRepuestoReparacion = async (data) => {
  // ensure reparacion exists
  const reparacion = await prisma.enReparacion.findUnique({ where: { id: data.reparacionId } });
  if (!reparacion) {
    const error = new Error('DATA_NOT_FOUND');
    error.code = 'DATA_NOT_FOUND';
    throw error;
  }

  const created = await prisma.repuestosReparacion.create({ data, include: { reparacion: true, estado: true } });
  return created;
};

const putRepuestoReparacion = async (id, data) => {
  const existing = await prisma.repuestosReparacion.findUnique({ where: { id } });
  if (!existing) {
    const error = new Error('DATA_NOT_FOUND');
    error.code = 'DATA_NOT_FOUND';
    throw error;
  }

  // if reparacionId provided, ensure target reparacion exists
  if (typeof data.reparacionId !== 'undefined') {
    const reparacion = await prisma.enReparacion.findUnique({ where: { id: data.reparacionId } });
    if (!reparacion) {
      const error = new Error('DATA_NOT_FOUND');
      error.code = 'DATA_NOT_FOUND';
      throw error;
    }
  }
  // handle image replacement similar to productos: if imagen changed, delete old image
  const oldImagen = existing.imagen;
  if (data.imagen && data.imagen !== oldImagen) {
    try {
      await deleteImage(oldImagen);
    } catch (err) {
      console.error('Error deleting old repuesto image:', err);
    }
  }

  const updated = await prisma.repuestosReparacion.update({ where: { id }, data, include: { reparacion: true, estado: true } });
  return updated;
};

const deleteRepuestoReparacion = async (id) => {
  const existing = await prisma.repuestosReparacion.findUnique({ where: { id } });
  if (!existing) {
    const error = new Error('DATA_NOT_FOUND');
    error.code = 'DATA_NOT_FOUND';
    throw error;
  }
  const deleted = await prisma.repuestosReparacion.delete({ where: { id } });
  return deleted;
};


const patchCheckedRepuestos = async (repuestosReparacionId, checked) => {
    const reparacion = await prisma.repuestosReparacion.findFirst({
        where: { id: repuestosReparacionId },
    });

    if (!reparacion) {
        const error = new Error('DATA_NOT_FOUND');
        error.code = 'DATA_NOT_FOUND';
        throw error;
    }

    const updatedReparacion = await prisma.repuestosReparacion.update({
        where: { id: repuestosReparacionId },
        data: { checked: checked },
    });

    return updatedReparacion;
}



export {
  getRepuestosReparacion,
  getRepuestoReparacion,
  postRepuestoReparacion,
  putRepuestoReparacion,
  deleteRepuestoReparacion,
  patchCheckedRepuestos
};
