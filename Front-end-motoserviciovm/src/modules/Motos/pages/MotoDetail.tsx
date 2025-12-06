import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { getMoto } from "../../../services/moto.services";
import DetailData from "../components/DetailData";
import { Grid, Button, Box, Typography, Divider } from "@mui/material";
import { useGoTo } from "../../../hooks/useGoTo";
import type { motoGetType } from "../../../types/motoType";
import { RiBikeFill } from "react-icons/ri";

const API_URL = import.meta.env.VITE_DOMAIN;

const MotoDetail = () => {
    const { id } = useParams();
    const goTo = useGoTo();

    const [moto, setMoto] = useState<motoGetType | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const breadcrumbsData = [
        { label: "Motos", icon: <RiBikeFill fontSize="inherit" />, href: "/admin/motos" },
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

    useEffect(() => {
        getOne();
    }, []);

    if (loading) return <Loading />;
    if (error) return <ErrorCard errorText={error} restart={getOne} />;

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />
            <DetailData
                title={moto?.modelo?.modelo ?? "Moto"}
                rows={[]}
            >
                {/* Top area: avatar left, info right (stack on mobile) */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                            {moto?.avatar ? (
                                <Box
                                    component="img"
                                    src={API_URL + moto.avatar}
                                    alt={moto?.placa ?? "avatar"}
                                    sx={{ width: "100%", maxHeight: 400, objectFit: "contain", borderRadius: 1 }}
                                />
                            ) : (
                                <Box sx={{ width: "100%", height: 200, bgcolor: "#f3f4f6", borderRadius: 1 }} />
                            )}
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box>
                            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
                                <Typography sx={{ minWidth: 120, color: "#6b7280", fontWeight: 600 }}>Placa</Typography>
                                <Typography>{moto?.placa ?? "-"}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
                                <Typography sx={{ minWidth: 120, color: "#6b7280", fontWeight: 600 }}>Modelo</Typography>
                                <Typography>{moto?.modelo?.modelo ?? "-"}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
                                <Typography sx={{ minWidth: 120, color: "#6b7280", fontWeight: 600 }}>Marca</Typography>
                                <Typography>{moto?.modelo?.marca?.marca ?? "-"}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
                                <Typography sx={{ minWidth: 120, color: "#6b7280", fontWeight: 600 }}>Línea</Typography>
                                <Typography>{moto?.modelo?.linea?.linea ?? "-"}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
                                <Typography sx={{ minWidth: 120, color: "#6b7280", fontWeight: 600 }}>Cilindrada</Typography>
                                <Typography>{moto?.modelo?.cilindrada?.cilindrada ?? "-"}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
                                <Typography sx={{ minWidth: 120, color: "#6b7280", fontWeight: 600 }}>Creado el</Typography>
                                <Typography>{moto?.createdAt ? new Date(moto.createdAt).toLocaleString() : "-"}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                <Typography sx={{ minWidth: 120, color: "#6b7280", fontWeight: 600 }}>Actualizado el</Typography>
                                <Typography>{moto?.updatedAt ? new Date(moto.updatedAt).toLocaleString() : "-"}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                {/* Usuarios asignados */}
                <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        Usuarios asignados
                    </Typography>

                    {moto?.users?.map((u) => (
                        <Grid key={u.id} size={12}>
                            <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between" }}>
                                <Box>
                                    <Typography sx={{ fontWeight: 600 }}>{`${u.primerNombre} ${u.primerApellido}`}</Typography>
                                    <Typography sx={{ color: "#6b7280" }}>{u.dpi || u.nit}</Typography>
                                    <Typography sx={{ color: "#6b7280" }}>{u.numeroTel}</Typography>
                                </Box>
                                <Box>
                                    <Button variant="outlined" onClick={() => goTo(`/admin/users/${u.id}`)}>
                                        Ver usuario
                                    </Button>
                                </Box>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                        </Grid>
                    ))}
                </Box>

                <Grid size={12}>
                    <Button variant="contained" onClick={() => goTo("/admin/motos/" + id + "/edit")}>
                        Editar
                    </Button>
                </Grid>
            </DetailData>
        </>
    );
};

export default MotoDetail;
