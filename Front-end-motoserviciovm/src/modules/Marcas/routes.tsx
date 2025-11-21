import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const MarcasList = lazy(() => import("./pages/MarcasList"));
const MarcaDetail = lazy(() => import("./pages/MarcaDetail"));
const MarcaCreate = lazy(() => import("./pages/MarcaCreate"));
const MarcaEdit = lazy(() => import("./pages/MarcaEdit"));

export const MarcasRoutes: RouteObject[] = [
    {
        path: "marcas",
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute allowedPermisos={["marcas:view"]}>
                        <MarcasList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "create",
                element: (
                    <ProtectedRoute allowedPermisos={["marcas:create"]}>
                        <MarcaCreate />
                    </ProtectedRoute>
                ),
            },
            {
                path: ":id",
                element: (
                    <ProtectedRoute allowedPermisos={["marcas:detail"]}>
                        <MarcaDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: ":id/edit",
                element: (
                    <ProtectedRoute allowedPermisos={["marcas:edit"]}>
                        <MarcaEdit />
                    </ProtectedRoute>
                ),
            },
        ],
    },
];

