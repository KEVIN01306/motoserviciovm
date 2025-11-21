import { Card, CardContent, Grid, Typography } from "@mui/material";
import type { LineaType } from "../../../types/lineaType";

type Props = {
    linea: LineaType;
};

const DetailData = ({ linea }: Props) => {
    return (
        <Grid size={12}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <DetailItem label="Línea" value={linea.linea} />
                        <DetailItem label="Estado" value={linea.estado?.estado ?? `Estado #${linea.estadoId}`} />
                        <DetailItem
                            label="Creado el"
                            value={linea.createdAt ? new Date(linea.createdAt).toLocaleString() : "-"}
                        />
                        <DetailItem
                            label="Actualizado el"
                            value={linea.updatedAt ? new Date(linea.updatedAt).toLocaleString() : "-"}
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

