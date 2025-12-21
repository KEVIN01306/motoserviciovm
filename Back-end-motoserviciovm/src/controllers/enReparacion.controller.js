import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getEnReparaciones, getEnReparacion, postEnReparacion, putEnReparacion, putEnReparacionSalida } from "../services/enReparacion.service.js";
import enReparacionSchema from "../zod/enReparacion.schema.js";

const getEnReparacionesHandler = async (req, res) => {
  try {
    const items = await getEnReparaciones();
    res.status(200).json(responseSuccesAll('En Reparaciones obtenidos exitosamente', items));
  } catch (error) {
    console.error('Error retrieving En Reparaciones:', error);
    let errorCode = 500;
    let errorMessage = 'INTERNAL_SERVER_ERROR';
    switch (error.code) {
      case 'DATA_NOT_FOUND':
        errorCode = 404;
        errorMessage = error.code;
        break;
    }
    res.status(errorCode).json(responseError(errorMessage));
  }
};

const getEnReparacionHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await getEnReparacion(parseInt(id));
    res.status(200).json(responseSucces('En Reparacion obtenido exitosamente', item));
  } catch (error) {
    console.error('Error retrieving En Reparacion:', error);
    let errorCode = 500;
    let errorMessage = 'INTERNAL_SERVER_ERROR';
    switch (error.code) {
      case 'DATA_NOT_FOUND':
        errorCode = 404;
        errorMessage = error.code;
        break;
    }
    res.status(errorCode).json(responseError(errorMessage));
  }
};

const postEnReparacionHandler = async (req, res) => {
  try {
    const data = req.body;
    const validation = enReparacionSchema.safeParse(data);
    if (!validation.success) {
      const errorMessages = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
      return res.status(400).json(responseError(errorMessages));
    }

    const created = await postEnReparacion(validation.data);
    res.status(201).json(responseSucces('En Reparacion creado exitosamente', created));
  } catch (error) {
    console.error('Error creating En Reparacion:', error);
    let errorCode = 500;
    let errorMessage = 'INTERNAL_SERVER_ERROR';
    switch (error.code) {
        case 'MOTO_ALREADY_IN_REPARATION':
        errorCode = 409;
        errorMessage = error.code;
        break;
        case 'MOTO_IN_PARKING':
        errorCode = 409;
        errorMessage = error.code;
        break;
    }
    res.status(errorCode).json(responseError(errorMessage));
  }
};

const putEnReparacionHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const validation = enReparacionSchema.partial().safeParse(data);
    if (!validation.success) {
      const errorMessages = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
      return res.status(400).json(responseError(errorMessages));
    }

    const updated = await putEnReparacion(parseInt(id), validation.data);
    res.status(200).json(responseSucces('En Reparacion actualizado exitosamente', updated));
  } catch (error) {
    console.error('Error updating En Reparacion:', error);
    let errorCode = 500;
    let errorMessage = 'INTERNAL_SERVER_ERROR';
    switch (error.code) {
      case 'DATA_NOT_FOUND':
        errorCode = 404;
        errorMessage = error.code;
        break;
    }
    res.status(errorCode).json(responseError(errorMessage));
  }
};

const putEnReparacionSalidaHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const validation = enReparacionSchema.partial().safeParse(data);
    if (!validation.success) {
      const errorMessages = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
      return res.status(400).json(responseError(errorMessages));
    }
    const updated = await putEnReparacionSalida(parseInt(id), validation.data);
    res.status(200).json(responseSucces('En Reparacion salida registrado', updated));
  } catch (error) {
    console.error('Error updating En Reparacion salida:', error);
    let errorCode = 500;
    let errorMessage = 'INTERNAL_SERVER_ERROR';
    switch (error.code) {
      case 'DATA_NOT_FOUND':
        errorCode = 404;
        errorMessage = error.code;
        break;
    }
    res.status(errorCode).json(responseError(errorMessage));
  }
};

export {
  getEnReparacionesHandler,
  getEnReparacionHandler,
  postEnReparacionHandler,
  putEnReparacionHandler,
  putEnReparacionSalidaHandler,
};
