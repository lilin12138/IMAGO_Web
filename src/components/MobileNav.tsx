'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// 页面顺序定义
const pages = ['', '/business', '/cases', '/about', '/contact'];

// 语言选项
const localeLabels: Record<string, string> = {
  ja: '日本語',
  zh: '中文',
  en: 'EN',
  ko: '한국어'
};

// 简短显示
const localeShort: Record<string, string> = {
  ja: 'JP',
  zh: '中',
  en: 'EN',
  ko: '한'
};

export default function MobileNav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 获取当前页面索引
  const getCurrentPageIndex = () => {
    const path = pathname.replace(`/${locale}`, '') || '';
    return pages.indexOf(path);
  };

  const currentIndex = getCurrentPageIndex();

  const navItems = [
    { key: 'home', href: `/${locale}` },
    { key: 'business', href: `/${locale}/business` },
    { key: 'cases', href: `/${locale}/cases` },
    { key: 'about', href: `/${locale}/about` },
    { key: 'contact', href: `/${locale}/contact` },
  ];

  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(ja|zh|en|ko)(\/|$)/, '$2') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setLangOpen(false);
  };

  useEffect(() => {
    const handleMobileScroll = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.isAtTop) {
        setVisible(true);
      } else {
        setVisible(!detail.isScrollingDown);
      }
    };

    window.addEventListener('mobileScroll', handleMobileScroll);

    return () => {
      window.removeEventListener('mobileScroll', handleMobileScroll);
    };
  }, []);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav
      className="md:hidden fixed left-0 right-0 z-50"
      style={{
        top: 0,
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease-in-out',
        backgroundColor: '#232323',
        width: '100%',
        maxWidth: '100vw',
      }}
    >
      <div className="h-safe-top" style={{ backgroundColor: '#232323' }} />
      <div className="flex items-center h-12">
        {/* 导航链接 */}
        <div className="flex items-center justify-around flex-1">
          {navItems.map((item, index) => {
            const isActive = index === currentIndex;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`relative flex items-center justify-center flex-1 h-12 text-sm transition-colors ${
                  isActive ? 'text-white' : 'text-[#484848]'
                }`}
              >
                {t(item.key)}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white" />
                )}
              </Link>
            );
          })}
        </div>

        {/* 语言切换 */}
        <div ref={dropdownRef} className="relative px-3">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1 text-sm text-[var(--imago-red)] transition-colors"
          >
            <span>{localeShort[locale]}</span>
            <svg
              className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* 下拉菜单 */}
          {langOpen && (
            <div
              className="absolute right-0 top-full mt-2 py-2 rounded-lg shadow-lg z-50"
              style={{ backgroundColor: '#1a1a1a', minWidth: '80px' }}
            >
              {Object.entries(localeLabels).map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => switchLocale(code)}
                  className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                    locale === code
                      ? 'text-white bg-[#333]'
                      : 'text-[#484848] hover:text-white hover:bg-[#2a2a2a]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
