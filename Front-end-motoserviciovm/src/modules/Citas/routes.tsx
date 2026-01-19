import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const CitasList = lazy(() => import("./pages/CitasList"));
const CitasCreate = lazy(() => import("./pages/CitasCreate"));
const CitasEdit = lazy(() => import("./pages/CitasEdit"));
const CitasDetail = lazy(() => import("./pages/CitasDetail"));

export const CitasRoutes: RouteObject[] = [
  {
    path: "citas",
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedPermisos={["citas:view"]}>
            <CitasList />
          </ProtectedRoute>
        ),
      },
      {
        path: "create",
        element: (
          <ProtectedRoute allowedPermisos={["citas:create"]}>
            <CitasCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: ":id",
        element: (
          <ProtectedRoute allowedPermisos={["citas:detail"]}>
            <CitasDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: ":id/edit",
        element: (
          <ProtectedRoute allowedPermisos={["citas:edit"]}>
            <CitasEdit />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default CitasRoutes;
