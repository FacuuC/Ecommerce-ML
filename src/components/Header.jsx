import { Link } from "./Link.jsx"
import { NavLink } from "react-router-dom"
import { useAuthStore } from "../store/authStore.js"
import { useFavoritesStore } from "../store/favStore.js"

export function Header() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    const login = useAuthStore((state) => state.login)
    const logout  = useAuthStore((state) => state.logout)

    const countFavorites = useFavoritesStore((state) => state.countFavorites)

    return (
        <header id="menu-bar">
            <Link href="/">
                <h2>MatienzoShop</h2>
            </Link>

            <nav id="nav-bar">
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                    Inicio</NavLink>
                <NavLink
                    className={({ isActive }) => isActive ? 'nav-link-active' : ''}
                    to="/search">
                    Celulares
                </NavLink>
                {
                    isLoggedIn && (
                        <NavLink
                            id="nav-bar-profile"
                            className={({ isActive }) => isActive ? 'nav-link-active' : ''}
                            to="/profile">
                            Perfil
                            <div id="profile-fav-info">
                                <span>{countFavorites()}</span>
                                <img
                                    src="/fav.svg"
                                    className="profile-fav-svg">
                                </img>
                            </div>
                        </NavLink>
                    )
                }
                <NavLink
                    to="/sobre-nosotros"
                    className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                    Sobre Nosotros
                </NavLink>
            </nav>
            <div id="sign-in">
                {
                    isLoggedIn
                        ?   <NavLink 
                                to="/"
                                className="btn-logout" 
                                onClick={logout}>
                                    Cerrar sesión
                            </NavLink>
                        :   <NavLink 
                                to="/login"
                                className="btn-login" >
                                    Iniciar sesión
                            </NavLink>
                }
            </div>
        </header>
    )
}