import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const EnParqueoList = lazy(() => import("./pages/EnParqueoList"));
const EnParqueoCreate = lazy(() => import("./pages/EnParqueoCreate"));
const EnParqueoDetail = lazy(() => import("./pages/EnParqueoDetail"));
const EnParqueoSalida = lazy(() => import("./pages/EnParqueoSalida"));

export const EnParqueoRoutes: RouteObject[] = [
  {
    path: "enparqueo",
    children: [
      { index: true, element: (<ProtectedRoute allowedPermisos={["enparqueo:view"]}><EnParqueoList/></ProtectedRoute>) },
      { path: "create", element: (<ProtectedRoute allowedPermisos={["enparqueo:create"]}><EnParqueoCreate/></ProtectedRoute>) },
      { path: ":id", element: (<ProtectedRoute allowedPermisos={["enparqueo:detail"]}><EnParqueoDetail/></ProtectedRoute>) },
      { path: ":id/salida", element: (<ProtectedRoute allowedPermisos={["enparqueo:salida"]}><EnParqueoSalida/></ProtectedRoute>) },
    ],
  },
];
