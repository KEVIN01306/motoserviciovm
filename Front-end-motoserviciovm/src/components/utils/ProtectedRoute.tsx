import type React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore"; // 1. Usar el hook correctamente

interface ProtectedRouteProps{
    children: React.ReactNode;
    allowedPermisos: string[];
}

const ProtectedRoute = ({ children, allowedPermisos }: ProtectedRouteProps) => {
    
    const user = useAuthStore(state => state.user);

    if (!user) {
        return <Navigate to={'/public/auth/login'} replace />;
    }

    const userPermisos = user.permisos || [];

    const hasPermission = allowedPermisos.some(permisoRequerido => 
        userPermisos.includes(permisoRequerido)
    );

    if (!hasPermission) {
        return <Navigate to={'/public/acceso-denegado'} replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;