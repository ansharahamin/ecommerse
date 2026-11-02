import ProductCard from './ProductCard.jsx'

export default function ProductGrid({ products, onOpen, onAdd }) {
  return (
    <div className="product-grid" data-reveal-stagger>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onOpen={onOpen} onAdd={onAdd} />
      ))}
    </div>
  )
}
