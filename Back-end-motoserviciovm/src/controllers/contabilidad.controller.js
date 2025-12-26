import { responseError, responseSucces } from "../helpers/response.helper.js";
import { getTotalesContabilidad } from "../services/contabilidad.service.js";


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
        const fechaInicioParsed = fechaInicio ? new Date(fechaInicio) : new Date('1970-01-01');
        const fechaFinParsed = fechaFin ? new Date(fechaFin) : new Date();

        console.log('Parsed Sucursal IDs:', parsedSucursalIds);
        console.log('sucuersalIds Raw:', sucursalIds);
        console.log('Fecha Inicio Parsed:', fechaInicioParsed);
        console.log('Fecha Fin Parsed:', fechaFinParsed);
        const totales = await getTotalesContabilidad(parsedSucursalIds,fechaInicioParsed,fechaFinParsed);
        return res.status(200).json(responseSucces('Totales de contabilidad', totales));
    } catch (err) {
        console.error('Get contabilidad error:', err);
        return res.status(500).json(responseError('INTERNAL_SERVER_ERROR'));
    }
}

export {
    getContabilidad,
}