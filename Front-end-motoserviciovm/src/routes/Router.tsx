import { lazy } from "react";
import FullLayout from "../layouts/Full/FullLayout";
import { createBrowserRouter, Navigate } from "react-router-dom";
import BlankLayout from "../layouts/Blanck/BlankLayout";
import { UsersRoutes } from "../modules/Users/routes";
import { authRoutes } from "../modules/Auth/routes";

const Home = lazy(() => import('../modules/LandingPages/index'))


const Router = [
    { index: true, element: <Home /> },
    {
        path: "/admin",
        element: (
            <FullLayout/>
        ),
        children: [
            { index: true, element: <Home /> },

            ...UsersRoutes,

            { path: '*',  element: <h1>Pagina no encontrada</h1> }
        ]
    },
    {
        path: "/public",
        element: <BlankLayout/>,
        children: [
            ...authRoutes,
            { path: '*',  element: <h1>Pagina no encontrada</h1> }
        ]
    },
    {
        path: '*', element: <Navigate to="/public/auth/login" replace />
    }
]

const router = createBrowserRouter(Router);
export default router;