import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const IngresosEgresosList = lazy(() => import("./pages/IngresosEgresosList"));
const IngresoEgresoCreate = lazy(() => import("./pages/IngresoEgresoCreate"));
const IngresoEgresoDetail = lazy(() => import("./pages/IngresoEgresoDetail"));
const IngresoEgresoEdit = lazy(() => import("./pages/IngresoEgresoEdit"));

export const IngresosEgresosRoutes: RouteObject[] = [
  {
    path: "ingresos-egresos",
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedPermisos={["ingresos-egresos:view"]}>
            <IngresosEgresosList />
          </ProtectedRoute>
        ),
      },
      {
        path: "create",
        element: (
          <ProtectedRoute allowedPermisos={["ingresos-egresos:create"]}>
            <IngresoEgresoCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: ":id",
        element: (
          <ProtectedRoute allowedPermisos={["ingresos-egresos:detail"]}>
            <IngresoEgresoDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: ":id/edit",
        element: (
          <ProtectedRoute allowedPermisos={["ingresos-egresos:edit"]}>
            <IngresoEgresoEdit />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
