import { Routes, Route } from 'react-router'
import { lazy, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'

import { Header } from "./components/Header.jsx"
import { Footer } from "./components/Footer.jsx"
import { ProtectedRoute } from './components/ProtectedRoute.jsx'

import './App.css'

const HomePage = lazy(() => import("./pages/Home.jsx"))
const SearchPage = lazy(() => import("./pages/Search.jsx"))
const NotFoundPage = lazy(() => import('./pages/404.jsx'))
const CelDetail = lazy(() => import('./pages/Detail.jsx'))
const ProfilePage = lazy(() => import("./pages/Profile.jsx"))
const LoginPage = lazy(() => import("./pages/Login.jsx"))
const RegisterPage = lazy(() => import("./pages/Register.jsx"))

export function App() {

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
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
            <Footer />
        </>
    )
}