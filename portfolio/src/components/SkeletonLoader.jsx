import { useEffect, useState } from 'react';

const Bone = ({ w = '100%', h = '20px', r = '4px', style }) => (
  <div
    className="skeleton-bone"
    style={{ width: w, height: h, borderRadius: r, ...style }}
  />
);

function HeroSkeleton() {
  return (
    <section
      className="min-h-screen flex flex-col justify-center px-6"
      style={{ paddingTop: 'var(--nav-height)', background: 'var(--bg-secondary)' }}
    >
      <div className="max-w-[1100px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-[60px] items-center">
          <div>
            <Bone w="120px" h="18px" style={{ marginBottom: 16 }} />
            <Bone w="340px" h="48px" style={{ marginBottom: 20 }} />
            <Bone w="260px" h="36px" r="6px" style={{ marginBottom: 16 }} />
            <Bone w="100px" h="28px" r="20px" style={{ marginBottom: 20 }} />
            <Bone w="100%" h="16px" style={{ marginBottom: 8, maxWidth: 500 }} />
            <Bone w="90%" h="16px" style={{ marginBottom: 8, maxWidth: 460 }} />
            <Bone w="70%" h="16px" style={{ marginBottom: 28, maxWidth: 360 }} />
            <div className="flex gap-3 mb-6">
              {[1, 2, 3, 4].map(i => (
                <Bone key={i} w="42px" h="42px" r="6px" />
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              <Bone w="160px" h="48px" r="6px" />
              <Bone w="160px" h="48px" r="6px" />
              <Bone w="120px" h="48px" r="6px" />
            </div>
          </div>
          <div className="hidden md:block">
            <Bone w="300px" h="300px" r="8px" />
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSkeleton() {
  return (
    <section className="py-20 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1100px] mx-auto">
        <Bone w="180px" h="32px" style={{ margin: '0 auto 32px' }} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="skeleton-card p-7">
            <Bone w="100%" h="14px" style={{ marginBottom: 10 }} />
            <Bone w="95%" h="14px" style={{ marginBottom: 10 }} />
            <Bone w="85%" h="14px" style={{ marginBottom: 20 }} />
            <Bone w="100%" h="14px" style={{ marginBottom: 10 }} />
            <Bone w="90%" h="14px" style={{ marginBottom: 20 }} />
            <Bone w="100%" h="14px" style={{ marginBottom: 10 }} />
            <Bone w="70%" h="14px" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-card p-5 text-center">
                <Bone w="80px" h="40px" style={{ margin: '0 auto 8px' }} />
                <Bone w="100px" h="12px" style={{ margin: '0 auto' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSkeleton() {
  return (
    <section className="py-20 px-6" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1100px] mx-auto">
        <Bone w="200px" h="32px" style={{ margin: '0 auto 32px' }} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="skeleton-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bone w="44px" h="44px" r="8px" />
                <div>
                  <Bone w="160px" h="18px" style={{ marginBottom: 6 }} />
                  <Bone w="80px" h="12px" />
                </div>
              </div>
              <Bone w="100%" h="13px" style={{ marginBottom: 8 }} />
              <Bone w="90%" h="13px" style={{ marginBottom: 16 }} />
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4].map(j => (
                  <Bone key={j} w="70px" h="24px" r="20px" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillsSkeleton() {
  return (
    <section className="py-20 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1100px] mx-auto">
        <Bone w="140px" h="32px" style={{ margin: '0 auto 32px' }} />
        <div className="flex gap-3 flex-wrap justify-center">
          {Array.from({ length: 12 }, (_, i) => (
            <Bone key={i} w={`${60 + Math.random() * 60}px`} h="36px" r="20px" />
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSkeleton() {
  return (
    <section className="py-20 px-6" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[600px] mx-auto">
        <Bone w="200px" h="32px" style={{ margin: '0 auto 12px' }} />
        <Bone w="300px" h="14px" style={{ margin: '0 auto 32px' }} />
        <div className="skeleton-card p-6">
          <Bone w="100%" h="44px" r="6px" style={{ marginBottom: 12 }} />
          <Bone w="100%" h="44px" r="6px" style={{ marginBottom: 12 }} />
          <Bone w="100%" h="120px" r="6px" style={{ marginBottom: 16 }} />
          <Bone w="160px" h="48px" r="6px" />
        </div>
      </div>
    </section>
  );
}

export default function SkeletonLoader({ visible }) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (!visible) {
      const t = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(t);
    } else {
      setShow(true);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <div
      className={`skeleton-wrapper ${visible ? '' : 'skeleton-fade-out'}`}
      aria-hidden="true"
    >
      {/* Fake navbar */}
      <div
        className="flex items-center justify-between px-6"
        style={{
          height: 'var(--nav-height, 70px)',
          background: 'var(--bg)',
          borderBottom: '3px solid var(--border)',
        }}
      >
        <Bone w="80px" h="28px" r="4px" />
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Bone key={i} w="60px" h="16px" />
          ))}
        </div>
        <Bone w="36px" h="36px" r="6px" />
      </div>

      <HeroSkeleton />
      <AboutSkeleton />
      <ProjectsSkeleton />
      <SkillsSkeleton />
      <ContactSkeleton />
    </div>
  );
}
