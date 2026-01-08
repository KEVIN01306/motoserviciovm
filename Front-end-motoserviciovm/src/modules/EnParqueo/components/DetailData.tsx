import { Card, CardContent, Grid, Typography, Button } from "@mui/material";
import type { EnParqueoGetType } from "../../../types/enParqueoType";
import { useGoTo } from "../../../hooks/useGoTo";

const DetailData = ({ item }: { item: EnParqueoGetType }) => {
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
            <Typography>{item.servicio?.moto?.placa ?? "-"}</Typography>
            {item.servicio?.moto?.id && (
              <Button size="small" variant="outlined" sx={{ mt: 1 }} onClick={() => goTo(`/admin/motos/${item?.servicio?.moto?.id}`)}>
                Ver Moto
              </Button>
            )}
          </Grid>
          <Grid size={6}>
            <Typography variant="subtitle2">Servicio</Typography>
            <Typography>{item.servicio?.id ?? "-"}</Typography>
            {item.servicio?.id && (
              <Button size="small" variant="outlined" sx={{ mt: 1 }} onClick={() => goTo(`/admin/servicios/${item.servicio?.id}`)}>
                Ver Servicio
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