import { Box, Container, Typography, List, ListItem, ListItemText, Grid } from "@mui/material";
import { useAuthStore } from "../../../store/useAuthStore";
import { useEffect, useState } from "react";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { getUser } from "../../../services/users.services";
import type { UserGetType } from "../../../types/userType";
import MotoCard from "../components/MotoCard";
import { useGoTo } from "../../../hooks/useGoTo";

const HomePages = () => {
	const storedUser = useAuthStore((state) => state.user);
	const userId = storedUser?.id;

	const [user, setUser] = useState<UserGetType | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const goTo = useGoTo()

	useEffect(() => {
		const fetch = async () => {
			if (!userId) return;
			try {
				setLoading(true);
				const u = await getUser(userId);
				setUser(u as UserGetType);
			} catch (err: any) {
				setError(err.message || String(err));
			} finally {
				setLoading(false);
			}
		};

		fetch();
	}, [userId]);

	if (!userId) {
		return (
			<Container maxWidth="lg">
				<Typography variant="body1">Usuario no identificado.</Typography>
			</Container>
		);
	}
	

	if (loading) return <Loading />;
	if (error) return <ErrorCard errorText={error} restart={() => window.location.reload()} />;

	const fullName = user
		? `${user.primerNombre || ''} ${user.primerApellido || ''}`.trim()
		: `${storedUser?.primerNombre || ''} ${storedUser?.primerApellido || ''}`.trim();

	const sucursales = user?.sucursales || [];

	return (
		<Container maxWidth="lg">
			<Box display="flex" flexDirection="column" gap={2} mb={3}>
				<Typography variant="h5" fontWeight={700}>
					Hola{fullName ? `: ${fullName}` : ''}
				</Typography>

				<Box>
					<Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
						Sedes asignadas
					</Typography>

					{sucursales.length === 0 ? (
						<Typography variant="body2" color="text.secondary">No tienes sedes asignadas.</Typography>
					) : (
						<List>
							{sucursales.map((s: any) => (
								<ListItem key={s.id} disablePadding>
									<ListItemText primary={s.nombre} />
								</ListItem>
							))}
						</List>
					)}
				</Box>

				{
					user?.motos && (
						<Grid container spacing={2} flexDirection="column" >
							<Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
								Motos asignadas
							</Typography>
							{user.motos.length === 0 ? (
								<Typography variant="body2" color="text.secondary">No tienes motos asignadas.</Typography>
							) : (
									
									user.motos.map((moto) => (
										<Grid size={{xs: 12, md: 4	}}  key={moto.id}>
											<MotoCard data={moto} onclikkHistorial={() => goTo(`/admin/historial-servicio/${moto.id}`)} />
										</Grid>
									))
							)}
						</Grid>
					)
				}

			</Box>
		</Container>
	)
}

export default HomePages;

