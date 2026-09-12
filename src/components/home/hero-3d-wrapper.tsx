"use client";

import dynamic from "next/dynamic";
import { Terminal } from "lucide-react";

const TechOrbScene = dynamic(
  () => import("@/components/three/tech-orb-scene").then((mod) => mod.TechOrbScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary animate-pulse">
          <Terminal className="w-8 h-8" />
        </div>
      </div>
    ),
  }
);

export function Hero3DWrapper() {
  return <TechOrbScene />;
}
