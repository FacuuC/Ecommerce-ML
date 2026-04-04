import { Link as NavLink } from "react-router-dom"

export function Link ({to, children, ...restOfProps}){
    return(
        <NavLink to={to} {...restOfProps}>
            {children}
        </NavLink>
    )
}