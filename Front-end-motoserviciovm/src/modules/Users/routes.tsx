import { lazy } from "react";
import type{ RouteObject} from 'react-router-dom'
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const UsersList = lazy(() => import('./pages/UsersList'))
const UserDetail = lazy(() => import('./pages/UserDetail'))
const UserCreate = lazy(() => import('./pages/UserCreate'))
const UserEdit = lazy(() => import('./pages/UserEdit'))

export const UsersRoutes: RouteObject[] = [
    {
        path: 'Users',
        children: [
            {index: true, element: 
                <ProtectedRoute allowedPermisos={['usuarios:view']}>
                    <UsersList/>
                </ProtectedRoute>
            },
            { path: ':id', element:                 
                <ProtectedRoute allowedPermisos={['usuarios:detail']}>
                    <UserDetail/>
                </ProtectedRoute> },
            { path: 'create', element: 
                <ProtectedRoute allowedPermisos={['usuarios:create']}>
                    <UserCreate/>
                </ProtectedRoute>
            },
            { path: ':id/edit', element: 
                <ProtectedRoute allowedPermisos={['usuarios:update']}>
                    <UserEdit/>
                </ProtectedRoute>
            }
        ]
    }
]
