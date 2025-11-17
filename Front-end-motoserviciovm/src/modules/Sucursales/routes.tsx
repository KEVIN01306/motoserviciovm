import { lazy } from "react";
import type{ RouteObject} from 'react-router-dom'
import ProtectedRoute from "../../components/utils/ProtectedRoute";

const SucursalesList = lazy(() => import('./pages/SucursalesList'))
const SucursalDetail = lazy(() => import('./pages/SucursalDetail'))
const SucursalCreate = lazy(() => import('./pages/SucursalCreate'))
const SucursalEdit = lazy(() => import('./pages/SucursalEdit'))

export const SucursalesRoutes: RouteObject[] = [
    {
        path: 'sucursales',
        children: [
            {index: true, element: 
                <ProtectedRoute allowedPermisos={['sucursales:view']}>
                    <SucursalesList/>
                </ProtectedRoute>
            },
            { path: ':id', element:                 
                <ProtectedRoute allowedPermisos={['sucursales:detail']}>
                    <SucursalDetail/>
                </ProtectedRoute> },
            { path: 'create', element: 
                <ProtectedRoute allowedPermisos={['sucursales:create']}>
                    <SucursalCreate/>
                </ProtectedRoute>
            },
            { path: ':id/edit', element: 
                <ProtectedRoute allowedPermisos={['sucursales:edit']}>
                    <SucursalEdit/>
                </ProtectedRoute>
            }
        ]
    }
]
