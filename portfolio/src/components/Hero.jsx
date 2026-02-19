import { useEffect, useState } from 'react';
import ResumeModal from './ResumeModal';
import { useMagnet } from '../hooks/useMagnet';

const ROLES = [
  'Full-Stack Engineer',
  'React Developer',
  'Problem Solver',
  'Backend Engineer',
  'Open Source Enthusiast',
];

function useTypewriter(words, { typeSpeed = 130, deleteSpeed = 75, pause = 2400 } = {}) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    const delay = deleting
      ? deleteSpeed
      : text === current
      ? pause
      : typeSpeed;

    const t = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) setDeleting(true);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length - 1 === 0) {
          setDeleting(false);
          setWordIndex(i => i + 1);
        }
      }
    }, delay);

    return () => clearTimeout(t);
  }, [text, deleting, wordIndex, words, typeSpeed, deleteSpeed, pause]);

  return text;
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const role = useTypewriter(ROLES);

  // Magnetic refs for CTA buttons
  const magContactRef = useMagnet({ radius: 80, strength: 0.35 });
  const magProjectsRef = useMagnet({ radius: 80, strength: 0.35 });
  const magResumeRef = useMagnet({ radius: 80, strength: 0.35 });

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const socials = [
    { icon: 'fab fa-github', href: 'https://github.com/zaid0091', label: 'GitHub' },
    { icon: 'fab fa-linkedin', href: 'https://www.linkedin.com/in/zaid-liaqat-075b8b25b/', label: 'LinkedIn' },
    { icon: 'fas fa-envelope', href: 'mailto:zaidliaqat999@gmail.com', label: 'Email' },
    { icon: 'fas fa-phone', href: 'tel:+923240281184', label: 'Phone' },
  ];

  const techs = [
    { icon: 'fab fa-react', label: 'React' },
    { icon: 'fab fa-node-js', label: 'Node' },
    { icon: 'fab fa-python', label: 'Python' },
    { icon: 'fab fa-js', label: 'JS' },
    { icon: 'fab fa-aws', label: 'AWS' },
    { icon: 'fas fa-database', label: 'Django' },
    { icon: 'fab fa-git-alt', label: 'Git' },
    { icon: 'fas fa-fire', label: 'Firebase' },
  ];

  const cls = (base, delay = '') =>
    `${base} ${mounted ? 'is-visible' : ''} ${delay}`.trim();

  return (
    <>
      <section
        id="hero"
        className="min-h-screen flex flex-col justify-center relative overflow-hidden border-b-[3px]"
        style={{
          paddingTop: 'var(--nav-height)',
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Dot grid bg */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(var(--border) 1.5px, transparent 1.5px)',
            backgroundSize: '30px 30px',
          }}
        />

        <div className="max-w-[1100px] mx-auto px-6 w-full relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-[60px] items-center">

            {/* Left */}
            <div>
              <p
                className={cls('reveal text-[1.1rem] font-mono mb-3', 'delay-1')}
                style={{ color: 'var(--text-muted)' }}
              >
                👋 Hey, I&apos;m
              </p>

              <h1
                className={cls('reveal font-bold leading-[1.1] tracking-[-0.03em] mb-5', 'delay-2')}
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', color: 'var(--text)' }}
              >
                Zaid Liaqat
              </h1>

              <span
                className={cls('reveal hero-title-badge inline-flex items-center font-semibold text-base px-4 py-1 border-[3px] mb-5 font-mono min-w-[260px]', 'delay-3')}
                style={{ background: '#66d9ef', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
              >
                {role}
                <span className="typewriter-cursor">|</span>
              </span>

              {/* Open to Work badge */}
              <div className={cls('reveal flex items-center gap-2 mb-5', 'delay-3')}>
                <span
                  className="open-to-work-badge inline-flex items-center gap-[7px] px-3 py-[5px] rounded-full border-2 text-[0.82rem] font-bold font-mono"
                  style={{ borderColor: 'var(--border)', background: '#d4f5e2', color: '#1a6636' }}
                >
                  <span className="otw-dot" />
                  Open to Work
                </span>
              </div>

              <p
                className={cls('reveal text-[1.05rem] leading-[1.7] max-w-[540px] mb-7', 'delay-3')}
                style={{ color: 'var(--text-muted)' }}
              >
                BS Software Engineering student at IUB with hands-on experience building
                full-stack web apps, REST APIs, and real-time systems. Passionate about
                clean code and solving real problems.
              </p>

              {/* Socials */}
              <div className={cls('reveal flex gap-[10px] mb-7', 'delay-4')}>
                {socials.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="social-btn w-[42px] h-[42px] border-2 flex items-center justify-center text-[1.1rem] rounded-[6px] transition-[box-shadow,transform,background] duration-150 hover:translate-x-[2px] hover:translate-y-[2px]"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--bg-card)',
                      boxShadow: '3px 3px 0 var(--border)',
                      color: 'var(--text)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#ffd93d';
                      e.currentTarget.style.boxShadow = '1px 1px 0 var(--border)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'var(--bg-card)';
                      e.currentTarget.style.boxShadow = '3px 3px 0 var(--border)';
                    }}
                  >
                    <i className={s.icon} />
                  </a>
                ))}
              </div>

              {/* Actions */}
              <div className={cls('reveal flex gap-3 flex-wrap', 'delay-4')}>
                <a
                  ref={magContactRef}
                  href="#contact"
                  className="btn-primary inline-flex items-center gap-2 px-6 py-3 font-bold text-[0.95rem] rounded-[6px] border-[3px] transition-[box-shadow,transform] duration-150 hover:translate-x-[3px] hover:translate-y-[3px]"
                  style={{
                    background: '#000',
                    color: '#fff',
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                >
                  <i className="fas fa-paper-plane" /> Get In Touch
                </a>
                <a
                  ref={magProjectsRef}
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 font-bold text-[0.95rem] text-black rounded-[6px] border-[3px] transition-[box-shadow,transform] duration-150 hover:translate-x-[3px] hover:translate-y-[3px]"
                  style={{
                    background: '#ffd93d',
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                >
                  <i className="fas fa-code" /> View Projects
                </a>
                <button
                  ref={magResumeRef}
                  onClick={() => setShowResume(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 font-bold text-[0.95rem] rounded-[6px] border-[3px] transition-[box-shadow,transform] duration-150 hover:translate-x-[3px] hover:translate-y-[3px]"
                  style={{
                    background: '#a8e6cf',
                    color: '#000',
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                >
                  <i className="fas fa-file-pdf" /> Resume
                </button>
              </div>

              {/* Tech strip */}
              <div
                className={cls('reveal flex gap-[10px] flex-wrap mt-12 pt-8 border-t-2 border-dashed', 'delay-5')}
                style={{ borderColor: 'var(--border)' }}
              >
                {techs.map(t => (
                  <span
                    key={t.label}
                    className="tech-badge inline-flex items-center gap-[6px] px-[14px] py-[6px] border-2 rounded-full text-[0.82rem] font-semibold transition-[background] duration-150 cursor-default"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--bg-card)',
                      color: 'var(--text)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#66d9ef'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
                  >
                    <i className={t.icon} /> {t.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — avatar */}
              <div className={cls('reveal-zoom relative w-[360px] shrink-0 hidden md:block', 'delay-3')}>
                <img
                  src="/image/my_picture.png"
                  alt="Zaid Liaqat"
                  className="hero-avatar-placeholder w-[360px] h-[380px] border-4 rounded-[8px] object-cover object-top transition-transform duration-300 hover:-rotate-2"
                  style={{
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                />

                {/* Deco tags */}
                <span
                  className="absolute bottom-[-16px] right-[-16px] px-[14px] py-[6px] text-[0.85rem] font-bold rounded border-[3px] whitespace-nowrap"
                  style={{ background: '#ff6b9d', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
                >
                   Hasilpur, Pakistan
                </span>
                <span
                  className="absolute top-[-14px] left-[-14px] px-[14px] py-[6px] text-[0.8rem] font-bold rounded border-[3px] whitespace-nowrap font-mono"
                  style={{ background: '#a8e6cf', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
                >
                  &lt;developer /&gt;
                </span>
              </div>

          </div>
        </div>
      </section>

      {showResume && <ResumeModal onClose={() => setShowResume(false)} />}
    </>
  );
}
