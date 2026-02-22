import { useState } from "react"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"
import { Link } from "react-router"
import toast from "react-hot-toast"
import styles from "../styles/ProductInfo.module.css"

export function ProductInfo({ cel }) {
    const [productQuantity, setProductQuantity] = useState(1)

    const increase = () => setProductQuantity(prev => prev + 1)
    const decrease = () => setProductQuantity(prev => Math.max(1, prev - 1))

    const { isLoggedIn } = useAuthStore()
    const addToCart = useCartStore((state) => state.addToCart)
    const items = useCartStore((state) => state.items)
    const enCarrito = items.some(item => item.productId === cel.id)


    const handleAddToCart = async (e) => {
        e.preventDefault()
        const success = await addToCart(cel.id, productQuantity)

        if (success) {
            toast.success("Producto añadido al carrito!")
        } else {
            toast.error("Ocurrió un error al añadir el producto al carrito.")
        }
    }

    return (
        <section className={styles.productInfo}>
            <header className={styles.productHeader}>
                <div className={styles.productRating}>
                    <p className={styles.brand}>Apple</p>
                    <p className={styles.rating}>⭐ 4.9 (124 reviews)</p>
                </div>
                <h1>{cel.modelo}</h1>
                <p className={styles.description}>
                    Dynamic Island, una forma mágica de interactuar con tu iPhone. Camara de 48MP para un nivel de detalle asombroso. Y todo en un diseño resistente.
                </p>
            </header>
            <div className={styles.priceDetail}>
                <p className={styles.price}>
                    <strong>${cel.precio}</strong>
                </p>
                <span className={styles.stock}>
                    En Stock
                </span>
            </div>


            <form className={styles.productOptions}>

                <fieldset>
                    <legend>Color: {cel.color}</legend>
                    <div className={styles.colorOptions}>
                        <label>
                            <input type="radio" name="color" />
                            <span className={styles.colorCircle}></span>
                        </label>
                        <label>
                            <input type="radio" name="color" />
                            <span className={styles.colorCircle}></span>
                        </label>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Almacenamiento</legend>
                    <div className={styles.storageOptions}>
                        <label>
                            <input type="radio" name="storage" />
                            <span>128GB</span>
                        </label>
                        <label>
                            <input type="radio" name="storage" />
                            <span>256GB</span>
                        </label>
                        <label>
                            <input type="radio" name="storage" />
                            <span>512GB</span>
                        </label>
                    </div>
                </fieldset>
                <div className={styles.shippingActions}>
                    <div className={styles.quantityShare}>
                        <div className={styles.quantity}>
                            <button type="button" onClick={decrease}>-</button>
                            <input
                                type="number"
                                value={productQuantity}
                                min="1"
                                onChange={(e) => setProductQuantity(Number(e.target.value) || 1)} />
                            <button type="button" onClick={increase}>+</button>

                            <div className={styles.shippingInfo}>
                                <p>Envío gratis</p>
                                <p>Llega mañana</p>
                            </div>
                        </div>
                        <div className={styles.share}>
                            <button
                                type="button"
                                className={styles.btnShare}
                                aria-label="Compartir producto"
                            >
                                🔗
                            </button>
                        </div>
                    </div>
                    <div className={styles.shippingButtons}>
                        {enCarrito ? (
                            <div className={styles.inCartActions}>
                                <Link to="/cart" className={styles.goCart}>Ir al carrito</Link>
                                <Link to="/search" className={styles.keepShopping}>Seguir comprando</Link>
                            </div>
                        ) : (
                            <button
                                disabled={!isLoggedIn}
                                type="button"
                                className={styles.btnAddToCart}
                                onClick={handleAddToCart}
                            >
                                {isLoggedIn
                                    ? '🛒 Añadir al carrito'
                                    : 'Inicia sesión para añadir'}
                            </button>
                        )}

                    </div>
                </div>
            </form>

            <footer className={styles.extra}>
                <p>Garantía oficial de 12 meses incluida</p>
            </footer>
        </section>
    )
}