'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

// 移动端 Footer 内容（作为页面内容的一部分）
export function MobileFooterContent() {
  const t = useTranslations('footer');

  return (
    <div className="w-full bg-[#232323] pt-16 pb-8 px-4">
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <Image
          src="/images/footer-logo.png"
          alt="東京八達商事株式会社"
          width={300}
          height={75}
          className="h-10 w-auto"
          unoptimized
        />

        {/* Info */}
        <div className="flex flex-col items-center gap-2 text-xs text-[#808080] text-center">
          <p>{t('locationLabel')}: {t('location')}</p>
          <p>{t('corpNumberLabel')}: {t('corpNumber')}</p>
          <p>{t('postalLabel')}: {t('postal')}</p>
          <p>{t('phoneLabel')}: {t('phone')}</p>
          <p>{t('emailLabel')}: {t('email')}</p>
        </div>

        {/* LINE QR */}
        <Image
          src="/images/footer-line.png"
          alt="LINE"
          width={150}
          height={75}
          className="h-10 w-auto"
          unoptimized
        />
      </div>
    </div>
  );
}

// 桌面端 Footer（固定底边栏）
export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="hidden md:flex fixed bottom-0 left-0 right-0 w-full z-40 bg-[#1a1a1a] flex-col items-center" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

          {/* Logo (includes company name) */}
          <div className="shrink-0">
            <Image
              src="/images/footer-logo.png"
              alt="東京八達商事株式会社"
              width={400}
              height={100}
              className="h-12 w-auto"
              unoptimized
            />
          </div>

          {/* Info Columns */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-sm text-[#484848]">

            {/* Column 1 */}
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <p>{t('locationLabel')}: {t('location')}</p>
              <p>{t('corpNumberLabel')}: {t('corpNumber')}</p>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <p>{t('postalLabel')}: {t('postal')}</p>
              <p>{t('phoneLabel')}: {t('phone')}</p>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <p>{t('emailLabel')}</p>
              <p>{t('email')}</p>
            </div>
          </div>

          {/* LINE QR */}
          <div className="shrink-0">
            <Image
              src="/images/footer-line.png"
              alt="LINE"
              width={200}
              height={100}
              className="h-12 w-auto"
              unoptimized
            />
          </div>

        </div>
      </div>
    </footer>
  );
}
