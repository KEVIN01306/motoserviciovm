import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getDiasDisponibles, getDiaDisponible } from "../services/diasDisponibles.service.js";

const getDiasDisponiblesHandler = async (req, res) => {
  try {
    const items = await getDiasDisponibles();
    return res.status(200).json(responseSuccesAll("dias disponibles obtenidos", items));
  } catch (error) {
    console.error(error);
    let code = 500;
    let msg = "INTERNAL_SERVER_ERROR";
    if (error.code === "DATA_NOT_FOUND") { code = 404; msg = error.code; }
    return res.status(code).json(responseError(msg));
  }
};

const getDiaDisponibleHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await getDiaDisponible(Number(id));
    return res.status(200).json(responseSucces("dia disponible obtenido", item));
  } catch (error) {
    console.error(error);
    let code = 500;
    let msg = "INTERNAL_SERVER_ERROR";
    if (error.code === "DATA_NOT_FOUND") { code = 404; msg = error.code; }
    return res.status(code).json(responseError(msg));
  }
};

export { getDiasDisponiblesHandler, getDiaDisponibleHandler };
