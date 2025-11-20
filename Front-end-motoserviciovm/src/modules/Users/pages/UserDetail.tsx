import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser } from "../../../services/users.services";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import type { UserGetType } from "../../../types/userType";

import {
    Container,
    Card,
    CardContent,
    Typography,
    Avatar,
    Box,
    Button,
    Chip,
    Divider,
} from "@mui/material";
import { DetailData } from "../components/index";
import { PiUserCheck, PiUsersFill } from "react-icons/pi";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { useGoTo } from "../../../hooks/useGoTo";
import { useAuthStore } from "../../../store/useAuthStore";

const UserDetail = () => {
    const goTo = useGoTo()
    const { id } = useParams()
    const userlogged = useAuthStore(state => state.user)
    const [user, setUser] = useState<UserGetType>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const getUserOne = async () => {
        try {
            setLoading(true)
            const response = await getUser(id)
            setUser(response)
        } catch (err: any) {
            setError(err.message || "Error al cargar los datos del usuario.")
        } finally {
            setLoading(false)
        }
    }
    const breadcrumbsData = [
        { label: "User", icon: <PiUsersFill fontSize="inherit" />, href: "/admin/users" },
        { label: user?.primerNombre ? user?.primerNombre : "", icon: <PiUserCheck fontSize="inherit" />, href: `/${id}` },
    ];

    useEffect(() => {
        getUserOne()
    }, [id])

    if (loading) return <Loading />;

    if (error) return <ErrorCard errorText={error} restart={getUserOne} />;

    if (!user) return <ErrorCard errorText="Usuario no encontrado." restart={getUserOne} />;

    const {
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido,
        tipo
    } = user;

    const fullName = `${primerNombre || ''} ${segundoNombre || ''} ${primerApellido || ''} ${segundoApellido || ''}`.trim();
    return (
        <>  {
                 userlogged?.permisos.includes('usuarios:view') && (
                    <BreadcrumbsRoutes items={breadcrumbsData} />
                 )
            }
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                    <CardContent>
                        <Box sx={{ textAlign: 'center', pb: 2 }}>
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    bgcolor: 'primary.main',
                                    fontSize: '2rem',
                                    mb: 1,
                                    mx: 'auto'
                                }}
                            >
                                {primerNombre ? primerNombre[0].toUpperCase() : 'U'}
                            </Avatar>

                            <Typography variant="h5" component="div" fontWeight="bold">
                                {fullName || 'Usuario Desconocido'}
                            </Typography>

                            <Chip
                                label={tipo?.toUpperCase() == null || tipo?.toUpperCase() == "" ? "MOTOSERVICIOVM" : tipo?.toUpperCase()}
                                size="small"
                                color={tipo === '' || tipo == null ? 'primary' : 'info'}
                                sx={{ mt: 0.5 }}
                            />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6" gutterBottom color="text.primary" fontWeight="bold">
                            Información del Perfil
                        </Typography>

                        <DetailData user={user} />

                        <Divider sx={{ my: 3 }} />
                        {
                            userlogged?.permisos.includes('usuarios:edit') && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button variant="outlined" color="primary" onClick={() => goTo(String('edit'))}>
                                        Editar Perfil
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => console.log('Cambiar Contraseña')}>
                                        Cambiar Contraseña
                                    </Button>
                                </Box>
                            )
                        }

                    </CardContent>
                </Card>
            </Container>
        </>
    );
}

export default UserDetail;