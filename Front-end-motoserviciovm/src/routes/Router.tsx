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
import { OpcionesServiciosRoutes } from "../modules/OpcionesServicios/routes";
import { TiposServiciosRoutes } from "../modules/TiposServicios/routes";
import { CategoriaProductoRoutes } from "../modules/CategoriaProducto/routes";
import { InventariosRoutes } from "../modules/Inventarios/routes";
import { ProductosRoutes } from "../modules/Productos/routes";
import { VentasRoutes } from "../modules/Ventas/routes";
import { IngresosEgresosRoutes } from "../modules/IngresosEgresos/routes";
import { MotosRoutes } from "../modules/Motos/routes";
import { EnParqueoRoutes } from "../modules/EnParqueo/routes";
import { EnReparacionRoutes } from "../modules/EnReparacion/routes";
import AuthRouteGuard from "../modules/Auth/components/AuthRouteGuard";
import { ServiciosRoutes } from "../modules/Servicios/routes";
import horariosRoutes from "../modules/Horarios/routes";
import homeRoutes from "../modules/Home/routes";
import CitasRoutes from "../modules/Citas/routes";

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
                    

                    ...UsersRoutes,
                    ...RolesRoutes,
                    ...PermisosRoutes,
                    ...SucursalesRoutes,
                    ...LineasRoutes,
                    ...CilindradaRoutes,
                    ...OpcionesServiciosRoutes,
                    ...TiposServiciosRoutes,
                    ...CategoriaProductoRoutes,
                    ...InventariosRoutes,
                    ...EnParqueoRoutes,
                    ...EnReparacionRoutes,
                    ...ProductosRoutes,
                    ...VentasRoutes,
                    ...IngresosEgresosRoutes,
                    ...MarcasRoutes,
                    ...ModelosRoutes,
                    ...MotosRoutes,
                    ...ServiciosRoutes,
                    ...homeRoutes,
                    ...horariosRoutes,
                    ...CitasRoutes
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