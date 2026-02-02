import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/utils/ProtectedRoute";


const SlidePages = lazy(() => import("./Slide/pages/SlidesPage"));
const AboutImagesPage = lazy(() => import("./AboutImage/pages/AboutImagesPage"));
const ValoresPage = lazy(() => import("./Valores/pages/ValoresPage"));
const ContactoPage = lazy(() => import("./Contacto/pages/ContactoPage"));
const TextosPage = lazy(() => import("./Textos/pages/TextosPage"));

export const customizeLandingRoutes: RouteObject[] = [
  {
    path: "customize-landing",
    children: [
      {
        path: 'slides',
        element: (
          <ProtectedRoute allowedPermisos={["customize-landing:slideManagemente"]}>
            <SlidePages />
          </ProtectedRoute>
        ),
      },
      {
        path: 'about-images',
        element: (
          <ProtectedRoute allowedPermisos={["customize-landing:aboutImageManagemente"]}>
            <AboutImagesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'valores',
        element: (
          <ProtectedRoute allowedPermisos={["customize-landing:valorManagemente"]}>
            <ValoresPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'contacto',
        element: (
          <ProtectedRoute allowedPermisos={["customize-landing:contactoManagemente"]}>
            <ContactoPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'textos',
        element: (
          <ProtectedRoute allowedPermisos={["customize-landing:textoManagemente"]}>
            <TextosPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default customizeLandingRoutes;
