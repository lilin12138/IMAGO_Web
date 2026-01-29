'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function CasesPage() {
  const t = useTranslations('cases');

  const cases = [
    {
      id: 1,
      image: '/images/case-city-pulse.png',
      title: t('case1.title'),
      category: t('case1.category'),
    },
    {
      id: 2,
      image: '/images/case-real-link.png',
      title: t('case2.title'),
      category: t('case2.category'),
    },
    {
      id: 3,
      image: '/images/case-immersive-view.png',
      title: t('case3.title'),
      category: t('case3.category'),
    },
    {
      id: 4,
      image: '/images/case-sync-vibes.png',
      title: t('case4.title'),
      category: t('case4.category'),
    },
  ];

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-start pt-4 md:pt-60 pb-10 md:pb-20 bg-[#232323]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="section-title text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="text-[var(--imago-red)] text-4xl md:text-5xl font-bold">Cases</span>
            <span className="text-white text-2xl md:text-3xl lg:text-4xl font-medium tracking-wide">
              {t('subtitle')}
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-8 md:h-24"></div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="group flex flex-col items-center cursor-pointer"
            >
              <div className="relative rounded-[2rem] overflow-hidden">
                <Image
                  src={caseItem.image}
                  alt={caseItem.title}
                  width={600}
                  height={1200}
                  className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500"
                />
                {/* 桌面端：悬停遮罩 */}
                <div className="hidden md:block absolute inset-[3%] bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500 rounded-[2.5rem]">
                  <div className="absolute bottom-[20%] left-0 right-0 text-center">
                    <p className="text-[var(--imago-red)] text-4xl font-bold mb-3">{caseItem.category}</p>
                    <h3 className="text-white text-2xl font-bold">{caseItem.title}</h3>
                  </div>
                </div>
              </div>
              {/* 手机端：文字显示在图片下方 */}
              <div className="md:hidden mt-4 text-center">
                <p className="text-[var(--imago-red)] text-lg font-bold mb-1">{caseItem.category}</p>
                <h3 className="text-white text-base font-bold">{caseItem.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
