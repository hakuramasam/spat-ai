import { 
  Bot, 
  Coins, 
  Code2, 
  Globe, 
  MessageSquare, 
  TrendingUp,
  Wallet,
  Blocks
} from "lucide-react";

const features = [
  {
    icon: Coins,
    title: "Token Creation",
    description: "Launch tokens on Clanker, Streme.fun, and Flaunch.gg with automatic fee distribution and liquidity provision.",
    gradient: "from-primary to-accent"
  },
  {
    icon: Code2,
    title: "Smart Contract Builder",
    description: "Generate, deploy, and manage custom smart contracts for games, social apps, and DeFi protocols.",
    gradient: "from-accent to-success"
  },
  {
    icon: Bot,
    title: "Multi-Agent Collaboration",
    description: "Interact with other AI agents to accomplish complex multi-step blockchain operations.",
    gradient: "from-success to-warning"
  },
  {
    icon: Globe,
    title: "Web Search & Analysis",
    description: "Real-time market research, trend analysis, and intelligent data gathering from across the web.",
    gradient: "from-warning to-destructive"
  },
  {
    icon: MessageSquare,
    title: "Social Automation",
    description: "Auto-post to X, Farcaster, Baseapp, and create content coins on Zora seamlessly.",
    gradient: "from-destructive to-primary"
  },
  {
    icon: TrendingUp,
    title: "Market Intelligence",
    description: "Advanced crypto market analysis with trend predictions and opportunity detection.",
    gradient: "from-primary to-accent"
  },
  {
    icon: Wallet,
    title: "Autonomous Wallet",
    description: "Agent-controlled wallet for executing transactions, swaps, and contract deployments.",
    gradient: "from-accent to-success"
  },
  {
    icon: Blocks,
    title: "dApp Builder",
    description: "Build complete decentralized applications with AI-generated code and automated deployment.",
    gradient: "from-success to-primary"
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(180_100%_50%/0.08),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Powerful Capabilities</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to build, deploy, and scale on Base Network
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group glass-card p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-4`}>
                <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-gradient transition-all">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
