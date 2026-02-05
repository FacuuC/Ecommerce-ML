import { AuthLayout } from "../components/AuthLayout"
import { NavLink } from "react-router"
import styles from "./Login.module.css"

export default function LoginPage(){
    return(
        <AuthLayout 
            title="Bienvenido de nuevo!!" 
            subtitle="Ingresa tus datos para acceder a tu cuenta"
        >
            <form>
                <button type="submit">Entrar</button>
            </form>

            <p className={styles.authFooter}>
                ¿Aún no tienes cuenta? <NavLink to="/register">Registrate gratis</NavLink>
            </p>
            
        </AuthLayout>
    )
}