import { RefObject, useLayoutEffect, useState } from "react";

export const useRect = (ref: RefObject<HTMLElement>) => {
  const [rect, setRect] = useState<DOMRect>();
  useLayoutEffect(() => {
    const observer = new ResizeObserver(entries => {
      setRect(entries[0].contentRect);
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [ref]);
  return rect;
};
