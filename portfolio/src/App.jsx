import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CursorGlow from './components/CursorGlow'
import Blog from './components/Blog'
// import HireMeBanner from './components/HireMeBanner'
import SectionTint from './components/SectionTint'
import SmoothScroll from './components/SmoothScroll'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy-loaded: admin routes (99% of visitors never visit these)
const Login = lazy(() => import('./components/admin/Login'))
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const ManageProjects = lazy(() => import('./components/admin/ManageProjects'))
const ManageBlogs = lazy(() => import('./components/admin/ManageBlogs'))

// Lazy-loaded: overlays & widgets (hidden by default, loaded on demand)
const CommandPalette = lazy(() => import('./components/CommandPalette'))
const KonamiEgg = lazy(() => import('./components/KonamiEgg'))
const AskMeChat = lazy(() => import('./components/AskMeChat'))
const NotFound = lazy(() => import('./components/NotFound'))

// Minimal loading spinner for route-level Suspense fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div
        className="w-8 h-8 border-[3px] rounded-full animate-spin"
        style={{ borderColor: 'var(--border)', borderTopColor: '#ffd93d' }}
      />
    </div>
  )
}
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
  const [showTop, setShowTop] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)
  const progressBarRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
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

  const toggleTheme = (x, y) => {
    const next = theme === 'light' ? 'dark' : 'light'

    const originX = x ?? window.innerWidth - 40
    const originY = y ?? 40

    const maxR = Math.hypot(
      Math.max(originX, window.innerWidth - originX),
      Math.max(originY, window.innerHeight - originY)
    )

    const apply = () => {
      setTheme(next)
      localStorage.setItem('theme', next)
      document.documentElement.setAttribute('data-theme', next)
    }

    if (!document.startViewTransition) {
      apply()
      return
    }

    const transition = document.startViewTransition(apply)

    transition.ready.then(() => {
      document.documentElement.animate(
        [
          { clipPath: `circle(0px at ${originX}px ${originY}px)` },
          { clipPath: `circle(${maxR}px at ${originX}px ${originY}px)` },
        ],
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      )
    })
  }

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })
  }

  return (
    <>
      {/* Scroll progress bar */}
      <div ref={progressBarRef} className="scroll-progress-bar" />

      <SmoothScroll />
      <SectionTint />
      <CursorGlow />

      <div id="smooth-root">
        <Navbar theme={theme} toggleTheme={toggleTheme} onCmdOpen={() => setCmdOpen(true)} />
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<><main><HomePage /></main><Footer /></>} />
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<ManageProjects />} />
                <Route path="blogs" element={<ManageBlogs />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Scroll-to-top button */}
      <button
        onClick={scrollToTop}
        className={`scroll-top-btn ${showTop ? 'scroll-top-btn--visible' : ''}`}
        aria-label="Scroll to top"
      >
        ↑
      </button>

      {/* Lazy-loaded overlays & widgets (fallback=null since hidden by default) */}
      <Suspense fallback={null}>
        <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onToggleTheme={toggleTheme} />
        <KonamiEgg />
        <AskMeChat />
      </Suspense>
    </>
  )
}

export default App
