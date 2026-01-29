'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSwipe } from '@/hooks/useSwipe';

export default function GoSection() {
  const t = useTranslations('go');
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const images = [
    '/images/go-1.png',
    '/images/go-2.png',
    '/images/go-3.png',
    '/images/go-4.png',
  ];

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
  }, [images.length]);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    startTimer(); // 重置倒计时
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    startTimer(); // 重置倒计时
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    startTimer(); // 重置倒计时
  };

  // 触摸滑动支持
  const swipeHandlers = useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrev,
  });

  return (
    <section id="go" className="snap-section w-full min-h-screen flex flex-col items-center justify-center py-10 md:py-20 bg-[#232323]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top title - Large headline */}
        <div className="section-title text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4">
            {/* 手机版第一行 / 电脑版左侧：GO (行) */}
            <div className="flex items-center">
              <span className="text-[var(--go-blue)] text-4xl md:text-5xl font-bold">GO</span>
              <span className="text-[var(--go-blue)] text-2xl md:text-3xl font-normal ml-2">({t('annotation')})</span>
            </div>
            {/* 手机版第二行 / 电脑版右侧：线下邀约 */}
            <span className="text-white text-2xl md:text-3xl lg:text-4xl font-medium tracking-wide">
              {t('subtitle')}
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-8 md:h-24"></div>

        <div className="relative flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-12 px-0 md:px-12">
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
          {/* Left - Carousel Image + Dots */}
          <div className="flex-1 content-slide-left">
            <div
              className="relative aspect-video rounded-xl overflow-hidden"
              {...swipeHandlers}
            >
              {images.map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  alt={`GO ${index + 1}`}
                  fill
                  className={`object-cover transition-opacity duration-500 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
            {/* Spacer */}
            <div style={{ height: '2rem' }}></div>
            {/* Pagination dots */}
            <div className="flex justify-center gap-3">
              {images.map((_, dotIndex) => (
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

          {/* Right - Slogan + Icon + Description */}
          <div className="content-slide-right flex flex-col items-center lg:items-start lg:w-[480px]">
            {/* Slogan Image */}
            <div className="scale-in">
              <Image
                src="/images/go-slogan.png"
                alt={t('slogan')}
                width={800}
                height={400}
                style={{ width: '320px' }}
              />
            </div>

            {/* Spacer */}
            <div style={{ height: '40px' }}></div>

            {/* Icon + Description - 左右布局 */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
              {/* GO Icon */}
              <div className="text-reveal flex-shrink-0">
                <Image
                  src="/images/GO_mark.png"
                  alt="GO"
                  width={80}
                  height={80}
                  className="w-20 h-20"
                />
              </div>

              {/* Description - 手机版合并为一段，桌面版分行显示 */}
              <div className="text-[#808080] text-base md:text-lg leading-loose text-center md:text-left">
                <p className="md:hidden">{t('desc1')}{t('desc2')}{t('desc3')}</p>
                <div className="hidden md:block space-y-2">
                  <p className="text-reveal">{t('desc1')}</p>
                  <p className="text-reveal">{t('desc2')}</p>
                  <p className="text-reveal">{t('desc3')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
