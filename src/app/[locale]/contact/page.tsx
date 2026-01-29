'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function ContactPage() {
  const t = useTranslations('contact');
  const footerT = useTranslations('footer');

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-start pt-4 md:pt-60 pb-10 md:pb-20 bg-[#232323]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="section-title text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="text-[var(--imago-red)] text-4xl md:text-5xl font-bold">Contact</span>
            <span className="text-white text-2xl md:text-3xl lg:text-4xl font-medium tracking-wide">
              {t('subtitle')}
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-8 md:h-24"></div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          {/* Left - Contact Info */}
          <div className="flex-1 space-y-8">
            {/* Company Info */}
            <div className="bg-[#1a1a1a] rounded-xl p-8">
              <Image
                src="/images/logo-full.png"
                alt="IMAGO"
                width={200}
                height={60}
                className="h-12 w-auto mb-6"
              />

              {/* Spacer */}
              <div className="h-4"></div>

              <div className="text-[#F7F7F7]">
                <div>
                  <p className="text-white font-medium mb-2">{t('company')}</p>
                  <p className="text-sm">{footerT('company')}</p>
                </div>

                {/* Spacer */}
                <div className="h-6"></div>

                <div>
                  <p className="text-white font-medium mb-2">{t('address')}</p>
                  <p className="text-sm">{footerT('postal')} {footerT('location')}</p>
                </div>

                {/* Spacer */}
                <div className="h-6"></div>

                <div>
                  <p className="text-white font-medium mb-2">{t('phone')}</p>
                  <p className="text-sm">{footerT('phone')}</p>
                </div>

                {/* Spacer */}
                <div className="h-6"></div>

                <div>
                  <p className="text-white font-medium mb-2">{t('email')}</p>
                  <p className="text-sm">{footerT('email')}</p>
                </div>
              </div>
            </div>

            {/* Spacer */}
            <div className="h-4"></div>

            {/* Social Links */}
            <div className="bg-[#1a1a1a] rounded-xl p-8">
              <h3 className="text-white font-bold mb-4">{t('followUs')}</h3>

              {/* Spacer */}
              <div className="h-2"></div>

              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-[#06C755] rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity">
                  <span className="text-white font-bold text-sm">LINE</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="flex-1">
            <div className="bg-[#1a1a1a] rounded-xl p-8">
              <h3 className="text-white text-xl font-bold mb-6">{t('formTitle')}</h3>

              {/* Spacer */}
              <div className="h-4"></div>

              {/*
                ============================================
                FormSubmit 配置说明：
                ============================================
                1. 将下方 action 中的 YOUR_EMAIL@example.com 替换为接收消息的邮箱
                2. 首次提交后会收到验证邮件，点击确认即可激活
                3. 之后用户提交的消息会自动发送到该邮箱

                可选配置（隐藏字段）：
                - _subject: 邮件主题
                - _next: 提交成功后跳转的页面 URL
                - _captcha: 设为 false 可关闭验证码（不推荐）

                更多配置请参考：https://formsubmit.co/
                ============================================
              */}
              <form
                action="https://formsubmit.co/admin@tokyohattatsu.jp"
                method="POST"
              >
                {/* FormSubmit 隐藏配置字段 */}
                <input type="hidden" name="_subject" value="IMAGO 网站新消息" />
                <input type="hidden" name="_captcha" value="true" />
                {/* 提交成功后跳转回首页，可修改为其他页面 */}
                <input type="hidden" name="_next" value="https://www.imago.tokyo" />

                <div>
                  <label className="block text-[#808080] text-sm" style={{ marginBottom: '16px' }}>{t('name')}</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-[#1a1a1a] border border-[#484848] rounded-lg px-4 py-3 text-white focus:border-[var(--imago-red)] focus:outline-none transition-colors"
                    placeholder={t('namePlaceholder')}
                  />
                </div>

                <div style={{ height: '24px' }}></div>

                <div>
                  <label className="block text-[#808080] text-sm" style={{ marginBottom: '16px' }}>{t('emailLabel')}</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-[#1a1a1a] border border-[#484848] rounded-lg px-4 py-3 text-white focus:border-[var(--imago-red)] focus:outline-none transition-colors"
                    placeholder={t('emailPlaceholder')}
                  />
                </div>

                <div style={{ height: '24px' }}></div>

                <div>
                  <label className="block text-[#808080] text-sm" style={{ marginBottom: '16px' }}>{t('message')}</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    className="w-full bg-[#1a1a1a] border border-[#484848] rounded-lg px-4 py-3 text-white focus:border-[var(--imago-red)] focus:outline-none transition-colors resize-none"
                    placeholder={t('messagePlaceholder')}
                  />
                </div>

                <div style={{ height: '16px' }}></div>

                <button
                  type="submit"
                  className="w-full bg-[var(--imago-red)] text-white font-bold py-3 rounded-lg hover:bg-[#a02828] transition-colors"
                >
                  {t('submit')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
