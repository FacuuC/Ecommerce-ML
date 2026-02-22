import { AuthLayout } from "../components/AuthLayout"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import {  useId, useState } from "react"
import styles from "../styles/LoginRegister.module.css"
import toast from "react-hot-toast"

export default function LoginPage() {
    const login = useAuthStore((state) => state.login)
    const error = useAuthStore((state) => state.error)
    const loading = useAuthStore((state) => state.loading)
    const setError = useAuthStore((state) => state.setError)

    const [visibleFields, setVisibleFields] = useState({
        password: false
    })

    const togglePasswordVisibility = () => {
        setVisibleFields(prev => ({
            ...prev,
            password: !prev.password
        }))
    }

    const navigate = useNavigate()
    const passwordId = useId()
    const emailId = useId()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const email = formData.get(emailId)
        const password = formData.get(passwordId)

        const success = await login(email, password)

        if (success) {
            toast.success("Bienvenido de nuevo!")
            navigate('/')
        }
    }

    return (
        <AuthLayout
            title="Bienvenido de nuevo👏"
            subtitle="Ingresa tus datos para acceder a tu cuenta"
        >
            <form className={styles.formContainer} onSubmit={handleSubmit} onChange={() => setError(null)}>

                {error && (
                    <div className={styles.errorBox}>
                        ⚠ {error}
                    </div>
                )}

                {/* Email Input */}
                <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>Correo electrónico</label>
                    <div className={styles.inputWrapper}>
                        <span className={styles.iconLeft}>✉️</span>
                        <input
                            type="email"
                            name={emailId}
                            id={emailId}
                            placeholder="ejemplo@correo.com"
                            className={`${styles.input} ${error ? styles.error : ''}`}
                            required
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className={styles.inputGroup}>
                    <div className={styles.labelRow}>
                        <label htmlFor="password" className={styles.label}>Contraseña</label>
                        <NavLink
                            to={"/forgot-password"}
                            className={styles.forgotLink}
                        >
                            ¿Olvidaste tu contraseña?
                        </NavLink>
                    </div>
                    <div className={styles.inputWrapper}>
                        <span className={styles.iconLeft}>🔒</span>
                        <input
                            type={visibleFields.password ? "text" : "password"}
                            name={passwordId}
                            id={passwordId}
                            placeholder="Contraseña"
                            className={`${styles.input} ${error ? styles.error : ''}`}
                            required
                        />
                        <button 
                        type="button" className={styles.btnEye} aria-label="Mostrar contraseña" onClick={togglePasswordVisibility}>
                            👁️
                        </button>
                    </div>
                </div>

                <button disabled={loading} type="submit" className={styles.btnPrimary}>
                    {loading ? "Validando..." : "Entrar a mi cuenta ➝"}
                </button>
            </form>

            <div className={styles.divider}>O continúa con</div>

            {/* Social Login */}

            <div className={styles.socialButtons}>
                <button type="button" className={styles.btnSocial}>
                    <img src="#" width="20" alt="" /> Google
                </button>
                <button type="button" className={styles.btnSocial}>
                    <img src="#" width="20" alt="" /> Apple
                </button>
            </div>

            {/* Footer */}
            <p className={styles.authFooter}>
                ¿Aún no tienes cuenta? <NavLink to="/register">Registrate gratis</NavLink>
            </p>

        </AuthLayout>
    )
}