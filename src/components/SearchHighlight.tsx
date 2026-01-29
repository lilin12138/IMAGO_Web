'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export default function SearchHighlight() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const highlight = searchParams.get('highlight');

  useEffect(() => {
    if (!highlight) return;

    // 先处理 hash 跳转
    const hash = window.location.hash;
    if (hash) {
      const targetId = hash.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // 延迟执行，确保页面已渲染
    const timer = setTimeout(() => {
      // 移除之前的高亮
      document.querySelectorAll('.search-highlight').forEach(el => {
        const parent = el.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(el.textContent || ''), el);
          parent.normalize();
        }
      });

      // 查找并高亮关键字
      const searchText = highlight.toLowerCase();
      let firstMatch: Element | null = null;

      // 递归遍历文本节点并高亮关键字
      const highlightTextNodes = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || '';
          const lowerText = text.toLowerCase();
          const index = lowerText.indexOf(searchText);

          if (index !== -1) {
            const parent = node.parentNode;
            if (!parent || (parent as Element).closest('header') || (parent as Element).closest('script')) {
              return;
            }

            // 创建高亮 span
            const before = text.substring(0, index);
            const match = text.substring(index, index + highlight.length);
            const after = text.substring(index + highlight.length);

            const span = document.createElement('span');
            span.className = 'search-highlight';
            span.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            span.style.borderRadius = '2px';
            span.style.padding = '0 2px';
            span.textContent = match;

            const fragment = document.createDocumentFragment();
            if (before) fragment.appendChild(document.createTextNode(before));
            fragment.appendChild(span);
            if (after) fragment.appendChild(document.createTextNode(after));

            parent.replaceChild(fragment, node);

            if (!firstMatch) {
              firstMatch = span;
            }
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // 跳过 header、script、style
          const el = node as Element;
          if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.closest('header')) {
            return;
          }
          // 复制子节点数组，因为遍历时可能会修改
          Array.from(node.childNodes).forEach(child => highlightTextNodes(child));
        }
      };

      highlightTextNodes(document.body);

      // 滚动到第一个匹配
      if (firstMatch) {
        (firstMatch as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });

        // 闪烁效果 - 背景色切换
        let blink = 0;
        const blinkInterval = setInterval(() => {
          if (blink >= 4) {
            clearInterval(blinkInterval);
            return;
          }
          document.querySelectorAll('.search-highlight').forEach(el => {
            (el as HTMLElement).style.backgroundColor = blink % 2 === 0
              ? 'rgba(255, 255, 255, 0.5)'
              : 'rgba(255, 255, 255, 0.2)';
          });
          blink++;
        }, 200);

        // 5秒后清除高亮并移除 URL 参数
        setTimeout(() => {
          document.querySelectorAll('.search-highlight').forEach(el => {
            // 将 span 内容还原为文本节点
            const parent = el.parentNode;
            if (parent) {
              parent.replaceChild(document.createTextNode(el.textContent || ''), el);
              parent.normalize();
            }
          });

          // 移除 URL 中的 highlight 参数
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.delete('highlight');
          const newUrl = newParams.toString()
            ? `${pathname}?${newParams.toString()}`
            : pathname;
          router.replace(newUrl, { scroll: false });
        }, 5000);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [highlight, pathname, router, searchParams]);

  return null;
}
