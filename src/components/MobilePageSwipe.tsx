'use client';

import { useEffect, useState, useRef, ReactNode, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

// 页面配置
const pages = [
  { path: '', key: 'home' },
  { path: '/business', key: 'business' },
  { path: '/cases', key: 'cases' },
  { path: '/about', key: 'about' },
  { path: '/contact', key: 'contact' },
];

// 页面组件
import HeroSection from '@/components/home/HeroSection';
import GoSection from '@/components/home/GoSection';
import ImaSection from '@/components/home/ImaSection';
import WooSection from '@/components/home/WooSection';
import AdvantagesSection from '@/components/home/AdvantagesSection';
import BusinessPage from '@/app/[locale]/business/page';
import CasesPage from '@/app/[locale]/cases/page';
import AboutPage from '@/app/[locale]/about/page';
import ContactPage from '@/app/[locale]/contact/page';
import { MobileFooterContent } from '@/components/Footer';

interface MobilePageSwipeProps {
  children: ReactNode;
}

export default function MobilePageSwipe({ children }: MobilePageSwipeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const isNavigating = useRef(false);

  // 获取当前页面索引
  const getCurrentPageIndex = () => {
    const path = pathname.replace(`/${locale}`, '') || '';
    const index = pages.findIndex(p => p.path === path);
    return index >= 0 ? index : 0;
  };

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 当 URL 变化时，同步 Swiper
  useEffect(() => {
    if (swiperRef.current && !isNavigating.current) {
      const index = getCurrentPageIndex();
      swiperRef.current.slideTo(index, 300);
    }
    isNavigating.current = false;
  }, [pathname, locale]);

  // 处理滑动切换 - 立即更新 URL
  const handleSlideChange = (swiper: SwiperType) => {
    const newIndex = swiper.activeIndex;
    const currentIndex = getCurrentPageIndex();

    if (newIndex !== currentIndex) {
      isNavigating.current = true;
      const newPath = pages[newIndex].path;
      // 使用 replace 避免产生历史记录，并立即更新
      router.replace(`/${locale}${newPath}`, { scroll: false });
    }
  };

  // 滚动监听 - 发送自定义事件控制导航栏显示/隐藏
  const prevScrollTop = useRef(0);
  const handleContainerScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const currentScrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;

    // 计算滚动方向
    const isScrollingDown = currentScrollTop > prevScrollTop.current;
    const scrollDiff = Math.abs(currentScrollTop - prevScrollTop.current);

    // 检测是否在底部（考虑iOS overscroll bounce）
    const isAtBottom = scrollHeight - currentScrollTop <= clientHeight + 20;

    // 只有滚动超过一定距离才触发
    if (scrollDiff > 5) {
      const isAtTop = currentScrollTop < 10;

      // 在底部时忽略滚动方向变化，避免iOS bounce导致的抖动
      if (isAtBottom && !isScrollingDown) {
        prevScrollTop.current = currentScrollTop;
        return;
      }

      // 发送自定义事件给 MobileNav
      window.dispatchEvent(new CustomEvent('mobileScroll', {
        detail: {
          scrollTop: currentScrollTop,
          isScrollingDown,
          isAtTop
        }
      }));
      prevScrollTop.current = currentScrollTop;
    }
  }, []);

  // 未挂载或桌面端直接渲染 children
  if (!mounted || !isMobile) {
    return <>{children}</>;
  }

  // 手机端使用 Swiper
  // 内容区域始终占满全屏，导航栏覆盖在上方，避免位置变化影响滚动惯性
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    >
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
        initialSlide={getCurrentPageIndex()}
        slidesPerView={1}
        spaceBetween={0}
        resistance={true}
        resistanceRatio={0.5}
        speed={300}
        touchRatio={1}
        threshold={10}
        touchAngle={25}
        touchStartPreventDefault={false}
        simulateTouch={true}
        allowTouchMove={true}
        direction="horizontal"
        touchReleaseOnEdges={true}
        passiveListeners={false}
        style={{ height: '100%', width: '100%' }}
      >
        {/* 首页 */}
        <SwiperSlide style={{ height: '100%', overflow: 'hidden' }}>
          <div
            className="mobile-scroll-container"
            onScroll={handleContainerScroll}
            style={{
              height: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              paddingTop: '4rem', // 为导航栏留出空间
            }}
          >
            <HeroSection />
            <GoSection />
            <ImaSection />
            <WooSection />
            <AdvantagesSection />
            <MobileFooterContent />
          </div>
        </SwiperSlide>

        {/* 业务页 */}
        <SwiperSlide style={{ height: '100%', overflow: 'hidden' }}>
          <div
            className="mobile-scroll-container"
            onScroll={handleContainerScroll}
            style={{
              height: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              paddingTop: '4rem', // 为导航栏留出空间
            }}
          >
            <BusinessPage />
            <MobileFooterContent />
          </div>
        </SwiperSlide>

        {/* 案例页 */}
        <SwiperSlide style={{ height: '100%', overflow: 'hidden' }}>
          <div
            className="mobile-scroll-container"
            onScroll={handleContainerScroll}
            style={{
              height: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              paddingTop: '4rem', // 为导航栏留出空间
            }}
          >
            <CasesPage />
            <MobileFooterContent />
          </div>
        </SwiperSlide>

        {/* 关于页 */}
        <SwiperSlide style={{ height: '100%', overflow: 'hidden' }}>
          <div
            className="mobile-scroll-container"
            onScroll={handleContainerScroll}
            style={{
              height: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              paddingTop: '4rem', // 为导航栏留出空间
            }}
          >
            <AboutPage />
            <MobileFooterContent />
          </div>
        </SwiperSlide>

        {/* 联系页 */}
        <SwiperSlide style={{ height: '100%', overflow: 'hidden' }}>
          <div
            className="mobile-scroll-container"
            onScroll={handleContainerScroll}
            style={{
              height: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              paddingTop: '4rem', // 为导航栏留出空间
            }}
          >
            <ContactPage />
            <MobileFooterContent />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
