import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';

const GITHUB_USERNAME = 'zaid0091';

function useCounter(target, duration = 1800, started = false) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!started) return;
    const isFloat = String(target).includes('.');
    const numericTarget = parseFloat(target);
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * numericTarget;
      setValue(isFloat ? parseFloat(current.toFixed(2)) : Math.floor(current));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      else setValue(numericTarget);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [started, target, duration]);

  return value;
}

export default function About() {
  const stats = [
    { number: '3.24', label: 'CGPA / 4.0',          color: '#66d9ef' },
    { number: '1',    label: 'Internship',            color: '#ff6b9d' },
    { number: '2',    label: 'Projects Built',        color: '#a8e6cf' },
    { number: '10',   label: 'Hackathons Organised',  color: '#ffd93d' },
  ];

  // Suffixes stored separately so counter stays numeric
  const suffixes = ['', '', '+', '+'];

  const [titleRef, titleVisible] = useInView();
  const [bioRef, bioVisible] = useInView();
  const [statsRef, statsVisible] = useInView();
  const [graphRef, graphVisible] = useInView();

  return (
    <section
      id="about"
      className="py-20"
      style={{ background: 'var(--bg)' }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <h2
          ref={titleRef}
          className={`section-title reveal-zoom ${titleVisible ? 'is-visible' : ''}`}
        >
          About Me
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Bio card */}
          <div
            ref={bioRef}
            className={`neo-card p-7 reveal-left ${bioVisible ? 'is-visible' : ''}`}
          >
            <p className="leading-[1.75] mb-4" style={{ color: 'var(--text-muted)' }}>
              I&apos;m a <span className="highlight font-semibold" style={{ background: '#ffd93d', padding: '1px 5px' }}>BS Software Engineering</span> student
              at <span className="highlight font-semibold" style={{ background: '#ffd93d', padding: '1px 5px' }}>IUB</span> (2024–2028),
              building full-stack applications and REST APIs with a passion for clean,
              maintainable code.
            </p>
            <p className="leading-[1.75] mb-4" style={{ color: 'var(--text-muted)' }}>
              During my internship at{' '}
              <span className="highlight-cyan font-semibold" style={{ background: '#66d9ef', padding: '1px 5px', color: 'var(--text)' }}>
                CodeWithCurious Tech Solutions
              </span>{' '}
              I worked on production-level Django &amp; React projects and shipped
              features end-to-end — from database design to deployment on AWS &amp; Vercel.
            </p>
            <p className="leading-[1.75]" style={{ color: 'var(--text-muted)' }}>
              Outside work I lead events for{' '}
              <span className="highlight-pink font-semibold" style={{ background: '#ff6b9d', padding: '1px 5px', color: '#000' }}>
                CodeWithCurious Tech Club
              </span>{' '}
              and contribute to the{' '}
              <span className="highlight-green font-semibold" style={{ background: '#a8e6cf', padding: '1px 5px', color: 'var(--text)' }}>
                GDSC
              </span>{' '}
              committee — organising 10+ hackathons and workshops.
            </p>
          </div>

          {/* Stats grid */}
          <div ref={statsRef} className={`grid grid-cols-2 gap-4 reveal ${statsVisible ? 'is-visible' : ''}`}>
            {stats.map((s, i) => (
              <CounterCard
                key={i}
                stat={s}
                suffix={suffixes[i]}
                started={statsVisible}
                delay={`${i * 0.1}s`}
              />
            ))}
          </div>
        </div>

        {/* GitHub contribution graph */}
        <div
          ref={graphRef}
          className={`neo-card p-6 mt-8 reveal ${graphVisible ? 'is-visible' : ''}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[1.1rem]">📊</span>
            <span className="font-bold text-[0.95rem]" style={{ color: 'var(--text)' }}>
              GitHub Activity
            </span>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[0.78rem] ml-auto"
              style={{ color: 'var(--text-muted)' }}
            >
              @{GITHUB_USERNAME} ↗
            </a>
          </div>
          <div className="overflow-x-auto">
            <img
              src={`https://ghchart.rshah.org/${GITHUB_USERNAME}`}
              alt={`${GITHUB_USERNAME} GitHub contribution graph`}
              className="w-full min-w-[600px]"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CounterCard({ stat, suffix, started, delay }) {
  const raw = parseFloat(stat.number);
  const isFloat = String(stat.number).includes('.');
  const counter = useCounter(raw, 1800, started);

  const display = isFloat ? counter.toFixed(2) : Math.floor(counter);

  return (
    <div
      className="neo-card p-5 text-center"
      style={{ transitionDelay: delay }}
    >
      <div
        className="text-[2.4rem] font-bold font-mono leading-none mb-[6px] tabular-nums"
        style={{ color: stat.color }}
      >
        {display}{suffix}
      </div>
      <div className="text-[0.82rem] font-medium" style={{ color: 'var(--text-muted)' }}>
        {stat.label}
      </div>
    </div>
  );
}
