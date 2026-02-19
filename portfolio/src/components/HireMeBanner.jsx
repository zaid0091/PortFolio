import { useState, useEffect } from 'react'
import { useMagnet } from '../hooks/useMagnet'

export default function HireMeBanner() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const magCtaRef = useMagnet({ radius: 70, strength: 0.4 })

  useEffect(() => {
    // Don't show if dismissed this session
    if (sessionStorage.getItem('banner-dismissed')) {
      setDismissed(true)
      return
    }
    // Slide in after a short delay so it doesn't compete with loader
    const t = setTimeout(() => setVisible(true), 2200)
    return () => clearTimeout(t)
  }, [])

  const dismiss = () => {
    setVisible(false)
    setTimeout(() => {
      setDismissed(true)
      sessionStorage.setItem('banner-dismissed', '1')
    }, 380)
  }

  if (dismissed) return null

  return (
    <div className={`hire-banner ${visible ? 'hire-banner--visible' : ''}`} role="banner">
      <div className="hire-banner-inner">
        <span className="hire-banner-dot" aria-hidden="true" />
        <span className="hire-banner-text">
          Available for work —{' '}
          <strong>Open to full-time &amp; freelance roles</strong>
        </span>
          <a
            ref={magCtaRef}
            href="#contact"
          className="hire-banner-cta"
          onClick={dismiss}
        >
          Let's talk
        </a>
        <button
          className="hire-banner-close"
          onClick={dismiss}
          aria-label="Dismiss banner"
        >
          ×
        </button>
      </div>
    </div>
  )
}
