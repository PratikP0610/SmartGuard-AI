import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/dashboard/Header';
import IndustrialTurbineScene from './components/3d/IndustrialTurbineScene';
import HealthScoreHUD from './components/dashboard/HealthScoreHUD';
import TelemetryControlPanel from './components/dashboard/TelemetryControlPanel';
import ExplainabilityPanel from './components/dashboard/ExplainabilityPanel';
import LiveOscilloscope from './components/dashboard/LiveOscilloscope';
import ReportModal from './components/dashboard/ReportModal';
import AnimatedList from './components/ui/AnimatedList';
import { predictMachineHealth } from './lib/mlEngine';
import { Code2, ExternalLink, Terminal } from 'lucide-react';

export default function App() {
  // Sensor State
  const [sensorValues, setSensorValues] = useState({
    temperature: 70,
    vibration: 0.50,
    pressure: 120,
    rpm: 3000,
    operating_hours: 2500,
  });

  // 3D Scene Controls
  const [isExploded, setIsExploded] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [thermalVision, setThermalVision] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Oscilloscope History Buffer
  const [telemetryHistory, setTelemetryHistory] = useState([
    { temperature: 70, vibration: 0.50, timestamp: Date.now() }
  ]);

  // Check user system reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Compute ML Prediction
  const predictionResult = predictMachineHealth(sensorValues);

  // Update sensor handler
  const handleSensorChange = useCallback((key, value) => {
    setSensorValues((prev) => {
      const next = { ...prev, [key]: value };
      return next;
    });
  }, []);

  // Preset Scenario Applier
  const handleApplyScenario = useCallback((scenario) => {
    setSensorValues(scenario.values);
  }, []);

  // Reset to nominal baseline
  const handleResetNominal = useCallback(() => {
    setSensorValues({
      temperature: 68,
      vibration: 0.35,
      pressure: 120,
      rpm: 3000,
      operating_hours: 1200,
    });
    setActiveHotspot(null);
  }, []);

  // Telemetry History recording & Streaming Autopilot Loop
  useEffect(() => {
    let intervalId;
    if (isStreaming) {
      intervalId = setInterval(() => {
        setSensorValues((prev) => {
          // Realistic Gaussian drift
          const nextTemp = Math.min(145, Math.max(25, prev.temperature + (Math.random() - 0.48) * 1.8));
          const nextVib = Math.min(1.95, Math.max(0.1, prev.vibration + (Math.random() - 0.48) * 0.04));
          const nextPressure = Math.min(240, Math.max(50, prev.pressure + (Math.random() - 0.49) * 3));
          const nextRpm = Math.min(5800, Math.max(1200, prev.rpm + (Math.random() - 0.48) * 60));
          const nextHours = Math.min(6000, prev.operating_hours + 1);

          return {
            temperature: Math.round(nextTemp),
            vibration: parseFloat(nextVib.toFixed(2)),
            pressure: Math.round(nextPressure),
            rpm: Math.round(nextRpm),
            operating_hours: nextHours,
          };
        });
      }, 600);
    }

    return () => clearInterval(intervalId);
  }, [isStreaming]);

  // Buffer history updates
  useEffect(() => {
    setTelemetryHistory((prev) => {
      const updated = [...prev, {
        temperature: sensorValues.temperature,
        vibration: sensorValues.vibration,
        timestamp: Date.now()
      }];
      return updated.slice(-30);
    });
  }, [sensorValues.temperature, sensorValues.vibration]);

  return (
    <div className="relative min-h-screen text-neutral-900 dark:text-neutral-100 bg-grid-cyber selection:bg-cyan-100 dark:selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-200">
      {/* Ambient background lighting */}
      <div className="fixed inset-0 bg-radial-glow pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation & Header */}
        <Header
          isStreaming={isStreaming}
          onToggleStreaming={() => setIsStreaming(!isStreaming)}
          isExploded={isExploded}
          onToggleExploded={() => setIsExploded(!isExploded)}
          thermalVision={thermalVision}
          onToggleThermal={() => setThermalVision(!thermalVision)}
          wireframeMode={wireframeMode}
          onToggleWireframe={() => setWireframeMode(!wireframeMode)}
          onOpenReport={() => setIsReportOpen(true)}
        />

        {/* Bento Grid Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:auto-rows-[minmax(250px,auto)] lg:grid-flow-dense mb-4">
          {/* Cell 1: 3D Digital Twin (Hero, tall) */}
          <div className="lg:col-span-7 lg:row-span-2 h-[420px] sm:h-[480px] lg:h-auto">
            <IndustrialTurbineScene
              sensorValues={sensorValues}
              isExploded={isExploded}
              wireframeMode={wireframeMode}
              thermalVision={thermalVision}
              activeHotspot={activeHotspot}
              onSelectHotspot={(hotspot) => setActiveHotspot(hotspot === activeHotspot ? null : hotspot)}
              reducedMotion={reducedMotion}
            />
          </div>

          {/* Cell 2: AI Health HUD (tall) */}
          <div className="lg:col-span-5 lg:row-span-2">
            <HealthScoreHUD predictionResult={predictionResult} />
          </div>

          {/* Cell 3: Explainability (wide, tall) */}
          <div className="lg:col-span-7 lg:row-span-2">
            <ExplainabilityPanel
              predictionResult={predictionResult}
              sensorValues={sensorValues}
            />
          </div>

          {/* Cell 4: Telemetry Controls (tall) */}
          <div className="lg:col-span-5 lg:row-span-2">
            <TelemetryControlPanel
              sensorValues={sensorValues}
              onChangeSensor={handleSensorChange}
              onApplyScenario={handleApplyScenario}
              onResetNominal={handleResetNominal}
              activeHotspot={activeHotspot}
              onSelectHotspot={(hotspot) => setActiveHotspot(hotspot === activeHotspot ? null : hotspot)}
            />
          </div>

          {/* Cell 5: Live Waveform Oscilloscope */}
          <div className="lg:col-span-7">
            <LiveOscilloscope
              history={telemetryHistory}
              isStreaming={isStreaming}
            />
          </div>

          {/* Cell 6: Telemetry Event Log (compact) */}
          <div className="lg:col-span-5 flex flex-col p-5 rounded-2xl bg-white dark:bg-neutral-900/70 border border-neutral-200 dark:border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-700 dark:text-cyan-400 font-semibold uppercase tracking-wider mb-3">
              <Terminal className="w-4 h-4" />
              <span>Telemetry Event Log</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
              <AnimatedList className="space-y-2 text-xs font-mono">
                {telemetryHistory.slice(-8).reverse().map((entry, idx) => {
                  const isWarning = entry.temperature > 90 || entry.vibration > 0.8;
                  return (
                    <div
                      key={entry.timestamp + idx}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                        isWarning
                          ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700 dark:bg-white/5 dark:border-white/10 dark:text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 shrink-0">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="truncate">
                          {isWarning ? '⚠ THRESHOLD BREACH' : '✓ NOMINAL UPDATE'}
                        </span>
                      </div>
                      <div className="flex gap-3 text-[10px] shrink-0">
                        <span>T:{entry.temperature}°C</span>
                        <span>V:{entry.vibration.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </AnimatedList>
            </div>
          </div>
        </section>

        {/* Footer & Engineering Specs */}
        <footer className="bg-white dark:bg-neutral-900/70 rounded-2xl p-5 border border-neutral-200 dark:border-white/10 text-xs text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-neutral-900 dark:text-neutral-200 font-semibold flex items-center gap-2">
              <span>SmartGuard AI • Industrial Predictive Maintenance Platform</span>
            </div>
            <p className="text-[11px] mt-1">
              Developed by <strong className="text-neutral-800 dark:text-neutral-100">Pratik Mahendra Pardeshi</strong> — Aspiring AI & ML Engineer
            </p>
            <p className="text-[11px] mt-0.5">
              Co-Developed by <strong className="text-neutral-800 dark:text-neutral-100">Sagnik Sengupta</strong>
            </p>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <a
              href="https://github.com/PratikP0610/SmartGuard-AI"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors"
            >
              <Code2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </footer>
      </div>

      {/* Diagnostics Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        sensorValues={sensorValues}
        predictionResult={predictionResult}
      />
    </div>
  );
}
