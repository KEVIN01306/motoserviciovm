// src/modules/Auth/components/AuthRouteGuard.tsx

import { useAuthStore } from '../../../store/useAuthStore';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { errorToast } from '../../../utils/toast';
import LoadingLogo from '../../../components/LoadingLogo';

const AuthRouteGuard = () => {
    // 🔑 Estados del Store: Ahora dependemos de isAuthReady
    const token = useAuthStore(state => state.token);
    const user = useAuthStore(state => state.user);
    const refreshMe = useAuthStore(state => state.refreshMe);
    
    // Estos tres son cruciales para la lógica de sincronización:
    const isHydrated = useAuthStore(state => state._hasHydrated);
    const isAuthReady = useAuthStore(state => state.isAuthReady); // 🔑 USAR ESTE EN LUGAR DE isLoading

    useEffect(() => {
        
        // Lógica de inicialización:
        // Solo ejecutamos refreshMe si:
        // 1. El estado ha sido recuperado de localStorage (isHydrated).
        // 2. Hay un token.
        // 3. Los datos del usuario aún no se han cargado (user es null).
        // 4. El proceso de autenticación aún no ha terminado (isAuthReady es false).
        
        if (isHydrated && token && !user && !isAuthReady) {
            // La llamada a refreshMe ahora se encarga de:
            // a) Llamar a /auth/me.
            // b) Limpiar el estado si falla (logout).
            // c) Poner isAuthReady en TRUE al finalizar, exitosa o fallidamente.
            refreshMe().catch(() => {
                errorToast("Fallo al refrescar sesión");
            });
        }
        
    }, [refreshMe, token, isHydrated, user, isAuthReady]); // Agregar isAuthReady como dependencia

    // 1. ⏳ Muestra el Loader mientras no esté listo (sin importar si es hidratado)
    // El onRehydrateStorage en el store se encarga de que isAuthReady sea false si hay token.
    if (!isAuthReady) {
        return (
            <LoadingLogo/>
        );
    }

    // 2. 🚫 Redirige si la sesión es inválida
    // Si isAuthReady es true y no tenemos token, la verificación terminó y falló.
    if (!token) {
        return <Navigate to="/public/auth/login" replace />;
    }

    // 3. ✅ La sesión está lista, los permisos están cargados y el user existe
    return <Outlet />; 
};

export default AuthRouteGuard;