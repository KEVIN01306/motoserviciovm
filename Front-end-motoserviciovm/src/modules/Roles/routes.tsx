import { lazy } from "react";
import type{ RouteObject} from 'react-router-dom'
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const RolesList = lazy(() => import('./pages/RolesList'))
const RolesCreate = lazy(() => import('./pages/RolesCreate'))
const RolesEdit = lazy(() => import('./pages/RolesEdit'))


export const RolesRoutes: RouteObject[] = [
    {
        path: 'Roles',
        children: [
            {index: true, element: 
                <ProtectedRoute allowedPermisos={['roles:view']}>
                    <RolesList/>
                </ProtectedRoute>
            },
            { path: 'create', element: 
                <ProtectedRoute allowedPermisos={['roles:create']}>
                    <RolesCreate/>
                </ProtectedRoute>
            },
            { path: ':id/edit', element: 
                <ProtectedRoute allowedPermisos={['roles:edit']}>
                    <RolesEdit/>
                </ProtectedRoute>
            }
        ]
    }
]
