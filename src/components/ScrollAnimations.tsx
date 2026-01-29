'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

export default function ScrollAnimations() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // 仅在客户端注册插件
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // 移动端不初始化任何动画
    const isMobileDevice = window.innerWidth < 768;
    if (isMobileDevice) {
      return;
    }

    // 检查是否在首页
    const isHomePage = pathname === '/' || pathname === '/zh' || pathname === '/en' || pathname === '/ja' || pathname === '/ko';

    let wheelHandler: ((e: WheelEvent) => void) | null = null;
    let rafId1: number | null = null;
    let rafId2: number | null = null;
    let isCleaned = false;

    // 延迟初始化，确保 DOM 完全渲染
    const initSnapScroll = () => {
      if (isCleaned) return;

      // 检测是否为移动设备（宽度小于 768px）
      const isMobile = window.innerWidth < 768;

      // ===== 全屏翻页效果（仅桌面端）=====
      const snapSections = gsap.utils.toArray('.snap-section') as HTMLElement[];

      if (snapSections.length > 0 && isHomePage && !isMobile) {
        let isAnimating = false;
        let animationDirection = 0; // 当前动画方向：1=下, -1=上, 0=无
        let targetIndex = -1; // 当前目标索引

        // 获取当前所在的 section 索引
        const getCurrentSection = () => {
          const scrollY = window.scrollY;
          for (let i = 0; i < snapSections.length; i++) {
            const section = snapSections[i];
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            // 在 section 范围内（有一定容差）
            if (scrollY >= top - 50 && scrollY < bottom - 50) {
              return i;
            }
          }
          return 0;
        };

        // 滚动到指定位置
        const scrollToTarget = (target: HTMLElement, direction: number) => {
          isAnimating = true;
          animationDirection = direction;

          gsap.killTweensOf(window);
          gsap.to(window, {
            scrollTo: {
              y: target,
              autoKill: false,
            },
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => {
              isAnimating = false;
              animationDirection = 0;
              targetIndex = -1;
            },
          });
        };

        // 监听滚轮事件
        wheelHandler = (e: WheelEvent) => {
          const lastSnapIndex = snapSections.length - 1;
          const direction = e.deltaY > 0 ? 1 : -1;

          e.preventDefault();

          // 动画进行中
          if (isAnimating) {
            // 如果用户反向滚动，取消当前动画，立即响应
            if (direction !== animationDirection) {
              gsap.killTweensOf(window);
              isAnimating = false;
              animationDirection = 0;
              // 继续执行下面的逻辑
            } else {
              // 同方向滚动，忽略
              return;
            }
          }

          const currentIndex = getCurrentSection();

          if (direction > 0) {
            // 向下滚动
            if (currentIndex < lastSnapIndex) {
              targetIndex = currentIndex + 1;
              scrollToTarget(snapSections[targetIndex], 1);
            }
            // 已经是最后一个 section，不允许继续滚动
          } else {
            // 向上滚动
            if (currentIndex > 0) {
              targetIndex = currentIndex - 1;
              scrollToTarget(snapSections[targetIndex], -1);
            }
          }
        };

        window.addEventListener('wheel', wheelHandler, { passive: false });
      }
    };

    // 使用 requestAnimationFrame 确保 DOM 已渲染
    rafId1 = requestAnimationFrame(() => {
      if (isCleaned) return;
      // 再延迟一帧确保完全渲染
      rafId2 = requestAnimationFrame(() => {
        if (isCleaned) return;
        initSnapScroll();
        // 刷新 ScrollTrigger 以获取正确的位置
        ScrollTrigger.refresh();
      });
    });

    // 等待 DOM 完全加载（仅桌面端）
    const ctx = gsap.context(() => {

      // ===== Hero Section =====
      // 标题视差效果 - 滚动时向上移动得更快
      gsap.to('.hero-title', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Hero 内容滚动淡出
      gsap.to('.hero-content', {
        opacity: 0,
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: '60% top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // ===== Section 水平滑入效果 =====
      // 从左侧滑入
      gsap.utils.toArray('.section-slide-left').forEach((el) => {
        const element = el as HTMLElement;
        gsap.fromTo(element,
          {
            x: '-100vw',
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });

      // 从右侧滑入
      gsap.utils.toArray('.section-slide-right').forEach((el) => {
        const element = el as HTMLElement;
        gsap.fromTo(element,
          {
            x: '100vw',
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });

      // ===== 内容块水平滑入（更细腻的效果）=====
      gsap.utils.toArray('.content-slide-left').forEach((el) => {
        const element = el as HTMLElement;
        gsap.fromTo(element,
          {
            x: -200,
            opacity: 0,
            rotateY: 15,
          },
          {
            x: 0,
            opacity: 1,
            rotateY: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });

      gsap.utils.toArray('.content-slide-right').forEach((el) => {
        const element = el as HTMLElement;
        gsap.fromTo(element,
          {
            x: 200,
            opacity: 0,
            rotateY: -15,
          },
          {
            x: 0,
            opacity: 1,
            rotateY: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });

      // ===== 通用 Section 动画 =====
      // 标题动画 - 从下方滑入并淡入
      gsap.utils.toArray('.section-title').forEach((el) => {
        const element = el as HTMLElement;
        gsap.fromTo(element,
          {
            opacity: 0,
            y: 60,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              end: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // 文字块动画 - 逐个淡入
      gsap.utils.toArray('.text-reveal').forEach((el) => {
        const element = el as HTMLElement;
        gsap.fromTo(element,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // 图片视差效果
      gsap.utils.toArray('.parallax-image').forEach((el) => {
        const element = el as HTMLElement;
        gsap.fromTo(element,
          {
            y: 100,
            scale: 1.1,
          },
          {
            y: -50,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });

      // 图片网格动画 - 交错出现
      gsap.utils.toArray('.image-grid').forEach((grid) => {
        const gridElement = grid as HTMLElement;
        const images = gridElement.querySelectorAll('.grid-image');

        gsap.fromTo(images,
          {
            opacity: 0,
            y: 80,
            scale: 0.8,
            rotateY: 15,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateY: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridElement,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // 左侧内容滑入
      gsap.utils.toArray('.slide-in-left').forEach((el) => {
        const element = el as HTMLElement;
        gsap.fromTo(element,
          {
            opacity: 0,
            x: -100,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // 右侧内容滑入
      gsap.utils.toArray('.slide-in-right').forEach((el) => {
        const element = el as HTMLElement;
        gsap.fromTo(element,
          {
            opacity: 0,
            x: 100,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // 缩放出现效果
      gsap.utils.toArray('.scale-in').forEach((el) => {
        const element = el as HTMLElement;
        gsap.fromTo(element,
          {
            opacity: 0,
            scale: 0.8,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // 卡片交错动画
      gsap.utils.toArray('.stagger-cards').forEach((container) => {
        const containerElement = container as HTMLElement;
        const cards = containerElement.querySelectorAll('.card-item');

        gsap.fromTo(cards,
          {
            opacity: 0,
            y: 60,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerElement,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // 水平线动画
      gsap.utils.toArray('.line-reveal').forEach((el) => {
        const element = el as HTMLElement;
        gsap.fromTo(element,
          {
            scaleX: 0,
            transformOrigin: 'left center',
          },
          {
            scaleX: 1,
            duration: 1,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // 数字/统计动画
      gsap.utils.toArray('.count-up').forEach((el) => {
        const element = el as HTMLElement;
        const target = parseInt(element.getAttribute('data-count') || '0');

        gsap.fromTo(element,
          {
            textContent: 0,
          },
          {
            textContent: target,
            duration: 2,
            ease: 'power1.out',
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

    });

    // 清理
    return () => {
      isCleaned = true;
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (wheelHandler) {
        window.removeEventListener('wheel', wheelHandler);
      }
      if (rafId1) {
        cancelAnimationFrame(rafId1);
      }
      if (rafId2) {
        cancelAnimationFrame(rafId2);
      }
    };
  }, [pathname, isClient]);

  return null;
}
