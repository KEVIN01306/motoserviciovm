import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const TiposServiciosList = lazy(() => import("./pages/TiposServiciosList"));
const TiposServiciosDetail = lazy(() => import("./pages/TiposServiciosDetail"));
const TiposServiciosCreate = lazy(() => import("./pages/TiposServiciosCreate"));
const TiposServiciosEdit = lazy(() => import("./pages/TiposServiciosEdit"));

export const TiposServiciosRoutes: RouteObject[] = [
  {
    path: "tiposervicio",
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedPermisos={["tiposervicios:view"]}>
            <TiposServiciosList />
          </ProtectedRoute>
        ),
      },
      {
        path: "create",
        element: (
          <ProtectedRoute allowedPermisos={["tiposervicios:create"]}>
            <TiposServiciosCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: ":id",
        element: (
          <ProtectedRoute allowedPermisos={["tiposervicios:detail"]}>
            <TiposServiciosDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: ":id/edit",
        element: (
          <ProtectedRoute allowedPermisos={["tiposervicios:edit"]}>
            <TiposServiciosEdit />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
