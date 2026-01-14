import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getTipoServicioHorario, getTipoServicioHorarios, postTipoServicioHorario, putTipoServicioHorario, upsertTipoServicioHorarioDia } from "../services/tipoServicioHorario.service.js";
import { tipoServicioHorarioSchema } from "../zod/tipoServicioHorario.schema.js";
import { tipoServicioHorarioQuerySchema } from "../zod/tipoServicioHorario.query.schema.js";
import { tipoServicioHorarioDiaSchema } from "../zod/tipoServicioHorarioDia.schema.js";

const getTipoServicioHorariosHandler = async (req, res) => {
  try {
    const queryValidation = tipoServicioHorarioQuerySchema.safeParse(req.query);
    if (!queryValidation.success) {
      const errors = queryValidation.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      return res.status(400).json({ errors });
    }
    const { sucursalId, tipoHorarioId } = queryValidation.data;
    const filters = { sucursalId, tipoHorarioId };
    const items = await getTipoServicioHorarios(filters);
    return res.status(200).json(responseSuccesAll("tipo servicio horarios obtenidos", items));
  } catch (error) {
    console.error(error);
    let code = 500;
    let msg = "INTERNAL_SERVER_ERROR";
    if (error.code === "DATA_NOT_FOUND") { code = 404; msg = error.code; }
    return res.status(code).json(responseError(msg));
  }
};

const getTipoServicioHorarioHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await getTipoServicioHorario(Number(id));
    return res.status(200).json(responseSucces("tipo servicio horario obtenido", item));
  } catch (error) {
    console.error(error);
    let code = 500;
    let msg = "INTERNAL_SERVER_ERROR";
    if (error.code === "DATA_NOT_FOUND") { code = 404; msg = error.code; }
    return res.status(code).json(responseError(msg));
  }
};

const postTipoServicioHorarioHandler = async (req, res) => {
  try {
    const data = req.body;
    const parsed = tipoServicioHorarioSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      return res.status(400).json({ errors });
    }
    const created = await postTipoServicioHorario(parsed.data);
    return res.status(201).json(responseSucces("tipo servicio horario creado", created));
  } catch (error) {
    console.error(error);
    let code = 500;
    let msg = "INTERNAL_SERVER_ERROR";
    if (error.code === "CONFLICT") { code = 409; msg = error.code; }
    if (error.code === "DATA_NOT_FOUND") { code = 404; msg = error.code; }
    return res.status(code).json(responseError(msg));
  }
};

const putTipoServicioHorarioHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const parsed = tipoServicioHorarioSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      return res.status(400).json({ errors });
    }
    const updated = await putTipoServicioHorario(Number(id), parsed.data);
    return res.status(200).json(responseSucces("tipo servicio horario actualizado", updated));
  } catch (error) {
    console.error(error);
    let code = 500;
    let msg = "INTERNAL_SERVER_ERROR";
    if (error.code === "DATA_NOT_FOUND") { code = 404; msg = error.code; }
    return res.status(code).json(responseError(msg));
  }
};


// Independent upsert for a day's configuration (cantidadPersonal + hours)
const upsertTipoServicioHorarioDiaHandler = async (req, res) => {
  try {
    const { id } = req.params; // tipoServicioHorarioId
    const parsed = tipoServicioHorarioDiaSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      return res.status(400).json({ errors });
    }
    
    const result = await upsertTipoServicioHorarioDia(Number(id), parsed.data);
    return res.status(200).json(responseSucces("configuracion de dia guardada", result));
  } catch (error) {
    console.error(error);
    let code = 500;
    let msg = "INTERNAL_SERVER_ERROR";
    if (error.code === "DATA_NOT_FOUND") { code = 404; msg = error.code; }
    return res.status(code).json(responseError(msg));
  }
};

export {
  getTipoServicioHorariosHandler,
  getTipoServicioHorarioHandler,
  postTipoServicioHorarioHandler,
  putTipoServicioHorarioHandler,
    upsertTipoServicioHorarioDiaHandler,
};
