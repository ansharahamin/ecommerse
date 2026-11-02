import { useEffect, useState } from 'react'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1400&q=85',
    alt: 'Sunlit, thoughtfully styled living space',
    caption: 'Objects for slow mornings',
    sticker: <>Live<br />a little<br /><em>lighter</em></>,
  },
  {
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
    alt: 'Natural textures and warm, simple home details',
    caption: 'Find your softer side',
    sticker: <>Made for<br />the little<br /><em>moments</em></>,
  },
  {
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85',
    alt: 'A warm, relaxed home filled with considered details',
    caption: 'A home that feels like you',
    sticker: <>Keep it<br />simple.<br /><em>Keep it good.</em></>,
  },
]

export default function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 5500)
    return () => window.clearInterval(timer)
  }, [])

  function showSlide(offset) {
    setActiveSlide((current) => (current + offset + slides.length) % slides.length)
  }

  const slide = slides[activeSlide]

  return (
    <div className="hero-visual" role="region" aria-roledescription="carousel" aria-label="Featured scenes">
      <img key={slide.image} src={slide.image} alt={slide.alt} />
      <div className="hero-caption">
        <span>{String(activeSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
        <span>{slide.caption}</span>
      </div>
      <span className="hero-sticker">{slide.sticker}</span>
      <div className="carousel-controls" aria-label="Carousel controls">
        <button type="button" onClick={() => showSlide(-1)} aria-label="Previous slide">←</button>
        <div className="carousel-dots">
          {slides.map((item, index) => (
            <button
              aria-label={`Show slide ${index + 1}: ${item.caption}`}
              aria-current={index === activeSlide ? 'true' : undefined}
              className={index === activeSlide ? 'active' : ''}
              key={item.caption}
              onClick={() => setActiveSlide(index)}
              type="button"
            />
          ))}
        </div>
        <button type="button" onClick={() => showSlide(1)} aria-label="Next slide">→</button>
      </div>
    </div>
  )
}
