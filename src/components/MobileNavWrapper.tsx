'use client';

import { useState, useEffect } from 'react';
import MobileNav from './MobileNav';

export default function MobileNavWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 在客户端挂载前不渲染任何内容，避免 hydration 错误
  if (!mounted) {
    return null;
  }

  return <MobileNav />;
}
