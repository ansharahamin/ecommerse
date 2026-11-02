export default function AccountPage({ user, navigate, onLogout }) {
  return (
    <main className="account-page page-section">
      <span className="eyebrow"><span className="eyebrow-line" /> Your Kindred account</span>
      <h1>Welcome home,<br /><em>{user?.userName || 'friend'}.</em></h1>
      <p className="account-intro">Your good things are all in one place.</p>
      <div className="account-actions">
        {user?.role === 'admin' && (
          <button className="account-action" onClick={() => navigate('/admin/products')} type="button">
            <span><strong>Manage your products</strong><small>Create, edit, or remove your listings.</small></span>
            <span aria-hidden="true">↗</span>
          </button>
        )}
        <button className="account-action" onClick={() => navigate('/cart')} type="button">
          <span><strong>Your bag</strong><small>See the things you’ve picked out.</small></span>
          <span aria-hidden="true">↗</span>
        </button>
        <button className="account-action" onClick={() => navigate('/shop')} type="button">
          <span><strong>Keep exploring</strong><small>Find something lovely for everyday.</small></span>
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <p className="account-email">{user?.email}</p>
      <button className="account-signout" onClick={onLogout} type="button">Sign out</button>
    </main>
  )
}
