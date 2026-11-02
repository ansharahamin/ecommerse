import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function PageMotion({ children, animationKey }) {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-reveal]',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'all',
        },
      )

      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            clearProps: 'all',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          },
        )
      })

      gsap.utils.toArray('[data-reveal-stagger]').forEach((grid) => {
        const cards = grid.querySelectorAll('.product-card')
        if (!cards.length) return

        gsap.fromTo(
          cards,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.09,
            ease: 'power2.out',
            clearProps: 'all',
            scrollTrigger: {
              trigger: grid,
              start: 'top 88%',
              once: true,
            },
          },
        )
      })

      const storyImage = root.querySelector('.story-image img')
      if (storyImage) {
        gsap.fromTo(
          storyImage,
          { yPercent: 4, scale: 1.04 },
          {
            yPercent: -4,
            scale: 1.04,
            ease: 'none',
            scrollTrigger: {
              trigger: storyImage,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        )
      }
    }, root)

    return () => context.revert()
  }, [animationKey])

  return <div className="page-motion-root" ref={rootRef}>{children}</div>
}
