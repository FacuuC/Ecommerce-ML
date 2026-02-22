import { Routes, Route } from 'react-router'
import { lazy, Suspense, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

import { Header } from "./components/Header.jsx"
import { Footer } from "./components/Footer.jsx"
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { useAuthStore } from './store/authStore.js'


import './App.css'
import { useSessionStore } from './store/sessionStore.js'

const HomePage = lazy(() => import("./pages/Home.jsx"))
const SearchPage = lazy(() => import("./pages/Search.jsx"))
const NotFoundPage = lazy(() => import('./pages/404.jsx'))
const CelDetail = lazy(() => import('./pages/Detail.jsx'))
const ProfilePage = lazy(() => import("./pages/Profile.jsx"))
const LoginPage = lazy(() => import("./pages/Login.jsx"))
const RegisterPage = lazy(() => import("./pages/Register.jsx"))
const CartPage = lazy(() => import("./pages/Cart.jsx"))

export function App() {
    const initSession = useSessionStore((state) => state.initSession)

    useEffect(() => {
        document.title = "Matienzo Shop - Tu tienda de celulares online"
        initSession()
        const token = localStorage.getItem('token')

        if (token) {
            // Si hay un token, bootstrap de la sesión para cargar datos como el carrito
            useAuthStore.getState().restoreSession(token)
        }
    }, [])

    return (
        <>
            <Header />

            <Toaster position="top-right" reverseOrder={false} />
            <Suspense fallback={<div style={{maxWidth: '1280px', margin:'0 auto', padding:'0 1rem'}}>Cargando...</div>}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path='/search' element={<SearchPage />} />
                    <Route path='/profile' element={
                        <ProtectedRoute redirectTo="/login">
                            <ProfilePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/celulares/:celId" element={<CelDetail />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/cart" element={
                        <ProtectedRoute redirectTo="/login">
                            <CartPage />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
            <Footer />
        </>
    )
}