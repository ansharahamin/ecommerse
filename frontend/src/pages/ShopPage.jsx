import { useMemo, useState } from 'react'
import ProductGrid from '../components/ProductGrid.jsx'

export default function ShopPage({ products, loading, error, onRetry, onOpen, onAdd, category, sort }) {
  const [query, setQuery] = useState('')
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    let result = category
      ? products.filter((product) => (product.category || 'Home') === category)
      : products
    if (sort === 'new') result = [...result].sort((a, b) => b._id.localeCompare(a._id))
    if (!normalizedQuery) return result
    return result.filter((product) =>
      `${product.name} ${product.des}`.toLowerCase().includes(normalizedQuery),
    )
  }, [products, query, category, sort])

  const title = category || (sort === 'new' ? 'New arrivals' : 'The collection')

  return (
    <main className="shop-page page-section">
      <div className="shop-title" data-reveal>
        <span className="eyebrow"><span className="eyebrow-line" /> Made for the everyday</span>
        <h1>{title}<span>.</span></h1>
        <p>{category ? `Explore thoughtful ${category.toLowerCase()} finds for everyday living.` : 'Considered pieces to make the everyday feel a little more special.'}</p>
      </div>
      <div className="shop-toolbar" data-reveal>
        <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'good thing' : 'good things'}</span>
        <label className="search-field">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4 4" /></svg>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find something..." aria-label="Search products" />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
        </label>
      </div>
      {error && <div className="notice error-notice">{error} <button onClick={onRetry}>Try again</button></div>}
      {loading ? (
        <div className="loading-state">Finding the good stuff<span className="loading-dots">...</span></div>
      ) : filteredProducts.length ? (
        <ProductGrid products={filteredProducts} onOpen={onOpen} onAdd={onAdd} />
      ) : (
        <div className="empty-products">
          <span className="empty-icon">✳</span>
          <p>{query ? 'Nothing by that name just yet.' : 'The collection is on its way.'}</p>
          <span>{query ? 'Try another search.' : 'Check back soon for something good.'}</span>
        </div>
      )}
    </main>
  )
}
