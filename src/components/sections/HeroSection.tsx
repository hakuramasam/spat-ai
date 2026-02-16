import { Button } from "@/components/ui/button";
import { AgentIcon } from "@/components/icons/AgentIcon";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";

interface HeroSectionProps {
  onLaunchAgent: () => void;
}

export function HeroSection({ onLaunchAgent }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(217_100%_50%/0.15),transparent_70%)]" />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--border) / 0.2) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.2) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-[80px] animate-float" style={{ animationDelay: '-3s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">Powered by Base Network</span>
          </div>

          {/* Agent Icon */}
          <div className="w-32 h-32 md:w-40 md:h-40 mb-8 animate-float">
            <AgentIcon animated />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-gradient">SPAT Agent</span>
            <br />
            <span className="text-foreground">Autonomous AI for</span>
            <br />
            <span className="text-gradient-accent">Web3 Building</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            An autonomous Base AI agent with its own execution wallet for transactions,
            token operations, and blockchain workflows you define. Access requires
            1,000,000+ $SPAT in your connected wallet.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button variant="gradient" size="xl" onClick={onLaunchAgent}>
              <Sparkles className="w-5 h-5" />
              Launch Agent
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl">
              View Documentation
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 md:gap-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-accent" />
                <span className="text-2xl md:text-3xl font-bold text-foreground">500K+</span>
              </div>
              <span className="text-sm text-muted-foreground">Tasks Completed</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-2xl md:text-3xl font-bold text-foreground">1,000+</span>
              </div>
              <span className="text-sm text-muted-foreground">Tokens Created</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-success" />
                <span className="text-2xl md:text-3xl font-bold text-foreground">$2M+</span>
              </div>
              <span className="text-sm text-muted-foreground">TVL Generated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
