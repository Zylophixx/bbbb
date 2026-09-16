import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 1.8;
      });
    }, 45);

    const tl = gsap.timeline({ onComplete: () => { clearInterval(interval); onComplete(); } });

    tl.set(containerRef.current, { opacity: 1 })
      .fromTo(taglineRef.current, { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .to({}, { duration: 2 })
      .to([taglineRef.current, barRef.current],
        { opacity: 0, y: -16, stagger: 0.05, duration: 0.4, ease: 'power2.in' })
      .to(containerRef.current,
        { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, '-=0.15');

    return () => { tl.kill(); clearInterval(interval); };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center opacity-0"
      style={{ background: '#0a0a0a', pointerEvents: 'none' }}
    >
      <div className="splash-noise" />
      <div className="relative flex flex-col items-center text-center px-8 max-w-lg w-full">
        {/* Tagline */}
        <div ref={taglineRef} className="opacity-0 mb-10">
          <p className="ibm-font text-sm tracking-widest uppercase"
             style={{ color: 'rgba(201,168,76,0.7)', letterSpacing: '0.25em' }}>
            Visual Storyteller &amp; Motion Designer
          </p>
        </div>

        {/* Progress */}
        <div ref={barRef} className="w-full max-w-xs">
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, rgba(201,168,76,0.4), rgba(201,168,76,0.9))',
                transition: 'width 0.1s linear',
              }}
            />
          </div>
          <p className="syne text-xs mt-3 text-center" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em' }}>
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </div>
  );
}
