import { formatPrice } from '../money.js'

export default function ProductPage({ product, onAdd, navigate }) {
  if (!product) {
    return (
      <main className="page-section product-missing">
        <span className="eyebrow"><span className="eyebrow-line" /> A little detour</span>
        <h1>We can’t find<br /><em>that one.</em></h1>
        <button className="button button-dark" onClick={() => navigate('/shop')}>Back to the collection <span>↗</span></button>
      </main>
    )
  }

  return (
    <main className="product-detail page-section">
      <button className="back-link" onClick={() => navigate('/shop')} type="button">← Back to the collection</button>
      <div className="product-detail-layout">
        <div className="detail-image" data-reveal><img src={product.image} alt={product.name} /></div>
        <div className="detail-copy" data-reveal>
          <span className="eyebrow"><span className="eyebrow-line" /> A Kindred find</span>
          <h1>{product.name}</h1>
          <p className="detail-price">{formatPrice(product.price, product.currency)}</p>
          <p className="detail-description">{product.des}</p>
          <div className="detail-divider" />
          <p className="detail-note"><span>✳</span> Thoughtfully chosen for everyday living.</p>
          <button className="button button-dark add-to-bag" onClick={() => onAdd(product)}>
            Add to your bag <span aria-hidden="true">↗</span>
          </button>
          <p className="detail-footnote">Free shipping on orders over $75</p>
        </div>
      </div>
    </main>
  )
}
