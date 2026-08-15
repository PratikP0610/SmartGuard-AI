import React from 'react';
import { BarChart3 } from 'lucide-react';
import { FEATURE_IMPORTANCES } from '../../lib/mlEngine';

export default function ExplainabilityPanel({ predictionResult }) {
  const { contributions } = predictionResult;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/70 border border-neutral-200 dark:border-white/10 h-full flex flex-col">
      {/* Title */}
      <div className="flex items-center justify-between gap-2 mb-5">
        <div>
          <h2 className="text-sm font-mono uppercase font-semibold tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Feature Importance (SHAP)</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Random Forest Gini importance & real-time feature risk attribution
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-cyan-600 dark:bg-cyan-400"></span>
            <span>Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-orange-500"></span>
            <span>Live Impact</span>
          </div>
        </div>
      </div>

      {/* 1. Global Model Feature Importance Weights (Vertical Bar Chart) */}
      <div className="mb-6">
        <div className="h-40 flex items-end gap-2 border-b border-l border-neutral-200 dark:border-white/10 pb-2 pl-2 relative mt-8">
          {/* Y-Axis Labels */}
          <div className="absolute -left-6 top-0 bottom-2 flex flex-col justify-between text-[9px] font-mono text-neutral-500 dark:text-neutral-400">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>

          {/* Grid lines */}
          <div className="absolute left-2 right-0 top-0 bottom-2 flex flex-col justify-between pointer-events-none opacity-30">
            <div className="border-t border-neutral-300 dark:border-white/20 w-full h-0" />
            <div className="border-t border-neutral-300 dark:border-white/20 w-full h-0" />
            <div className="border-t border-neutral-300 dark:border-white/20 w-full h-0" />
            <div className="border-t border-neutral-300 dark:border-white/20 w-full h-0" />
            <div className="border-t border-neutral-300 dark:border-white/20 w-full h-0" />
          </div>

          <div className="w-full flex justify-around h-full items-end z-10 px-2">
            {FEATURE_IMPORTANCES.map((item) => {
              const baselinePercentage = item.importance * 100 * 1.5; // Scale up slightly for visibility

              // Find live impact contribution if exists, else small default
              const contrib = contributions.find(c => c.feature.toLowerCase().includes(item.key.replace('_', ' ').split(' ')[0]));
              let liveImpactPercentage = 10;
              if (contrib) {
                liveImpactPercentage = contrib.impact === 'CRITICAL' ? 85 : contrib.impact === 'ELEVATED' ? 45 : 15;
              }

              return (
                <div key={item.key} className="flex flex-col items-center gap-2 h-full justify-end group cursor-help">
                  <div className="flex items-end gap-1 h-full w-8">
                    {/* Baseline Bar */}
                    <div
                      className="w-3 rounded-t-sm bg-cyan-600 dark:bg-cyan-400 transition-all duration-500"
                      style={{ height: `${Math.min(baselinePercentage, 100)}%` }}
                    />
                    {/* Live Impact Bar */}
                    <div
                      className="w-3 rounded-t-sm bg-orange-500 transition-all duration-500"
                      style={{ height: `${Math.min(liveImpactPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-[9px] font-mono text-neutral-500 dark:text-neutral-400 text-center w-16 truncate" title={item.name}>
                    {item.name.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Real-Time Telemetry Impact Breakdown */}
      <div className="flex-1">
        <div className="text-xs font-mono uppercase text-neutral-500 dark:text-neutral-400 mb-3">
          Current Operating Telemetry Risk Attribution
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {contributions.map((c) => {
            const isCritical = c.impact === 'CRITICAL';
            const isElevated = c.impact === 'ELEVATED';

            return (
              <div
                key={c.feature}
                className={`p-3 rounded-xl border transition-colors ${
                  isCritical
                    ? 'bg-rose-50 border-rose-300 text-rose-800 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300'
                    : isElevated
                    ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-300'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-700 dark:bg-white/5 dark:border-white/10 dark:text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold">{c.feature}</span>
                  <span className={`font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                    isCritical
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400'
                      : isElevated
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                      : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {c.impact}
                  </span>
                </div>
                <div className="text-sm font-semibold font-mono text-neutral-900 dark:text-white mb-1">
                  {typeof c.value === 'number' ? (c.value % 1 !== 0 ? c.value.toFixed(2) : c.value) : c.value} {c.unit}
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                  {c.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
