import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const CategoriaProductoList = lazy(() => import("./pages/CategoriaProductoList"));
const CategoriaProductoDetail = lazy(() => import("./pages/CategoriaProductoDetail"));
const CategoriaProductoCreate = lazy(() => import("./pages/CategoriaProductoCreate"));
const CategoriaProductoEdit = lazy(() => import("./pages/CategoriaProductoEdit"));

export const CategoriaProductoRoutes: RouteObject[] = [
  {
    path: "categoriaproducto",
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedPermisos={["categoriaproducto:view"]}>
            <CategoriaProductoList />
          </ProtectedRoute>
        ),
      },
      {
        path: "create",
        element: (
          <ProtectedRoute allowedPermisos={["categoriaproducto:create"]}>
            <CategoriaProductoCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: ":id",
        element: (
          <ProtectedRoute allowedPermisos={["categoriaproducto:detail"]}>
            <CategoriaProductoDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: ":id/edit",
        element: (
          <ProtectedRoute allowedPermisos={["categoriaproducto:edit"]}>
            <CategoriaProductoEdit />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
