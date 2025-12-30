import { responseError, responseSucces, responseSuccesAll } from "../helpers/response.helper.js";
import { getIngresosEgresos, getIngresoEgreso, postIngresoEgreso, putIngresoEgreso, deleteIngresoEgreso, finalizarIngresoEgreso,cancelarIngresoEgreso,  } from "../services/ingresosEgresos.service.js";
import { ingresosEgresosSchema } from "../zod/ingresosEgresos.schema.js";

const getIngresosEgresosHandler = async (req, res) => {
    try {
        const ingresosEgresos = await getIngresosEgresos();
        res.status(200).json(responseSuccesAll("Ingresos/Egresos obtenidos exitosamente", ingresosEgresos));
    } catch (error) {
        console.error(error);
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

const getIngresoEgresoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const ingresoEgreso = await getIngresoEgreso(parseInt(id));
        res.status(200).json(responseSuccesAll("Ingreso/Egreso obtenido exitosamente", ingresoEgreso));
    } catch (error) {
        console.error(error);
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

const postIngresoEgresoHandler = async (req, res) => {
    console.log("POST INGRESO/EGRESO HANDLER", req.body);
    try {
        const data = req.body;

        const validationResult = ingresosEgresosSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => 
                `${issue.path.join('.')}: ${issue.message}`
            );
            return res.status(400).json({ errors: errorMessages });
        }

        const { data: value } = validationResult;

        const newIngresoEgreso = await postIngresoEgreso(value);
        res.status(201).json(responseSucces("Ingreso/Egreso creado exitosamente", newIngresoEgreso));
    } catch (error) {
        console.error(error);
        let errorCode = 500;
        let errorMessage = 'INTERNAL_SERVER_ERROR';
        switch (error.code) {
            case 'CONFLICT':
                errorCode = 409;
                errorMessage = error.code;
                break;
        }
        res.status(errorCode).json(responseError(errorMessage));
    }
};

const putIngresoEgresoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const validationResult = ingresosEgresosSchema.safeParse(data);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => 
                `${issue.path.join('.')}: ${issue.message}`
            );
            return res.status(400).json({ errors: errorMessages });
        }

        const { data: value } = validationResult;

        const updatedIngresoEgreso = await putIngresoEgreso(parseInt(id), value);
        res.status(200).json(responseSucces("Ingreso/Egreso actualizado exitosamente", updatedIngresoEgreso));
    } catch (error) {
        console.error(error);
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

const deleteIngresoEgresoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteIngresoEgreso(parseInt(id));
        res.status(200).json(responseSucces("Ingreso/Egreso deshabilitado exitosamente", null));
    } catch (error) {
        console.error(error);
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

const finalizarIngresoEgresoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const finalizedIngresoEgreso = await finalizarIngresoEgreso(parseInt(id));
        res.status(200).json(responseSucces("Ingreso/Egreso finalizado exitosamente", finalizedIngresoEgreso));
    } catch (error) {
        console.error(error);
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

const cancelarIngresoEgresoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const canceledIngresoEgreso = await cancelarIngresoEgreso(parseInt(id));
        res.status(200).json(responseSucces("Ingreso/Egreso cancelado exitosamente", canceledIngresoEgreso));
    } catch (error) {
        console.error(error);
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
    getIngresosEgresosHandler,
    getIngresoEgresoHandler,
    postIngresoEgresoHandler,
    putIngresoEgresoHandler,
    deleteIngresoEgresoHandler,
    finalizarIngresoEgresoHandler,
    cancelarIngresoEgresoHandler
};