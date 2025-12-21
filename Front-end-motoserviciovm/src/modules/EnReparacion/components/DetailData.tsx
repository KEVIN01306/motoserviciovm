import { Card, CardContent, Grid, Typography, Button } from "@mui/material";
import type { EnReparacionGetType } from "../../../types/enReparacionType";
import { useGoTo } from "../../../hooks/useGoTo";

const DetailData = ({ item }: { item: EnReparacionGetType }) => {
  const goTo = useGoTo();

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h6">Descripción</Typography>
            <Typography>{item.descripcion ?? "-"}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="subtitle2">Fecha Entrada</Typography>
            <Typography>{item.fechaEntrada ? new Date(item.fechaEntrada).toLocaleString() : "-"}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="subtitle2">Fecha Salida</Typography>
            <Typography>{item.fechaSalida ? new Date(item.fechaSalida).toLocaleString() : "-"}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="subtitle2">Total</Typography>
            <Typography>{item.total ?? "-"}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="subtitle2">Moto</Typography>
            <Typography>{item.moto?.placa ?? "-"}</Typography>
            {item.moto?.id && (
              <Button size="small" variant="outlined" sx={{ mt: 1 }} onClick={() => goTo(`/admin/motos/${item.moto.id}`)}>
                Ver Moto
              </Button>
            )}
          </Grid>
          <Grid size={12}>
            <Typography variant="subtitle2">Observaciones</Typography>
            <Typography>{item.observaciones ?? "-"}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DetailData;
