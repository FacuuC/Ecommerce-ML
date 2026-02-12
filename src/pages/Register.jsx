import { AuthLayout } from "../components/AuthLayout"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { useId, useState } from "react"
import toast from "react-hot-toast"
import styles from "./LoginRegister.module.css"
import clsx from "clsx"

export default function RegisterPage() {
    const register = useAuthStore((state) => state.register)
    const error = useAuthStore((state) => state.error)
    const setError = useAuthStore((state) => state.setError)
    const loading = useAuthStore((state) => state.loading)

    const [visibleFIelds, setVisibleFields] = useState({
        password: false,
        confirmPassword: false
    })
    const navigate = useNavigate()
    const confirmPasswordId = useId()
    const nameId = useId()
    const passwordId = useId()
    const emailId = useId()

    const togglePasswordVisibility = (field) => {
        setVisibleFields(prev => ({
            ...prev,
            [field]: !prev[field]
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const name = formData.get("firstName")
        const email = formData.get("email")
        const password = formData.get("password")
        const confirmPassword = formData.get("confirmPassword")

        const success = await register(name, email, password, confirmPassword)
        if (success) {
            toast.success("Te registraste correctamente. Redirigiendo al inicio de sesión...")
            navigate('/login')
        }
    }

    return (
        <AuthLayout
            title="Crea tu cuenta ✨"
            subtitle="Completa tus datos para empezar a comprar"
        >
            <form className={styles.formContainer} onSubmit={handleSubmit} onChange={() => setError(null)}>

                {/* Nombre Completo */}
                <div className={styles.inputGroup}>
                    <label htmlFor="name" className={styles.label}>Nombre Completo</label>
                    <div className={styles.inputWrapper}>
                        <span className={styles.iconLeft}>👤</span>
                        <input
                            type="text"
                            name="firstName"
                            id={nameId}
                            placeholder="Juan Pérez"
                            className={styles.input}
                            required
                        />
                    </div>
                </div>

                {/* Email */}
                <div className={styles.inputGroup}>
                    <div className={styles.labelRow}>
                        <label htmlFor="email" className={styles.label}>Correo electrónico</label>

                        {error?.field === "email" && (
                            <p className={styles.errorText}>⚠ {error.message}</p>
                        )}
                    </div>
                    <div className={styles.inputWrapper}>
                        <span className={styles.iconLeft}>✉️</span>
                        <input
                            type="email"
                            name="email"
                            id={emailId}
                            placeholder="ejemplo@correo.com"
                            className={clsx(
                                styles.input,
                                error?.field === "email" && styles.error
                            )}
                            required
                        />
                    </div>
                </div>

                {/* Contraseña */}
                <div className={styles.inputGroup}>

                    <div className={styles.labelRow}>
                        <label htmlFor="password" className={styles.label}>Contraseña</label>

                        {error?.field === "password" && (
                            <p className={styles.errorText}>⚠ {error.message}</p>
                        )}
                    </div>
                    <div className={styles.inputWrapper}>
                        <span className={styles.iconLeft}>🔒</span>
                        <input
                            name="password"
                            type={visibleFIelds.password ? "text" : "password"}
                            id={passwordId}
                            placeholder="••••••••"
                            className={clsx(
                                styles.input,
                                error?.field === "password" && styles.error
                            )}
                            required
                        />
                        <button 
                            type="button"
                            className={styles.btnEye}
                            onClick={() => togglePasswordVisibility("password")}
                        >
                            👁️
                        </button>
                    </div>
                </div>

                {/* Confirmar Contraseña */}
                <div className={styles.inputGroup}>
                    <label htmlFor="confirm-password" className={styles.label}>Confirmar contraseña</label>
                    <div className={styles.inputWrapper}>
                        <span className={styles.iconLeft}>🔄</span>
                        <input
                            name="confirmPassword"
                            type={visibleFIelds.confirmPassword ? "text" : "password"}
                            id={confirmPasswordId}
                            placeholder="••••••••"
                            className={clsx(
                                styles.input,
                                error?.field === "password" && styles.error
                            )}
                            required
                        />
                        <button type="button"
                            className={styles.btnEye}
                            onClick={() => togglePasswordVisibility("confirmPassword")}
                        >
                            👁️
                        </button>
                    </div>
                </div>

                <button type="submit" className={styles.btnPrimary}>
                    Crear mi cuenta 👤+
                </button>

                <div className={styles.divider}>O regístrate con</div>

                {/* Botones sociales */}
                <div className={styles.socialButtons}>
                    <button type="button" className={styles.btnSocial}>
                        <img src="#" width="20" alt="" /> Google
                    </button>
                    <button type="button" className={styles.btnSocial}>
                        <img src="#" width="20" alt="" /> Apple
                    </button>
                </div>

                <button type="submit" className={styles.btnPrimary}>
                    Crear mi cuenta 👤+
                </button>
            </form>

            <p className={styles.authFooter}>
                ¿Ya tienes cuenta? <NavLink to="/login">Inicia Sesión</NavLink>
            </p>

        </AuthLayout>
    )
}