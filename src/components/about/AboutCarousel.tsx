'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSwipe } from '@/hooks/useSwipe';

// 移动端单个卡片组件
function MobileAboutCard({ slide }: { slide: { id: string; icon: string | null; image: string; description: string } }) {
  return (
    <div className="flex flex-col items-center">
      {/* Top: Icon + Image inline (or just image for tokyo) */}
      {slide.icon ? (
        <div className="flex flex-row items-center justify-center gap-4">
          <Image
            src={slide.icon}
            alt=""
            width={200}
            height={80}
            style={{ height: '40px', width: 'auto' }}
          />
          <div className="relative overflow-hidden rounded" style={{ height: '50px', width: '160px' }}>
            <Image
              src={slide.image}
              alt=""
              fill
              className="object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded" style={{ height: '80px', width: '100%', maxWidth: '300px' }}>
          <Image
            src={slide.image}
            alt=""
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Spacer */}
      <div style={{ height: '1.5rem' }}></div>

      {/* Description text */}
      <p className="text-[#808080] text-sm leading-relaxed text-center px-4">
        {slide.description}
      </p>
    </div>
  );
}

export default function AboutCarousel() {
  const t = useTranslations('about');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      id: 'hatta',
      icon: '/images/about-hatta-icon.png',
      image: '/images/about-hatta-image.png',
      description: t('hatta.description'),
    },
    {
      id: 'imago',
      icon: '/images/logo-full.png',
      image: '/images/about-imago-image.png',
      description: t('imago.description'),
    },
    {
      id: 'tokyo',
      icon: null,
      image: '/images/about-tokyo.png',
      description: t('tokyo.description'),
    }
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    setMounted(true);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
  }, [slides.length]);

  useEffect(() => {
    if (!isMobile) {
      startTimer();
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [startTimer, isMobile]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    startTimer();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    startTimer();
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    startTimer();
  };

  // 触摸滑动支持
  const swipeHandlers = useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrev,
  });

  // 未挂载时不渲染，避免闪烁
  if (!mounted) {
    return null;
  }

  // 移动端：3个独立卡片纵向排列
  if (isMobile) {
    return (
      <section className="w-full py-10 bg-[#232323]">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-24">
            {slides.map((slide) => (
              <MobileAboutCard key={slide.id} slide={slide} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 桌面端：轮播效果
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center pt-4 md:pt-36 pb-10 md:pb-20 bg-[#232323]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col items-center px-0 md:px-12">
          {/* Left Arrow */}
          <button
            onClick={goToPrev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center text-[#484848] hover:text-white transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center text-[#484848] hover:text-white transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slides Container */}
          <div
            className="relative w-full"
            style={{ minHeight: '200px' }}
            {...swipeHandlers}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 flex flex-col items-center transition-opacity duration-500 ${
                  index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {/* Top: Icon + Image inline (or just image for tokyo) */}
                {slide.icon ? (
                  <div className="flex items-center justify-center gap-4">
                    <Image
                      src={slide.icon}
                      alt=""
                      width={300}
                      height={120}
                      style={{ height: '60px', width: 'auto' }}
                    />
                    <div className="relative overflow-hidden rounded" style={{ height: '60px', width: '240px' }}>
                      <Image
                        src={slide.image}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded" style={{ height: '120px', width: '100%', maxWidth: '600px' }}>
                    <Image
                      src={slide.image}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Spacer */}
                <div style={{ height: '2rem' }}></div>

                {/* Description text */}
                <p className="text-[#F7F7F7] text-base md:text-lg leading-loose text-center max-w-3xl">
                  {slide.description}
                </p>
              </div>
            ))}
          </div>

          {/* Spacer */}
          <div style={{ height: '2rem' }}></div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-3">
            {slides.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => goToIndex(dotIndex)}
                className="w-4 h-4 flex items-center justify-center"
              >
                <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  dotIndex === currentIndex ? 'bg-white scale-125' : 'bg-[#484848]'
                }`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
