const API_BASE_URL = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.')
  }
  return data
}

export const api = {
  getProducts: () => request('/product'),
  getMyProducts: () => request('/product/mine'),
  createProduct: (product) =>
    request('/product/createProduct', { method: 'POST', body: product }),
  updateProduct: (id, product) =>
    request(`/product/${encodeURIComponent(id)}`, { method: 'PUT', body: product }),
  deleteProduct: (id) =>
    request(`/product/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  getCart: () => request('/cart'),
  addToCart: (productId) =>
    request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quentity: 1 }),
    }),
  login: (credentials) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (details) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(details) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
}

export function getProductsFromResponse(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.products)) return data.products
  return []
}
