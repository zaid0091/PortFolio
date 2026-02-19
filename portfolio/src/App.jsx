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

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Education />
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

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1400)
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
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
        {/* Scroll progress bar */}
        <div ref={progressBarRef} className="scroll-progress-bar" />

      <CursorGlow />
      <Loader hidden={loaded} />
      <Navbar theme={theme} toggleTheme={toggleTheme} onCmdOpen={() => setCmdOpen(true)} />
        <Routes>
          <Route path="/" element={<><main><HomePage /></main><Footer /></>} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      {/* Scroll-to-top button */}
      <button
        onClick={scrollToTop}
        className={`scroll-top-btn ${showTop ? 'scroll-top-btn--visible' : ''}`}
        aria-label="Scroll to top"
      >
        ↑
      </button>

        {/* Command Palette */}
        <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

        {/* Konami Code Easter Egg */}
        <KonamiEgg />
      </>
    )
}

export default App
