import { useCallback, useEffect, useState } from 'react'
import { api } from '../api.js'
import { formatPrice } from '../money.js'

const emptyForm = {
  name: '',
  des: '',
  price: '',
  category: 'Home',
  image: null,
}

function ProductForm({ initialProduct, onCancel, onSave }) {
  const [form, setForm] = useState(() => initialProduct
    ? {
        name: initialProduct.name,
        des: initialProduct.des,
        price: String(initialProduct.price),
        category: initialProduct.category || 'Home',
        image: null,
      }
    : emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function update(event) {
    const { name, value, files } = event.target
    setForm((current) => ({ ...current, [name]: name === 'image' ? files?.[0] || null : value }))
  }

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const data = new FormData()
    data.append('name', form.name.trim())
    data.append('des', form.des.trim())
    data.append('price', form.price)
    data.append('category', form.category)
    if (form.image) data.append('image', form.image)

    try {
      await onSave(data)
      if (!initialProduct) {
        event.currentTarget.reset()
        setForm({ ...emptyForm })
      }
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="admin-product-form" onSubmit={submit}>
      <div className="admin-form-heading">
        <div>
          <span className="eyebrow"><span className="eyebrow-line" /> {initialProduct ? 'Your product' : 'A new find'}</span>
          <h2>{initialProduct ? 'Edit product' : 'Add a product'}</h2>
        </div>
        {initialProduct && (
          <button className="admin-cancel" onClick={onCancel} type="button">Cancel</button>
        )}
      </div>
      <label>
        Product name
        <input autoComplete="off" maxLength={120} name="name" onChange={update} required value={form.name} />
      </label>
      <label>
        Description
        <textarea maxLength={2000} name="des" onChange={update} required rows={3} value={form.des} />
      </label>
      <div className="admin-form-row">
        <label>
          Price (PKR)
          <input min="0.01" name="price" onChange={update} required step="0.01" type="number" value={form.price} />
        </label>
        <label>
          Category
          <select name="category" onChange={update} value={form.category}>
            <option value="Home">Home</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Accessories">Accessories</option>
          </select>
        </label>
      </div>
      <label>
        Product image {initialProduct && <span className="admin-optional">(optional)</span>}
        <input accept="image/*" name="image" onChange={update} required={!initialProduct} type="file" />
      </label>
      {initialProduct?.image && !form.image && (
        <p className="admin-current-image">Current image will be kept unless you choose a new one.</p>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-dark admin-save" disabled={saving} type="submit">
        {saving ? 'Saving...' : initialProduct ? 'Save changes' : 'Create product'}
        <span aria-hidden="true">↗</span>
      </button>
    </form>
  )
}

export default function AdminProductsPage({ onProductsChanged }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [notice, setNotice] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingId, setDeletingId] = useState('')

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setPageError('')
    try {
      const response = await api.getMyProducts()
      setProducts(Array.isArray(response.products) ? response.products : [])
    } catch (error) {
      setPageError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(loadProducts, 0)
    return () => window.clearTimeout(timer)
  }, [loadProducts])

  async function saveProduct(data) {
    if (editingProduct) {
      await api.updateProduct(editingProduct._id, data)
      setNotice('Your product changes have been saved.')
      setEditingProduct(null)
    } else {
      await api.createProduct(data)
      setNotice('Your product is now in the collection.')
    }
    await Promise.all([loadProducts(), onProductsChanged()])
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Delete "${product.name}"? This can’t be undone.`)) return
    setDeletingId(product._id)
    setPageError('')
    setNotice('')
    try {
      await api.deleteProduct(product._id)
      if (editingProduct?._id === product._id) setEditingProduct(null)
      setNotice(`${product.name} was deleted.`)
      await Promise.all([loadProducts(), onProductsChanged()])
    } catch (error) {
      setPageError(error.message)
    } finally {
      setDeletingId('')
    }
  }

  return (
    <main className="admin-products-page page-section">
      <span className="eyebrow"><span className="eyebrow-line" /> Shop management</span>
      <h1>Your products<span>.</span></h1>
      <p className="admin-page-intro">Create and manage only the products that belong to your account.</p>

      {notice && <p className="admin-notice" role="status">{notice}</p>}
      {pageError && <div className="notice error-notice" role="alert">{pageError} <button onClick={loadProducts} type="button">Try again</button></div>}

      <div className="admin-products-layout">
        <section className="admin-inventory" data-reveal>
          <div className="admin-inventory-heading">
            <h2>Your inventory</h2>
            {!loading && <span>{products.length} {products.length === 1 ? 'product' : 'products'}</span>}
          </div>
          {loading ? (
            <div className="loading-state">Loading your products<span className="loading-dots">...</span></div>
          ) : products.length ? (
            <div className="admin-product-list">
              {products.map((product) => (
                <article className="admin-product-row" key={product._id}>
                  <img src={product.image} alt="" />
                  <div className="admin-product-info">
                    <h3>{product.name}</h3>
                    <span>{product.category || 'Home'} · {formatPrice(product.price, product.currency)}</span>
                  </div>
                  <div className="admin-product-actions">
                    <button onClick={() => setEditingProduct(product)} type="button">Edit</button>
                    <button
                      className="admin-delete"
                      disabled={deletingId === product._id}
                      onClick={() => deleteProduct(product)}
                      type="button"
                    >
                      {deletingId === product._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-empty">You haven’t added a product yet. Start with the form.</div>
          )}
        </section>

        <div data-reveal>
          <ProductForm
            key={editingProduct?._id || 'new-product'}
            initialProduct={editingProduct}
            onCancel={() => setEditingProduct(null)}
            onSave={saveProduct}
          />
        </div>
      </div>
    </main>
  )
}
