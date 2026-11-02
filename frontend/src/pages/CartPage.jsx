import { formatPrice } from '../money.js'

export default function CartPage({ cart, loading, error, navigate, onRetry }) {
  const items = cart.filter((item) => item.product)
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.product.price) || 0) * (Number(item.quentity) || 0),
    0,
  )
  const currency = items[0]?.product.currency || 'PKR'

  return (
    <main className="cart-page page-section">
      <span className="eyebrow"><span className="eyebrow-line" /> Your good things</span>
      <h1>Your bag<span>.</span></h1>
      {loading ? (
        <div className="loading-state">Just a moment<span className="loading-dots">...</span></div>
      ) : error ? (
        <div className="notice error-notice">{error} <button onClick={onRetry}>Try again</button></div>
      ) : items.length === 0 ? (
        <div className="empty-cart">
          <span className="empty-icon">✳</span>
          <h2>A little room for something good.</h2>
          <p>Your bag is taking a breather. Find something you love.</p>
          <button className="button button-dark" onClick={() => navigate('/shop')}>Explore the collection <span>↗</span></button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <article className="cart-item" key={item.product._id}>
                <img src={item.product.image} alt={item.product.name} />
                <div className="cart-item-copy">
                  <h2>{item.product.name}</h2>
                  <p>{item.product.des}</p>
                  <span>Quantity · {item.quentity}</span>
                  <strong className="cart-item-price">{formatPrice(item.product.price, item.product.currency)}</strong>
                </div>
              </article>
            ))}
          </div>
          <aside className="cart-summary">
            <h2>A thoughtful choice.</h2>
            <p>Your items are ready when you are.</p>
            <div className="summary-rule" />
            <div className="summary-row"><span>Items</span><span>{items.reduce((sum, item) => sum + item.quentity, 0)}</span></div>
            <div className="summary-row subtotal-row"><span>Subtotal</span><strong>{formatPrice(subtotal, currency)}</strong></div>
            <p className="checkout-note">Checkout isn’t available just yet. Check back soon.</p>
            <button className="button button-dark checkout-button" disabled>Coming soon</button>
            <button className="continue-shopping" onClick={() => navigate('/shop')} type="button">Continue exploring</button>
          </aside>
        </div>
      )}
    </main>
  )
}
