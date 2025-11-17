import { lazy } from "react";
import type{ RouteObject} from 'react-router-dom'
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const PermisosList = lazy(() => import('./pages/PermisoList'));



export const PermisosRoutes: RouteObject[] = [
    {
        path: 'Permisos',
        children: [
            {index: true, element: 
                <ProtectedRoute allowedPermisos={['permisos:view']}>
                    <PermisosList/>
                </ProtectedRoute>
            },
            { path: ':id/edit', element: 
                <ProtectedRoute allowedPermisos={['permisos:edit']}>
                    <PermisosList/>
                </ProtectedRoute>
            }
        ]
    }
]
