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

const API_URL = import.meta.env.VITE_DOMAIN;



const HistorialServicio = () => {



    const { id } = useParams();
    const goTo = useGoTo();

    const [moto, setMoto] = useState<motoGetType | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
                    <Grid container spacing={2} width={'lx'} >

                        <Grid size={{ xs: 12, md: 6 }} sx={{ flexDirection: "row" }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                                {moto?.avatar ? (
                                    <Box
                                        component="img"
                                        src={"https://api.motoserviciovm.com/" + moto.avatar}
                                        alt={moto?.placa ?? "avatar"}
                                        sx={{ width: "100%", maxHeight: 400, padding: 2, objectFit: "contain", borderRadius: "24px" }}
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

        </>

    )
}


export default HistorialServicio;