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
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useGoTo } from "../hooks/useGoTo";
import FormEstructure from "./utils/FormEstructure";

const PagesNotFound = () => {
	const goTo = useGoTo();

	return (
		<Container maxWidth="xs" sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center" }}>
			<FormEstructure sx={{ padding: 0, margin: 0, border: "none", boxShadow: "none" }} pGrid={1} handleSubmit={() => {}}>
				<Card elevation={3} sx={{ borderRadius: 2, width: "100%" }}>
					<CardContent sx={{ p: 4, textAlign: "center" }}>
						<Box sx={{ textAlign: "center", mb: 2 }}>
							<ErrorOutlineIcon sx={{ fontSize: 48, color: "error.main" }} />
							<Typography variant="h5" component="h1" fontWeight="bold" sx={{ mt: 1 }}>
								Página no encontrada (404)
							</Typography>
							<Typography variant="body2" color="text.secondary">
								MOTOSERVICIOVM
							</Typography>
						</Box>

						<Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
							Lo sentimos, la página que buscas no existe o ha sido movida. Revisa la URL o vuelve a la página
							principal.
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
							Si crees que esto es un error, contacta con el administrador del sistema.
						</Typography>
					</CardContent>
				</Card>
			</FormEstructure>
		</Container>
	);
};

export default PagesNotFound;

