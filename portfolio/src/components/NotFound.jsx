import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20" style={{ background: 'var(--bg)' }}>
      <div className="text-center max-w-lg">
        {/* Big 404 */}
        <div className="not-found-number">
          <span className="not-found-4">4</span>
          <span className="not-found-0">0</span>
          <span className="not-found-4">4</span>
        </div>

        {/* Divider */}
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

        {/* Message */}
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-sans)' }}
        >
          Page not found
        </h2>
        <p
          className="text-lg mb-8"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}
        >
          Looks like this page got lost in the code.
          <br />
          Maybe it was{' '}
          <span style={{ fontFamily: 'var(--font-mono)', background: '#ffd93d', padding: '2px 6px', border: '2px solid var(--border)', color: '#000' }}>
            undefined
          </span>{' '}
          all along.
        </p>

        {/* Back home button */}
        <Link
          to="/"
          className="not-found-btn"
        >
          <i className="fas fa-arrow-left mr-2" />
          Back to Home
        </Link>

        {/* Fun code snippet */}
        <div className="neo-card mt-10 p-5 text-left" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>// the page you're looking for</p>
          <p>
            <span style={{ color: '#ff6b9d' }}>const</span>{' '}
            <span style={{ color: '#66d9ef' }}>page</span> ={' '}
            <span style={{ color: '#ffd93d' }}>null</span>;
          </p>
          <p className="mt-2">
            <span style={{ color: '#ff6b9d' }}>if</span> (!page) {'{'}
          </p>
          <p className="ml-4">
            <span style={{ color: '#66d9ef' }}>redirect</span>(
            <span style={{ color: '#a8e6cf' }}>'/home'</span>);
          </p>
          <p>{'}'}</p>
        </div>
      </div>
    </section>
  )
}
