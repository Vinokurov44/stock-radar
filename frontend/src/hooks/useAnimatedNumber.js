import { useEffect, useState } from 'react';

const DURATION_MS = 1800;

// Starts fast and slows down near the end, like a needle settling.
function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

// Animates a number from 0 to `target`. Changing `replayKey` plays it again.
export function useAnimatedNumber(target) {
  const [value, setValue] = useState(0);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduceMotion) {
      return; // nothing to animate: the target is returned directly below
    }

    let frameId;
    const start = performance.now();

    function step(now) {
      const progress = Math.min(1, (now - start) / DURATION_MS);
      setValue(target * easeOutCubic(progress));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    }

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, reduceMotion]);

  return reduceMotion ? target : value;
}
