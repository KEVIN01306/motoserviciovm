import { Card, CardContent, Typography, Box } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';

type Props = {
    nombre: string;
    direccion?: string;
    usuariosCount: number;
}

const SucursalCard = ({ nombre, direccion, usuariosCount }: Props) => {
    return (
        <Card sx={{ minWidth: 220, maxWidth: 320, borderRadius: 2 }} elevation={2}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h6" fontWeight={700} noWrap>
                            {nombre}
                        </Typography>
                        {direccion && (
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {direccion}
                            </Typography>
                        )}
                    </Box>
                    <Box textAlign="right">
                        <Typography variant="caption" color="text.secondary">
                            Usuarios
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <CircleIcon sx={{ fontSize: 12, color: 'primary.main' }} />
                            <Typography variant="h6" fontWeight={700}>
                                {usuariosCount}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}

export default SucursalCard;
