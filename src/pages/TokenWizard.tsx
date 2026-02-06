import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { 
  Coins, 
  ArrowRight, 
  ArrowLeft,
  Check,
  AlertTriangle,
  Sparkles,
  Rocket,
  Image as ImageIcon,
  FileText,
  Users
} from "lucide-react";
import { toast } from "sonner";

type Platform = "clanker" | "streme" | "flaunch";
type Step = "platform" | "details" | "distribution" | "review";

interface TokenConfig {
  platform: Platform | null;
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  totalSupply: string;
  twitter: string;
  telegram: string;
  website: string;
}

const platforms = [
  {
    id: "clanker" as Platform,
    name: "Clanker.world",
    description: "Launch tokens directly on Base with community-focused features",
    icon: "🤖",
    features: ["Instant launch", "Auto liquidity", "Community tools"],
    gradient: "from-primary to-accent"
  },
  {
    id: "streme" as Platform,
    name: "Streme.fun",
    description: "Stream-powered token launches with social integration",
    icon: "🌊",
    features: ["Streaming launch", "Social hooks", "Viral mechanics"],
    gradient: "from-accent to-success"
  },
  {
    id: "flaunch" as Platform,
    name: "Flaunch.gg",
    description: "Fair launch platform with anti-snipe protection",
    icon: "🚀",
    features: ["Fair launch", "Anti-snipe", "Bonding curve"],
    gradient: "from-success to-warning"
  }
];

const ecosystemRecipients = [
  { name: "Base Blockchain Founder", address: "0x...base", percentage: "0.1%" },
  { name: "Baseapp Founder", address: "0x...baseapp", percentage: "0.1%" },
  { name: "Zora Founder", address: "0x...zora", percentage: "0.1%" },
  { name: "Farcaster Founder", address: "0x...farcaster", percentage: "0.1%" },
  { name: "haku85.base.eth", address: "0x...haku", percentage: "0.1%" },
];

export default function TokenWizard() {
  const [isConnected] = useState(true);
  const [walletAddress] = useState("0x4E26fc6eb05a1CDbD762609fDE9958e5b8CC754d");
  const [currentStep, setCurrentStep] = useState<Step>("platform");
  const [config, setConfig] = useState<TokenConfig>({
    platform: null,
    name: "",
    symbol: "",
    description: "",
    imageUrl: "",
    totalSupply: "1000000000",
    twitter: "",
    telegram: "",
    website: ""
  });

  const steps: Step[] = ["platform", "details", "distribution", "review"];
  const stepIndex = steps.indexOf(currentStep);

  const nextStep = () => {
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1]);
    }
  };

  const prevStep = () => {
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1]);
    }
  };

  const handleLaunch = () => {
    toast.success("Token creation initiated!", {
      description: "Please approve the transaction in your wallet"
    });
  };

  const renderPlatformStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Choose Launch Platform</h2>
        <p className="text-muted-foreground">Select where you want to launch your token</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => setConfig({ ...config, platform: platform.id })}
            className={`glass-card p-6 text-left transition-all hover:scale-[1.02] ${
              config.platform === platform.id 
                ? "border-primary shadow-[0_0_30px_hsl(217_100%_50%/0.3)]" 
                : "hover:border-primary/50"
            }`}
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center text-2xl mb-4`}>
              {platform.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{platform.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{platform.description}</p>
            <div className="space-y-2">
              {platform.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            {config.platform === platform.id && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <span className="text-xs text-primary font-medium">✓ Selected</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Token Details</h2>
        <p className="text-muted-foreground">Configure your token's identity</p>
      </div>

      <div className="glass-card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Token Name *</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              placeholder="e.g. Super Token"
              className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Symbol *</label>
            <input
              type="text"
              value={config.symbol}
              onChange={(e) => setConfig({ ...config, symbol: e.target.value.toUpperCase() })}
              placeholder="e.g. SUPER"
              maxLength={8}
              className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={config.description}
            onChange={(e) => setConfig({ ...config, description: e.target.value })}
            placeholder="Describe your token's purpose and vision..."
            rows={3}
            className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary/50 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Total Supply</label>
          <input
            type="text"
            value={config.totalSupply}
            onChange={(e) => setConfig({ ...config, totalSupply: e.target.value.replace(/\D/g, '') })}
            placeholder="1000000000"
            className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Token Image URL</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={config.imageUrl}
              onChange={(e) => setConfig({ ...config, imageUrl: e.target.value })}
              placeholder="https://..."
              className="flex-1 bg-secondary/50 border border-border/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary/50"
            />
            <Button variant="glass">
              <ImageIcon className="w-4 h-4" />
              Generate
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          <label className="block text-sm font-medium mb-4">Social Links (Optional)</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={config.twitter}
              onChange={(e) => setConfig({ ...config, twitter: e.target.value })}
              placeholder="Twitter URL"
              className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary/50"
            />
            <input
              type="text"
              value={config.telegram}
              onChange={(e) => setConfig({ ...config, telegram: e.target.value })}
              placeholder="Telegram URL"
              className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary/50"
            />
            <input
              type="text"
              value={config.website}
              onChange={(e) => setConfig({ ...config, website: e.target.value })}
              placeholder="Website URL"
              className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDistributionStep = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Token Distribution</h2>
        <p className="text-muted-foreground">Review automatic ecosystem distribution</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Ecosystem Distribution (0.5% Total)</h3>
        </div>

        <div className="space-y-3">
          {ecosystemRecipients.map((recipient) => (
            <div 
              key={recipient.name}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
            >
              <div>
                <p className="font-medium">{recipient.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{recipient.address}</p>
              </div>
              <span className="text-primary font-semibold">{recipient.percentage}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning mb-1">Platform Fee</p>
              <p className="text-muted-foreground">
                A fee of <span className="text-foreground font-medium">$0.10 USD worth of ETH</span> will be charged 
                and sent to the SPAT Agent treasury.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Review & Launch</h2>
        <p className="text-muted-foreground">Confirm your token configuration</p>
      </div>

      <div className="glass-card p-6 space-y-6">
        {/* Platform */}
        <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
          <span className="text-muted-foreground">Platform</span>
          <span className="font-medium">{platforms.find(p => p.id === config.platform)?.name}</span>
        </div>

        {/* Token Info */}
        <div className="p-4 bg-secondary/30 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{config.name || "Not set"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Symbol</span>
            <span className="font-medium">${config.symbol || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Supply</span>
            <span className="font-medium">{Number(config.totalSupply).toLocaleString()}</span>
          </div>
        </div>

        {/* Fees Summary */}
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Fees & Costs
          </h4>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Platform Fee</span>
            <span>$0.10 in ETH</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ecosystem Distribution</span>
            <span>0.5% of tokens</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">$SPAT Cost</span>
            <span className="text-primary font-medium">50,000 $SPAT</span>
          </div>
        </div>
      </div>

      <Button variant="gradient" size="lg" className="w-full" onClick={handleLaunch}>
        <Rocket className="w-5 h-5" />
        Launch Token
        <Sparkles className="w-5 h-5" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isConnected={isConnected}
        walletAddress={walletAddress}
        onConnectWallet={() => {}}
      />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  index <= stepIndex 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {index < stepIndex ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 md:w-24 h-1 mx-2 rounded transition-all ${
                    index < stepIndex ? "bg-primary" : "bg-secondary"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Platform</span>
            <span>Details</span>
            <span>Distribution</span>
            <span>Review</span>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === "platform" && renderPlatformStep()}
        {currentStep === "details" && renderDetailsStep()}
        {currentStep === "distribution" && renderDistributionStep()}
        {currentStep === "review" && renderReviewStep()}

        {/* Navigation */}
        <div className="flex justify-between max-w-2xl mx-auto mt-8">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={stepIndex === 0}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          {currentStep !== "review" && (
            <Button 
              variant="glow" 
              onClick={nextStep}
              disabled={currentStep === "platform" && !config.platform}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
