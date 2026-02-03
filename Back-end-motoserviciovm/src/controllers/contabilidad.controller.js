import { responseError, responseSucces } from "../helpers/response.helper.js";
import { getTotalesContabilidad } from "../services/contabilidad.service.js";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
dayjs.extend(utc);
dayjs.extend(timezone);

const getContabilidad = async (req, res) => {
    try {
        const { sucursalIds, fechaInicio, fechaFin } = req.query;
        let parsedSucursalIds = [];

        if (Array.isArray(sucursalIds)) {
            parsedSucursalIds = sucursalIds.map(id => parseInt(id));
        }
        if (typeof sucursalIds === 'string') {
            parsedSucursalIds = sucursalIds ? sucursalIds.split(',').map(id => parseInt(id)) : [];
        }
        const tz = "America/Guatemala";

        const startStr = fechaInicio ? String(fechaInicio).replace('Z', '') : '1970-01-01';
        const endStr = fechaFin ? String(fechaFin).replace('Z', '') : dayjs().format('YYYY-MM-DD HH:mm:ss');

        const inicioAjustado = dayjs.tz(startStr, tz).startOf('day').toDate();
        const finAjustado = dayjs.tz(endStr, tz).endOf('day').toDate();

        console.log('Parsed Sucursal IDs:', parsedSucursalIds);
        console.log('sucuersalIds Raw:', sucursalIds);
        console.log('Fecha Inicio Parsed:', inicioAjustado);
        console.log('Fecha Fin Parsed:', finAjustado);
        const totales = await getTotalesContabilidad(parsedSucursalIds,inicioAjustado,finAjustado);
        return res.status(200).json(responseSucces('Totales de contabilidad', totales));
    } catch (err) {
        console.error('Get contabilidad error:', err);
        return res.status(500).json(responseError('INTERNAL_SERVER_ERROR'));
    }
}

export {
    getContabilidad,
}