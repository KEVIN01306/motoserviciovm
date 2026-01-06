import { type RouteObject } from 'react-router-dom';
import ProtectedRoute from '../../components/utils/ProtectedRoute';
import { lazy } from 'react';

const HomePages = lazy(() => import('../Home/pages/HomePages'));
const ContabilidadView = lazy(() => import('./pages/Contabilidad'));
const HistorialServicio = lazy(() => import('../Home/pages/HistorialServicio'));


const homeRoutes: RouteObject[] = [
  {
    path: '', // Relative path to align with parent route
    children: [
        {
        index: true,
        element: (
          <ProtectedRoute allowedPermisos={['home:view']}>
            <HomePages />
          </ProtectedRoute>
        ),
        },
        {
            path: 'contabilidad',
            element: (
                <ProtectedRoute allowedPermisos={['contabilidad:view']}>
                    <ContabilidadView />
                </ProtectedRoute>
            )
        },
        { path: 'historial-servicio/:id',
        element: (
          <ProtectedRoute allowedPermisos={['home:view']}>
            <HistorialServicio />
          </ProtectedRoute>
        ),
        },
    ],
  },
];

export default homeRoutes;