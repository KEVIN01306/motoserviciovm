import { Card, CardContent, Grid, Typography } from "@mui/material";
import type { CategoriaProductoType } from "../../../types/categoriaProductoType";
import LinkStylesNavigate from "../../../components/utils/links";
import { useGoTo } from "../../../hooks/useGoTo";

interface Props {
    categoria: CategoriaProductoType;
}

const DetailData = ({ categoria }: Props) => {
    const goTo = useGoTo();
    return (
        <Grid size={12}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" color="textSecondary">Categoría</Typography>
                            <Typography variant="body1">{categoria.categoria ?? "-"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="subtitle2" color="textSecondary">Creado el</Typography>
                            <Typography variant="body1">{categoria.createdAt ? new Date(categoria.createdAt).toLocaleString() : "-"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="subtitle2" color="textSecondary">Actualizado el</Typography>
                            <Typography variant="body1">{categoria.updatedAt ? new Date(categoria.updatedAt).toLocaleString() : "-"}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card>
                <CardContent>

                    <Typography variant="h6" gutterBottom>Productos en esta categoría</Typography>
                    {categoria.productos.length === 0 ? (
                        <Typography variant="body2">No hay productos en esta categoría.</Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {categoria.productos.map((producto) => (
                                <Grid key={producto.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Card variant="outlined" sx={{ p: 2 }}>
                                        <Typography variant="subtitle1" gutterBottom><LinkStylesNavigate variant="body2" label={producto.nombre} onClick={() => goTo(`/admin/productos/${producto.id}`)} / ></Typography>
                                        <Typography variant="body2">Precio: {producto.precio}</Typography>
                                        <Typography variant="body2">Stock: {producto.cantidad}</Typography>
                                    </Card> 
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </CardContent>
            </Card>
        </Grid>
    );
};

export default DetailData;
