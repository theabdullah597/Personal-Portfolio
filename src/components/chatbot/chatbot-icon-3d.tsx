"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function BotMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[1.2, 64, 64]}>
        <MeshDistortMaterial
          color="#0ea5e9" // primary cyan/blue color
          emissive="#0369a1"
          emissiveIntensity={0.5}
          distort={0.4}
          speed={3}
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>
      {/* Outer subtle glow sphere */}
      <Sphere args={[1.4, 32, 32]}>
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} side={THREE.BackSide} />
      </Sphere>
    </Float>
  );
}

export function ChatbotIcon3D() {
  return (
    <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-black">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[2, 5, 2]} intensity={2.5} />
        <pointLight position={[-2, -2, 2]} color="#0ea5e9" intensity={2} />
        <BotMesh />
      </Canvas>
    </div>
  );
}
