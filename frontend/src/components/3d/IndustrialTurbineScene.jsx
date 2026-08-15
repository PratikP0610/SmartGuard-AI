import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// 3D Turbine Blade Array Component
function RotorStage({ count = 16, radius = 1.6, bladeLength = 0.8, bladeWidth = 0.16, angle = 0.35, color, metalness = 0.9, roughness = 0.2, emissive = '#000000', emissiveIntensity = 0, wireframe = false }) {
  const blades = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      items.push({
        position: [Math.cos(theta) * radius * 0.4, Math.sin(theta) * radius * 0.4, 0],
        rotation: [0, 0, theta + Math.PI / 2 + angle]
      });
    }
    return items;
  }, [count, radius, angle]);

  return (
    <group>
      {/* Central Hub Disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.45, radius * 0.45, 0.22, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          wireframe={wireframe}
        />
      </mesh>
      {/* Array of Aerodynamic Blades */}
      {blades.map((b, idx) => (
        <mesh key={idx} position={b.position} rotation={b.rotation}>
          <boxGeometry args={[bladeWidth, bladeLength, 0.04]} />
          <meshStandardMaterial
            color={color}
            metalness={metalness}
            roughness={roughness}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
            wireframe={wireframe}
          />
        </mesh>
      ))}
    </group>
  );
}

// Complete Turbine Assembly with Exploded View and Hotspots
function TurbineAssembly({
  sensorValues,
  isExploded,
  wireframeMode,
  thermalVision,
  activeHotspot,
  onSelectHotspot,
  reducedMotion,
  isMobile
}) {
  const mainGroupRef = useRef();
  const rotorRef = useRef();
  const statorRef = useRef();
  const casingRef = useRef();
  const particlesRef = useRef();

  const { temperature, vibration, rpm, pressure } = sensorValues;

  // Calculate dynamic colors and emissives based on temperature & thermal vision
  const { bladeColor, glowColor, glowIntensity } = useMemo(() => {
    if (thermalVision) {
      // Thermal FLIR gradient
      if (temperature > 100) return { bladeColor: '#ef4444', glowColor: '#ff0055', glowIntensity: 1.5 };
      if (temperature > 85) return { bladeColor: '#f59e0b', glowColor: '#ff8800', glowIntensity: 1.0 };
      if (temperature > 70) return { bladeColor: '#06b6d4', glowColor: '#00f0ff', glowIntensity: 0.6 };
      return { bladeColor: '#3b82f6', glowColor: '#0044ff', glowIntensity: 0.4 };
    } else {
      // Photorealistic Titanium / Steel with heat discolouration
      if (temperature > 95) {
        return { bladeColor: '#ff4d4d', glowColor: '#ff1100', glowIntensity: 0.8 };
      } else if (temperature > 85) {
        return { bladeColor: '#eab308', glowColor: '#d97706', glowIntensity: 0.4 };
      }
      return { bladeColor: '#94a3b8', glowColor: '#000000', glowIntensity: 0 };
    }
  }, [temperature, thermalVision]);

  // Frame update for RPM spin and vibration jitter
  useFrame((state, delta) => {
    if (!reducedMotion) {
      // Dynamic rotation speed proportional to RPM
      const rotationSpeed = (rpm / 600) * delta;
      if (rotorRef.current) {
        rotorRef.current.rotation.z -= rotationSpeed;
      }
      if (particlesRef.current) {
        particlesRef.current.rotation.z -= rotationSpeed * 0.5;
      }

      // Vibration jitter simulation
      if (vibration > 0.4 && mainGroupRef.current) {
        const jitter = (vibration / 2.0) * 0.025;
        mainGroupRef.current.position.x = (Math.random() - 0.5) * jitter;
        mainGroupRef.current.position.y = (Math.random() - 0.5) * jitter;
      } else if (mainGroupRef.current) {
        mainGroupRef.current.position.x = 0;
        mainGroupRef.current.position.y = 0;
      }
    }

    // Exploded CAD view smooth spring transitions
    const targetCasingZ = isExploded ? 2.4 : 0;
    const targetRotorZ = isExploded ? 0.8 : 0;
    const targetStatorZ = isExploded ? -1.2 : 0;

    if (casingRef.current) {
      casingRef.current.position.z = THREE.MathUtils.lerp(casingRef.current.position.z, targetCasingZ, 0.08);
    }
    if (rotorRef.current) {
      rotorRef.current.position.z = THREE.MathUtils.lerp(rotorRef.current.position.z, targetRotorZ, 0.08);
    }
    if (statorRef.current) {
      statorRef.current.position.z = THREE.MathUtils.lerp(statorRef.current.position.z, targetStatorZ, 0.08);
    }
  });

  return (
    <group ref={mainGroupRef}>
      {/* 1. Central Drive Shaft */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 4.2, 32]} />
        <meshStandardMaterial
          color={thermalVision ? '#0284c7' : '#475569'}
          metalness={0.95}
          roughness={0.15}
          wireframe={wireframeMode}
        />
      </mesh>

      {/* 2. Rotating Subsystem (Rotor Discs & Compressor Stages) */}
      <group ref={rotorRef}>
        {/* Stage 1: Intake Fan (Large) */}
        <group position={[0, 0, 1.2]}>
          <RotorStage
            count={24}
            radius={2.3}
            bladeLength={1.2}
            bladeWidth={0.22}
            angle={0.4}
            color={bladeColor}
            emissive={glowColor}
            emissiveIntensity={glowIntensity}
            wireframe={wireframeMode}
          />
        </group>

        {/* Stage 2: Intermediate Compressor */}
        <group position={[0, 0, 0.6]}>
          <RotorStage
            count={20}
            radius={1.9}
            bladeLength={0.95}
            bladeWidth={0.18}
            angle={0.35}
            color={bladeColor}
            emissive={glowColor}
            emissiveIntensity={glowIntensity}
            wireframe={wireframeMode}
          />
        </group>

        {/* Stage 3: High-Pressure Compressor */}
        <group position={[0, 0, 0.0]}>
          <RotorStage
            count={18}
            radius={1.6}
            bladeLength={0.8}
            bladeWidth={0.16}
            angle={0.3}
            color={bladeColor}
            emissive={glowColor}
            emissiveIntensity={glowIntensity}
            wireframe={wireframeMode}
          />
        </group>

        {/* Stage 4: High-Pressure Turbine (Combustion Core) */}
        <group position={[0, 0, -0.6]}>
          <RotorStage
            count={16}
            radius={1.5}
            bladeLength={0.75}
            bladeWidth={0.15}
            angle={0.25}
            color={temperature > 85 ? '#f43f5e' : bladeColor}
            emissive={temperature > 85 ? '#ef4444' : glowColor}
            emissiveIntensity={glowIntensity * 1.4}
            wireframe={wireframeMode}
          />
        </group>

        {/* Front Nose Cone Spinner */}
        <mesh position={[0, 0, 1.65]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.5, 0.9, 32]} />
          <meshStandardMaterial
            color={thermalVision ? '#38bdf8' : '#0f172a'}
            metalness={0.9}
            roughness={0.2}
            wireframe={wireframeMode}
          />
        </mesh>
      </group>

      {/* 3. Stator Vanes Subsystem & Magnetic Bearings */}
      <group ref={statorRef}>
        {/* Bearing Ring 1 (Front) */}
        <mesh position={[0, 0, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.09, 16, 32]} />
          <meshStandardMaterial
            color={vibration > 0.8 ? '#f43f5e' : '#38bdf8'}
            emissive={vibration > 0.8 ? '#ef4444' : '#0284c7'}
            emissiveIntensity={vibration > 0.8 ? 1.0 : 0.2}
            metalness={0.9}
            wireframe={wireframeMode}
          />
        </mesh>

        {/* Bearing Ring 2 (Rear Hot Section) */}
        <mesh position={[0, 0, -0.9]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.09, 16, 32]} />
          <meshStandardMaterial
            color={temperature > 90 ? '#ef4444' : '#f59e0b'}
            emissive={temperature > 90 ? '#ef4444' : '#d97706'}
            emissiveIntensity={temperature > 90 ? 1.2 : 0.4}
            metalness={0.9}
            wireframe={wireframeMode}
          />
        </mesh>

        {/* Combustion Chamber Liner */}
        <mesh position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.1, 1.1, 0.8, 32, 1, true]} />
          <meshStandardMaterial
            color={temperature > 85 ? '#b91c1c' : '#334155'}
            metalness={0.8}
            roughness={0.4}
            wireframe={wireframeMode}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 4. Outer Casing & Transparent Nacelle Shroud */}
      <group ref={casingRef}>
        <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.75, 1.85, 2.8, 36, 1, true]} />
          <meshPhysicalMaterial
            color={thermalVision ? '#0f172a' : '#1e293b'}
            metalness={0.2}
            roughness={0.1}
            transmission={wireframeMode ? 0 : 0.72}
            thickness={0.4}
            transparent={true}
            opacity={wireframeMode ? 1 : 0.45}
            wireframe={wireframeMode}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Structural Ring Flanges */}
        <mesh position={[0, 0, 1.4]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.76, 0.05, 16, 36]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.86, 0.05, 16, 36]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* 5. Particle Flow & Exhaust Rings */}
      <group ref={particlesRef} position={[0, 0, -1.8]}>
        <Sparkles
          count={rpm > 4000 ? 120 : 60}
          scale={[2.2, 2.2, 2.5]}
          size={3.5}
          speed={0.8 + (rpm / 3000)}
          color={temperature > 90 ? '#ef4444' : '#00f0ff'}
        />
      </group>

      {/* 6. Interactive 3D Hotspot Sensor Pins */}
      {/* Hotspot 1: Temperature Sensor at Combustor */}
      {(!isMobile || activeHotspot === 'temperature') && (
      <group position={[0, 1.4, -0.6]}>
        <Html distanceFactor={8} position={[0, 0.2, 0]} center>
          <button
            onClick={() => onSelectHotspot('temperature')}
            className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all duration-300 ${
              activeHotspot === 'temperature'
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 text-cyan-700 border border-cyan-200 dark:bg-neutral-900/90 dark:text-cyan-300 dark:border-cyan-400/40'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${temperature > 90 ? 'bg-red-500 animate-ping' : 'bg-cyan-500'}`} />
            <span>TEMP: {temperature}°C</span>
          </button>
        </Html>
      </group>
      )}

      {/* Hotspot 2: Vibration Accelerometer at Front Bearing */}
      {(!isMobile || activeHotspot === 'vibration') && (
      <group position={[1.2, 0.8, 0.8]}>
        <Html distanceFactor={8} position={[0, 0.2, 0]} center>
          <button
            onClick={() => onSelectHotspot('vibration')}
            className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all duration-300 ${
              activeHotspot === 'vibration'
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 text-amber-700 border border-amber-300 dark:bg-neutral-900/90 dark:text-amber-300 dark:border-amber-500/40'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${vibration > 0.8 ? 'bg-red-500 animate-ping' : 'bg-amber-500'}`} />
            <span>VIB: {vibration.toFixed(2)} mm/s</span>
          </button>
        </Html>
      </group>
      )}

      {/* Hotspot 3: RPM Tachometer at Spinner */}
      {(!isMobile || activeHotspot === 'rpm') && (
      <group position={[-1.2, 0.5, 1.4]}>
        <Html distanceFactor={8} position={[0, 0.2, 0]} center>
          <button
            onClick={() => onSelectHotspot('rpm')}
            className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all duration-300 ${
              activeHotspot === 'rpm'
                ? 'bg-cyan-600 text-white dark:bg-cyan-500'
                : 'bg-white/90 text-neutral-700 border border-neutral-200 dark:bg-neutral-900/90 dark:text-neutral-300 dark:border-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{rpm} RPM</span>
          </button>
        </Html>
      </group>
      )}

      {/* Hotspot 4: Pressure Transducer */}
      {(!isMobile || activeHotspot === 'pressure') && (
      <group position={[0, -1.3, 0.2]}>
        <Html distanceFactor={8} position={[0, -0.2, 0]} center>
          <button
            onClick={() => onSelectHotspot('pressure')}
            className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all duration-300 ${
              activeHotspot === 'pressure'
                ? 'bg-blue-600 text-white'
                : 'bg-white/90 text-blue-700 border border-blue-200 dark:bg-neutral-900/90 dark:text-blue-300 dark:border-blue-400/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>{pressure} kPa</span>
          </button>
        </Html>
      </group>
      )}
    </group>
  );
}

/**
 * Main WebGL Canvas Component with Controls, Lighting, and Environment
 */
export default function IndustrialTurbineScene({
  sensorValues,
  isExploded = false,
  wireframeMode = false,
  thermalVision = false,
  activeHotspot = null,
  onSelectHotspot = () => {},
  reducedMotion = false
}) {
  const controlsRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 flex flex-col" style={{ backgroundColor: 'var(--canvas)' }}>
      {/* Accessibility: Screen Reader Only List */}
      <ul className="sr-only">
        <li>
          <button onClick={() => onSelectHotspot('temperature')}>Focus Temperature Sensor: {sensorValues.temperature} degrees</button>
        </li>
        <li>
          <button onClick={() => onSelectHotspot('vibration')}>Focus Vibration Sensor: {sensorValues.vibration} mm/s</button>
        </li>
        <li>
          <button onClick={() => onSelectHotspot('rpm')}>Focus RPM Sensor: {sensorValues.rpm} RPM</button>
        </li>
        <li>
          <button onClick={() => onSelectHotspot('pressure')}>Focus Pressure Sensor: {sensorValues.pressure} kPa</button>
        </li>
      </ul>

      {/* 3D Canvas */}
      <div className="flex-1 min-h-[350px]">
      <Canvas
        camera={{ position: [3.8, 2.2, 4.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lights */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -5, -5]} intensity={0.6} color="#00f0ff" />
        <pointLight position={[0, 3, 0]} intensity={1.2} color={thermalVision ? '#ff3366' : '#38bdf8'} />

        {/* 3D Model with Float Physics */}
        <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={0.2} floatIntensity={0.3}>
          <TurbineAssembly
            sensorValues={sensorValues}
            isExploded={isExploded}
            wireframeMode={wireframeMode}
            thermalVision={thermalVision}
            activeHotspot={activeHotspot}
            onSelectHotspot={onSelectHotspot}
            reducedMotion={reducedMotion}
            isMobile={isMobile}
          />
        </Float>

        {/* Ground Ambient Contact Shadow */}
        <ContactShadows
          position={[0, -2.2, 0]}
          opacity={0.35}
          scale={8}
          blur={2.5}
          far={4}
          color="#000000"
        />

        {/* Camera Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={!reducedMotion && !isExploded}
          autoRotateSpeed={0.8}
          minDistance={2.5}
          maxDistance={9.0}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
      </div>

      {/* Swipeable Bottom Sheet for Mobile Hotspots */}
      {isMobile && (
        <div className="flex-none p-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-white/10 flex overflow-x-auto snap-x gap-2 z-20" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => onSelectHotspot('temperature')}
            className={`flex-shrink-0 snap-center min-w-[120px] min-h-[44px] flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-mono transition-colors ${
              activeHotspot === 'temperature' ? 'bg-rose-500 text-white' : 'bg-neutral-100 dark:bg-white/5 text-cyan-700 dark:text-cyan-300 border border-neutral-200 dark:border-white/10'
            }`}
          >
            TEMP: {sensorValues.temperature}°C
          </button>
          <button
            onClick={() => onSelectHotspot('vibration')}
            className={`flex-shrink-0 snap-center min-w-[120px] min-h-[44px] flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-mono transition-colors ${
              activeHotspot === 'vibration' ? 'bg-amber-500 text-white' : 'bg-neutral-100 dark:bg-white/5 text-amber-700 dark:text-amber-300 border border-neutral-200 dark:border-white/10'
            }`}
          >
            VIB: {sensorValues.vibration.toFixed(2)}
          </button>
          <button
            onClick={() => onSelectHotspot('rpm')}
            className={`flex-shrink-0 snap-center min-w-[120px] min-h-[44px] flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-mono transition-colors ${
              activeHotspot === 'rpm' ? 'bg-cyan-600 dark:bg-cyan-500 text-white' : 'bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10'
            }`}
          >
            {sensorValues.rpm} RPM
          </button>
          <button
            onClick={() => onSelectHotspot('pressure')}
            className={`flex-shrink-0 snap-center min-w-[120px] min-h-[44px] flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-mono transition-colors ${
              activeHotspot === 'pressure' ? 'bg-blue-600 text-white' : 'bg-neutral-100 dark:bg-white/5 text-blue-700 dark:text-blue-300 border border-neutral-200 dark:border-white/10'
            }`}
          >
            {sensorValues.pressure} kPa
          </button>
        </div>
      )}

      {/* Interactive Overlay Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-neutral-900/60 text-[11px] font-mono text-neutral-700 dark:text-cyan-300 border border-neutral-200 dark:border-white/10 backdrop-blur-sm pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-cyan-500" />
        <span>3D DIGITAL TWIN • 60 FPS</span>
      </div>

      {/* Orbit Gesture Hint */}
      <div className="absolute bottom-3 left-3 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 bg-white/80 dark:bg-neutral-900/60 px-2.5 py-1 rounded border border-neutral-200 dark:border-white/10 backdrop-blur-sm pointer-events-none hidden md:block">
        🖱️ Click & Drag to Orbit • Scroll to Zoom
      </div>
    </div>
  );
}
