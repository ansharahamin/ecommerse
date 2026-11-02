import SpaLink from './SpaLink.jsx'

export default function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <SpaLink className="wordmark" href="/" navigate={navigate}>
            kindred<span>.</span>
          </SpaLink>
          <p>Good things, made for the everyday.</p>
        </div>
        <div className="footer-links">
          <div>
            <p className="footer-label">Explore</p>
            <SpaLink href="/shop" navigate={navigate}>Shop all</SpaLink>
            <SpaLink href="/shop" navigate={navigate}>Our collection</SpaLink>
          </div>
          <div>
            <p className="footer-label">Need a hand?</p>
            <a href="mailto:hello@kindred.store">Get in touch</a>
            <a href="mailto:hello@kindred.store">Shipping & returns</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 Kindred Goods</span>
        <span>Made for living well.</span>
      </div>
    </footer>
  )
}
