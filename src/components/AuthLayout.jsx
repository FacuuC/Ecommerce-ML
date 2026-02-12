import { NavLink } from "react-router-dom"
import styles from "./AuthLayout.module.css"

export function AuthLayout({children, title, subtitle}) {
    return (
        <main className={styles.authWrapper}>
            <div className={styles.authCard}>

                <section className={styles.authVisual}>
                    <h2 className={styles.authVisualTitle}>Tu próximo celular te espera.</h2>
                    <p className={styles.authVisualDescription}>Accede a las mejores ofertas con equipos nuevos y usados con garantía total.</p>

                    <figure className={styles.visual}>
                        <img 
                            className={styles.backgroundImage}
                            src="/iphone17.png" 
                            alt="" />
                        <figcaption className={styles.discount}>
                            <span 
                                className={styles.discountLabel}
                                aria-hidden="true">🏷️</span>
                            <div className={styles.discountInfo}>
                                <strong className={styles.discountStrong}>Descuento de bienvenida</strong>
                                <small className={styles.discountSmall}>10% OFF en tu primera compra</small>
                            </div>
                        </figcaption>
                    </figure>

                </section>

                <section className={styles.authFormContainer}>
                    <nav className={styles.tabs}>
                        <NavLink 
                            to="/login"
                            className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
                        >
                            Iniciar Sesión
                        </NavLink>
                        <NavLink 
                            to="/register"
                            className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
                        >
                            Registrarse
                        </NavLink>
                    </nav>

                    <div className={styles.formContent}>
                        <h1 className={styles.text}>{title}</h1>
                        <p className={styles.subtext}>{subtitle}</p>

                        {children}

                    </div>
                </section>
            </div>
        </main>
    )
}