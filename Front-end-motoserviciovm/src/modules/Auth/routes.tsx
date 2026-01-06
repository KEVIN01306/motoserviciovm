import { lazy } from 'react'
import type{ RouteObject  }from 'react-router-dom'

const Login = lazy(() => import('./pages/Login'))
const LoginClientes = lazy(() => import('./pages/LoginClientes'))
const AccesError = lazy(() => import('./pages/AccesError'))
//const Register = lazy(() => import('./pages/Register'))


export const authRoutes: RouteObject[] = [
    {
        path: 'auth',

        children: [
            { path: 'login', element: <Login/>},
            { path: 'login-clientes', element: <LoginClientes/>},
            //{ path: 'register', element: <Register/>}
        ]
    },
    {
        path: 'acceso-denegado',
        element: <AccesError/>
    }
]