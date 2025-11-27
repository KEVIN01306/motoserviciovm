import { Card, CardContent, Grid, Typography } from "@mui/material";
import type { MarcaType } from "../../../types/marcaType";

type Props = {
    marca: MarcaType;
};

const DetailData = ({ marca }: Props) => {
    return (
        <Grid size={12}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <DetailItem label="Marca" value={marca.marca} />
                        <DetailItem label="Estado" value={(marca as any).estado?.estado ?? `Estado #${marca.estadoId}`} />
                        <DetailItem
                            label="Creado el"
                            value={marca.createdAt ? new Date(marca.createdAt).toLocaleString() : "-"}
                        />
                        <DetailItem
                            label="Actualizado el"
                            value={marca.updatedAt ? new Date(marca.updatedAt).toLocaleString() : "-"}
                        />
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    );
};

const DetailItem = ({ label, value }: { label: string; value?: string }) => (
    <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="subtitle2" color="textSecondary">
            {label}
        </Typography>
        <Typography variant="body1">{value ?? "-"}</Typography>
    </Grid>
);

export default DetailData;

