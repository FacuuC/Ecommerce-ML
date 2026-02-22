import { Link } from "./Link.jsx"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore.js"
import { useCartStore } from "../store/cartStore.js"
import { CartProfile } from "./CartProfile.jsx"


export function Header() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    const hydrated = useCartStore((state) => state.hydrated)
    const { items } = useCartStore()

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <header id="menu-bar">
            <Link href="/">
                <h2>MatienzoShop</h2>
            </Link>

            <nav id="nav-bar">
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                    Inicio
                </NavLink>
                <NavLink
                    className={({ isActive }) => isActive ? 'nav-link-active' : ''}
                    to="/search">
                    Celulares
                </NavLink>
                <NavLink
                    to="/sobre-nosotros"
                    className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                    Sobre Nosotros
                </NavLink>
            </nav>
            <div id="sign-in">
                {
                    isLoggedIn
                        ? <CartProfile totalItems={hydrated ? totalItems : null} />
                        : <NavLink
                            to="/login"
                            className="btn-login" >
                            Iniciar sesión
                        </NavLink>
                }
            </div>
        </header>
    )
}