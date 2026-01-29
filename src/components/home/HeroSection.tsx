'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function HeroSection() {
  const t = useTranslations('hero');
  const headerT = useTranslations('header');
  const titleRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 检测移动端
    const checkMobile = window.innerWidth < 768;
    setIsMobile(checkMobile);

    // 移动端不执行动画
    if (checkMobile) return;

    // 标题文字动画 - 逐字出现
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.char');
      gsap.fromTo(chars,
        {
          opacity: 0,
          y: 50,
          rotateX: -90,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: 'back.out(1.7)',
          delay: 0.3,
        }
      );
    }

    // 内容区域动画
    gsap.fromTo('.hero-left',
      { opacity: 0, x: -80, rotateY: 10 },
      { opacity: 1, x: 0, rotateY: 0, duration: 1.2, ease: 'power3.out', delay: 0.8 }
    );

    gsap.fromTo('.hero-right',
      { opacity: 0, x: 80, rotateY: -10 },
      { opacity: 1, x: 0, rotateY: 0, duration: 1.2, ease: 'power3.out', delay: 1 }
    );

    // 描述文字逐行出现
    gsap.fromTo('.hero-desc p',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 1.4 }
    );

    // 滚动指示器
    gsap.fromTo('.scroll-indicator',
      { opacity: 0 },
      { opacity: 1, duration: 0.5, delay: 2 }
    );
  }, []);

  // 将文字拆分成单个字符
  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="char inline-block" style={{ perspective: '1000px' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section className="hero-section snap-section w-full min-h-screen flex flex-col items-center justify-center pt-0 md:pt-32 relative overflow-hidden bg-[#232323]">
      <div className="hero-content w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-0 md:-mt-20">
        {/* Top tagline - Large headline */}
        <div ref={titleRef} className="hero-title text-center">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="text-5xl md:text-6xl font-bold text-[var(--imago-red)]">
              {splitText('IMAGO')}
            </span>
            <span className="text-white text-2xl md:text-3xl lg:text-4xl font-medium tracking-wide">
              {splitText(headerT('slogan'))}
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-8 md:h-24"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Left side - Slogan Image */}
          <div className="hero-left flex justify-center lg:justify-end" style={{ opacity: isMobile ? 1 : 0 }}>
            <Image
              src="/images/hero-slogan.png"
              alt={t('subtitle')}
              width={600}
              height={300}
              className="max-w-xl w-full"
              priority
            />
          </div>

          {/* Right side - IMAGO letters image + Description */}
          <div className="hero-right flex flex-col items-center lg:items-start justify-center lg:justify-start" style={{ opacity: isMobile ? 1 : 0 }}>
            <Image
              src="/images/hero-imago-letters.png"
              alt="IMAGO"
              width={600}
              height={240}
              className="max-w-xl w-full mb-6"
              priority
            />
            {/* Description - 手机版合并为一段，桌面版分行显示 */}
            <div className="hero-desc text-[#808080] text-base md:text-lg leading-loose text-center lg:text-left">
              {/* 手机版：合并为一段 */}
              <p className="md:hidden">
                {t('description1')}{t('description2')}{t('description3')}
              </p>
              {/* 桌面版：分行显示 */}
              <div className="hidden md:block space-y-2">
                <p>{t('description1')}</p>
                <p>{t('description2')}</p>
                <p>{t('description3')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - 仅桌面端显示 */}
      <div className="scroll-indicator hidden md:block absolute bottom-36 left-1/2 -translate-x-1/2" style={{ opacity: 0 }}>
        <div className="text-[#484848] text-center animate-bounce">
          <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span className="text-xs">Scroll</span>
        </div>
      </div>
    </section>
  );
}
