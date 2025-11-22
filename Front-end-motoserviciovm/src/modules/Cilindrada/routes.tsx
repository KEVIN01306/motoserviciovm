import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const CilindradaList = lazy(() => import("./pages/CilindradaList"));
const CilindradaDetail = lazy(() => import("./pages/CilindradaDetail"));
const CilindradaCreate = lazy(() => import("./pages/CilindradaCreate"));
const CilindradaEdit = lazy(() => import("./pages/CilindradaEdit"));

export const CilindradaRoutes: RouteObject[] = [
	{
		path: "cilindrada",
		children: [
			{
				index: true,
				element: (
					<ProtectedRoute allowedPermisos={["cilindradas:view"]}>
						<CilindradaList />
					</ProtectedRoute>
				),
			},
			{
				path: "create",
				element: (
					<ProtectedRoute allowedPermisos={["cilindradas:create"]}>
						<CilindradaCreate />
					</ProtectedRoute>
				),
			},
			{
				path: ":id",
				element: (
					<ProtectedRoute allowedPermisos={["cilindradas:detail"]}>
						<CilindradaDetail />
					</ProtectedRoute>
				),
			},
			{
				path: ":id/edit",
				element: (
					<ProtectedRoute allowedPermisos={["cilindradas:edit"]}>
						<CilindradaEdit />
					</ProtectedRoute>
				),
			},
		],
	},
];
