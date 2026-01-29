'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

interface SearchResult {
  title: string;
  content: string;
  url: string;
  section: string;
}

// 翻译内容与页面的映射关系
const sectionMapping: Record<string, { url: string; section: string; title: Record<string, string> }> = {
  hero: { url: '', section: 'home', title: { ja: 'ホーム', zh: '首页', en: 'Home', ko: '홈' } },
  go: { url: '#go', section: 'feature', title: { ja: 'GO', zh: 'GO', en: 'GO', ko: 'GO' } },
  ima: { url: '#ima', section: 'feature', title: { ja: 'IMA', zh: 'IMA', en: 'IMA', ko: 'IMA' } },
  woo: { url: '#woo', section: 'feature', title: { ja: 'Woo', zh: 'Woo', en: 'Woo', ko: 'Woo' } },
  advantages: { url: '#advantages', section: 'feature', title: { ja: '優位性', zh: '优势', en: 'Advantages', ko: '우위' } },
  about: { url: '/about', section: 'page', title: { ja: '会社概要', zh: '关于', en: 'About', ko: '소개' } },
  business: { url: '/business', section: 'page', title: { ja: '事業', zh: '业务', en: 'Business', ko: '사업' } },
  cases: { url: '/cases', section: 'page', title: { ja: '事例', zh: '案例', en: 'Cases', ko: '사례' } },
  contact: { url: '/contact', section: 'page', title: { ja: 'お問い合わせ', zh: '联系', en: 'Contact', ko: '연락처' } },
  footer: { url: '/contact', section: 'page', title: { ja: '会社情報', zh: '公司信息', en: 'Company Info', ko: '회사 정보' } },
};

function SearchIcon({ isActive }: { isActive?: boolean }) {
  return (
    <svg
      className={`w-4 h-4 shrink-0 transition-colors duration-300 ${
        isActive ? 'text-[#c73232]' : 'text-[#484848]'
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

// 递归提取对象中的所有字符串值
function extractStrings(obj: unknown, path = ''): { text: string; path: string }[] {
  const results: { text: string; path: string }[] = [];

  if (typeof obj === 'string') {
    results.push({ text: obj, path });
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      results.push(...extractStrings(item, `${path}[${index}]`));
    });
  } else if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      results.push(...extractStrings(value, path ? `${path}.${key}` : key));
    });
  }

  return results;
}

export default function SearchBox() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [allContent, setAllContent] = useState<{ text: string; section: string }[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = isFocused || query.length > 0;

  // 加载翻译内容
  useEffect(() => {
    const loadContent = async () => {
      try {
        const messages = await import(`../../messages/${locale}.json`);
        const extracted = extractStrings(messages.default || messages);

        const content = extracted.map(({ text, path }) => {
          // 从路径中提取 section 名称
          const sectionKey = path.split('.')[0].toLowerCase();
          return { text, section: sectionKey };
        });

        setAllContent(content);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadContent();
  }, [locale]);

  // 搜索逻辑
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const queryLower = query.toLowerCase();
    const searchResults: SearchResult[] = [];
    const seenTexts = new Set<string>(); // 避免完全相同的文本重复

    // 搜索所有内容
    allContent.forEach(({ text, section }) => {
      if (text.toLowerCase().includes(queryLower)) {
        // 避免重复显示相同的文本
        const textKey = text.substring(0, 50);
        if (seenTexts.has(textKey)) return;
        seenTexts.add(textKey);

        const mapping = sectionMapping[section];
        if (mapping) {
          // 高亮搜索词在文本中的位置
          const index = text.toLowerCase().indexOf(queryLower);
          const start = Math.max(0, index - 15);
          const end = Math.min(text.length, index + query.length + 30);
          let preview = text.substring(start, end);
          if (start > 0) preview = '...' + preview;
          if (end < text.length) preview = preview + '...';

          searchResults.push({
            title: mapping.title[locale] || section,
            content: preview,
            url: `/${locale}${mapping.url}`,
            section: mapping.section
          });
        }
      }
    });

    // 限制结果数量
    setResults(searchResults.slice(0, 8));
    setIsOpen(searchResults.length > 0);
  }, [query, allContent, locale]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setQuery('');
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (url: string) => {
    // 分离 hash 和路径
    const hashIndex = url.indexOf('#');
    let path = url;
    let hash = '';
    if (hashIndex !== -1) {
      path = url.substring(0, hashIndex);
      hash = url.substring(hashIndex);
    }

    // 添加搜索词到 URL，用于高亮
    const urlWithQuery = `${path}?highlight=${encodeURIComponent(query)}${hash}`;
    router.push(urlWithQuery);
    setQuery('');
    setIsOpen(false);
  };

  const noResultsText = locale === 'ja' ? '結果が見つかりません' : locale === 'zh' ? '未找到結果' : locale === 'ko' ? '결과를 찾을 수 없습니다' : 'No results found';
  const placeholderText = locale === 'ja' ? '検索' : locale === 'zh' ? '搜尋' : locale === 'ko' ? '검색' : 'Search';

  return (
    <div ref={searchRef} className="relative">
      <div
        className={`
          flex items-center gap-3 px-5 py-2.5 cursor-text
          bg-white/5 backdrop-blur-sm
          border rounded-full
          transition-all duration-300 ease-out
          ${isActive
            ? 'border-[#c73232]/40 shadow-[0_0_20px_rgba(199,50,50,0.15)] min-w-[200px]'
            : 'border-white/[0.06] hover:border-white/10 min-w-[140px]'
          }
        `}
        onClick={() => inputRef.current?.focus()}
      >
        <SearchIcon isActive={isActive} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholderText}
          className="bg-transparent text-white placeholder-[#484848] focus:outline-none flex-1 text-sm w-0"
        />
        {isActive && (
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-[#484848] bg-white/5 rounded border border-white/10">
            ESC
          </kbd>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#484848] rounded-lg shadow-xl overflow-hidden z-50 min-w-[280px]">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelect(result.url)}
              className="w-full px-4 py-3 text-left hover:bg-[#2a2a2a] transition-colors border-b border-[#484848] last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 bg-[#c73232]/20 text-[#c73232] rounded">
                  {result.section}
                </span>
                <span className="text-white font-medium">{result.title}</span>
              </div>
              <p className="text-[#484848] text-sm mt-1 line-clamp-1">{result.content}</p>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#484848] rounded-lg shadow-xl p-4 text-center text-[#484848] z-50">
          {noResultsText}
        </div>
      )}
    </div>
  );
}
