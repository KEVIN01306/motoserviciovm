import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const ModelosList = lazy(() => import("./pages/ModelosList"));
const ModeloDetail = lazy(() => import("./pages/ModeloDetail"));
const ModeloCreate = lazy(() => import("./pages/ModeloCreate"));
const ModeloEdit = lazy(() => import("./pages/ModeloEdit"));

export const ModelosRoutes: RouteObject[] = [
    {
        path: "modelos",
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute allowedPermisos={["modelos:view"]}>
                        <ModelosList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "create",
                element: (
                    <ProtectedRoute allowedPermisos={["modelos:create"]}>
                        <ModeloCreate />
                    </ProtectedRoute>
                ),
            },
            {
                path: ":id",
                element: (
                    <ProtectedRoute allowedPermisos={["modelos:detail"]}>
                        <ModeloDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: ":id/edit",
                element: (
                    <ProtectedRoute allowedPermisos={["modelos:edit"]}>
                        <ModeloEdit />
                    </ProtectedRoute>
                ),
            },
        ],
    },
];
