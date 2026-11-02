import { useState } from 'react'
import SpaLink from './SpaLink.jsx'

const categories = ['New arrivals', 'Home', 'Lifestyle', 'Accessories']
const categoryPaths = {
  'New arrivals': '/shop?sort=new',
  Home: '/shop?category=Home',
  Lifestyle: '/shop?category=Lifestyle',
  Accessories: '/shop?category=Accessories',
}

export default function Header({ cartCount, navigate, user, onLogout, path, theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className="announcement">
        Thoughtful things for everyday living <span>·</span> Free shipping on orders over $75
      </div>
      <header className="site-header">
        <SpaLink className="wordmark" href="/" navigate={navigate}>
          kindred<span>.</span>
        </SpaLink>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          {categories.map((category) => (
            <SpaLink
              href={categoryPaths[category]}
              key={category}
              navigate={navigate}
              onClick={() => setMenuOpen(false)}
              aria-current={path === categoryPaths[category] ? 'page' : undefined}
            >
              {category}
            </SpaLink>
          ))}
        </nav>
        <div className="header-actions">
          <button
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-pressed={theme === 'dark'}
            className="theme-toggle"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            type="button"
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.7 8.7 0 1 0 20.2 15.1Z" />
              </svg>
            )}
          </button>
          {user?.role === 'admin' && (
            <SpaLink className="admin-header-link" href="/admin/products" navigate={navigate}>
              Manage products
            </SpaLink>
          )}
          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="menu-toggle"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            <span />
            <span />
          </button>
          <SpaLink
            className="icon-link account-link"
            href={user ? '/account' : '/login'}
            navigate={navigate}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 20c.7-3.5 3.1-5.2 7-5.2s6.3 1.7 7 5.2" />
            </svg>
            <span>{user ? user.userName : 'Sign in'}</span>
          </SpaLink>
          {user && (
            <button className="text-button logout-link" onClick={onLogout} type="button">
              Sign out
            </button>
          )}
          <SpaLink
            className="icon-link bag-link"
            href="/cart"
            navigate={navigate}
            aria-label={`Shopping bag, ${cartCount} items`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5.5 8h13l1 12h-15l1-12Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>
            <span className="bag-count">{cartCount}</span>
          </SpaLink>
        </div>
      </header>
    </>
  )
}
