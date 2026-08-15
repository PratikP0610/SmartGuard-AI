import React from 'react';
import { Cpu, Radio, Layers, Sparkles, Eye, EyeOff, Download, Sun, Moon } from 'lucide-react';
import MagnetButton from '../ui/MagnetButton';
import { useTheme } from '../../theme/ThemeContext';

function ToggleButton({ active, activeClass, onClick, icon: Icon, label, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
        active
          ? `border-transparent text-white ${activeClass}`
          : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-neutral-100'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default function Header({
  isStreaming,
  onToggleStreaming,
  isExploded,
  onToggleExploded,
  thermalVision,
  onToggleThermal,
  wireframeMode,
  onToggleWireframe,
  onOpenReport
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="w-full bg-white dark:bg-neutral-900/70 border border-neutral-200 dark:border-white/10 rounded-2xl px-4 sm:px-6 py-3.5 mb-6 flex flex-wrap items-center justify-between gap-3">
      {/* Brand & System Identity */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-400/10 border border-cyan-200 dark:border-cyan-400/30">
          <Cpu className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              SmartGuard AI
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold tracking-wider bg-cyan-50 dark:bg-cyan-400/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-400/20">
              v2.4 TWIN
            </span>
          </div>
          <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex items-center gap-2 mt-0.5">
            <span className="hidden sm:inline">PREDICTIVE MAINTENANCE 3D ENGINE</span>
            <span className="hidden sm:inline text-neutral-300 dark:text-neutral-600">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              100% ACCURACY
            </span>
          </p>
        </div>
      </div>

      {/* 3D & Telemetry Quick Toggles */}
      <div className="flex flex-wrap items-center gap-1 bg-neutral-100 dark:bg-white/5 rounded-xl p-1">
        <ToggleButton
          active={isStreaming}
          activeClass="bg-cyan-600 dark:bg-cyan-500"
          onClick={onToggleStreaming}
          icon={Radio}
          label={isStreaming ? 'Streaming' : 'Stream'}
          title="Toggle live telemetry stream generator"
        />
        <ToggleButton
          active={isExploded}
          activeClass="bg-blue-600 dark:bg-blue-500"
          onClick={onToggleExploded}
          icon={Layers}
          label={isExploded ? 'Exploded' : 'Assembled'}
          title="Toggle exploded CAD component view"
        />
        <ToggleButton
          active={thermalVision}
          activeClass="bg-amber-500"
          onClick={onToggleThermal}
          icon={Sparkles}
          label={thermalVision ? 'Thermal' : 'Metal'}
          title="Toggle thermal FLIR gradient heatmap"
        />
        <ToggleButton
          active={wireframeMode}
          activeClass="bg-violet-600 dark:bg-violet-500"
          onClick={onToggleWireframe}
          icon={wireframeMode ? Eye : EyeOff}
          label={wireframeMode ? 'Wireframe' : 'Solid'}
          title="Toggle wireframe HUD mesh"
        />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-neutral-400 hover:bg-white dark:hover:bg-white/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors ml-1"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Diagnostics Report Export CTA */}
      <MagnetButton
        onClick={onOpenReport}
        variant="primary"
        className="py-2 px-4 text-xs"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">DIAGNOSTIC REPORT</span>
      </MagnetButton>
    </header>
  );
}
