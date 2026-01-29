'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function BusinessPage() {
  const t = useTranslations('business');

  const services = [
    {
      id: 'platform',
      icon: '/images/logo-full.png',
      image: '/images/business-platform.png',
      title: t('platform.title'),
      description: t('platform.description'),
    },
    {
      id: 'events',
      icon: '/images/GO_mark.png',
      image: '/images/business-events.png',
      title: t('events.title'),
      description: t('events.description'),
    },
    {
      id: 'marketing',
      icon: '/images/IMA_mark.png',
      image: '/images/business-marketing.png',
      title: t('marketing.title'),
      description: t('marketing.description'),
    },
  ];

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-start pt-4 md:pt-60 pb-10 md:pb-20 bg-[#232323]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="section-title text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="text-[var(--imago-red)] text-4xl md:text-5xl font-bold">Business</span>
            <span className="text-white text-2xl md:text-3xl lg:text-4xl font-medium tracking-wide">
              {t('subtitle')}
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-8 md:h-24"></div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="relative rounded-xl overflow-hidden flex flex-col items-center text-center group"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 pt-48 flex flex-col items-center">
                <h3 className="text-white text-xl font-bold mb-4">{service.title}</h3>

                {/* Spacer */}
                <div className="h-2"></div>

                <p className="text-[#F7F7F7] text-sm leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
