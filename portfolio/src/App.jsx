import { useState, useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Loader from './components/Loader'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CursorGlow from './components/CursorGlow'
import NotFound from './components/NotFound'
import CommandPalette from './components/CommandPalette'
import KonamiEgg from './components/KonamiEgg'
import Blog from './components/Blog'
import HireMeBanner from './components/HireMeBanner'
import SectionTint from './components/SectionTint'
import SmoothScroll from './components/SmoothScroll'
import SkeletonLoader from './components/SkeletonLoader'

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      <Blog />
      <Contact />
    </>
  )
}

function App() {
  const [theme, setTheme] = useState('light')
  const [loaded, setLoaded] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)
  const progressBarRef = useRef(null)
  const isWiping = useRef(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  useEffect(() => {
    // If user prefers reduced motion, skip the loader entirely
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const delay = reducedMotion ? 0 : 1400
    const timer = setTimeout(() => setLoaded(true), delay)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onScroll = () => {
        const scrolled = window.scrollY
        const total = document.documentElement.scrollHeight - window.innerHeight
        const pct = total > 0 ? (scrolled / total) * 100 : 0
        if (progressBarRef.current) progressBarRef.current.style.width = `${pct}%`
        setShowTop(scrolled > 400)
      }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault()
          setCmdOpen(o => !o)
          return
        }
        // '/' opens palette unless user is typing in an input/textarea
        if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
          const tag = document.activeElement?.tagName
          if (tag === 'INPUT' || tag === 'TEXTAREA') return
          e.preventDefault()
          setCmdOpen(true)
        }
      }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toggleTheme = (e) => {
    const next = theme === 'light' ? 'dark' : 'light'

    // If View Transitions API not supported, already wiping, or user prefers reduced motion → fall back instantly
    if (!document.startViewTransition || isWiping.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTheme(next)
      localStorage.setItem('theme', next)
      document.documentElement.setAttribute('data-theme', next)
      return
    }

    // Get click coordinates from the toggle button
    const rect = e?.currentTarget?.getBoundingClientRect?.()
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const y = rect ? rect.top + rect.height / 2 : 0

    // Calculate the max radius needed to cover the entire viewport
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    // Set CSS custom properties for the animation origin
    document.documentElement.style.setProperty('--wipe-x', `${x}px`)
    document.documentElement.style.setProperty('--wipe-y', `${y}px`)
    document.documentElement.style.setProperty('--wipe-radius', `${maxRadius}px`)

    isWiping.current = true

    const transition = document.startViewTransition(() => {
      setTheme(next)
      localStorage.setItem('theme', next)
      document.documentElement.setAttribute('data-theme', next)
    })

    transition.finished.then(() => {
      isWiping.current = false
    })
  }

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })
  }

    return (
      <>
            <SkeletonLoader visible={!loaded} />

            {/* Scroll progress bar */}
            <div ref={progressBarRef} className="scroll-progress-bar" />

        <SmoothScroll />
      <SectionTint />
      <HireMeBanner />
      <CursorGlow />
      <Loader hidden={loaded} />

      <div id="smooth-root">
        <Navbar theme={theme} toggleTheme={toggleTheme} onCmdOpen={() => setCmdOpen(true)} />
          <Routes>
            <Route path="/" element={<><main><HomePage /></main><Footer /></>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </div>

      {/* Scroll-to-top button */}
      <button
        onClick={scrollToTop}
        className={`scroll-top-btn ${showTop ? 'scroll-top-btn--visible' : ''}`}
        aria-label="Scroll to top"
      >
        ↑
      </button>

        {/* Command Palette */}
        <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onToggleTheme={toggleTheme} />

          {/* Konami Code Easter Egg */}
          <KonamiEgg />
        </>
      )
}

export default App
