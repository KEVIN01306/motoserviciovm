import { Card, CardContent, Grid, Typography, List, ListItem, ListItemText } from "@mui/material";
import type { TipoServicioGetType } from "../../../types/tipoServicioType";

interface Props {
    item: TipoServicioGetType;
}

const DetailData = ({ item }: Props) => {
    return (
        <Grid size={12}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" color="textSecondary">Tipo</Typography>
                            <Typography variant="body1">{item.tipo ?? "-"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" color="textSecondary">Descripción</Typography>
                            <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>{item.descripcion ?? "-"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" color="textSecondary">Opciones de Servicio</Typography>
                            <List>
                                {item.opcionServicios && item.opcionServicios.length > 0 ? (
                                    item.opcionServicios.map((opt, idx) => (
                                        <ListItem key={opt.id ?? idx}>
                                            <ListItemText primary={`${idx + 1}. ${opt.opcion}`} secondary={opt.descripcion} />
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography variant="body2">-</Typography>
                                )}
                            </List>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="subtitle2" color="textSecondary">Creado el</Typography>
                            <Typography variant="body1">{item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="subtitle2" color="textSecondary">Actualizado el</Typography>
                            <Typography variant="body1">{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-"}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="subtitle2" color="textSecondary">¿Es un servicio completo?</Typography>
                            <Typography variant="body1">{item.servicioCompleto ? "Sí" : "No"}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default DetailData;
