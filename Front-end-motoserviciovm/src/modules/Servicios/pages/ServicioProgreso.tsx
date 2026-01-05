import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Container, Card, CardContent, Box, Typography, Divider, Grid, Chip, Fab, Avatar, Paper, colors } from '@mui/material';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { RiToolsLine } from 'react-icons/ri';
import Loading from '../../../components/utils/Loading';
import ErrorCard from '../../../components/utils/ErrorCard';
import { getServicio, putServicioOpcionesTipoServicio, putProximoServicioItems } from '../../../services/servicios.services';
import ProximoServicioItemsForm from '../components/ProximoServicioItemsForm';
import ServicioOpcionesTipoServicioForm from '../components/ServicioOpcionesTipoServicioForm';
import type { ServicioGetType, ServicioItemType, ProgresoItemType, ProgresoItemGetType } from '../../../types/servicioType';
import ProductsTable from '../../../components/Table/ProductsTable';
import { formatDate } from '../../../utils/formatDate';
import type { VentaGetType, VentaProductoGetType, VentaType } from '../../../types/ventaType';
import { estados } from '../../../utils/estados';
import { useGoTo } from '../../../hooks/useGoTo';
import LinkStylesNavigate from '../../../components/utils/links';
import { exportarAPDF } from '../../../utils/exportarPdf';
import { ExposureTwoTone } from '@mui/icons-material';
import { PiExportDuotone } from 'react-icons/pi';
import ImageGallery from '../../../components/utils/GaleryImagenes';
import type { OpcionServicioType } from '../../../types/opcionServicioType';

const API_URL = import.meta.env.VITE_DOMAIN;

const ServicioProgreso = () => {
    const [savingProximo, setSavingProximo] = useState(false);
    const handleSaveProximoServicioItems = async (items: any[]) => {
        if (!data?.id) return;
        setSavingProximo(true);
        try {
            await putProximoServicioItems(data.id, items);
            await fetch();
        } catch (e: any) {
            setError(e?.message ?? 'Error actualizando próximos servicios');
        } finally {
            setSavingProximo(false);
        }
    };
    const { id } = useParams();
    const [savingOpciones, setSavingOpciones] = useState(false);
    // Handler para guardar opcionesTipoServicio
    const handleSaveOpcionesTipoServicio = async (opciones: any[]) => {
        if (!data?.id) return;
        setSavingOpciones(true);
        try {
            await putServicioOpcionesTipoServicio(data.id, opciones); // opciones es la lista, el servicio espera progresoItems
            await fetch(); // Refrescar datos
        } catch (e: any) {
            setError(e?.message ?? 'Error actualizando opciones');
        } finally {
            setSavingOpciones(false);
        }
    };
    const [data, setData] = useState<ServicioGetType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const goTo = useGoTo();
    const { hash } = useLocation();

    const fetch = async () => {
        try {
            setLoading(true);
            const res = await getServicio(id);
            setData(res);
            console.log(res);
        } catch (err: any) {
            setError(err?.message ?? 'Error cargando servicio');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetch(); }, [id]);


    useEffect(() => {
        // Solo intentamos el scroll si no estamos cargando, hay data y hay un hash
        if (!loading && data && hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);

            if (element) {
                // Un pequeño delay de 100ms asegura que Material UI terminó de pintar
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }, [loading, data, hash]);

    const [dataTableCambiosServicio, setDataTableCambiosServicio] = useState<any[]>([]);

    useEffect(() => {
        if (!data) return;

        const dataTableCambiosServicioList = Array.from(
            [
                // Aplanamos los productos de las ventas
                ...(data.ventas?.flatMap((venta: VentaGetType) =>
                    venta.productos?.map((producto: VentaProductoGetType) => ({
                        id: producto.producto?.id,
                        nombre: producto.producto?.nombre,
                    })) || []
                ) || []),
                // Añadimos los productos directos del cliente
                ...(data.productosCliente?.map((producto: any) => ({
                    id: producto.id,
                    nombre: producto.nombre,
                })) || [])
            ].reduce((map, obj) => {
                // El Map se encarga de que si el ID ya existe, no se duplique
                if (obj.id && !map.has(obj.id)) {
                    map.set(obj.id, obj);
                }
                return map;
            }, new Map<string | number, any>()).values()
        ) || [];

        setDataTableCambiosServicio(dataTableCambiosServicioList);
    }, [data, setDataTableCambiosServicio]);


    if (loading) return <Loading />;
    if (error) return <ErrorCard errorText={error} restart={fetch} />;
    if (!data) return <ErrorCard errorText={'Servicio no encontrado'} restart={fetch} />;

    const breadcrumbs = [
        { label: 'Servicios', href: '/admin/servicios', icon: <RiToolsLine fontSize="inherit" /> },
        { label: `Servicio #${data.id}`, icon: <RiToolsLine fontSize="inherit" /> },
    ];

    const chipColorByEstado = (id: number) => {
        switch (id) {
            case estados().enEspera:
                return "warning";
            case estados().confirmado:
                return "success";
            case estados().cancelado:
                return "error";
            default:
                return "primary";
        }
    };
    const totalVentasDescuentos = data?.ventas
    ?.filter(venta => venta.estadoId === estados().confirmado) // Filtra solo las confirmadas
    ?.reduce((acc, venta) => {
        return acc + (venta.descuentoTotal || 0); // Suma el descuento acumulado
    }, 0) || 0;
    const totalServicio = (data.ventas?.reduce((acc, venta) => acc + (venta.total || 0), 0) || 0) + (data.total || 0);

    const dataTableTotales = [
        { label: 'Total Servicio', value: `Q ${data.total?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}` },
        { label: 'Repuestos', value: `Q ${data.ventas?.reduce((acc, venta) => acc + (venta.total || 0), 0 - totalVentasDescuentos).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}` },
        { label: 'Gran Total', value: `Q ${(Number(totalServicio)-Number(totalVentasDescuentos)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    ]


    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbs} />
            <Grid size={{ xs: 1, md: 1 }} display={'flex'} flexGrow={1} alignItems={'center'} justifyContent={'end'}>
                <Fab size="small" color="primary" aria-label="Exportar" onClick={() => window.print()}>
                    <PiExportDuotone />
                </Fab>
            </Grid>
            <Container maxWidth="md" sx={{ mt: 4, mb: 4, boxShadow: 'none' }} >
                <Card sx={{ boxShadow: 'none' }} id="servicio-detail-container">
                    <Grid size={12}>
                        <Box display={'flex'} width={'100%'} justifyContent={'space-around'}>
                            <Avatar variant='square' sx={{ width: '22%', height: 'auto' }} src="/public/icons/logo_corto.png" alt="Logo Moto Servicio VM" />
                            <Box width={'40%'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        color: '#ffff44',
                                        fontFamily: 'fantasy',
                                        textAlign: 'center',
                                        // xs: móvil (pequeño), sm: tablet, md: escritorio
                                        fontSize: { xs: '0.8rem', sm: '1.4rem', md: '2.6rem' },
                                        lineHeight: 1.2,
                                        textShadow: `
                                    -1.7px -1.7px 0 #000,  
                                    1.7px -1.7px 0 #000,
                                    -1.7px  1.7px 0 #000,
                                    1.7px  1.7px 0 #000, 
                                    0px 4px 8px rgba(0, 0, 0, 0.5)`
                                    }}
                                >
                                    MOTO SERVICIO VELASQUEZ MONZON
                                </Typography>                        </Box>
                            <Avatar variant='square' sx={{ width: '22%', height: 'auto' }} src="/public/icons/logo_corto.png" alt="Logo Moto Servicio VM" />
                        </Box>

                    </Grid>

                    <CardContent sx={{ padding: 6 }}>
                        <Typography variant="h6" display={'flex'} justifyContent={'end'} alignContent={'center'} sx={{ fontWeight: 700, mb: 2, color: "red" }}>{`ORDEN NO.${data.id}`}</Typography>

                        <Grid size={10}>
                            {/* FECHA */}
                            <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                                <Typography sx={{ color: '#05172b', fontWeight: 600 }}>FECHA:</Typography>
                                <Typography>{data.fechaSalida ? formatDate(data.fechaSalida as any) : '-'}</Typography>
                            </Box>

                            {/* CLIENTE */}
                            <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                                <Typography sx={{ color: '#05172b', fontWeight: 600 }}>CLIENTE:</Typography>
                                <Typography>{data.cliente?.primerNombre} {data.cliente?.primerApellido}</Typography>
                            </Box>

                            {/* CONTACTO */}
                            <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                                <Typography sx={{ color: '#05172b', fontWeight: 600 }}>CONTACTO:</Typography>
                                <Typography>{data.cliente?.numeroTel}</Typography>
                            </Box>

                            {/* MOTO */}
                            <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                                <Typography sx={{ color: '#05172b', fontWeight: 600 }}>MOTO:</Typography>
                                <Typography>{data.moto?.modelo?.modelo ?? '-'}</Typography>
                            </Box>

                            {/* KILOMETRAJE (Con separación extra en medio) */}
                            <Box sx={{ mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                <Typography sx={{ color: '#05172b', fontWeight: 600 }}>KILOMETRAJE:</Typography>
                                <Typography>{data?.kilometraje ?? '-'}</Typography>

                                {/* ml: 4 añade un espacio notable entre el kilometraje actual y el próximo servicio */}
                                <Typography sx={{ color: '#05172b', fontWeight: 600, ml: 4 }}>
                                    KILOMETRAJE PROXIMO SERVICIO:
                                </Typography>
                                <Typography>{data?.kilometrajeProximoServicio ?? '-'}</Typography>
                            </Box>

                            {/* PLACA */}
                            <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                                <Typography sx={{ color: '#05172b', fontWeight: 600 }}>PLACA:</Typography>
                                <Typography>{data.moto?.placa ?? '-'}</Typography>
                            </Box>
                        </Grid>

                        <Divider sx={{ my: 2 }} />
                        {/* Tabla editable de proximoServicioItems para mecánico */}
                        {data.proximoServicioItems && (
                            <ProximoServicioItemsForm
                                initial={data.proximoServicioItems}
                                onSubmit={handleSaveProximoServicioItems}
                                loading={savingProximo}
                            />
                        )}

                        <Box >
            
                            {/* Invocación del componente */}
                            <ImageGallery imagenes={data.imagen ?? []} />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {
                            data.tipoServicio?.servicioCompleto &&
                            <>
                                <Typography variant="h6" display={'flex'} justifyContent={'center'} gutterBottom>REVISION</Typography>
                                <ProductsTable
                                    maxHeight={'none'}
                                    columns={[
                                        { id: 'itemName', label: 'Inventario', minWidth: 120, format: (v: any) => v ?? '' },
                                        { id: 'checked', label: 'Presente', minWidth: 80, align: 'center', format: (v: any) => v ? 'Sí' : 'No' },
                                        { id: 'itemDescripcion', label: 'Descripción', minWidth: 180, format: (v: any) => v ?? '' },
                                        { id: 'notas', label: 'Notas', minWidth: 180, format: (v: any) => v ?? '' },
                                    ] as any}
                                    rows={data.servicioItems ?? []}
                                    headerColor="#1565c0"
                                />
                            </>
                        }


                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h5" textAlign={'center'} m={2} gutterBottom>{data.tipoServicio?.tipo ?? ''}</Typography>

                        {/* Tabla editable de opcionesTipoServicio para mecánico */}
                        {data.servicioOpcionesTipoServicio && data.servicioOpcionesTipoServicio.length > 0 && (
                            <ServicioOpcionesTipoServicioForm
                                initial={data.servicioOpcionesTipoServicio}
                                onSubmit={handleSaveOpcionesTipoServicio}
                                loading={savingOpciones}
                            />
                        )}
                    


                        <Divider sx={{ my: 2 }} />
                        <Box width={'100%'} display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} justifyContent={'space-between'} mb={4}>
                            <Box width={{ xs: '100%', md: '40%' }} mx="auto">
                                {
                                    dataTableCambiosServicio.length === 0 ? (
                                        null
                                    ) : (
                                        <>

                                            <ProductsTable
                                                maxHeight={'none'}
                                                columns={[
                                                    { id: 'nombre', label: 'CAMBIOS REALIZADOS DURANTE SERVICIO', minWidth: 180, format: (v: any) => v ?? '', align: 'center' },
                                                ] as any}
                                                rows={dataTableCambiosServicio ?? []}
                                                headerColor="#1565c0"
                                            />

                                            <Divider sx={{ my: 2 }} />
                                        </>
                                    )
                                }
                            </Box>

                            <Box width={{ xs: '100%', md: '40%' }} mx="auto">
                                {
                                    data.proximoServicioItems?.length === 0 ? (
                                        null
                                    ) : (
                                        <>

                                            <ProductsTable
                                            maxHeight={'none'}
                                                columns={[
                                                    { id: 'nombre', label: 'CAMBIOS POR REALIZAR EN SIGUIENTE SERVICIO', minWidth: 180, format: (v: any) => v ?? '', align: 'center' },
                                                ] as any}
                                                rows={data.proximoServicioItems ?? []}
                                                headerColor="#1565c0"
                                            />

                                            <Divider sx={{ my: 2 }} />
                                        </>
                                    )
                                }
                            </Box>
                        </Box>


                        <Grid size={10}>
                            <Box sx={{ mb: 1, justifyContent: 'start', display: 'flex' }}><Typography sx={{ color: '#0517b', fontWeight: 600 }}>{`Observaciones detalladas: `}</Typography><Typography>{data.observaciones ?? '-'}</Typography></Box>
                        </Grid>

                    </CardContent>
                </Card>
            </Container>


        </>
    );
};

export default ServicioProgreso;
