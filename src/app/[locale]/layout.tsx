import { Suspense } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNavWrapper from '@/components/MobileNavWrapper';
import MobilePageSwipe from '@/components/MobilePageSwipe';
import ScrollAnimationsWrapper from '@/components/ScrollAnimationsWrapper';
import SearchHighlight from '@/components/SearchHighlight';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'ja' | 'zh' | 'en' | 'ko')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-[#232323] text-white min-h-screen w-full" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ScrollAnimationsWrapper />
          <Suspense fallback={null}>
            <SearchHighlight />
          </Suspense>
          <div className="flex flex-col min-h-screen w-full">
            <Header />
            <MobilePageSwipe>
              <main className="flex-1 w-full md:pb-28">{children}</main>
            </MobilePageSwipe>
            <Footer />
            <MobileNavWrapper />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
