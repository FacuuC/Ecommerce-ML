import { NavLink } from "react-router-dom"

export function CartProfile ({ totalItems }) {
    return (
        <>
            <NavLink
                to="/cart"
                className="btn-cart"
            >
                {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                <img src="/carrito.svg" alt="Carrito de compras" />
            </NavLink>
            <NavLink
                id="nav-bar-profile"
                className="btn-profile"
                to="/profile">
                <img src="/profile.svg" alt="Perfil" />
            </NavLink>
        </>
    )
}