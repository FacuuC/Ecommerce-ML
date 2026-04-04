import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const authApi = axios.create({
    baseURL: 'http://localhost:8080'
})

authApi.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            useAuthStore.getState().logout()
            window.location.href = "/login"
        }
        return Promise.reject(err)
    }
)

export const loginRequest = (data) => 
    authApi.post('/auth/login', data)


export const registerRequest = (data) => 
    authApi.post('/auth/register', data)
