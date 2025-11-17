import { Grid, Card, CardContent, Typography } from "@mui/material";
import type { SucursalType } from "../../../types/sucursalType";

type Props = {
    sucursal: SucursalType
}

const DetailData = ({ sucursal }: Props) => {
    return (
        <Grid size={12}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <DetailItem label="Nombre" value={sucursal.nombre} />
                        <DetailItem label="Teléfono" value={sucursal.telefono} />
                        <DetailItem label="Email" value={sucursal.email} />
                        <DetailItem label="Dirección" value={sucursal.direccion} />
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    )
}

const DetailItem = ({ label, value }: { label: string; value: string | undefined }) => {
    return (
        <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="textSecondary">{label}</Typography>
            <Typography variant="body1">{value ?? "-"}</Typography>
        </Grid>
    )
}

export default DetailData
