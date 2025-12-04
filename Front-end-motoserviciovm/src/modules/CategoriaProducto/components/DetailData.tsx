import { Card, CardContent, Grid, Typography } from "@mui/material";
import type { CategoriaProductoType } from "../../../types/categoriaProductoType";

interface Props {
    categoria: CategoriaProductoType;
}

const DetailData = ({ categoria }: Props) => {
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
        </Grid>
    );
};

export default DetailData;
