import { useRef } from 'react';

export function useRenderCount(componentName?: string) {
  const renderCount = useRef(0);

  renderCount.current += 1;

  console.log(`${componentName || 'Component'} rendered ${renderCount.current} times.`);
}
