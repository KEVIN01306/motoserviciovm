import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getRepuestosReparacion, getRepuestoReparacion, postRepuestoReparacion, putRepuestoReparacion, deleteRepuestoReparacion, patchCheckedRepuestos } from "../services/repuestosReparacion.service.js";
import { repuestoReparacionSchema } from "../zod/repuestosReparacion.schema.js";
import path, { parse } from 'path';

const directorio = '/uploads/repuestosReparacion/';

const getRepuestosHandler = async (req, res) => {
  try {
    const items = await getRepuestosReparacion();
    res.status(200).json(responseSuccesAll('Repuestos de reparacion obtenidos', items));
  } catch (error) {
    console.error('Error retrieving repuestos:', error);
    let code = 500;
    let msg = 'INTERNAL_SERVER_ERROR';
    if (error.code === 'DATA_NOT_FOUND') { code = 404; msg = error.code; }
    res.status(code).json(responseError(msg));
  }
};

const getRepuestoHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await getRepuestoReparacion(parseInt(id));
    res.status(200).json(responseSucces('Repuesto obtenido', item));
  } catch (error) {
    console.error('Error retrieving repuesto:', error);
    let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
    if (error.code === 'DATA_NOT_FOUND') { code = 404; msg = error.code; }
    res.status(code).json(responseError(msg));
  }
};

const postRepuestoHandler = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.imagen = directorio + req.file.filename;
    if (typeof data.estadoId !== 'undefined') data.estadoId = parseInt(data.estadoId);
    if (typeof data.cantidad !== 'undefined') data.cantidad = parseInt(data.cantidad);
    if (typeof data.reparacionId !== 'undefined') data.reparacionId = parseInt(data.reparacionId);
    if (typeof data.checked !== 'undefined') data.checked = data.checked === 'true' || data.checked === true;
    const validation = repuestoReparacionSchema.safeParse(data);
    if (!validation.success) {
      const msgs = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
      return res.status(400).json(responseError(msgs));
    }
    const created = await postRepuestoReparacion(validation.data);
    res.status(201).json(responseSucces('Repuesto creado', created));
  } catch (error) {
    console.error('Error creating repuesto:', error);
    let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
    if (error.code === 'DATA_NOT_FOUND') { code = 404; msg = error.code; }
    res.status(code).json(responseError(msg));
  }
};

const putRepuestoHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (req.file) data.imagen = directorio + req.file.filename;
    if (typeof data.estadoId !== 'undefined') data.estadoId = parseInt(data.estadoId);
    if (typeof data.cantidad !== 'undefined') data.cantidad = parseInt(data.cantidad);
    if (typeof data.reparacionId !== 'undefined') data.reparacionId = parseInt(data.reparacionId);
    if (typeof data.checked !== 'undefined') data.checked = data.checked === 'true' || data.checked === true;
    const validation = repuestoReparacionSchema.partial().safeParse(data);
    if (!validation.success) {
      const msgs = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
      return res.status(400).json(responseError(msgs));
    }
    const updated = await putRepuestoReparacion(parseInt(id), validation.data);
    res.status(200).json(responseSucces('Repuesto actualizado', updated));
  } catch (error) {
    console.error('Error updating repuesto:', error);
    let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
    if (error.code === 'DATA_NOT_FOUND') { code = 404; msg = error.code; }
    res.status(code).json(responseError(msg));
  }
};

const deleteRepuestoHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteRepuestoReparacion(parseInt(id));
    res.status(200).json(responseSucces('Repuesto eliminado (soft delete)', deleted));
  } catch (error) {
    console.error('Error deleting repuesto:', error);
    let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
    if (error.code === 'DATA_NOT_FOUND') { code = 404; msg = error.code; }
    res.status(code).json(responseError(msg));
  }
};


const patchCheckedRepuestosHandler = async (req, res) => {
  try { 
    const { id } = req.params;
    const { checked } = req.body;
    console.log('Checked value received:', checked, typeof checked, id);

    const updated = await patchCheckedRepuestos(parseInt(id),checked);
    res.status(200).json(responseSucces('Repuesto reparacion actualizado', updated));
  } catch (error) {
    console.error('Error updating repuesto reparacion checked status:', error);
    let code = 500; let msg = 'INTERNAL_SERVER_ERROR';
    if (error.code === 'DATA_NOT_FOUND') { code = 404; msg = error.code; }
    res.status(code).json(responseError(msg));
  }
};

export {
  getRepuestosHandler,
  getRepuestoHandler,
  postRepuestoHandler,
  putRepuestoHandler,
  deleteRepuestoHandler,
  patchCheckedRepuestosHandler
};
