import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const EnReparacionList = lazy(() => import("./pages/EnReparacionList"));
const EnReparacionCreate = lazy(() => import("./pages/EnReparacionCreate"));
const EnReparacionDetail = lazy(() => import("./pages/EnReparacionDetail"));
const EnReparacionSalida = lazy(() => import("./pages/EnReparacionSalida"));
const EnReparacionEdit = lazy(() => import("./pages/EnReparacionEdit"));

export const EnReparacionRoutes: RouteObject[] = [
  {
    path: "enreparacion",
    children: [
      { index: true, element: (<ProtectedRoute allowedPermisos={["enreparacion:view"]}><EnReparacionList/></ProtectedRoute>) },
      { path: "create", element: (<ProtectedRoute allowedPermisos={["enreparacion:create"]}><EnReparacionCreate/></ProtectedRoute>) },
      { path: ":id", element: (<ProtectedRoute allowedPermisos={["enreparacion:detail"]}><EnReparacionDetail/></ProtectedRoute>) },
      { path: ":id/edit", element: (<ProtectedRoute allowedPermisos={["enreparacion:edit"]}><EnReparacionEdit/></ProtectedRoute>) },
      { path: ":id/salida", element: (<ProtectedRoute allowedPermisos={["enreparacion:salida"]}><EnReparacionSalida/></ProtectedRoute>) },
    ],
  },
];
