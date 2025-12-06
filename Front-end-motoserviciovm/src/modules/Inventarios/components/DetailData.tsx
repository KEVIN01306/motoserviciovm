import { Box, Grid, Typography, Divider, Card, CardContent } from "@mui/material";
import type { InventarioType } from "../../../types/inventarioType";

type Props = {
  item?: InventarioType | null;
};

const DetailData = ({ item }: Props) => {
  if (!item) return null;

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            {item.item}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid size={12}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography sx={{ minWidth: 140, color: "#6b7280", fontWeight: 600 }}>Descripción</Typography>
              <Typography>{item.descripcion ?? "-"}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid size={12}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography sx={{ minWidth: 140, color: "#6b7280", fontWeight: 600 }}>Activo</Typography>
              <Typography>{item.activo ? "Sí" : "No"}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DetailData;
