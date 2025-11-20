import { create } from "zustand";
import type { AuthType } from "../types/authType";
import { persist } from "zustand/middleware";
import { getMe, postLogin } from "../services/auth.services";

interface AuthState {
    user: any;
    token: string | null;
    error: null | string;

    login: (data: AuthType) => Promise<void>;
    logout: () => void;
    refreshMe: () => Promise<void>;

    isAuthReady: boolean;

     _hasHydrated?: boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            error: null,
            _hasHydrated: false,
            isAuthReady: false,

            login: async (data: AuthType) => {
                try {
                    set({ error: null });
                    const { user, token } = await postLogin(data);
                    set({ user, token, isAuthReady: true });
                } catch (error: any) {
                    set({ error: error.message, isAuthReady: true });
                    throw error;
                }
            },

            logout: () => {
                set({ user: null, token: null });
            },

            refreshMe: async() => {
                const token = get().token;

                if (!token) return

                try {
                    const response = await getMe();
                    const updatedToken = response.token || token;
                    
                    set({ user: response.user, token: updatedToken, error: null, isAuthReady: true })
                }catch (error){
                    set({ token: null, user: null, error: "Token Expirado o no Valido",isAuthReady: true })
                    throw error;
                }
            }

        }),
        {
            name: "auth-storage",
            onRehydrateStorage: () => (state) => {
                if (!state) return;

                state._hasHydrated  = true

                if (state.token) {
                    state.isAuthReady = false; 
                } else {
                    // Si no hay token, la autenticación ya está "lista" (no hay sesión)
                    state.isAuthReady = true;
                }
            },
            partialize: (state) => ({
                token: state.token,
            }),
        }
    )
);
