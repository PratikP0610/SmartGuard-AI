import React, { useEffect, useRef, useState } from 'react';

/**
 * Animated Number Counter component
 * Smoothly interpolates numbers with customizable precision and unit
 */
export default function AnimatedNumber({
  value,
  duration = 400,
  decimals = 1,
  suffix = '',
  prefix = '',
  className = ''
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const startValueRef = useRef(value);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = startValueRef.current;
    const endValue = typeof value === 'number' ? value : parseFloat(value) || 0;

    if (Math.abs(startValue - endValue) < 0.001) {
      startValueRef.current = endValue;
      setDisplayValue(endValue);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const current = startValue + (endValue - startValue) * easedProgress;

      setDisplayValue(current);
      startValueRef.current = current;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}
