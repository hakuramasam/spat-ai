import { cn } from "@/lib/utils";

interface AgentIconProps {
  className?: string;
  animated?: boolean;
}

export function AgentIcon({ className, animated = false }: AgentIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-full h-full", animated && "animate-pulse-glow", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer glow ring */}
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="url(#gradient-ring)"
        strokeWidth="2"
        opacity="0.5"
      />
      
      {/* Main hexagon body */}
      <path
        d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
        fill="url(#gradient-body)"
        stroke="url(#gradient-stroke)"
        strokeWidth="1.5"
      />
      
      {/* Inner core */}
      <circle
        cx="50"
        cy="50"
        r="20"
        fill="url(#gradient-core)"
      />
      
      {/* AI eye */}
      <circle cx="50" cy="50" r="8" fill="hsl(180 100% 50%)" />
      <circle cx="50" cy="50" r="4" fill="hsl(217 100% 50%)" />
      <circle cx="52" cy="48" r="2" fill="white" opacity="0.8" />
      
      {/* Circuit lines */}
      <path
        d="M50 30 L50 42 M50 58 L50 70 M30 50 L42 50 M58 50 L70 50"
        stroke="hsl(180 100% 50%)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      
      {/* Corner nodes */}
      <circle cx="50" cy="30" r="3" fill="hsl(180 100% 50%)" />
      <circle cx="50" cy="70" r="3" fill="hsl(180 100% 50%)" />
      <circle cx="30" cy="50" r="3" fill="hsl(180 100% 50%)" />
      <circle cx="70" cy="50" r="3" fill="hsl(180 100% 50%)" />
      
      <defs>
        <linearGradient id="gradient-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(217 100% 50%)" />
          <stop offset="100%" stopColor="hsl(180 100% 50%)" />
        </linearGradient>
        <linearGradient id="gradient-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(222 47% 14%)" />
          <stop offset="100%" stopColor="hsl(222 47% 8%)" />
        </linearGradient>
        <linearGradient id="gradient-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(217 100% 50%)" />
          <stop offset="50%" stopColor="hsl(180 100% 50%)" />
          <stop offset="100%" stopColor="hsl(217 100% 50%)" />
        </linearGradient>
        <radialGradient id="gradient-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(222 47% 20%)" />
          <stop offset="100%" stopColor="hsl(222 47% 10%)" />
        </radialGradient>
      </defs>
    </svg>
  );
}
