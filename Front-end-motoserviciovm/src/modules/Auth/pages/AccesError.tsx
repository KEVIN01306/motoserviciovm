import {
    Container,
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Divider,
    Stack,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import { useGoTo } from "../../../hooks/useGoTo";
import FormEstructure from "../../../components/utils/FormEstructure";

const AccesError = () => {
    const goTo = useGoTo();

    return (
        <Container maxWidth="xs" sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center" }}>
            <FormEstructure sx={{ padding: 0, margin: 0, border: "none", boxShadow: "none" }} pGrid={1} handleSubmit={() => {}}>
                <Card elevation={3} sx={{ borderRadius: 2, width: "100%" }}>
                    <CardContent sx={{ p: 4, textAlign: "center" }}>
                        <Box sx={{ textAlign: "center", mb: 2 }}>
                            <BlockIcon sx={{ fontSize: 48, color: "error.main" }} />
                            <Typography variant="h5" component="h1" fontWeight="bold" sx={{ mt: 1 }}>
                                Acceso denegado
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                MOTOSERVICIOVM
                            </Typography>
                        </Box>

                        <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
                            Lo sentimos, no tienes permisos para acceder a esta sección. Si crees que esto es un error,
                            contacta con el administrador del sistema.
                        </Typography>

                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() => goTo("/admin")}
                                sx={{ py: 1.5, borderRadius: 1 }}
                            >
                                Volver al Inicio
                            </Button>

                            <Button
                                variant="outlined"
                                color="primary"
                                fullWidth
                                onClick={() => goTo("/public/auth/login")}
                                sx={{ py: 1.5, borderRadius: 1 }}
                            >
                                Ir al Login
                            </Button>
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="caption" color="text.secondary">
                            Si necesitas más ayuda, revisa la configuración de permisos o contacta soporte.
                        </Typography>
                    </CardContent>
                </Card>
            </FormEstructure>
        </Container>
    );
};

export default AccesError;