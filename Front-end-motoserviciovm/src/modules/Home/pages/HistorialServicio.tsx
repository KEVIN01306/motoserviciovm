import { useEffect, useState } from "react";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { RiBikeFill } from "react-icons/ri";
import type { motoGetType } from "../../../types/motoType";
import { useParams } from "react-router-dom";
import { useGoTo } from "../../../hooks/useGoTo";
import { getMoto } from "../../../services/moto.services";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import GuatemalaMotorcyclePlate from "../../../components/utils/PlacaView";
import ServiciosHistorialTable from '../components/ServiciosHistorialTable';
import HistorialServicioFiltros from '../components/HistorialServicioFiltros';
import { getServicios } from '../../../services/servicios.services';
import dayjs from 'dayjs';
import type { ServicioGetType } from "../../../types/servicioType";

const API_URL = import.meta.env.VITE_DOMAIN;



const HistorialServicio = () => {



    const { id } = useParams();
    const goTo = useGoTo();

    const [moto, setMoto] = useState<motoGetType | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [servicios, setServicios] = useState<ServicioGetType[]>([]);
    const [serviciosLoading, setServiciosLoading] = useState(false);
    const [serviciosError, setServiciosError] = useState<string | null>(null);
    // Fechas por defecto: 1 de enero del año actual y hoy
    const defaultStart = dayjs().startOf('year').format('YYYY-MM-DD');
    const defaultEnd = dayjs().endOf('year').format('YYYY-MM-DD');
    const [startDate, setStartDate] = useState(defaultStart);
    const [endDate, setEndDate] = useState(defaultEnd);

    const breadcrumbsData = [
        { label: "Motos", icon: <RiBikeFill fontSize="inherit" />, href: "/admin" },
        { label: "Detalle Moto", icon: <RiBikeFill fontSize="inherit" />, href: "/admin/motos/" + id },
    ];


    const getOne = async () => {
        try {
            setLoading(true);
            const response = await getMoto(id as any);
            setMoto(response);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const chipColorByEstado = (estado: string) => {
        switch (estado.toLowerCase()) {
        case "activo":
            return "success";
        case "inactivo":
            return "default";
        case "pendiente":
            return "warning";
        case "en reparacion":
            return "error";
        case "en parqueo":
            return "warning";
        default:
            return "primary";
        }
    };

    // Cargar servicios al montar y cuando cambian los filtros
    useEffect(() => {
        if (!moto?.placa) return;
        setServiciosLoading(true);
        setServiciosError(null);
        getServicios({ placa: moto.placa, startDate, endDate })
          .then(setServicios)
          .catch(e => setServiciosError(e.message))
          .finally(() => setServiciosLoading(false));
      }, [moto?.placa, startDate, endDate]);


    useEffect(() => {
        getOne();
    }, []);

    if (loading) return <Loading />;
    if (error) return <ErrorCard errorText={error} restart={getOne} />;

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />


            <Box sx={{ mt: 2, mb: 2 }} width={'100%'}>

                <Paper elevation={1} sx={{ padding: 2, width: '100%', }}>
                    <Grid container spacing={2} width={'lx'} display={'flex'} justifyContent={'center'} alignItems={'center'}>

                        <Grid size={{ xs: 8, md: 4 }} sx={{ flexDirection: "row", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                                {moto?.avatar ? (
                                    <Box
                                        component="img"
                                        boxShadow={2}
                                        
                                        src={API_URL + moto.avatar}
                                        alt={moto?.placa ?? "avatar"}
                                        sx={{ width: "100%", maxHeight: 400, objectFit: "cover", borderRadius: "24px",display: 'flex', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center' }}
                                    />
                                ) : (
                                    <Box sx={{ width: "100%", height: 200, bgcolor: "#f3f4f6", borderRadius: "24px" }} />
                                )}
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} sx={{padding: 2}}>
                            <Box sx={{ display: "flex", flexDirection: "column"}}>
                               
                                <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                                    <Typography sx={{ color: '#05172b', fontWeight: 600 }}>MODELO:</Typography>
                                    <Typography>{moto?.modelo?.modelo}</Typography>
                                </Box>
                                <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                                    <Typography sx={{ color: '#05172b', fontWeight: 600 }}>MARCA:</Typography>
                                    <Typography>{moto?.modelo?.marca?.marca}</Typography>
                                </Box>
                                <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                                    <Typography sx={{ color: '#05172b', fontWeight: 600 }}>CC:</Typography>
                                    <Typography>{moto?.modelo?.cilindrada?.cilindrada}</Typography>
                                </Box>
                                <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                                    <GuatemalaMotorcyclePlate plate={moto?.placa || ""} />
                                </Box>
                                <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                                    <Chip label={moto?.estado?.estado} variant="outlined" color={chipColorByEstado(moto?.estado?.estado || "")} />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            <Box sx={{ mt: 2, mb: 2 }} width={'100%'}>

                <HistorialServicioFiltros
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(start, end) => { setStartDate(start); setEndDate(end); }}
                />
                {serviciosLoading ? (
                    <Loading />
                ) : serviciosError ? (
                    <ErrorCard errorText={serviciosError} restart={() => getServicios({ placa: moto?.placa, startDate, endDate }).then(setServicios)} />
                ) : (
                    <ServiciosHistorialTable rows={servicios} />
                )}
            </Box>

        </>

    )
}


export default HistorialServicio;