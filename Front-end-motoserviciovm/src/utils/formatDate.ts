import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (dateString: string | undefined | Date) => {
    if (!dateString) return 'No disponible';

    try {
        // 1. Interpretamos la fecha de la DB como UTC
        // 2. La convertimos a la zona horaria de Guatemala
        // 3. Formateamos
        return dayjs.utc(dateString)
                    .tz('America/Guatemala')
                    .format('DD/MM/YYYY');
    } catch (e) {
        return 'Fecha inválida';
    }
};

export const formatDateNotFormat = (dateString: string | undefined | Date) => {
    if (!dateString) return 'No disponible';

    try {
        // 1. Interpretamos la fecha de la DB como UTC
        // 2. La convertimos a la zona horaria de Guatemala
        // 3. Formateamos
        return dayjs.utc(dateString)
                    .format('DD/MM/YYYY');
    } catch (e) {
        return 'Fecha inválida';
    }
};
