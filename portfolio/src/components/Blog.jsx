import { useState, useEffect, useRef } from 'react'

const POSTS = [
  {
    id: 1,
    title: 'How I Built a Full-Stack Django + React App from Scratch',
    date: 'Feb 2025',
    tags: ['Django', 'React', 'REST API'],
    color: '#ffd93d',
    summary: 'Walking through the architecture decisions, auth setup, and deployment pipeline I used when building my first full-stack project.',
    content: `## The Problem

I wanted to build a real project that used both Django on the backend and React on the frontend — not just a tutorial clone, but something I designed myself.

## Architecture

I went with a Django REST Framework API served separately from the React frontend (decoupled architecture). This keeps both parts independently deployable and easier to reason about.

\`\`\`
Frontend (React + Vite)  →  Django REST API  →  PostgreSQL
\`\`\`

## Auth with JWT

I used **djangorestframework-simplejwt** for token-based auth. The flow is:

1. User logs in → Django returns \`access\` + \`refresh\` tokens
2. React stores the access token in memory (not localStorage — avoids XSS)
3. Refresh token in an httpOnly cookie
4. Axios interceptor auto-refreshes the access token before expiry

## What I Learned

- Always version your API (\`/api/v1/\`) from the start — retrofitting is painful
- Django signals are powerful for side effects (sending emails on user create)
- CORS setup trips up everyone the first time — use \`django-cors-headers\`

## Deployment

- Django on Railway
- React on Vercel
- PostgreSQL on Supabase (free tier is surprisingly capable)

The full project is on my GitHub if you want to dig into the code.`,
  },
  {
    id: 2,
    title: 'What I Learned Building My Portfolio from Zero',
    date: 'Jan 2025',
    tags: ['React', 'CSS', 'Vite'],
    color: '#66d9ef',
    summary: 'The design system, animation patterns, and performance tricks I picked up while building this exact site you\'re reading right now.',
    content: `## Why Build From Scratch?

Template portfolios look like template portfolios. Recruiters see hundreds. I wanted mine to feel like *me* — so I built it from zero with React + Vite, no component library.

## Design System First

Before writing a single component, I defined CSS custom properties for everything:

\`\`\`css
:root {
  --bg: #ffffff;
  --border: #000000;
  --shadow: 5px 5px 0 #000;
}
\`\`\`

This neobrutalist style (hard shadows, thick borders, flat colors) forces visual consistency even when you're moving fast.

## Scroll Animations Without a Library

I used \`IntersectionObserver\` directly instead of pulling in framer-motion or AOS:

\`\`\`js
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) el.classList.add('is-visible')
}, { threshold: 0.15 })
\`\`\`

Pair that with a CSS keyframe and you have scroll-triggered animations with zero dependencies.

## Performance Tricks

- **Font subsetting** — only load the character weights you actually use
- **will-change: transform** on animated elements — promotes them to their own compositor layer
- **passive scroll listeners** everywhere

## Key Takeaway

Building your own portfolio teaches you more than any tutorial. You hit every real problem: responsive layout, state management, performance, deployment. It's the best project to have on your resume.`,
  },
  {
    id: 3,
    title: 'Firebase vs Supabase — Which Should You Pick?',
    date: 'Dec 2024',
    tags: ['Firebase', 'Supabase', 'Backend'],
    color: '#ff6b9d',
    summary: 'A practical comparison based on real projects. Not benchmarks — actual developer experience, pricing surprises, and when to use each.',
    content: `## The Short Answer

- **Firebase** if you need real-time sync, push notifications, or you're building mobile-first
- **Supabase** if you want SQL, a real Postgres database, and open-source escape hatches

## Firebase Strengths

1. **Realtime database** — Firestore's real-time listeners are genuinely excellent
2. **Auth** — easiest social auth setup I've used (Google login in 10 minutes)
3. **Ecosystem** — FCM push notifications, Analytics, Hosting all in one dashboard

## Firebase Pain Points

- NoSQL means you duplicate data everywhere to avoid expensive reads
- Pricing can spike unexpectedly at scale (read/write counts add up fast)
- Vendor lock-in is real — migrating off Firebase is painful

## Supabase Strengths

1. **Real SQL** — complex queries, joins, foreign keys — it's just Postgres
2. **Row Level Security** — fine-grained auth at the database level
3. **Open source** — you can self-host if you need to

## Supabase Pain Points

- Real-time is improving but still behind Firestore
- Edge functions (Deno-based) have a smaller ecosystem than Firebase Functions

## My Recommendation

For a side project or portfolio app: **Supabase**. The free tier is generous, SQL knowledge transfers everywhere, and you're not locked in.

For a production mobile app with real-time features: **Firebase**.`,
  },
]

function BlogModal({ post, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Simple markdown renderer (bold, code, headings, paragraphs)
  const renderContent = (md) => {
    return md.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="blog-modal-h2">{line.slice(3)}</h2>
      }
      if (line.startsWith('```')) {
        return null // handled below in block
      }
      // inline code
      const parts = line.split(/(`[^`]+`)/)
      const rendered = parts.map((part, j) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={j} className="blog-inline-code">{part.slice(1, -1)}</code>
        }
        // bold
        const boldParts = part.split(/(\*\*[^*]+\*\*)/)
        return boldParts.map((bp, k) => {
          if (bp.startsWith('**') && bp.endsWith('**')) {
            return <strong key={k}>{bp.slice(2, -2)}</strong>
          }
          return bp
        })
      })
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('- ')) {
        return <li key={i} className="blog-modal-li">{rendered}</li>
      }
      if (line.trim() === '') return <br key={i} />
      return <p key={i} className="blog-modal-p">{rendered}</p>
    })
  }

  // Split content into text blocks and code blocks
  const renderFull = (md) => {
    const blocks = []
    let codeBuffer = []
    let inCode = false
    md.split('\n').forEach((line, i) => {
      if (line.startsWith('```')) {
        if (inCode) {
          blocks.push(<pre key={`code-${i}`} className="blog-code-block"><code>{codeBuffer.join('\n')}</code></pre>)
          codeBuffer = []
          inCode = false
        } else {
          inCode = true
        }
        return
      }
      if (inCode) { codeBuffer.push(line); return }

      if (line.startsWith('## ')) {
        blocks.push(<h2 key={i} className="blog-modal-h2">{line.slice(3)}</h2>)
      } else if (line.startsWith('- ') || /^\d+\. /.test(line)) {
        const text = line.replace(/^[-\d]+\.?\s/, '')
        const parts = text.split(/(\*\*[^*]+\*\*)|(`[^`]+`)/).map((p, j) => {
          if (!p) return null
          if (p.startsWith('**') && p.endsWith('**')) return <strong key={j}>{p.slice(2,-2)}</strong>
          if (p.startsWith('`') && p.endsWith('`')) return <code key={j} className="blog-inline-code">{p.slice(1,-1)}</code>
          return p
        })
        blocks.push(<li key={i} className="blog-modal-li">{parts}</li>)
      } else if (line.trim() === '') {
        blocks.push(<div key={i} className="blog-modal-spacer" />)
      } else {
        const parts = line.split(/(\*\*[^*]+\*\*)|(`[^`]+`)/).map((p, j) => {
          if (!p) return null
          if (p.startsWith('**') && p.endsWith('**')) return <strong key={j}>{p.slice(2,-2)}</strong>
          if (p.startsWith('`') && p.endsWith('`')) return <code key={j} className="blog-inline-code">{p.slice(1,-1)}</code>
          return p
        })
        blocks.push(<p key={i} className="blog-modal-p">{parts}</p>)
      }
    })
    return blocks
  }

  return (
    <div className="blog-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="blog-modal-dialog">
        {/* Header */}
        <div className="blog-modal-header" style={{ borderBottom: '3px solid var(--border)' }}>
          <div style={{ flex: 1 }}>
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags.map(t => (
                <span key={t} className="blog-tag" style={{ background: post.color }}>{t}</span>
              ))}
            </div>
            <h2 className="blog-modal-title">{post.title}</h2>
            <span className="blog-modal-date">{post.date}</span>
          </div>
          <button className="blog-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {/* Body */}
        <div className="blog-modal-body">
          <div className="blog-modal-content">
            {renderFull(post.content)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Blog() {
  const [active, setActive] = useState(null)
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="blog" ref={ref} style={{ background: 'var(--bg)', padding: '40px 0 60px' }}>
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 className={`section-title reveal ${visible ? 'is-visible' : ''}`}>Blog / Devlog</h2>

        <div className="blog-grid">
          {POSTS.map((post, i) => (
            <article
              key={post.id}
              className={`blog-card reveal delay-${i + 1} ${visible ? 'is-visible' : ''}`}
              onClick={() => setActive(post)}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') setActive(post) }}
              role="button"
              aria-label={`Read: ${post.title}`}
            >
              {/* Color accent bar */}
              <div className="blog-card-bar" style={{ background: post.color }} />

              <div className="blog-card-body">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map(t => (
                    <span key={t} className="blog-tag" style={{ background: post.color }}>{t}</span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="blog-card-title">{post.title}</h3>

                {/* Summary */}
                <p className="blog-card-summary">{post.summary}</p>

                {/* Footer */}
                <div className="blog-card-footer">
                  <span className="blog-card-date">{post.date}</span>
                  <span className="blog-read-more">Read more →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {active && <BlogModal post={active} onClose={() => setActive(null)} />}
    </section>
  )
}
