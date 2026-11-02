import { useRef } from 'react'
import gsap from 'gsap'
import { formatPrice } from '../money.js'

export default function ProductCard({ product, onOpen, onAdd }) {
  const cardRef = useRef(null)
  const imageRef = useRef(null)

  function animateHover(entering) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.to(cardRef.current, {
      y: entering ? -6 : 0,
      boxShadow: entering ? '0 18px 34px rgba(35, 38, 31, 0.09)' : '0 0 0 rgba(35, 38, 31, 0)',
      duration: entering ? 0.35 : 0.45,
      ease: entering ? 'power3.out' : 'power2.out',
      overwrite: 'auto',
    })
    gsap.to(imageRef.current, {
      scale: entering ? 1.055 : 1,
      duration: entering ? 0.55 : 0.65,
      ease: entering ? 'power2.out' : 'power3.out',
      overwrite: 'auto',
    })
  }

  return (
    <article
      className="product-card"
      onMouseEnter={() => animateHover(true)}
      onMouseLeave={() => animateHover(false)}
      ref={cardRef}
    >
      <button
        className="product-image-button"
        onClick={() => onOpen(product._id)}
        onFocus={() => animateHover(true)}
        onBlur={() => animateHover(false)}
        type="button"
        aria-label={`View ${product.name}`}
      >
        <img ref={imageRef} src={product.image} alt={product.name} loading="lazy" />
        <span className="image-action">View item <span aria-hidden="true">↗</span></span>
      </button>
      <div className="product-card-info">
        <button className="product-name" onClick={() => onOpen(product._id)} type="button">
          {product.name}
        </button>
        <button
          className="quick-add"
          onClick={() => onAdd(product)}
          type="button"
          aria-label={`Add ${product.name} to bag`}
        >
          +
        </button>
      </div>
      <div className="product-card-meta">
        <p className="product-description">{product.des}</p>
        <p className="product-price">{formatPrice(product.price, product.currency)}</p>
      </div>
    </article>
  )
}
