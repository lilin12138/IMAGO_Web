'use client';

import { useState, useEffect } from 'react';
import ScrollAnimations from './ScrollAnimations';

export default function ScrollAnimationsWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <ScrollAnimations />;
}
