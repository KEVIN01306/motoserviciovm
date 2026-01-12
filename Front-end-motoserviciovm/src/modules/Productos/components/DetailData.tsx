import { Box, Grid, Typography, Divider, Card, CardContent, Button } from "@mui/material";
import type { ProductoGetType } from "../../../types/productoType";
import { useGoTo } from "../../../hooks/useGoTo";
import { useAuthStore } from "../../../store/useAuthStore";

const API_URL = import.meta.env.VITE_DOMAIN;

type Props = {
  producto?: ProductoGetType | null;
  id?: string | undefined;
};

const DetailData = ({ producto, id }: Props) => {
  const goTo = useGoTo();
  const user = useAuthStore((state) => state.user);

  if (!producto) return null;

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            {producto?.nombre}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              {producto?.imagen ? (
                <Box
                  component="img"
                  src={String(producto.imagen).startsWith('http') ? String(producto.imagen) : API_URL + producto.imagen}
                  alt={producto?.nombre ?? "imagen"}
                  sx={{ width: "100%", maxHeight: 400, objectFit: "contain", borderRadius: 1 }}
                />
              ) : (
                <Box sx={{ width: "100%", height: 200, bgcolor: "#f3f4f6", borderRadius: 1 }} />
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: (producto?.imagen ? 6 : 12) }}>
            <Box>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
                <Typography sx={{ minWidth: 120, color: "#6b7280", fontWeight: 600 }}>Descripción</Typography>
                <Typography>{producto?.descripcion ?? "-"}</Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
                <Typography sx={{ minWidth: 120, color: "#6b7280", fontWeight: 600 }}>Costo</Typography>
                <Typography>{producto?.costo != null ? "Q "+String(producto.costo) : "-"}</Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
                <Typography sx={{ minWidth: 120, color: "#6b7280", fontWeight: 600 }}>Precio</Typography>
                <Typography>{producto?.precio != null ? "Q "+String(producto.precio) : "-"}</Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
                <Typography sx={{ minWidth: 120, color: "#6b7280", fontWeight: 600 }}>Cantidad</Typography>
                <Typography>{producto?.cantidad ?? "-"}</Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
                <Typography sx={{ minWidth: 120, color: "#6b7280", fontWeight: 600 }}>Categoría</Typography>
                <Typography>{producto?.categoria?.categoria ?? "-"}</Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Typography sx={{ minWidth: 120, color: "#6b7280", fontWeight: 600 }}>Creado el</Typography>
                <Typography>{producto?.createdAt ? new Date(producto.createdAt).toLocaleString() : "-"}</Typography>
              </Box>
              
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Typography sx={{ minWidth: 120, color: "#6b7280", fontWeight: 600 }}>Actualizado el</Typography>
                <Typography>{producto?.updatedAt ? new Date(producto.updatedAt).toLocaleString() : "-"}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        {
            user?.permisos?.includes("productos:edit") && id && (

                <Grid>  
                <Button variant="contained" onClick={() => goTo(`/admin/productos/${id}/edit`)}>Editar</Button>
                </Grid>
            )
        }
      </CardContent>
    </Card>
  );
};

export default DetailData;
