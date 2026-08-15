import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Info, Zap } from 'lucide-react';
import SpotlightCard from '../ui/SpotlightCard';
import AnimatedNumber from '../ui/AnimatedNumber';

export default function HealthScoreHUD({ predictionResult }) {
  const {
    failureProbability,
    healthScore,
    statusTier,
    statusBadge,
    statusColor,
    actionRecommendation,
    confidence,
    topDriver
  } = predictionResult;

  // Dynamic status styling
  const isCritical = statusTier === 'CRITICAL';
  const isWarning = statusTier === 'WARNING';

  const accentBorder = isCritical
    ? 'border-rose-300 dark:border-rose-500/40'
    : isWarning
    ? 'border-amber-300 dark:border-amber-500/40'
    : 'border-cyan-200 dark:border-cyan-400/30';

  return (
    <SpotlightCard className={`p-6 h-full flex flex-col ${accentBorder}`}>
      {/* Top Classification Pill */}
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ backgroundColor: statusColor }}
            />
            <span
              className="relative inline-flex rounded-full h-3 w-3"
              style={{ backgroundColor: statusColor }}
            />
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            System Health State
          </span>
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wide border flex items-center gap-1.5"
          style={{
            backgroundColor: `${statusColor}14`,
            borderColor: `${statusColor}55`,
            color: statusColor
          }}
        >
          {isCritical ? <AlertOctagon className="w-3.5 h-3.5" /> : isWarning ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          <span>{statusBadge}</span>
        </div>
      </div>

      {/* Main Dual Metric Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* Metric 1: Health Index */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
          <div className="text-xs font-mono uppercase text-neutral-500 dark:text-neutral-400 mb-1 flex items-center justify-between">
            <span>Machine Health Score</span>
            <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="text-3xl font-bold tracking-tight font-mono" style={{ color: statusColor }}>
            <AnimatedNumber value={healthScore} decimals={1} suffix="/100" />
          </div>
          {/* Visual Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-white/10 mt-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${healthScore}%`,
                backgroundColor: statusColor
              }}
            />
          </div>
        </div>

        {/* Metric 2: Failure Probability */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
          <div className="text-xs font-mono uppercase text-neutral-500 dark:text-neutral-400 mb-1 flex items-center justify-between">
            <span>Failure Probability</span>
            <AlertTriangle className={`w-3.5 h-3.5 ${failureProbability > 45 ? 'text-rose-500' : 'text-neutral-300 dark:text-neutral-600'}`} />
          </div>
          <div className="text-3xl font-bold tracking-tight font-mono text-neutral-900 dark:text-white">
            <AnimatedNumber value={failureProbability} decimals={1} suffix="%" />
          </div>
          {/* Visual Probability Bar */}
          <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-white/10 mt-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${failureProbability}%`,
                backgroundColor: failureProbability > 45 ? '#ef4444' : '#f59e0b'
              }}
            />
          </div>
        </div>
      </div>

      {/* Primary Root Cause & Recommendation Alert */}
      <div
        className="p-4 rounded-xl border"
        style={{
          backgroundColor: `${statusColor}0d`,
          borderColor: `${statusColor}33`
        }}
      >
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: statusColor }} />
          <div>
            <div className="text-xs font-mono font-semibold uppercase tracking-wide" style={{ color: statusColor }}>
              Primary Diagnostic Root Cause: {topDriver.feature} ({topDriver.value} {topDriver.unit})
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
              {actionRecommendation}
            </p>
          </div>
        </div>
      </div>

      {/* Model Confidence & Telemetry Health footer */}
      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-auto pt-4 border-t border-neutral-200 dark:border-white/10">
        <span>AI MODEL: RANDOM FOREST (100 TREES)</span>
        <span className="text-cyan-700 dark:text-cyan-400">CONFIDENCE: {confidence.toFixed(1)}%</span>
      </div>
    </SpotlightCard>
  );
}
