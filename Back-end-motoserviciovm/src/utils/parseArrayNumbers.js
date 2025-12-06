

export const parseArrayNumbers = (value) => {
    if (value === null || typeof value === 'undefined') return [];

    if (Array.isArray(value)) return value.map(v => parseInt(v));

    if (typeof value === 'object') return [];

    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed === '') return [];
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return parsed.map(v => parseInt(v));
        } catch (err) {
        }
        if (trimmed.indexOf(',') !== -1) {
            return trimmed.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        }
    }

    return [];
}