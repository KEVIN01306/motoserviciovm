
export const formatDate = (dateString: string | undefined | Date) => {
    if (!dateString) return 'No disponible';
    // Avoid timezone shifts by extracting the YYYY-MM-DD part when available
    // and formatting it as DD/MM/YYYY
    try {
        const datePart = String(dateString).includes('T') ? String(dateString).slice(0, 10) : String(dateString).slice(0, 10);
        const [year, month, day] = datePart.split('-');
        if (year && month && day) return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    } catch (e) {
        // fallback to original parsing
    }
    try {
        return new Date(String(dateString)).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (e) {
        return String(dateString);
    }
};