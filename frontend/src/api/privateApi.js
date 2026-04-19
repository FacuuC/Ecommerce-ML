import { createClient } from "./apiClient";
import { useAuthStore } from "../store/authStore";

let isLoggingOut = false; // Bandera para evitar múltiples solicitudes de logout

const client = createClient()

// REQUEST -> token
client.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// RESPONSE -> 401
client.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401 && !isLoggingOut) {
            isLoggingOut = true;
            useAuthStore.getState().logout();
            window.location.replace('/login');
        }
        return Promise.reject(err)
    }   
)

export const privateApi = client