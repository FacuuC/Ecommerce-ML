import { create } from "zustand";
import { loginRequest, registerRequest } from "../api/authApi";

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    isLoggedInIn: false,
    setError: (error) => set({ error }),

    //Acciones
    login: async (email, password) => {
        set({ loading: true, error: null })

        try {
            const res = await loginRequest({ email, password })

            set({
                user: res.data.user,
                token: res.data.token,
                loading: false,
                isLoggedIn: true
            })

            localStorage.setItem('token', res.data.token)
            return true

        } catch (err) {

            const message =
                err.response?.data?.message ||
                'Email o contraseña incorrectos';

            set({
                error: message,
                loading: false
            });

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
    }
}))