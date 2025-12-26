import { type RouteObject } from 'react-router-dom';
import ProtectedRoute from '../../components/utils/ProtectedRoute';
import { lazy } from 'react';

const HomePages = lazy(() => import('../Home/pages/HomePages'));
const ContabilidadView = lazy(() => import('./pages/Contabilidad'));

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
        }
    ],
  },
];

export default homeRoutes;