import { useEffect } from 'react'

// Each section id → a subtle tint colour for the page background
const SECTION_TINTS = [
  { id: 'hero',       color: 'rgba(255,217,61,0.04)'  },
  { id: 'about',      color: 'rgba(102,217,239,0.05)' },
  { id: 'experience', color: 'rgba(168,230,207,0.05)' },
  { id: 'skills',     color: 'rgba(201,184,255,0.05)' },
  { id: 'projects',   color: 'rgba(255,107,157,0.04)' },
  { id: 'education',  color: 'rgba(255,179,71,0.05)'  },
  { id: 'blog',       color: 'rgba(102,217,239,0.04)' },
  { id: 'contact',    color: 'rgba(255,217,61,0.06)'  },
]

export default function SectionTint() {
  useEffect(() => {
    const sections = SECTION_TINTS
      .map(({ id, color }) => {
        const el = document.getElementById(id)
        return el ? { el, color } : null
      })
      .filter(Boolean)

    const overlay = document.createElement('div')
    overlay.id = 'section-tint-overlay'
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      transition: background 0.9s cubic-bezier(0.22, 1, 0.36, 1);
      background: transparent;
    `
    document.body.appendChild(overlay)

    let currentColor = 'transparent'
    let ticking = false

    const update = () => {
      const mid = window.scrollY + window.innerHeight * 0.45

      let active = sections[0]
      for (const s of sections) {
        if (s.el.offsetTop <= mid) active = s
      }

      if (active.color !== currentColor) {
        currentColor = active.color
        overlay.style.background = active.color
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      overlay.remove()
    }
  }, [])

  return null
}
