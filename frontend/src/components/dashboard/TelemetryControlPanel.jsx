import React from 'react';
import { Thermometer, Activity, Gauge, RotateCw, Clock, Sparkles, RefreshCw } from 'lucide-react';
import { PRESET_SCENARIOS } from '../../lib/mlEngine';

export default function TelemetryControlPanel({
  sensorValues,
  onChangeSensor,
  onApplyScenario,
  onResetNominal,
  activeHotspot,
  onSelectHotspot
}) {
  const { temperature, vibration, pressure, rpm, operating_hours } = sensorValues;

  const sensorConfigs = [
    {
      key: 'temperature',
      label: 'Core Temperature',
      icon: Thermometer,
      value: temperature,
      min: 0,
      max: 150,
      step: 1,
      unit: '°C',
      warningThreshold: 90,
      nominalRange: '60 - 80 °C',
      color: 'text-rose-500 dark:text-rose-400',
      activeColor: '#ef4444'
    },
    {
      key: 'vibration',
      label: 'Vibration Level',
      icon: Activity,
      value: vibration,
      min: 0.0,
      max: 2.0,
      step: 0.05,
      unit: 'mm/s',
      warningThreshold: 0.8,
      nominalRange: '0.3 - 0.6 mm/s',
      color: 'text-amber-600 dark:text-amber-400',
      activeColor: '#f59e0b'
    },
    {
      key: 'pressure',
      label: 'Hydraulic Pressure',
      icon: Gauge,
      value: pressure,
      min: 0,
      max: 250,
      step: 1,
      unit: 'kPa',
      warningThreshold: 200,
      nominalRange: '100 - 140 kPa',
      color: 'text-blue-600 dark:text-blue-400',
      activeColor: '#3b82f6'
    },
    {
      key: 'rpm',
      label: 'Rotor RPM',
      icon: RotateCw,
      value: rpm,
      min: 0,
      max: 6000,
      step: 50,
      unit: 'RPM',
      warningThreshold: 5000,
      nominalRange: '2800 - 3400 RPM',
      color: 'text-emerald-600 dark:text-emerald-400',
      activeColor: '#10b981'
    },
    {
      key: 'operating_hours',
      label: 'Operating Hours',
      icon: Clock,
      value: operating_hours,
      min: 0,
      max: 6000,
      step: 50,
      unit: 'hrs',
      warningThreshold: 4000,
      nominalRange: '0 - 3500 hrs',
      color: 'text-violet-600 dark:text-violet-400',
      activeColor: '#8b5cf6'
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/70 border border-neutral-200 dark:border-white/10 h-full flex flex-col">
      {/* Header & Reset */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-sm font-mono uppercase font-semibold tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-2">
            <span>Machine Sensor Inputs</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Real-time parameter tuning for ML inference</p>
        </div>
        <button
          onClick={onResetNominal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs font-mono text-neutral-600 dark:text-neutral-300 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors"
          title="Reset to factory baseline nominal parameters"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Nominal</span>
        </button>
      </div>

      {/* Preset Scenario Quick Selectors (horizontal scroll strip) */}
      <div className="mb-4">
        <div className="text-[11px] font-mono uppercase text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Quick Benchmark Scenarios</span>
        </div>
        <div className="flex overflow-x-auto snap-x gap-2 pb-1" style={{ scrollbarWidth: 'thin' }}>
          {PRESET_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => onApplyScenario(sc)}
              title={sc.description}
              className="flex-shrink-0 snap-start px-3 py-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:border-cyan-300 dark:hover:border-cyan-400/40 hover:bg-cyan-50 dark:hover:bg-cyan-400/10 text-left transition-all min-h-[44px]"
            >
              <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                {sc.name}
              </div>
              <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap mt-0.5">
                {sc.values.temperature}°C • {sc.values.vibration}g
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sensor Input Sliders */}
      <div className="space-y-3 flex-1">
        {sensorConfigs.map((sensor) => {
          const Icon = sensor.icon;
          const isWarning = sensor.value >= sensor.warningThreshold;
          const isHotspotActive = activeHotspot === sensor.key;

          return (
            <div
              key={sensor.key}
              className={`p-3 rounded-xl border transition-colors ${
                isWarning
                  ? 'bg-rose-50 border-rose-300 dark:bg-rose-500/10 dark:border-rose-500/40'
                  : isHotspotActive
                  ? 'bg-cyan-50 border-cyan-300 dark:bg-cyan-400/10 dark:border-cyan-400/40'
                  : 'bg-neutral-50 border-neutral-200 dark:bg-white/5 dark:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    onClick={() => onSelectHotspot(sensor.key)}
                    className="cursor-pointer p-1.5 rounded-lg bg-white dark:bg-white/10 border border-neutral-200 dark:border-white/10 hover:border-cyan-400 transition-colors flex-shrink-0"
                    title="Focus sensor on 3D Digital Twin"
                  >
                    <Icon className={`w-4 h-4 ${sensor.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                      <span className="truncate">{sensor.label}</span>
                      {isWarning && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex-shrink-0">
                          OVER LIMIT
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                      Nominal: {sensor.nominalRange}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-base font-semibold font-mono ${sensor.color}`}>
                    {typeof sensor.value === 'number' ? (sensor.step < 1 ? sensor.value.toFixed(2) : sensor.value) : sensor.value}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono ml-1">{sensor.unit}</span>
                </div>
              </div>

              {/* Slider Track */}
              <input
                type="range"
                min={sensor.min}
                max={sensor.max}
                step={sensor.step}
                value={sensor.value}
                onChange={(e) => onChangeSensor(sensor.key, parseFloat(e.target.value))}
                className="w-full h-8 cursor-pointer"
                aria-label={sensor.label}
              />

              <div className="flex justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400 -mt-1.5">
                <span>{sensor.min} {sensor.unit}</span>
                <span>Limit: {sensor.warningThreshold} {sensor.unit}</span>
                <span>{sensor.max} {sensor.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
