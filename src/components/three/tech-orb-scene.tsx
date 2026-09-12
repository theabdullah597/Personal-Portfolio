"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * Stylized 3D Developer & AI Engineer Workspace
 * Inspired by the warm, playful, artistic creative developer visual language.
 */
function WorkspaceScene() {
  const groupRef = React.useRef<THREE.Group>(null);
  const screenGlowRef = React.useRef<THREE.Mesh>(null);
  const floatingBadgeRef = React.useRef<THREE.Group>(null);
  const mouse = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth, responsive cursor parallax
      const targetRotationY = mouse.current.x * 0.35 - 0.25;
      const targetRotationX = -mouse.current.y * 0.2 + 0.15;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotationY,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotationX,
        0.05
      );
    }

    if (screenGlowRef.current) {
      // Subtle rhythmic glow on monitor
      const time = state.clock.getElapsedTime();
      const material = screenGlowRef.current.material as THREE.MeshStandardMaterial;
      if (material) {
        material.emissiveIntensity = 0.6 + Math.sin(time * 2.5) * 0.15;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]} rotation={[0.15, -0.25, 0]}>
      {/* ================= DESK SURFACE ================= */}
      {/* Tabletop */}
      <RoundedBox args={[4.2, 0.16, 2.4]} radius={0.06} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial color="#E8DACB" roughness={0.3} metalness={0.05} />
      </RoundedBox>

      {/* Sleek Tailored Desk Mat */}
      <RoundedBox args={[2.4, 0.015, 1.05]} radius={0.03} smoothness={4} position={[0.0, 0.088, 0.2]}>
        <meshStandardMaterial color="#151D2C" roughness={0.7} metalness={0.1} />
      </RoundedBox>
      {/* Inner Inset Stitching */}
      <mesh position={[0.0, 0.096, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.32, 0.97]} />
        <meshStandardMaterial color="#1E283D" roughness={0.8} />
      </mesh>

      {/* Desk Legs */}
      <mesh position={[-1.8, -0.8, -0.9]}>
        <cylinderGeometry args={[0.06, 0.06, 1.5, 16]} />
        <meshStandardMaterial color="#222A3B" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[1.8, -0.8, -0.9]}>
        <cylinderGeometry args={[0.06, 0.06, 1.5, 16]} />
        <meshStandardMaterial color="#222A3B" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-1.8, -0.8, 0.9]}>
        <cylinderGeometry args={[0.06, 0.06, 1.5, 16]} />
        <meshStandardMaterial color="#222A3B" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[1.8, -0.8, 0.9]}>
        <cylinderGeometry args={[0.06, 0.06, 1.5, 16]} />
        <meshStandardMaterial color="#222A3B" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* ================= MAIN DISPLAY ================= */}
      {/* Monitor Stand Base */}
      <RoundedBox args={[0.7, 0.04, 0.5]} radius={0.02} smoothness={2} position={[-0.1, 0.11, -0.6]}>
        <meshStandardMaterial color="#1E2538" metalness={0.7} roughness={0.3} />
      </RoundedBox>
      {/* Monitor Pole */}
      <mesh position={[-0.1, 0.5, -0.65]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
        <meshStandardMaterial color="#2B364E" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Monitor Frame */}
      <RoundedBox args={[2.2, 1.35, 0.08]} radius={0.04} smoothness={4} position={[-0.1, 0.95, -0.6]}>
        <meshStandardMaterial color="#151C2C" roughness={0.4} />
      </RoundedBox>
      {/* Screen Display (Glowing Code & AI Architecture) */}
      <mesh ref={screenGlowRef} position={[-0.1, 0.95, -0.55]}>
        <planeGeometry args={[2.08, 1.22]} />
        <meshStandardMaterial
          color="#0F172A"
          emissive="#FF7A2F"
          emissiveIntensity={0.65}
          roughness={0.2}
        />
      </mesh>

      {/* Code Editor Windows On Screen (Stylized boxes) */}
      <group position={[-0.1, 0.95, -0.54]}>
        {/* Window Top Bar */}
        <mesh position={[0, 0.52, 0]}>
          <planeGeometry args={[1.98, 0.08]} />
          <meshBasicMaterial color="#1E293B" />
        </mesh>
        {/* Window dots */}
        <mesh position={[-0.88, 0.52, 0.001]}>
          <circleGeometry args={[0.02, 16]} />
          <meshBasicMaterial color="#FF5F56" />
        </mesh>
        <mesh position={[-0.82, 0.52, 0.001]}>
          <circleGeometry args={[0.02, 16]} />
          <meshBasicMaterial color="#FFBD2E" />
        </mesh>
        <mesh position={[-0.76, 0.52, 0.001]}>
          <circleGeometry args={[0.02, 16]} />
          <meshBasicMaterial color="#27C93F" />
        </mesh>
        {/* Code Lines (Orange, Cyan, Gold lines) */}
        <mesh position={[-0.4, 0.35, 0.001]}>
          <planeGeometry args={[0.9, 0.03]} />
          <meshBasicMaterial color="#FF7A2F" />
        </mesh>
        <mesh position={[-0.2, 0.27, 0.001]}>
          <planeGeometry args={[1.3, 0.025]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
        <mesh position={[-0.35, 0.19, 0.001]}>
          <planeGeometry args={[1.0, 0.025]} />
          <meshBasicMaterial color="#FBBF24" />
        </mesh>
        <mesh position={[-0.1, 0.11, 0.001]}>
          <planeGeometry args={[1.4, 0.025]} />
          <meshBasicMaterial color="#A78BFA" />
        </mesh>
        <mesh position={[-0.5, 0.03, 0.001]}>
          <planeGeometry args={[0.7, 0.025]} />
          <meshBasicMaterial color="#34D399" />
        </mesh>
        {/* Neural Network Nodes visual graphic on right pane */}
        <mesh position={[0.55, 0.2, 0.001]}>
          <ringGeometry args={[0.18, 0.21, 32]} />
          <meshBasicMaterial color="#FF7A2F" />
        </mesh>
        <mesh position={[0.55, 0.2, 0.001]}>
          <circleGeometry args={[0.07, 16]} />
          <meshBasicMaterial color="#FF7A2F" />
        </mesh>
      </group>

      {/* ================= SECONDARY LAPTOP (ANGLED) ================= */}
      <group position={[1.4, 0.12, -0.2]} rotation={[0, -0.5, 0]}>
        {/* Base */}
        <RoundedBox args={[0.9, 0.03, 0.65]} radius={0.02} smoothness={2}>
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </RoundedBox>
        {/* Laptop Screen */}
        <group position={[0, 0.35, -0.3]} rotation={[-0.3, 0, 0]}>
          <RoundedBox args={[0.88, 0.58, 0.02]} radius={0.02} smoothness={2}>
            <meshStandardMaterial color="#1E293B" />
          </RoundedBox>
          <mesh position={[0, 0, 0.015]}>
            <planeGeometry args={[0.82, 0.52]} />
            <meshStandardMaterial color="#0284C7" emissive="#0284C7" emissiveIntensity={0.5} />
          </mesh>
        </group>
      </group>

      {/* ================= MECHANICAL KEYBOARD & MOUSE ================= */}
      <group position={[-0.20, 0.11, 0.28]} rotation={[-0.10, 0, 0]}>
        {/* Keyboard Housing Case (Angled Anodized Aluminum Chassis) */}
        <RoundedBox args={[1.36, 0.05, 0.52]} radius={0.016} smoothness={4} position={[0, 0, 0]}>
          <meshStandardMaterial color="#1E283D" roughness={0.3} metalness={0.4} />
        </RoundedBox>

        {/* Recessed Switch Plate with Vibrant Glowing Cyan RGB Underglow */}
        <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.28, 0.44]} />
          <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.65} roughness={0.2} />
        </mesh>

        {/* --- ROW 0: Number & Function Row --- */}
        {/* ESC Key (Accent Cyber Orange) */}
        <RoundedBox args={[0.075, 0.034, 0.07]} radius={0.008} smoothness={2} position={[-0.58, 0.046, -0.15]}>
          <meshStandardMaterial color="#FF7A2F" roughness={0.3} emissive="#FF7A2F" emissiveIntensity={0.5} />
        </RoundedBox>
        {[-0.49, -0.41, -0.33, -0.25, -0.17, -0.09, -0.01, 0.07, 0.15, 0.23, 0.31, 0.39].map((x, i) => (
          <RoundedBox key={`r0-${i}`} args={[0.068, 0.034, 0.068]} radius={0.008} smoothness={2} position={[x, 0.046, -0.15]}>
            <meshStandardMaterial color="#F8FAFC" roughness={0.35} />
          </RoundedBox>
        ))}
        {/* Backspace Key */}
        <RoundedBox args={[0.11, 0.034, 0.07]} radius={0.008} smoothness={2} position={[0.49, 0.046, -0.15]}>
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </RoundedBox>

        {/* --- ROW 1: QWERTY Row --- */}
        {/* Tab Key */}
        <RoundedBox args={[0.10, 0.034, 0.07]} radius={0.008} smoothness={2} position={[-0.57, 0.046, -0.075]}>
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </RoundedBox>
        {[-0.47, -0.39, -0.31, -0.23, -0.15, -0.07, 0.01, 0.09, 0.17, 0.25, 0.33, 0.41].map((x, i) => (
          <RoundedBox key={`r1-${i}`} args={[0.068, 0.034, 0.068]} radius={0.008} smoothness={2} position={[x, 0.046, -0.075]}>
            <meshStandardMaterial color="#F8FAFC" roughness={0.35} />
          </RoundedBox>
        ))}
        {/* Backslash Key */}
        <RoundedBox args={[0.08, 0.034, 0.07]} radius={0.008} smoothness={2} position={[0.50, 0.046, -0.075]}>
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </RoundedBox>

        {/* --- ROW 2: Home Row (ASDF) --- */}
        {/* CapsLock Key */}
        <RoundedBox args={[0.11, 0.034, 0.07]} radius={0.008} smoothness={2} position={[-0.565, 0.046, 0.00]}>
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </RoundedBox>
        {[-0.46, -0.38, -0.30, -0.22, -0.14, -0.06, 0.02, 0.10, 0.18, 0.26, 0.34].map((x, i) => (
          <RoundedBox key={`r2-${i}`} args={[0.068, 0.034, 0.068]} radius={0.008} smoothness={2} position={[x, 0.046, 0.00]}>
            <meshStandardMaterial color="#F8FAFC" roughness={0.35} />
          </RoundedBox>
        ))}
        {/* Enter Key (Electric Cyan Glow) */}
        <RoundedBox args={[0.15, 0.036, 0.07]} radius={0.008} smoothness={2} position={[0.47, 0.047, 0.00]}>
          <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.6} roughness={0.25} />
        </RoundedBox>

        {/* --- ROW 3: ZXCV Row --- */}
        {/* Left Shift */}
        <RoundedBox args={[0.14, 0.034, 0.07]} radius={0.008} smoothness={2} position={[-0.55, 0.046, 0.075]}>
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </RoundedBox>
        {[-0.43, -0.35, -0.27, -0.19, -0.11, -0.03, 0.05, 0.13, 0.21, 0.29].map((x, i) => (
          <RoundedBox key={`r3-${i}`} args={[0.068, 0.034, 0.068]} radius={0.008} smoothness={2} position={[x, 0.046, 0.075]}>
            <meshStandardMaterial color="#F8FAFC" roughness={0.35} />
          </RoundedBox>
        ))}
        {/* Right Shift */}
        <RoundedBox args={[0.14, 0.034, 0.07]} radius={0.008} smoothness={2} position={[0.41, 0.046, 0.075]}>
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </RoundedBox>
        {/* Up Arrow (Electric Cyan) */}
        <RoundedBox args={[0.065, 0.034, 0.068]} radius={0.008} smoothness={2} position={[0.53, 0.046, 0.075]}>
          <meshStandardMaterial color="#38BDF8" roughness={0.3} emissive="#38BDF8" emissiveIntensity={0.3} />
        </RoundedBox>

        {/* --- ROW 4: Bottom Row & Spacebar --- */}
        {/* Left Modifiers (Ctrl, Win, Alt) */}
        <RoundedBox args={[0.085, 0.034, 0.07]} radius={0.008} smoothness={2} position={[-0.58, 0.046, 0.15]}>
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </RoundedBox>
        <RoundedBox args={[0.075, 0.034, 0.07]} radius={0.008} smoothness={2} position={[-0.485, 0.046, 0.15]}>
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </RoundedBox>
        <RoundedBox args={[0.075, 0.034, 0.07]} radius={0.008} smoothness={2} position={[-0.395, 0.046, 0.15]}>
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </RoundedBox>

        {/* Sculpted Spacebar (Accent Sunset Orange) */}
        <RoundedBox args={[0.40, 0.036, 0.07]} radius={0.010} smoothness={2} position={[-0.14, 0.047, 0.15]}>
          <meshStandardMaterial color="#FF7A2F" roughness={0.3} emissive="#FF7A2F" emissiveIntensity={0.3} />
        </RoundedBox>

        {/* Right Modifiers */}
        <RoundedBox args={[0.075, 0.034, 0.07]} radius={0.008} smoothness={2} position={[0.11, 0.046, 0.15]}>
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </RoundedBox>
        <RoundedBox args={[0.075, 0.034, 0.07]} radius={0.008} smoothness={2} position={[0.20, 0.046, 0.15]}>
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </RoundedBox>

        {/* Navigation Arrows (Left, Down, Right in Electric Cyan) */}
        <RoundedBox args={[0.065, 0.034, 0.068]} radius={0.008} smoothness={2} position={[0.37, 0.046, 0.15]}>
          <meshStandardMaterial color="#38BDF8" roughness={0.3} emissive="#38BDF8" emissiveIntensity={0.3} />
        </RoundedBox>
        <RoundedBox args={[0.065, 0.034, 0.068]} radius={0.008} smoothness={2} position={[0.45, 0.046, 0.15]}>
          <meshStandardMaterial color="#38BDF8" roughness={0.3} emissive="#38BDF8" emissiveIntensity={0.3} />
        </RoundedBox>
        <RoundedBox args={[0.065, 0.034, 0.068]} radius={0.008} smoothness={2} position={[0.53, 0.046, 0.15]}>
          <meshStandardMaterial color="#38BDF8" roughness={0.3} emissive="#38BDF8" emissiveIntensity={0.3} />
        </RoundedBox>
      </group>

      {/* Ergonomic Optical Gaming Mouse */}
      <group position={[0.82, 0.11, 0.28]}>
        {/* Mouse Base */}
        <RoundedBox args={[0.24, 0.06, 0.38]} radius={0.035} smoothness={4} position={[0, 0, 0]}>
          <meshStandardMaterial color="#1E283D" roughness={0.3} metalness={0.3} />
        </RoundedBox>
        {/* Mouse Scroll Wheel */}
        <mesh position={[0, 0.034, -0.06]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.024, 16]} />
          <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.6} roughness={0.2} />
        </mesh>
        {/* Mouse Center Accent Light */}
        <mesh position={[0, 0.032, 0.06]}>
          <boxGeometry args={[0.016, 0.006, 0.09]} />
          <meshStandardMaterial color="#FF7A2F" emissive="#FF7A2F" emissiveIntensity={0.7} />
        </mesh>
      </group>

      {/* ================= COFFEE MUG ================= */}
      <group position={[-1.3, 0.18, 0.35]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.14, 0.34, 24]} />
          <meshStandardMaterial color="#FF7A2F" roughness={0.2} />
        </mesh>
        {/* Handle */}
        <mesh position={[-0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.1, 0.03, 12, 24]} />
          <meshStandardMaterial color="#FF7A2F" />
        </mesh>
        {/* Coffee inside */}
        <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.14, 24]} />
          <meshStandardMaterial color="#3E2723" roughness={0.9} />
        </mesh>
      </group>

      {/* ================= SUCCULENT DESK PLANT ================= */}
      <group position={[-1.45, 0.17, -0.45]}>
        {/* Clay Pot */}
        <mesh>
          <cylinderGeometry args={[0.2, 0.14, 0.3, 24]} />
          <meshStandardMaterial color="#D97706" roughness={0.6} />
        </mesh>
        {/* Soil */}
        <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.18, 16]} />
          <meshStandardMaterial color="#2E1C14" />
        </mesh>
        {/* Stylized Succulent Leaves */}
        <mesh position={[0, 0.25, 0]} rotation={[0.2, 0, 0.3]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#10B981" roughness={0.4} />
        </mesh>
        <mesh position={[0.08, 0.22, 0.05]} rotation={[-0.2, 0.4, -0.3]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#34D399" roughness={0.4} />
        </mesh>
        <mesh position={[-0.07, 0.24, -0.05]} rotation={[0.4, -0.3, 0.1]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#059669" roughness={0.4} />
        </mesh>
      </group>

      {/* ================= TECHNICAL BOOKS STACK ================= */}
      <group position={[1.4, 0.13, 0.55]} rotation={[0, 0.2, 0]}>
        {/* Bottom Book (Deep Navy) */}
        <RoundedBox args={[0.65, 0.07, 0.9]} radius={0.02} smoothness={2} position={[0, 0, 0]}>
          <meshStandardMaterial color="#1E293B" />
        </RoundedBox>
        {/* Middle Book (Warm Orange) */}
        <RoundedBox args={[0.6, 0.06, 0.85]} radius={0.02} smoothness={2} position={[0.02, 0.065, 0]}>
          <meshStandardMaterial color="#FF7A2F" />
        </RoundedBox>
        {/* Top Book (Sand Beige) */}
        <RoundedBox args={[0.55, 0.05, 0.8]} radius={0.02} smoothness={2} position={[-0.01, 0.12, 0]}>
          <meshStandardMaterial color="#FBBF24" />
        </RoundedBox>
      </group>

      {/* ================= FLOATING AI / NEURAL NETWORK BADGE ================= */}
      <Float speed={3} rotationIntensity={0.8} floatIntensity={1.2}>
        <group ref={floatingBadgeRef} position={[1.3, 1.45, -0.1]}>
          {/* Floating Octahedron AI Core */}
          <mesh rotation={[0.4, 0.5, 0]}>
            <octahedronGeometry args={[0.26, 0]} />
            <meshStandardMaterial
              color="#FF7A2F"
              emissive="#FF7A2F"
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          {/* Mini orbit ring */}
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.42, 0.015, 16, 32]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} />
          </mesh>
        </group>
      </Float>

      {/* Second Subtle Floating Geometric Accent (Left Side) */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.7}>
        <group position={[-1.5, 1.2, -0.3]}>
          <mesh rotation={[0.6, 0.2, 0.8]}>
            <icosahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial
              color="#FBBF24"
              emissive="#FBBF24"
              emissiveIntensity={0.4}
              roughness={0.3}
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

export function TechOrbScene() {
  const [mounted, setMounted] = React.useState(false);
  const [hasWebGL, setHasWebGL] = React.useState(true);

  React.useEffect(() => {
    setMounted(true);
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center text-center p-6">
        <div className="w-32 h-32 rounded-3xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center text-primary shadow-soft">
          <span className="text-3xl font-extrabold font-mono">3D</span>
          <span className="text-xs font-semibold text-muted-foreground mt-1">
            Workspace
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[380px] sm:min-h-[440px] relative">
      <Canvas
        camera={{ position: [0, 2.05, 4.0], fov: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        {/* Warm Studio & Isometric Fill Lighting Setup */}
        <ambientLight intensity={1.0} color="#FFF7ED" />
        {/* Front-top directional light illuminating keycaps and desk */}
        <directionalLight
          position={[0, 6, 4.5]}
          intensity={1.5}
          color="#FFFBF5"
        />
        {/* Angled rim light for specular edge highlights */}
        <directionalLight
          position={[5, 7, 3]}
          intensity={1.5}
          color="#FFF3E0"
          castShadow
        />
        <pointLight position={[-4, 3, 2]} intensity={0.9} color="#FF7A2F" />
        <pointLight position={[3, 4, -2]} intensity={0.8} color="#38BDF8" />

        <WorkspaceScene />
      </Canvas>
    </div>
  );
}
