import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <section
          className="min-h-screen flex items-center justify-center px-6 py-20"
          style={{ background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}
        >
          <div
            aria-hidden
            style={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 0,
              background: `repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 3px,
                rgba(0,0,0,0.03) 3px,
                rgba(0,0,0,0.03) 4px
              )`,
            }}
          />

          <div className="text-center max-w-lg" style={{ position: 'relative', zIndex: 1 }}>
            <div
              className="inline-block px-4 py-2 mb-6"
              style={{
                background: '#ffd93d',
                border: '3px solid var(--border)',
                boxShadow: '4px 4px 0 var(--border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#000',
              }}
            >
              ERROR
            </div>

            <h1
              className="text-6xl font-bold mb-4"
              style={{
                color: '#ff6b9d',
                fontFamily: 'var(--font-display)',
                textShadow: '3px 3px 0 var(--border)',
              }}
            >
              Something broke
            </h1>

            <div
              className="mx-auto my-6"
              style={{
                width: 80,
                height: 4,
                background: '#ffd93d',
                border: '2px solid var(--border)',
                borderRadius: 2,
              }}
            />

            <p
              className="text-lg mb-4"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}
            >
              An unexpected error occurred. This has been logged to the console.
            </p>

            {this.state.error && (
              <div
                className="neo-card p-4 text-left mb-6"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                <p style={{ color: '#ff6b9d', marginBottom: '0.5rem' }}>
                  {this.state.error.name}: {this.state.error.message}
                </p>
                {this.state.errorInfo?.componentStack && (
                  <pre
                    style={{
                      color: 'var(--text-muted)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      fontSize: '0.75rem',
                      margin: 0,
                    }}
                  >
                    {this.state.errorInfo.componentStack
                      .split('\n')
                      .slice(0, 8)
                      .join('\n')}
                  </pre>
                )}
              </div>
            )}

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={this.handleReset}
                className="neo-btn-primary"
                style={{
                  background: '#ffd93d',
                  border: '3px solid var(--border)',
                  boxShadow: '4px 4px 0 var(--border)',
                  padding: '10px 24px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.1s',
                  color: '#000',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '2px 2px 0 var(--border)'
                  e.currentTarget.style.transform = 'translate(2px, 2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '4px 4px 0 var(--border)'
                  e.currentTarget.style.transform = 'translate(0, 0)'
                }}
              >
                Try Again
              </button>
              <Link
                to="/"
                onClick={this.handleReset}
                className="neo-btn-secondary"
                style={{
                  background: 'var(--bg)',
                  border: '3px solid var(--border)',
                  boxShadow: '4px 4px 0 var(--border)',
                  padding: '10px 24px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.1s',
                  textDecoration: 'none',
                  color: 'var(--text)',
                  display: 'inline-block',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '2px 2px 0 var(--border)'
                  e.currentTarget.style.transform = 'translate(2px, 2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '4px 4px 0 var(--border)'
                  e.currentTarget.style.transform = 'translate(0, 0)'
                }}
              >
                Go Home
              </Link>
            </div>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}
