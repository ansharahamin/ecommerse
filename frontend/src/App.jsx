import { useCallback, useEffect, useMemo, useState } from 'react'
import { api, getProductsFromResponse } from './api.js'
import AccountPage from './pages/AccountPage.jsx'
import AdminProductsPage from './pages/AdminProductsPage.jsx'
import PageMotion from './components/PageMotion.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import AuthPage from './pages/AuthPage.jsx'
import CartPage from './pages/CartPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import ShopPage from './pages/ShopPage.jsx'
import './App.css'

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('kindred-user') || 'null')
  } catch {
    return null
  }
}

function currentPath() {
  return `${window.location.pathname}${window.location.search}`
}

function getInitialTheme() {
  try {
    const savedTheme = window.localStorage.getItem('kindred-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  } catch {
    // Continue with the operating-system preference when storage is unavailable.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [path, setPath] = useState(currentPath)
  const [theme, setTheme] = useState(getInitialTheme)
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState('')
  const [cart, setCart] = useState([])
  const [cartLoading, setCartLoading] = useState(false)
  const [cartError, setCartError] = useState('')
  const [user, setUser] = useState(readUser)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [toast, setToast] = useState('')

  const navigate = useCallback((destination) => {
    window.history.pushState({}, '', destination)
    setPath(currentPath())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const onPopState = () => setPath(currentPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem('kindred-theme', theme)
    } catch {
      // The selected theme remains active for this page session.
    }
  }, [theme])

  const loadProducts = useCallback(async () => {
    setProductsLoading(true)
    setProductsError('')
    try {
      const response = await api.getProducts()
      setProducts(getProductsFromResponse(response))
    } catch (error) {
      setProductsError(error.message)
    } finally {
      setProductsLoading(false)
    }
  }, [])

  const loadCart = useCallback(async () => {
    if (!user) {
      setCart([])
      return
    }
    setCartLoading(true)
    setCartError('')
    try {
      const response = await api.getCart()
      setCart(Array.isArray(response.cart) ? response.cart : [])
    } catch (error) {
      setCartError(error.message)
    } finally {
      setCartLoading(false)
    }
  }, [user])

  useEffect(() => {
    const timer = window.setTimeout(loadProducts, 0)
    return () => window.clearTimeout(timer)
  }, [loadProducts])
  useEffect(() => {
    const timer = window.setTimeout(loadCart, 0)
    return () => window.clearTimeout(timer)
  }, [loadCart])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + (Number(item.quentity) || 0), 0),
    [cart],
  )

  function toggleTheme() {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')
  }

  async function addToCart(product) {
    if (!user) {
      navigate('/login')
      setToast('Sign in to add something to your bag.')
      return
    }
    try {
      await api.addToCart(product._id)
      await loadCart()
      setToast(`${product.name} added to your bag.`)
    } catch (error) {
      setToast(error.message)
    }
  }

  async function submitAuth(details) {
    setAuthLoading(true)
    setAuthError('')
    try {
      const response = path.startsWith('/register')
        ? await api.register(details)
        : await api.login(details)
      const nextUser = response.user || { userName: details.userName || details.email, email: details.email }
      localStorage.setItem('kindred-user', JSON.stringify(nextUser))
      setUser(nextUser)
      navigate('/')
      setToast(path.startsWith('/register') ? 'Welcome to Kindred.' : 'Welcome back.')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setAuthLoading(false)
    }
  }

  async function logout() {
    let message = 'You’re signed out.'
    try {
      await api.logout()
    } catch (error) {
      message = `Signed out here, but the server could not end the session: ${error.message}`
    } finally {
      localStorage.removeItem('kindred-user')
      setUser(null)
      setCart([])
      navigate('/')
      setToast(message)
    }
  }

  const route = path.split('?')[0]
  const routeParams = new URLSearchParams(path.split('?')[1] || '')
  const productMatch = route.match(/^\/product\/([^/]+)$/)
  const activeProduct = productMatch ? products.find((item) => item._id === productMatch[1]) : null
  const authPage = route === '/login' || route === '/register'

  return (
    <div className="app-shell">
      <Header
        cartCount={cartCount}
        navigate={navigate}
        user={user}
        onLogout={logout}
        path={path}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <PageMotion animationKey={`${path}:${products.length}`}>
      {route === '/' && (
        <HomePage
          products={products}
          loading={productsLoading}
          error={productsError}
          onRetry={loadProducts}
          onOpen={(id) => navigate(`/product/${id}`)}
          onAdd={addToCart}
          navigate={navigate}
        />
      )}
      {route === '/shop' && (
        <ShopPage
          products={products}
          loading={productsLoading}
          error={productsError}
          onRetry={loadProducts}
          onOpen={(id) => navigate(`/product/${id}`)}
          onAdd={addToCart}
          category={routeParams.get('category')}
          sort={routeParams.get('sort')}
        />
      )}
      {productMatch && (
        activeProduct ? (
          <ProductPage product={activeProduct} onAdd={addToCart} navigate={navigate} />
        ) : productsLoading ? (
          <main className="page-section"><div className="loading-state">Finding that good thing<span className="loading-dots">...</span></div></main>
        ) : (
          <ProductPage product={null} onAdd={addToCart} navigate={navigate} />
        )
      )}
      {route === '/account' && (user ? (
        <AccountPage user={user} navigate={navigate} onLogout={logout} />
      ) : (
        <main className="page-section account-page">
          <span className="eyebrow"><span className="eyebrow-line" /> Your Kindred account</span>
          <h1>Come on<br /><em>in.</em></h1>
          <p className="account-intro">Sign in to find your good things.</p>
          <button className="button button-dark" onClick={() => navigate('/login')}>Sign in <span>↗</span></button>
        </main>
      ))}
      {route === '/admin/products' && (user?.role === 'admin' ? (
        <AdminProductsPage onProductsChanged={() => Promise.all([loadProducts(), loadCart()])} />
      ) : (
        <main className="page-section account-page">
          <span className="eyebrow"><span className="eyebrow-line" /> Admin access</span>
          <h1>This space is<br /><em>for admins.</em></h1>
          <p className="account-intro">Sign in with an administrator account to manage your products.</p>
          <button className="button button-dark" onClick={() => navigate('/login')}>Sign in <span>↗</span></button>
        </main>
      ))}
      {route === '/cart' && (
        user ? (
          <CartPage cart={cart} loading={cartLoading} error={cartError} navigate={navigate} onRetry={loadCart} />
        ) : (
          <main className="cart-page page-section">
            <span className="eyebrow"><span className="eyebrow-line" /> Your good things</span>
            <h1>Your bag<span>.</span></h1>
            <div className="empty-cart">
              <span className="empty-icon">✳</span>
              <h2>Let’s get you settled in.</h2>
              <p>Sign in to see what’s in your bag.</p>
              <button className="button button-dark" onClick={() => navigate('/login')}>Sign in <span>↗</span></button>
            </div>
          </main>
        )
      )}
      {authPage && (
        <AuthPage
          mode={route.slice(1)}
          onSubmit={submitAuth}
          navigate={navigate}
          loading={authLoading}
          error={authError}
        />
      )}
      {!['/', '/shop', '/cart', '/login', '/register', '/account', '/admin/products'].includes(route) && !productMatch && (
        <main className="page-section not-found">
          <span className="eyebrow"><span className="eyebrow-line" /> Not quite the right place</span>
          <h1>Let’s find<br /><em>something good.</em></h1>
          <button className="button button-dark" onClick={() => navigate('/')}>Back to home <span>↗</span></button>
        </main>
      )}
      </PageMotion>
      {!authPage && <Footer navigate={navigate} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}

export default App
