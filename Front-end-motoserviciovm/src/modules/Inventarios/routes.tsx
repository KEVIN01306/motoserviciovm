import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const InventariosList = lazy(() => import("./pages/InventariosList"));
const InventarioDetail = lazy(() => import("./pages/InventarioDetail"));
const InventarioCreate = lazy(() => import("./pages/InventarioCreate"));
const InventarioEdit = lazy(() => import("./pages/InventarioEdit"));

export const InventariosRoutes: RouteObject[] = [
    {
        path: "inventarios",
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute allowedPermisos={["inventarios:view"]}>
                        <InventariosList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "create",
                element: (
                    <ProtectedRoute allowedPermisos={["inventarios:create"]}>
                        <InventarioCreate />
                    </ProtectedRoute>
                ),
            },
            {
                path: ":id",
                element: (
                    <ProtectedRoute allowedPermisos={["inventarios:detail"]}>
                        <InventarioDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: ":id/edit",
                element: (
                    <ProtectedRoute allowedPermisos={["inventarios:edit"]}>
                        <InventarioEdit />
                    </ProtectedRoute>
                ),
            },
        ],
    },
];
