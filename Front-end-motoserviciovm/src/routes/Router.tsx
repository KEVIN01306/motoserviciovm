import { lazy } from "react";
import FullLayout from "../layouts/Full/FullLayout";
import { createBrowserRouter } from "react-router-dom";
import BlankLayout from "../layouts/Blanck/BlankLayout";
import { UsersRoutes } from "../modules/Users/routes";
import { authRoutes } from "../modules/Auth/routes";
import { RolesRoutes } from "../modules/Roles/routes";
import { PermisosRoutes } from "../modules/Permisos/routes";
import { SucursalesRoutes } from "../modules/Sucursales/routes";
import { LineasRoutes } from "../modules/Lineas/routes";
import { MarcasRoutes } from "../modules/Marcas/routes";
import { ModelosRoutes } from "../modules/Modelos/routes";
import { CilindradaRoutes } from "../modules/Cilindrada/routes";
import AuthRouteGuard from "../modules/Auth/components/AuthRouteGuard";

const Home = lazy(() => import('../modules/LandingPages/index'))
const HomePages = lazy(() => import('../modules/Home/pages/HomePages'))
const NotFound = lazy(() => import('../components/PagesNotFound'))


const Router = [
    { index: true, element: <Home /> },
    {
        path: "/public",
        element: <BlankLayout />,
        children: [
            ...authRoutes,
        ]
    },

    {   
        path: "/admin",
        element: <AuthRouteGuard />,
        children: [
            {
                element: (
                    <FullLayout />
                ),
                children: [
                    { index: true, element: <HomePages/> },

                    ...UsersRoutes,
                    ...RolesRoutes,
                    ...PermisosRoutes,
                    ...SucursalesRoutes,
                    ...LineasRoutes,
                    ...CilindradaRoutes,
                    ...MarcasRoutes,
                    ...ModelosRoutes,

                ]
            },

        ]
    },

    { 
        path: '*', element: <NotFound/> 
    }
]

const router = createBrowserRouter(Router);
export default router;