import styles from "../styles/Cart.module.css"
import { Link } from "./Link.jsx"
import { useCartStore } from "../store/cartStore"

export function CartItemList({ items }) {

    const updateItemQuantity = useCartStore((state) => state.updateItemQuantity)
    const removeFromCart = useCartStore((state) => state.removeFromCart)
    const clearCart = useCartStore((state) => state.clearCart)

    const handleQty = (itemId, delta) => {
        updateItemQuantity(itemId, delta)
    }

    const handleDelete = (itemId) => {
        removeFromCart(itemId)
    }

    const handleEmptyCart = () => {
        clearCart()
    }

    return (
        <>
            <ul className={styles.cartList}>
                {items.map((item) => (
                    <li key={item.itemId} className={styles.cartItem}>

                        <div className={styles.itemInfo}>
                            <small className={styles.itemBrand}>{item.productBrand}</small>
                            <h3 className={styles.itemName}>{item.productModel}</h3>
                            <p className={styles.itemUnitPrice}>Precio unitario: {item.price}</p>

                            <div className={styles.quantityControl}>
                                <button className={styles.qtyBtn} onClick={() => handleQty(item.itemId, -1)}>-</button>
                                <span className={styles.qtyValue}>{item.quantity}</span>
                                <button className={styles.qtyBtn} onClick={() => handleQty(item.itemId, 1)}>+</button>
                            </div>
                        </div>

                        <div className={styles.itemActions}>
                            <p className={styles.itemSubtotal}>${item.price * item.quantity}</p>
                            <button className={styles.deleteBtn} onClick={() => handleDelete(item.itemId)}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className={styles.continueShopping}>
                <Link to="/search" className={styles.btnOutline}>
                    &larr; SEGUIR COMPRANDO
                </Link>
                <button onClick={handleEmptyCart} className={styles.btnClearCart}>VACIAR CARRITO</button>
            </div>
        </>
    )
}