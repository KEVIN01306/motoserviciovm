import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const OpcionesServiciosList = lazy(() => import("./pages/OpcionesServiciosList"));
const OpcionesServiciosDetail = lazy(() => import("./pages/OpcionesServiciosDetail"));
const OpcionesServiciosCreate = lazy(() => import("./pages/OpcionesServiciosCreate"));
const OpcionesServiciosEdit = lazy(() => import("./pages/OpcionesServiciosEdit"));

export const OpcionesServiciosRoutes: RouteObject[] = [
  {
    path: "opcionservicio",
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedPermisos={["opcioneservicios:view"]}>
            <OpcionesServiciosList />
          </ProtectedRoute>
        ),
      },
      {
        path: "create",
        element: (
          <ProtectedRoute allowedPermisos={["opcioneservicios:create"]}>
            <OpcionesServiciosCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: ":id",
        element: (
          <ProtectedRoute allowedPermisos={["opcioneservicios:detail"]}>
            <OpcionesServiciosDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: ":id/edit",
        element: (
          <ProtectedRoute allowedPermisos={["opcioneservicios:edit"]}>
            <OpcionesServiciosEdit />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
