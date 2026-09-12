import * as React from "react";
import {
  Code2,
  Terminal,
  Cpu,
  Layout,
  Palette,
  Server,
  Zap,
  Database,
  Layers,
  Bot,
  Sparkles,
  GitBranch,
  Box,
  Wrench,
} from "lucide-react";

interface SkillIconProps {
  name?: string | null;
  className?: string;
}

export function SkillIcon({ name, className = "w-4 h-4" }: SkillIconProps) {
  switch (name) {
    case "Code2":
      return <Code2 className={className} />;
    case "Terminal":
      return <Terminal className={className} />;
    case "Cpu":
      return <Cpu className={className} />;
    case "Layout":
      return <Layout className={className} />;
    case "Palette":
      return <Palette className={className} />;
    case "Server":
      return <Server className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "Database":
      return <Database className={className} />;
    case "Layers":
      return <Layers className={className} />;
    case "Bot":
      return <Bot className={className} />;
    case "Sparkles":
      return <Sparkles className={className} />;
    case "GitBranch":
      return <GitBranch className={className} />;
    case "Box":
      return <Box className={className} />;
    default:
      return <Wrench className={className} />;
  }
}
