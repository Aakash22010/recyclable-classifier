// src/hooks/useSmoothAnimation.js
import { useRef, useCallback } from 'react';

export const useSmoothAnimation = () => {
  const animationRef = useRef(null);

  const smoothScrollTo = useCallback((element, duration = 600) => {
    if (!element) return;

    const start = window.pageYOffset;
    const target = element.getBoundingClientRect().top + start;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const ease = (t) => t * (2 - t);
      
      window.scrollTo(0, start + (target - start) * ease(progress));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateScroll);
      }
    };

    animationRef.current = requestAnimationFrame(animateScroll);
  }, []);

  const cancelAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  return { smoothScrollTo, cancelAnimation };
};