import { useState, useEffect, useRef } from 'react'

import { supabase } from '../services/supabaseClient';


function BlogModal({ post, onClose }) {
  const [readProgress, setReadProgress] = useState(0)
  const bodyRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      const max = scrollHeight - clientHeight
      setReadProgress(max > 0 ? Math.min(scrollTop / max, 1) : 1)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

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

  // Helper function to parse inline formatting (bold and code) robustly
  const parseInlineFormatting = (text, baseKey) => {
    const parts = []
    let current = ''
    let j = 0
    
    while (j < text.length) {
      // Check for bold
      if (text.substr(j, 2) === '**') {
        if (current) parts.push(current)
        const endIdx = text.indexOf('**', j + 2)
        if (endIdx !== -1) {
          parts.push(<strong key={`${baseKey}-s-${parts.length}`}>{text.slice(j + 2, endIdx)}</strong>)
          j = endIdx + 2
          current = ''
        } else {
          current += text[j]
          j++
        }
      } 
      // Check for code
      else if (text[j] === '`') {
        if (current) parts.push(current)
        const endIdx = text.indexOf('`', j + 1)
        if (endIdx !== -1) {
          parts.push(<code key={`${baseKey}-c-${parts.length}`} className="blog-inline-code">{text.slice(j + 1, endIdx)}</code>)
          j = endIdx + 1
          current = ''
        } else {
          current += text[j]
          j++
        }
      } 
      else {
        current += text[j]
        j++
      }
    }
    if (current) parts.push(current)
    return parts
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
        const parts = parseInlineFormatting(text, `li-${i}`)
        blocks.push(<li key={i} className="blog-modal-li">{parts}</li>)
      } else if (line.trim() === '') {
        blocks.push(<div key={i} className="blog-modal-spacer" />)
      } else {
        const parts = parseInlineFormatting(line, `p-${i}`)
        blocks.push(<p key={i} className="blog-modal-p">{parts}</p>)
      }
    })
    return blocks
  }

  return (
    <div className="blog-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="blog-modal-dialog">
        {/* Reading progress bar */}
        <div className="blog-progress-track">
          <div
            className="blog-progress-fill"
            style={{
              width: `${readProgress * 100}%`,
              background: post.color,
            }}
          />
        </div>
        {/* Header */}
        <div className="blog-modal-header">
          <div className="blog-modal-header-content">
            <div className="blog-modal-tags">
              {post.tags.map(t => (
                <span key={t} className="blog-tag" style={{ background: post.color }}>{t}</span>
              ))}
            </div>
            <h2 className="blog-modal-title">{post.title}</h2>
            <div className="blog-modal-meta">
              <span className="blog-modal-date">{post.date}</span>
              <span
                className="blog-modal-progress-badge"
                style={{
                  background: readProgress >= 1 ? '#a8e6cf' : 'var(--bg-secondary)',
                  color: readProgress >= 1 ? '#1a6636' : 'var(--text-muted)',
                }}
              >
                {Math.round(readProgress * 100)}%
              </span>
            </div>
          </div>
          <button className="blog-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {/* Body */}
        <div className="blog-modal-body" ref={bodyRef}>
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
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (!error) {
        setPosts(data);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

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

        {loading ? (
          <div className="text-center py-10 opacity-60 font-mono" style={{ color: 'var(--text)' }}>Loading posts...</div>
        ) : (
          <div className="blog-grid">
            {posts.map((post, i) => (
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
        )}
      </div>

      {active && <BlogModal post={active} onClose={() => setActive(null)} />}
    </section>
  )
}
