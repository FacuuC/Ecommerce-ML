import { create } from "zustand";
import { loginRequest, registerRequest, verifyTokenRequest } from "../api/authApi";
import { trackEvent } from "../services/trackingService";
import { useCartStore } from "./cartStore";
import { useSessionStore } from "./sessionStore";

export const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    isLoggedIn: false,
    isAuthLoading: false,
    setError: (error) => set({ error }),

    //Acciones
    login: async (email, password) => {
        set({ loading: true, error: null })

        const res = await loginRequest({ email, password })
        localStorage.setItem('token', res.data.token)

        try {
            await useCartStore.getState().fetchCart()

            set({
                user: res.data.userId,
                token: res.data.token,
                loading: false,
                isLoggedIn: true
            })
            return true

        } catch (err) {
            console.error("Error en login:", err)

            localStorage.removeItem('token')

            const message =
                err.response?.data?.message ||
                'Email o contraseña incorrectos';

            set({
                error: message,
                loading: false
            });

            trackEvent("LOGIN_FAILED", null, {
                method: "email_password",
                errorMessage: message
            })

            return false
        }
    },

    register: async (name, email, password, confirmPassword) => {
        set({ loading: true, error: null })

        try {
            const res = await registerRequest({
                firstName: name,
                email,
                password,
                confirmPassword
            })

            set({
                user: res.data.user,
                token: res.data.token,
                loading: false,
                error: null
            })

            trackEvent("REGISTER", null,{
                method: "email_password",
            })

            return true

        } catch (err) {
            const apiError = err.response?.data;

            set({
                error: apiError ?? {
                    code: "UNKNOWN_ERROR",
                    message: "Error inesperado. Por favor, intenta nuevamente.",
                    field: null
                },
                loading: false
            });

            return false
        }
    },


    logout: () => {
        set({
            user: null,
            token: null,
            isLoggedIn: false
        })

        localStorage.removeItem('token')
        useSessionStore.getState().resetSession()
        useCartStore.getState().clearCart()
        trackEvent("LOGOUT", null, {
            method: "email_password",
        })
    }, 


    bootstrapSession: async () => {
        await useCartStore.getState().fetchCart()

        trackEvent("LOGIN", null,{
                    method: "email_password",
        })
    },


    restoreSession: async (token) => {
        try {
            await verifyTokenRequest() // Verifica si el token es válido y obtiene datos del usuario

            set({ token, isLoggedIn: true, isAuthLoading: false })

            await useCartStore.getState().fetchCart() // Restaura el carrito asociado a la sesión

        } catch (error) {
            console.error("Error restaurando sesión:", error)

            localStorage.removeItem('token')
            set({ token: null, isLoggedIn: false, isAuthLoading: false })
        }
    }
}))