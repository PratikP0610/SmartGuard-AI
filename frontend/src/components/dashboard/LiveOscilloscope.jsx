import React, { useRef, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

export default function LiveOscilloscope({ history = [], isStreaming = false }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const isDark = theme === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(24, 24, 27, 0.05)';
    const tempColor = isDark ? '#22d3ee' : '#0891b2';
    const vibColor = '#f59e0b';

    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (history.length < 2) return;

    // Draw Temperature Waveform
    ctx.beginPath();
    ctx.strokeStyle = tempColor;
    ctx.lineWidth = 2;
    history.forEach((point, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - (point.temperature / 150) * (height - 20) - 10;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Vibration Waveform
    ctx.beginPath();
    ctx.strokeStyle = vibColor;
    ctx.lineWidth = 2;
    history.forEach((point, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - (point.vibration / 2.0) * (height - 20) - 10;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [history, theme]);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/70 border border-neutral-200 dark:border-white/10 h-full">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
            Real-Time Telemetry Oscilloscope
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <span className="flex items-center gap-1.5 text-cyan-700 dark:text-cyan-400">
            <span className="w-2 h-0.5 bg-cyan-600 dark:bg-cyan-400" /> Temp (°C)
          </span>
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <span className="w-2 h-0.5 bg-amber-500" /> Vibration (mm/s)
          </span>
          <span className={`hidden sm:inline px-2 py-0.5 rounded border ${
            isStreaming
              ? 'bg-cyan-50 border-cyan-300 text-cyan-700 dark:bg-cyan-400/10 dark:border-cyan-400/30 dark:text-cyan-300'
              : 'bg-neutral-100 border-neutral-200 text-neutral-500 dark:bg-white/5 dark:border-white/10 dark:text-neutral-400'
          }`}>
            {isStreaming ? 'LIVE OSCILLATION' : 'STATIC BUFFER'}
          </span>
        </div>
      </div>

      <div className="relative w-full h-28 rounded-xl border border-neutral-200 dark:border-white/10 overflow-hidden" style={{ backgroundColor: 'var(--canvas)' }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={112}
          className="w-full h-full block"
        />
        {/* Glow corner */}
        <div className="absolute top-2 right-2 text-[9px] font-mono text-neutral-500 dark:text-neutral-400">
          BUFFER: {history.length} SAMPLES
        </div>
      </div>
    </div>
  );
}
