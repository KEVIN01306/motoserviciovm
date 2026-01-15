export const estados = () => {

    return{
        activo: 1,
        inactivo: 2,
        enParqueo: 3,
        enReparacion: 4,
        enServicio: 5,
        entregado: 6,
        enEspera: 7,
        confirmado: 8,
        cancelado: 9,
        pruebas: 10,
        listoEntrega: 11,
    }
}

export const estadosServicio = () => {
    return{
        enParqueo: {
            id: 3, estado: 'En Parqueo'
        },
        enReparacion: {
            id: 4, estado: 'En Reparación'
        },
        enServicio: {
            id: 5, estado: 'En Servicio'
        },
        entregado: {
            id: 6, estado: 'Entregado'
        },
        enEspera: {
            id: 7, estado: 'En Espera'
        },
        confirmado: {
            id: 8, estado: 'Confirmado'
        },
        cancelado: {
            id: 9, estado: 'Cancelado'
        },
        pruebas: {
            id: 10, estado: 'Pruebas'
        },
        listoEntrega: {
            id: 11, estado: 'Listo para Entrega'
        },
    }
}