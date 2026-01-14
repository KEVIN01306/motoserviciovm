import { responseError, responseSuccesAll } from "../helpers/response.helper.js";
import { getTiposHorario } from "../services/tipoHorario.service.js";

const getTiposHorarioHandler = async (req, res) => {
  try {
    const items = await getTiposHorario();
    return res.status(200).json(responseSuccesAll("tipos de horario obtenidos exitosamente", items));
  } catch (error) {
    console.error(error);
    let errorCode = 500;
    let errorMessage = "INTERNAL_SERVER_ERROR";
    switch (error.code) {
      case "DATA_NOT_FOUND":
        errorCode = 404;
        errorMessage = error.code;
        break;
    }
    return res.status(errorCode).json(responseError(errorMessage));
  }
};

export { getTiposHorarioHandler };
