import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../../components/utils/ProtectedRoute';

const ServiciosList = lazy(() => import('./pages/ServiciosList'));
const ServicioCreate = lazy(() => import('./pages/ServicioCreate'));
const ServicioDetail = lazy(() => import('./pages/ServicioDetail'));
const ServicioEdit = lazy(() => import('./pages/ServicioEdit'));
const ServicioSalida = lazy(() => import('./pages/ServicioSalida'));
const ServicioDetailSalida = lazy(() => import('./pages/ServicioDetailSalida'));


export const ServiciosRoutes: RouteObject[] = [
  {
    path: 'servicios',
    children: [
      { index: true, element: (<ProtectedRoute allowedPermisos={["servicios:view"]}><ServiciosList /></ProtectedRoute>) },
      { path: 'create', element: (<ProtectedRoute allowedPermisos={["servicios:create"]}><ServicioCreate /></ProtectedRoute>) },
      { path: ':id', element: (<ProtectedRoute allowedPermisos={["servicios:detail"]}><ServicioDetail /></ProtectedRoute>) },
      { path: ':id/salidaDetalle', element: (<ProtectedRoute allowedPermisos={["servicios:detail"]}><ServicioDetailSalida /></ProtectedRoute>) },
      { path: ':id/edit', element: (<ProtectedRoute allowedPermisos={["servicios:edit"]}><ServicioEdit /></ProtectedRoute>) },
      { path: ':id/salida', element: (<ProtectedRoute allowedPermisos={["servicios:salida"]}><ServicioSalida /></ProtectedRoute>) },

    ],
  },
];
