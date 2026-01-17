import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getCitas, getCita, postCita, putCita, deleteCita } from "../services/cita.service.js";
import { citaSchema } from "../zod/cita.schema.js";
import { citaQuerySchema } from "../zod/cita.query.schema.js";

const getCitasHandler = async (req, res) => {
  try {
    const queryValidation = citaQuerySchema.safeParse(req.query);
    if (!queryValidation.success) {
      const errors = queryValidation.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      return res.status(400).json({ errors });
    }
    
    const { sucursalId, estadoId, clienteId, tipoServicioId } = queryValidation.data;
    const filters = { sucursalId, estadoId, clienteId, tipoServicioId };
    
    const citas = await getCitas(filters);
    res.status(200).json(responseSuccesAll("citas obtenidas exitosamente", citas));
  } catch (error) {
    console.error(error);
    let errorCode = 500;
    let errorMessage = 'INTERNAL_SERVER_ERROR';
    if (error.code === 'DATA_NOT_FOUND') {
      errorCode = 404;
      errorMessage = error.code;
    }
    res.status(errorCode).json(responseError(errorMessage));
  }
};

const getCitaHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const cita = await getCita(parseInt(id));
    res.status(200).json(responseSucces("cita obtenida exitosamente", cita));
  } catch (error) {
    console.error(error);
    let errorCode = 500;
    let errorMessage = 'INTERNAL_SERVER_ERROR';
    if (error.code === 'DATA_NOT_FOUND') {
      errorCode = 404;
      errorMessage = error.code;
    }
    res.status(errorCode).json(responseError(errorMessage));
  }
};

const postCitaHandler = async (req, res) => {
  try {
    const data = req.body;
    const validationResult = citaSchema.safeParse(data);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      return res.status(400).json({ errors });
    }

    const { data: value } = validationResult;
    const newCita = await postCita(value);
    res.status(201).json(responseSucces("cita creada exitosamente", newCita));
  } catch (error) {
    console.error(error);
    let errorCode = 500;
    let errorMessage = 'INTERNAL_SERVER_ERROR';
    if (error.code === 'DATA_NOT_FOUND') {
      errorCode = 404;
      errorMessage = error.code;
    }
    if (error.code === 'CONFLICT') {
      errorCode = 409;
      errorMessage = error.code;
    }
    res.status(errorCode).json(responseError(errorMessage));
  }
};

const putCitaHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const validationResult = citaSchema.safeParse(data);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      return res.status(400).json({ errors });
    }

    const { data: value } = validationResult;
    const updatedCita = await putCita(parseInt(id), value);
    res.status(200).json(responseSucces("cita actualizada exitosamente", updatedCita));
  } catch (error) {
    console.error(error);
    let errorCode = 500;
    let errorMessage = 'INTERNAL_SERVER_ERROR';
    if (error.code === 'DATA_NOT_FOUND') {
      errorCode = 404;
      errorMessage = error.code;
    }
    res.status(errorCode).json(responseError(errorMessage));
  }
};

const deleteCitaHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCita(parseInt(id));
    res.status(200).json(responseSucces("cita eliminada exitosamente", null));
  } catch (error) {
    console.error(error);
    let errorCode = 500;
    let errorMessage = 'INTERNAL_SERVER_ERROR';
    if (error.code === 'DATA_NOT_FOUND') {
      errorCode = 404;
      errorMessage = error.code;
    }
    res.status(errorCode).json(responseError(errorMessage));
  }
};

export { getCitasHandler, getCitaHandler, postCitaHandler, putCitaHandler, deleteCitaHandler };
