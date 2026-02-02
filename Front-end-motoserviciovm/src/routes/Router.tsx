import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
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
import { customizeLandingRoutes } from "../modules/AdminLanding/routes";


const Index = lazy(() => import('../modules/LandingPages/index'))
const NotFound = lazy(() => import('../components/PagesNotFound'))


const FullLayout = lazy(() => import('../layouts/Full/FullLayout'));
const BlankLayout = lazy(() => import('../layouts/Blanck/BlankLayout'));

const LoadingComponente = lazy(() => import('../components/LoadingLogo'));

const Router = [
    { index: true, element: <Index />},
    {
        path: "/public",
        element: <Suspense fallback={<LoadingComponente />}><BlankLayout /></Suspense>,
        children: [
            ...authRoutes,
        ]
    },

    {   
        path: "/admin",
        element: <Suspense fallback={<LoadingComponente />}><AuthRouteGuard /></Suspense>,
        children: [
            {
                element: (
                    <Suspense fallback={<LoadingComponente />}><FullLayout /></Suspense>
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
                    ...CitasRoutes,
                    ...customizeLandingRoutes
                ]
            },

        ]
    },

    { 
        path: '*', element: <Suspense fallback={<LoadingComponente />}><NotFound /></Suspense>
    }
]

const router = createBrowserRouter(Router);
export default router;