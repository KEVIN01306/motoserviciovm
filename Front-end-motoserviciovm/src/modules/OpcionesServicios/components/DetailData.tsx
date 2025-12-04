import { Card, CardContent, Grid, Typography } from "@mui/material";
import type { OpcionServicioType } from "../../../types/opcionServicioType";

interface Props {
    opcion: OpcionServicioType;
}

const DetailData = ({ opcion }: Props) => {
    return (
        <Grid size={12}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <DetailItem label="Opción" value={opcion.opcion} />
                        <DetailItem label="Descripción" value={opcion.descripcion} />
                        <DetailItem label="Creado el" value={opcion.createdAt ? new Date(opcion.createdAt).toLocaleString() : "-"} />
                        <DetailItem label="Actualizado el" value={opcion.updatedAt ? new Date(opcion.updatedAt).toLocaleString() : "-"} />
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
