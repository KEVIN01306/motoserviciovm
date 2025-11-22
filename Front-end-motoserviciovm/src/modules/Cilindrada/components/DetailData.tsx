import { Card, CardContent, Grid, Typography } from "@mui/material";
import type { CilindradaType } from "../../../types/cilindradaType";

interface Props {
    cilindrada: CilindradaType;
}

const DetailData = ({ cilindrada }: Props) => {
    return (
        <Grid size={12}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <DetailItem label="Cilindrada" value={String(cilindrada.cilindrada)} />
                        <DetailItem label="Creado el" value={cilindrada.createdAt ? new Date(cilindrada.createdAt).toLocaleString() : "-"} />
                        <DetailItem label="Actualizado el" value={cilindrada.updatedAt ? new Date(cilindrada.updatedAt).toLocaleString() : "-"} />
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
