import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const VentasList = lazy(() => import("./pages/VentasList"));
const VentaCreate = lazy(() => import("./pages/VentaCreate"));
const VentaDetail = lazy(() => import("./pages/VentaDetail"));
const VentaEdit = lazy(() => import("./pages/VentaEdit"));

export const VentasRoutes: RouteObject[] = [
  {
    path: "ventas",
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedPermisos={["ventas:view"]}>
            <VentasList />
          </ProtectedRoute>
        ),
      },
      {
        path: "create",
        element: (
          <ProtectedRoute allowedPermisos={["ventas:create"]}>
            <VentaCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: ":id",
        element: (
          <ProtectedRoute allowedPermisos={["ventas:detail"]}>
            <VentaDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: ":id/edit",
        element: (
          <ProtectedRoute allowedPermisos={["ventas:edit"]}>
            <VentaEdit />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
