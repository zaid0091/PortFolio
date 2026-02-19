import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { useInView } from '../hooks/useInView';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || '';

const SOCIAL_CARDS = [
  { icon: 'fab fa-github',   label: 'GitHub',         href: 'https://github.com/zaid0091' },
  { icon: 'fab fa-linkedin', label: 'LinkedIn',        href: 'https://www.linkedin.com/in/zaid-liaqat-075b8b25b/' },
  { icon: 'fas fa-phone',    label: '+92 324 028 1184', href: 'tel:+923240281184' },
];

export default function Contact() {
  const formRef    = useRef(null);
  const botRef     = useRef(null);
  const [status, setStatus]     = useState('idle'); // idle | sending | success | error
  const [focused, setFocused]   = useState('');
  const [copied, setCopied]     = useState(false);
  const [charCount, setCharCount] = useState(0);

  function copyEmail() {
    navigator.clipboard.writeText('zaidliaqat999@gmail.com').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const [titleRef, titleVisible] = useInView();
  const [bodyRef, bodyVisible]   = useInView();

  async function handleSubmit(e) {
    e.preventDefault();
    // Honeypot: bots fill hidden fields, humans don't
    if (botRef.current?.value) return;
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus('config');
      return;
    }
    setStatus('sending');
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
        setStatus('success');
        formRef.current.reset();
        setCharCount(0);
        setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  }

  const inputStyle = (name) => ({
    background: 'var(--bg)',
    border: `3px solid ${focused === name ? '#66d9ef' : 'var(--border)'}`,
    boxShadow: focused === name ? '4px 4px 0 #66d9ef' : '4px 4px 0 var(--border)',
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    borderRadius: '8px',
    padding: '12px 14px',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-sans)',
    width: '100%',
    display: 'block',
  });

  return (
    <section
      id="contact"
      className="py-20"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <h2
          ref={titleRef}
          className={`section-title reveal-zoom ${titleVisible ? 'is-visible' : ''}`}
        >
          Contact
        </h2>

        <div ref={bodyRef} className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-10 items-start">

          {/* ── Left: form ── */}
          <div
            className={`reveal ${bodyVisible ? 'is-visible' : ''}`}
            style={{
              background: 'var(--bg-card)',
              border: '3px solid var(--border)',
              boxShadow: 'var(--shadow-lg)',
              borderRadius: '12px',
              padding: '32px',
            }}
          >
            <h3 className="font-bold text-[1.2rem] mb-1" style={{ color: 'var(--text)' }}>
              Send a message
            </h3>
            <p className="text-[0.88rem] mb-6" style={{ color: 'var(--text-muted)' }}>
              I reply within 24 hours.
            </p>

              <form ref={formRef} onSubmit={handleSubmit} noValidate style={{ position: 'relative' }}>
              <div className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label className="block text-[0.82rem] font-bold mb-1 font-mono" style={{ color: 'var(--text-muted)' }}>
                    NAME *
                  </label>
                  <input
                    name="from_name"
                    type="text"
                    required
                    placeholder="Your name"
                    style={inputStyle('name')}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused('')}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[0.82rem] font-bold mb-1 font-mono" style={{ color: 'var(--text-muted)' }}>
                    EMAIL *
                  </label>
                  <input
                    name="reply_to"
                    type="email"
                    required
                    placeholder="your@email.com"
                    style={inputStyle('email')}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-[0.82rem] font-bold mb-1 font-mono" style={{ color: 'var(--text-muted)' }}>
                    SUBJECT
                  </label>
                  <input
                    name="subject"
                    type="text"
                    placeholder="What's this about?"
                    style={inputStyle('subject')}
                    onFocus={() => setFocused('subject')}
                    onBlur={() => setFocused('')}
                  />
                </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[0.82rem] font-bold mb-1 font-mono" style={{ color: 'var(--text-muted)' }}>
                      MESSAGE *
                    </label>
                    <textarea
                      name="message"
                      required
                      maxLength={500}
                      rows={5}
                      placeholder="Tell me about your project or opportunity..."
                      style={{ ...inputStyle('message'), resize: 'vertical', minHeight: '130px' }}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused('')}
                      onChange={e => setCharCount(e.target.value.length)}
                    />
                    <p
                      className="text-right text-[0.78rem] font-mono mt-1"
                      style={{ color: charCount >= 480 ? '#e53e3e' : 'var(--text-muted)' }}
                    >
                      {charCount}/500
                    </p>
                  </div>

                  {/* Honeypot — hidden from real users, bots fill it */}
                  <input
                    ref={botRef}
                    name="bot_trap"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
                  />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 font-bold text-[0.95rem] rounded-[8px] border-[3px] transition-[box-shadow,transform,background] duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: status === 'success' ? '#a8e6cf' : '#ffd93d',
                    color: '#000',
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow)',
                  }}
                  onMouseEnter={e => { if (status !== 'sending') { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; e.currentTarget.style.transform = 'translate(3px,3px)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = ''; }}
                >
                  {status === 'sending' && <><i className="fas fa-circle-notch fa-spin" /> Sending…</>}
                  {status === 'success' && <><i className="fas fa-check" /> Message Sent!</>}
                  {status === 'error'   && <><i className="fas fa-times" /> Failed — try again</>}
                  {status === 'config'  && <><i className="fas fa-cog" /> Configure EmailJS keys</>}
                  {status === 'idle'    && <><i className="fas fa-paper-plane" /> Send Message</>}
                </button>

                {status === 'config' && (
                  <p className="text-[0.8rem] font-mono p-3 rounded border-2" style={{ background: '#fff3cd', borderColor: 'var(--border)', color: '#856404' }}>
                    Add <strong>VITE_EMAILJS_SERVICE_ID</strong>, <strong>VITE_EMAILJS_TEMPLATE_ID</strong>, and <strong>VITE_EMAILJS_PUBLIC_KEY</strong> to your <code>.env</code> file.
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* ── Right: info ── */}
          <div className="flex flex-col gap-5">
            <div
              className={`reveal delay-1 ${bodyVisible ? 'is-visible' : ''}`}
              style={{
                background: 'var(--bg-card)',
                border: '3px solid var(--border)',
                boxShadow: 'var(--shadow)',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <p className="font-bold text-[0.82rem] font-mono mb-3" style={{ color: 'var(--text-muted)' }}>
                EMAIL
              </p>
              <button
                onClick={copyEmail}
                className="flex items-center gap-2 font-semibold text-[0.95rem] underline underline-offset-[3px] cursor-pointer transition-colors duration-150"
                style={{ color: 'var(--text)', background: 'none', border: 'none', padding: 0 }}
                title="Click to copy"
              >
                {copied
                  ? <><i className="fas fa-check text-green-600" /><span style={{ color: '#16a34a' }}>Copied!</span></>
                  : <><i className="fas fa-copy text-[0.85rem]" />zaidliaqat999@gmail.com</>
                }
              </button>
            </div>

            {/* Social links */}
            <div className="flex flex-col gap-3">
              {SOCIAL_CARDS.map((c, i) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`contact-card flex items-center gap-[10px] px-5 py-[14px] border-[3px] rounded-[8px] font-semibold text-[0.9rem] transition-[box-shadow,transform,background] duration-150 hover:translate-x-[3px] hover:translate-y-[3px] reveal ${bodyVisible ? 'is-visible' : ''} delay-${i + 2}`}
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--bg-card)',
                    boxShadow: 'var(--shadow)',
                    color: 'var(--text)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#ffd93d'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                >
                  <i className={`${c.icon} text-[1.2rem]`} />
                  {c.label}
                </a>
              ))}
            </div>

            {/* Availability */}
            <div
              className={`reveal delay-5 ${bodyVisible ? 'is-visible' : ''}`}
              style={{
                background: '#d4f5e2',
                border: '3px solid var(--border)',
                boxShadow: 'var(--shadow)',
                borderRadius: '12px',
                padding: '20px 24px',
              }}
            >
              <p className="font-bold text-[0.82rem] font-mono mb-1" style={{ color: '#1a6636' }}>
                AVAILABILITY
              </p>
              <p className="font-semibold text-[0.9rem]" style={{ color: '#1a6636' }}>
                Open to internships, freelance &amp; full-time roles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
