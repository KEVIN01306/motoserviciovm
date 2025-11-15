import type React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

interface ProtectedRouteProps{
    children: React.ReactNode;
    allowedPermisos: string[];
}

const ProtectedRoute = ({ children, allowedPermisos }: ProtectedRouteProps) => {
    const user = useAuthStore.getState().user

    if (user?.roles < 0) return <Navigate to={'/public/auth/login'} replace />

    if (!allowedPermisos.some(permiso => user.permisos.includes(permiso))) return <Navigate to={'/public/auth/login'} replace/>

    return children;

}


export default ProtectedRoute;