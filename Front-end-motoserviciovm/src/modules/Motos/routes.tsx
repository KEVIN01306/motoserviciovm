import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const MotosList = lazy(() => import("./pages/MotosList"));
const MotoDetail = lazy(() => import("./pages/MotoDetail"));
const MotoCreate = lazy(() => import("./pages/MotoCreate"));
const MotoEdit = lazy(() => import("./pages/MotoEdit"));

export const MotosRoutes: RouteObject[] = [
    {
        path: "motos",
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute allowedPermisos={["motos:view"]}>
                        <MotosList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "create",
                element: (
                    <ProtectedRoute allowedPermisos={["motos:create"]}>
                        <MotoCreate />
                    </ProtectedRoute>
                ),
            },
            {
                path: ":id",
                element: (
                    <ProtectedRoute allowedPermisos={["motos:detail"]}>
                        <MotoDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: ":id/edit",
                element: (
                    <ProtectedRoute allowedPermisos={["motos:edit"]}>
                        <MotoEdit />
                    </ProtectedRoute>
                ),
            },
        ],
    },
];
