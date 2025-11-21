import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const LineasList = lazy(() => import("./pages/LineasList"));
const LineaDetail = lazy(() => import("./pages/LineaDetail"));
const LineaCreate = lazy(() => import("./pages/LineaCreate"));
const LineaEdit = lazy(() => import("./pages/LineaEdit"));

export const LineasRoutes: RouteObject[] = [
    {
        path: "lineas",
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute allowedPermisos={["lineas:view"]}>
                        <LineasList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "create",
                element: (
                    <ProtectedRoute allowedPermisos={["lineas:create"]}>
                        <LineaCreate />
                    </ProtectedRoute>
                ),
            },
            {
                path: ":id",
                element: (
                    <ProtectedRoute allowedPermisos={["lineas:detail"]}>
                        <LineaDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: ":id/edit",
                element: (
                    <ProtectedRoute allowedPermisos={["lineas:edit"]}>
                        <LineaEdit />
                    </ProtectedRoute>
                ),
            },
        ],
    },
];
