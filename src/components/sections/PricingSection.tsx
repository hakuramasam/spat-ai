import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    cost: "500,000 $SPAT",
    description: "Begin your journey with SPAT Agent",
    features: [
      "Unlock agent access",
      "Basic chat functionality (free)",
      "Simple token creation",
      "Web search queries",
      "Market analysis basics"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Builder",
    cost: "Per Action",
    description: "Scale your blockchain operations",
    features: [
      "All Starter features",
      "Smart contract deployment",
      "Multi-chain operations",
      "Social media automation",
      "Advanced market analytics",
      "Custom code generation"
    ],
    cta: "Launch Agent",
    popular: true
  },
  {
    name: "Enterprise",
    cost: "Custom",
    description: "Full autonomous capabilities",
    features: [
      "All Builder features",
      "Multi-agent orchestration",
      "White-label solutions",
      "Priority execution",
      "Dedicated support",
      "Custom integrations"
    ],
    cta: "Contact Us",
    popular: false
  }
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(217_100%_50%/0.1),transparent_60%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">$SPAT Powered</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            All actions are powered by $SPAT tokens. Chatting is always free.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
            <span className="text-xs font-mono text-muted-foreground">
              $SPAT: 0x7f18bdbe376b3b0648ad75da2fcc52f8c107bcdf
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative glass-card p-8 ${
                tier.popular 
                  ? 'border-primary/50 shadow-[0_0_40px_hsl(217_100%_50%/0.2)]' 
                  : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-xs font-semibold">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-gradient mb-2">{tier.cost}</div>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={tier.popular ? "gradient" : "outline"} 
                className="w-full"
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Fee Info */}
        <div className="mt-16 glass-card p-6 max-w-3xl mx-auto">
          <h4 className="font-semibold mb-4 text-center">Token Creation Fees</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <p className="text-muted-foreground mb-2">Platform Fee</p>
              <p className="font-mono text-foreground">$0.10 USD in ETH per token</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <p className="text-muted-foreground mb-2">Ecosystem Distribution</p>
              <p className="font-mono text-foreground">0.5% of created tokens</p>
              <p className="text-xs text-muted-foreground mt-1">
                Split between Base, Baseapp, Zora, Farcaster founders & haku85.base.eth
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
