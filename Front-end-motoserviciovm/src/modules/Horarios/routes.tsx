import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const HorariosList = lazy(() => import("./pages/HorariosList"));
const HorariosCreate = lazy(() => import("./pages/HorariosCreate"));
const HorariosEdit = lazy(() => import("./pages/HorariosEdit"));
const HorariosDetail = lazy(() => import("./pages/HorariosDetail"));

const horariosRoutes: RouteObject[] = [
  {
    path: 'horarios',
    children: [
      {
        index: true,
        element: <HorariosList />
      },
      {
        path: 'create',
        element: <HorariosCreate />
      },
      {
        path: ':id',
        element: <HorariosDetail />
      },
      {
        path: ':id/edit',
        element: <HorariosEdit />
      }
    ]
  }
];

export default horariosRoutes;
