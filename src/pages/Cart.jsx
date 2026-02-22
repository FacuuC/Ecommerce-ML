import styles from '../styles/Cart.module.css'
import { useCartStore } from '../store/cartStore'
import { Link } from '../components/Link.jsx'
import { CartItemList } from '../components/CartItemList.jsx'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'

export default function CartPage() {

    const navigate = useNavigate()
    const { items, total, checkout } = useCartStore()
    const cantidad = (() => {
        if (items.length === 1){
            return "producto"
        } else {
            return "productos"
        }
    })

    async function handleCheckout () {
        const success = await checkout()
        if (success) {
            toast.success("Compra realizada 🎉")
            navigate("/")
        } else {
            toast.error("No se pudo completar la compra")
        }
    }

    return (
        <main className={styles.cartMain}>

            <nav className={styles.breadcrumb}>
                <div className={styles.breadcrumbContent}>
                    <Link
                        href="/"
                        className={styles.breadcrumbLink}>
                        Inicio
                    </Link>
                    <span
                        className={styles.breadcrumbSeparator}
                    >{'>'}</span>
                    <span
                        className={styles.breadcrumbCurrent}
                    >Carrito de Compras</span>
                </div>
            </nav>

            <article className={styles.cartLayout}>

                <section className={styles.cartItemsSection}>
                    <div className={styles.cartHeader}>
                        <h2 className={styles.summaryTitle}>Tu Carrito</h2>
                        <span className={styles.itemsCount}>{items.length} productos</span>
                    </div>

                    <div className={styles.productsContainer}>
                        {items.length === 0 ? (
                            <p>Tu carrito está vacío. <Link className={styles.continueSearching} to="/search">Explora nuestros productos</Link></p>
                        ) : (
                            <CartItemList items={items} />
                        )}
                    </div>
                </section>

                <aside className={styles.cartSidebar}>
                    <div className={styles.summaryCard}>
                        <h3 className={styles.summaryTitle}>Resumen de tu compra</h3>

                        <div className={styles.summaryDetails}>
                            <div className={styles.summaryRow}>
                                <p>Subtotal ({items.length}) {cantidad()}</p>
                                <strong>${total}</strong>
                            </div>
                            <div className={styles.summaryRow}>
                                <p>Envío</p>
                                <strong className={styles.textGreen}>¡Gratis!</strong>
                            </div>
                            <div className={styles.summaryTotal}>
                                <p>Total</p>
                                <strong className={styles.totalAmount}>${total}</strong>
                            </div>
                        </div>

                        <div className={styles.summaryActions}>
                            <button onClick={handleCheckout} className={styles.btnCheckout}>Proceder al pago</button>
                        </div>
                    </div>

                    <div className={styles.helpCard}>
                        <h3 className={styles.helpTitle}>¿Necesitas ayuda?</h3>
                        <p className={styles.helpText}>Contáctanos para cualquier consulta sobre tu pedido.</p>
                        <button className={styles.btnHelp}>Contactar Soporte</button>
                    </div>
                </aside>
            </article>
        </main>
    )
}