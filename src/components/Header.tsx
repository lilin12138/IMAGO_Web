'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import SearchBox from './SearchBox';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(ja|zh|en|ko)(\/|$)/, '$2') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const localeLabels: Record<string, string> = {
    ja: '日本語',
    zh: '中文',
    en: 'English',
    ko: '한국어'
  };

  const navLinks = [
    { key: 'home', href: `/${locale}` },
    { key: 'business', href: `/${locale}/business` },
    { key: 'cases', href: `/${locale}/cases` },
    { key: 'about', href: `/${locale}/about` },
    { key: 'contact', href: `/${locale}/contact` },
  ];

  return (
    <header className="hidden md:flex fixed top-0 left-0 right-0 w-full z-50 bg-[#1a1a1a]/95 backdrop-blur-sm flex-col items-center">
      {/* Top Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 py-4">
          {/* Logo */}
          <Link href={`/${locale}`}>
            <Image
              src="/images/logo-full.png"
              alt="IMAGO"
              width={160}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Search Box - Desktop */}
          <div className="hidden md:block">
            <SearchBox />
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {Object.entries(localeLabels).map(([code, label]) => (
              <button
                key={code}
                onClick={() => switchLocale(code)}
                className={`text-sm transition-colors ${
                  locale === code
                    ? 'text-white'
                    : 'text-[#484848] hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#484848] hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Secondary Navigation - Desktop */}
      <nav className="hidden md:flex w-full justify-center">
        <div className="flex items-center gap-24 h-14 py-2">
          {navLinks.map((link) => {
            const isActive = (link.key === 'home' && pathname === `/${locale}`) ||
              (link.key === 'about' && pathname.includes('/about')) ||
              (link.key === 'business' && pathname.includes('/business')) ||
              (link.key === 'cases' && pathname.includes('/cases')) ||
              (link.key === 'contact' && pathname.includes('/contact'));
            return (
              <Link
                key={link.key}
                href={link.href}
                className={`text-sm transition-colors relative py-3 ${
                  isActive ? 'text-white' : 'text-[#484848] hover:text-white'
                }`}
              >
                {t(link.key)}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full py-4 px-4">
          <div className="mb-4">
            <SearchBox />
          </div>
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-[#484848] hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center mt-4 pt-4">
            {Object.entries(localeLabels).map(([code, label]) => (
              <button
                key={code}
                onClick={() => {
                  switchLocale(code);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 text-sm transition-colors ${
                  locale === code
                    ? 'text-white'
                    : 'text-[#484848] hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
