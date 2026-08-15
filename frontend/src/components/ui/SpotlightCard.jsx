import React, { useRef, useState } from 'react';

/**
 * ReactBits SpotlightCard Primitive
 * Card with mouse-tracking radial illumination
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(8, 145, 178, 0.10)',
  borderColor,
  glowOnHover = true,
  ...props
}) {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      className={`relative rounded-2xl overflow-hidden glass-panel transition-all duration-300 ${
        glowOnHover ? 'hover:border-cyan-300 dark:hover:border-cyan-400/40' : ''
      } ${className}`}
      style={borderColor ? { borderColor } : undefined}
      {...props}
    >
      {/* Specular Spotlight Follower */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
}
