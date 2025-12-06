import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const ProductosList = lazy(() => import("./pages/ProductosList"));
const ProductoDetail = lazy(() => import("./pages/ProductoDetail"));
const ProductoCreate = lazy(() => import("./pages/ProductoCreate"));
const ProductoEdit = lazy(() => import("./pages/ProductoEdit"));

export const ProductosRoutes: RouteObject[] = [
    {
        path: "productos",
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute allowedPermisos={["productos:view"]}>
                        <ProductosList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "create",
                element: (
                    <ProtectedRoute allowedPermisos={["productos:create"]}>
                        <ProductoCreate />
                    </ProtectedRoute>
                ),
            },
            {
                path: ":id",
                element: (
                    <ProtectedRoute allowedPermisos={["productos:detail"]}>
                        <ProductoDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: ":id/edit",
                element: (
                    <ProtectedRoute allowedPermisos={["productos:edit"]}>
                        <ProductoEdit />
                    </ProtectedRoute>
                ),
            },
        ],
    },
];
