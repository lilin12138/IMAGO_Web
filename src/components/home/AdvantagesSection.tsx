'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSwipe } from '@/hooks/useSwipe';

export default function AdvantagesSection() {
  const t = useTranslations('advantages');
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const images = [
    '/images/advantage-1.png',
    '/images/advantage-2.png',
    '/images/advantage-3.png',
    '/images/advantage-4.png',
  ];

  const items = t.raw('items') as Array<{
    keyword: string;
    title: string;
    lines: string[];
  }>;

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
  }, [items.length]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    startTimer();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
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

  return (
    <section id="advantages" className="snap-section w-full min-h-screen flex flex-col items-center justify-center py-10 md:py-20 bg-[#232323]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top title */}
        <div className="text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4">
            {/* 手机版第一行 / 电脑版左侧：Advantages */}
            <span className="text-[var(--imago-red)] text-4xl md:text-5xl font-bold italic">Advantages</span>
            {/* 手机版第二行 / 电脑版右侧：差异化与优势 */}
            <span className="text-white text-2xl md:text-3xl lg:text-4xl font-medium tracking-wide">
              {t('subtitle')}
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-8 md:h-24"></div>

        {/* Single Carousel Card */}
        <div className="relative flex flex-col lg:flex-row gap-6 lg:gap-12 px-0 md:px-12">
          {/* Left Arrow - 仅桌面端显示 */}
          <button
            onClick={goToPrev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center text-[#484848] hover:text-white transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow - 仅桌面端显示 */}
          <button
            onClick={goToNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center text-[#484848] hover:text-white transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {/* Left - Image + Dots */}
          <div className="flex-1">
            <div
              className="relative aspect-video rounded-xl overflow-hidden"
              {...swipeHandlers}
            >
              {images.map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  alt={items[index]?.keyword || ''}
                  fill
                  className={`object-cover transition-opacity duration-500 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
            {/* Spacer */}
            <div style={{ height: '3rem' }}></div>
            {/* Pagination dots */}
            <div className="flex justify-center gap-3">
              {items.map((_, dotIndex) => (
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

          {/* Right - All 4 items (clickable) */}
          <div className="lg:w-[480px] flex flex-col gap-8 items-center lg:items-start">
            {items.map((item, itemIndex) => {
              const isCurrent = itemIndex === currentIndex;

              return (
                <button
                  key={itemIndex}
                  onClick={() => goToIndex(itemIndex)}
                  className="text-center lg:text-left transition-all duration-300"
                >
                  {isCurrent ? (
                    <div className="space-y-3">
                      <p className="inline-block border-b border-[#484848] pb-1 text-xl md:text-2xl">
                        <span className="text-[var(--imago-red)] font-bold">{item.keyword}</span>
                        <span className="text-white ml-1">{item.title}</span>
                      </p>
                      <p className="text-[#F7F7F7] text-lg md:text-xl">
                        {item.lines.join('')}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[#484848] hover:text-[#666666] transition-colors">
                      {item.keyword}{item.title}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
