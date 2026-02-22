import { NavLink } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

export default function ProfilePage() {
    const logout = useAuthStore((state) => state.logout)

    const handleLogout = (e) => {   
        e.preventDefault()
        logout()
    }
    return (
        <main>
            <h2>Este es el ProfilePage</h2>
            <NavLink
                to="/"
                className="btn-logout"
                onClick={handleLogout}
            >
                Cerrar sesión
            </NavLink>
        </main>
    )
}