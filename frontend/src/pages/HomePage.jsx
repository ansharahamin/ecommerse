import ProductGrid from '../components/ProductGrid.jsx'
import HeroCarousel from '../components/HeroCarousel.jsx'
import SpaLink from '../components/SpaLink.jsx'

export default function HomePage({ products, loading, error, onRetry, onOpen, onAdd, navigate }) {
  return (
    <>
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow" data-hero-reveal><span className="eyebrow-line" /> A little more intentional</span>
            <h1 data-hero-reveal>Make room<br />for <em>the good.</em></h1>
            <p data-hero-reveal>Everyday objects, considered carefully. Pieces that feel like they’ve always belonged.</p>
            <SpaLink className="button button-dark" href="/shop" navigate={navigate} data-hero-reveal>
              Explore the collection <span aria-hidden="true">↗</span>
            </SpaLink>
            <div className="hero-note" data-hero-reveal>
              <span className="note-mark">✳</span>
              <span>Small details.<br /><strong>Better everyday.</strong></span>
            </div>
          </div>
          <HeroCarousel />
          <div className="hero-side-label">CURATED FOR THE EVERYDAY — EST. 2025</div>
        </section>

        <section className="values-strip" aria-label="Our values" data-reveal>
          <span>Thoughtful by nature</span><i>✳</i><span>Made to be lived in</span><i>✳</i><span>Good things, less fuss</span>
        </section>

        <section className="featured-section page-section">
          <div className="section-heading" data-reveal>
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> A few favorites</span>
              <h2>Good things<br /><em>we found.</em></h2>
            </div>
            <SpaLink className="text-link" href="/shop" navigate={navigate}>Shop everything <span>↗</span></SpaLink>
          </div>
          <ProductGrid products={products.slice(0, 4)} onOpen={onOpen} onAdd={onAdd} />
          {loading && <div className="loading-state">Finding the good stuff<span className="loading-dots">...</span></div>}
          {error && <div className="notice error-notice">{error} <button onClick={onRetry}>Try again</button></div>}
          {!loading && !error && products.length === 0 && (
            <div className="empty-products">
              <span className="empty-icon">✳</span>
              <p>We’re making room for the good stuff.</p>
              <span>Our collection will be here soon.</span>
            </div>
          )}
        </section>

        <section className="story-section">
          <div className="story-image" data-reveal>
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85"
              alt="Natural textures and warm, simple home details"
              loading="lazy"
            />
            <span className="story-image-tag">Less, but lovely.</span>
          </div>
          <div className="story-copy" data-reveal>
            <span className="eyebrow"><span className="eyebrow-line" /> The Kindred point of view</span>
            <h2>Keep what<br />makes you <em>feel good.</em></h2>
            <p>We believe the things you live with should earn their place. So we look for thoughtful design, lasting materials, and details worth noticing.</p>
            <SpaLink className="text-link" href="/shop" navigate={navigate}>Find your favorites <span>↗</span></SpaLink>
            <span className="story-scribble" aria-hidden="true">♡</span>
          </div>
        </section>

        <section className="newsletter" data-reveal>
          <span className="eyebrow">A good note, now and then</span>
          <h2>A little more <em>good</em> in your inbox.</h2>
          <p>New finds, thoughtful living, and the occasional very good thing.</p>
          <a className="newsletter-link" href="mailto:hello@kindred.store?subject=Keep%20me%20in%20the%20loop">
            Say hello <span aria-hidden="true">↗</span>
          </a>
          <span className="newsletter-spark spark-left" aria-hidden="true">✳</span>
          <span className="newsletter-spark spark-right" aria-hidden="true">✳</span>
        </section>
      </main>
    </>
  )
}
