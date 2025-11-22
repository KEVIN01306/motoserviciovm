import React from "react";
import { Box, Grid, Typography, Divider, Card, CardContent } from "@mui/material";

type Row = {
  label: string;
  value?: any;
};

type Props = {
  title?: string;
  rows: Row[];
  children?: React.ReactNode;
};

const formatValue = (value: any) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string") {
    const d = Date.parse(value);
    if (!isNaN(d)) return new Date(value).toLocaleString();
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "object") {
    if ((value as any).marca) return (value as any).marca;
    if ((value as any).linea) return (value as any).linea;
    if ((value as any).cilindrada) return String((value as any).cilindrada);
    if ((value as any).estado) return (value as any).estado;
    return JSON.stringify(value);
  }
  return String(value);
};

const DetailData = ({ title, rows, children }: Props) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {rows.map((row, idx) => (
            <Grid key={idx} size={12}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Typography sx={{ minWidth: 140, color: "#6b7280", fontWeight: 600 }}>{row.label}</Typography>
                <Typography>{formatValue(row.value)}</Typography>
              </Box>
              {idx < rows.length - 1 && <Divider sx={{ my: 1 }} />}
            </Grid>
          ))}
        </Grid>

        {children ? (
          <Box sx={{ mt: 2 }}>{children}</Box>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default DetailData;
