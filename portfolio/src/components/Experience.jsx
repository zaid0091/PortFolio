import { useRef, useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';

function TimelineItem({ item, dateColor, index, visible }) {
  const isLeft = index % 2 === 0;
  return (
    <div className={`timeline-item ${isLeft ? 'timeline-item--left' : 'timeline-item--right'} ${visible ? 'is-visible' : ''}`}
      style={{ '--delay': `${index * 0.15 + 0.2}s` }}
    >
      {/* Dot */}
      <div className="timeline-dot" style={{ background: dateColor }} />

      {/* Card */}
      <div className="timeline-card neo-card p-6">
        <div className="flex justify-between items-start gap-3 mb-2 flex-wrap">
          <div>
            <div className="text-[1.05rem] font-bold leading-[1.3]" style={{ color: 'var(--text)' }}>
              {item.title}
            </div>
            <div className="text-[0.92rem] font-medium mt-[2px]" style={{ color: 'var(--text-muted)' }}>
              {item.company}
            </div>
          </div>
          <span
            className="timeline-date font-mono text-[0.76rem] border-2 px-[10px] py-[2px] rounded shrink-0"
            style={{ background: dateColor, borderColor: 'var(--border)', color: '#000' }}
          >
            {item.date}
          </span>
        </div>

        <div className="text-[0.8rem] mb-3" style={{ color: 'var(--text-muted)' }}>
          📍 {item.location}
        </div>

        <ul className="flex flex-col gap-[5px] mb-3">
          {item.bullets.map((b, j) => (
            <li key={j} className="text-[0.9rem] leading-[1.65] flex items-start gap-1" style={{ color: 'var(--text-muted)' }}>
              <span className="mt-[3px] shrink-0 text-[0.7rem]">▸</span> {b}
            </li>
          ))}
        </ul>

        <div className="flex gap-[6px] flex-wrap mt-3">
          {item.tags.map(t => (
            <span
              key={t}
              className="text-[0.72rem] px-[9px] py-[2px] border-2 rounded font-semibold"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineSection({ title, items, dateColor, accentColor }) {
  const [ref, visible] = useInView({ threshold: 0.05 });
  const lineRef = useRef(null);

  useEffect(() => {
    if (!visible || !lineRef.current) return;
    lineRef.current.style.height = lineRef.current.dataset.height;
  }, [visible]);

  return (
    <div className="mb-16" ref={ref}>
      <div className={`inline-flex items-center gap-2 mb-10 reveal-zoom ${visible ? 'is-visible' : ''}`}>
        <span
          className="text-[0.95rem] font-bold font-mono px-4 py-[6px] border-2 rounded"
          style={{ background: accentColor, borderColor: 'var(--border)', color: '#000', boxShadow: 'var(--shadow)' }}
        >
          {title}
        </span>
      </div>

      <div className="timeline-track">
        {/* Animated vertical line */}
        <div className="timeline-line-wrapper">
          <div
            ref={lineRef}
            className={`timeline-line ${visible ? 'timeline-line--animated' : ''}`}
            style={{ background: `linear-gradient(to bottom, ${accentColor}, ${dateColor})` }}
          />
        </div>

        {items.map((item, i) => (
          <TimelineItem key={i} item={item} dateColor={dateColor} index={i} visible={visible} />
        ))}
      </div>
    </div>
  );
}

export default function Experience() {
  const work = [
    {
      title: 'Software Developer Intern',
      company: 'CodeWithCurious Tech Solutions',
      date: 'Jun 2023 – Dec 2023',
      location: 'Bhawalpur, Pakistan (Remote)',
      bullets: [
        'Built and maintained full-stack web applications using Django, Django REST Framework, and React.',
        'Designed RESTful APIs consumed by React front-ends; wrote unit tests with pytest.',
        'Deployed applications on AWS Lambda + Vercel; reduced page load time by ~30%.',
        'Collaborated with a cross-functional team via Git, daily stand-ups, and Agile sprints.',
      ],
      tags: ['Django', 'DRF', 'React', 'Python', 'AWS Lambda', 'Vercel', 'PostgreSQL'],
    },
  ];

  const activities = [
    {
      title: 'Head of Events',
      company: 'CodeWithCurious Tech Club — IUB',
      date: '2024 – Present',
      location: 'Bahawalpur, Pakistan',
      bullets: [
        'Organised and managed 10+ hackathons, coding competitions, and tech workshops.',
        'Coordinated with speakers, sponsors, and 200+ student participants.',
      ],
      tags: ['Leadership', 'Event Management', 'Community'],
    },
    {
      title: 'Committee Member',
      company: 'Google Developer Student Club (GDSC) — IUB',
      date: '2024 – Present',
      location: 'Bahawalpur, Pakistan',
      bullets: [
        'Contributed to organising developer-focused events and learning sessions.',
        'Helped onboard new members and promoted open-source culture on campus.',
      ],
      tags: ['Google', 'Open Source', 'Community'],
    },
  ];

  const [titleRef, titleVisible] = useInView();

  return (
    <section id="experience" className="py-20" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <h2 ref={titleRef} className={`section-title reveal-zoom ${titleVisible ? 'is-visible' : ''}`}>
          Experience
        </h2>
        <TimelineSection title="💼 Work Experience" items={work} dateColor="#66d9ef" accentColor="#66d9ef" />
        <TimelineSection title="🎓 Activities & Leadership" items={activities} dateColor="#a8e6cf" accentColor="#a8e6cf" />
      </div>
    </section>
  );
}
