import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ReactBits MagnetButton Primitive
 * Physics spring-magnetic attraction button for high-tactility CTA actions
 */
export default function MagnetButton({
  children,
  className = '',
  strength = 30,
  onClick,
  variant = 'primary',
  disabled = false,
  ...props
}) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (disabled || !ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * (strength / 100), y: middleY * (strength / 100) });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-sm border border-cyan-700/50 dark:border-cyan-400/30';
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-sm border border-rose-700/50 dark:border-rose-400/30';
      case 'cyber':
        return 'bg-cyan-50 text-cyan-700 border border-cyan-300 hover:bg-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-400 dark:border-cyan-400/30 dark:hover:bg-cyan-400/20';
      case 'ghost':
        return 'bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200 dark:bg-white/5 dark:text-neutral-300 dark:border-white/10 dark:hover:bg-white/10';
      default:
        return 'bg-cyan-600 text-white';
    }
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', damping: 15, stiffness: 150, mass: 0.1 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono text-sm tracking-wider uppercase transition-colors cursor-pointer select-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${getVariantStyles()} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
