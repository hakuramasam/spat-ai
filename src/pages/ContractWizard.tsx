import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import {
  Code,
  Shield,
  Rocket,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  FileCode,
  Sparkles,
  Loader2,
  Coins,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

type ContractType = "erc20" | "erc721" | "erc1155" | "custom" | "defi" | "gaming";
type WizardStep = "type" | "configure" | "code" | "deploy";

interface ContractConfig {
  type: ContractType | null;
  name: string;
  description: string;
  features: string[];
  customPrompt: string;
}

const contractTypes = [
  { id: "erc20" as ContractType, name: "ERC-20 Token", icon: "🪙", desc: "Fungible token with custom logic", cost: 100000, features: ["Mintable", "Burnable", "Pausable", "Capped Supply"] },
  { id: "erc721" as ContractType, name: "ERC-721 NFT", icon: "🎨", desc: "Non-fungible token collection", cost: 150000, features: ["Auto-increment IDs", "URI Storage", "Royalties", "Enumerable"] },
  { id: "erc1155" as ContractType, name: "ERC-1155 Multi", icon: "📦", desc: "Multi-token standard", cost: 150000, features: ["Batch Transfer", "URI per Token", "Supply Tracking", "Burnable"] },
  { id: "defi" as ContractType, name: "DeFi Protocol", icon: "💰", desc: "Staking, vaults, or AMM contracts", cost: 250000, features: ["Staking", "Yield Vault", "Liquidity Pool", "Flash Loans"] },
  { id: "gaming" as ContractType, name: "Gaming Contract", icon: "🎮", desc: "On-chain game mechanics", cost: 200000, features: ["Player Registry", "Loot System", "Leaderboard", "Rewards"] },
  { id: "custom" as ContractType, name: "Custom Contract", icon: "⚡", desc: "AI-generated from your description", cost: 300000, features: ["Any Logic", "AI Optimized", "Gas Efficient", "Audited"] },
];

const sampleSolidity = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;

    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {
        _mint(initialOwner, MAX_SUPPLY);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
}`;

export default function ContractWizard() {
  const [isConnected] = useState(true);
  const [walletAddress] = useState("0x4E26fc6eb05a1CDbD762609fDE9958e5b8CC754d");
  const [step, setStep] = useState<WizardStep>("type");
  const [config, setConfig] = useState<ContractConfig>({
    type: null,
    name: "",
    description: "",
    features: [],
    customPrompt: "",
  });
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const steps: WizardStep[] = ["type", "configure", "code", "deploy"];
  const stepIndex = steps.indexOf(step);
  const selectedType = contractTypes.find(c => c.id === config.type);

  const toggleFeature = (feature: string) => {
    setConfig(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedCode(sampleSolidity);
      setIsGenerating(false);
      setStep("code");
      toast.success("Smart contract generated!");
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
    toast.success("Code copied to clipboard");
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      toast.success("Contract deployed!", { description: "View on BaseScan" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={isConnected} walletAddress={walletAddress} onConnectWallet={() => {}} />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Smart Contract Wizard</h1>
          <p className="text-muted-foreground">AI-powered Solidity code generation and deployment</p>
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  i <= stepIndex ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>
                  {i < stepIndex ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-16 md:w-24 h-1 mx-2 rounded ${i < stepIndex ? "bg-primary" : "bg-secondary"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Type</span><span>Configure</span><span>Code</span><span>Deploy</span>
          </div>
        </div>

        {/* Step: Type */}
        {step === "type" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {contractTypes.map(ct => (
              <button
                key={ct.id}
                onClick={() => setConfig(prev => ({ ...prev, type: ct.id }))}
                className={`glass-card p-6 text-left transition-all hover:scale-[1.02] ${
                  config.type === ct.id ? "border-primary shadow-[0_0_30px_hsl(217_100%_50%/0.3)]" : "hover:border-primary/50"
                }`}
              >
                <span className="text-3xl mb-3 block">{ct.icon}</span>
                <h3 className="font-semibold mb-1">{ct.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{ct.desc}</p>
                <div className="flex items-center gap-1 text-xs text-primary">
                  <Coins className="w-3 h-3" />
                  {ct.cost.toLocaleString()} $SPAT
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step: Configure */}
        {step === "configure" && selectedType && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="glass-card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Contract Name</label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. MyToken"
                  className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={config.description}
                  onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what your contract should do..."
                  rows={3}
                  className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-3">Features</label>
                <div className="flex flex-wrap gap-2">
                  {selectedType.features.map(f => (
                    <button
                      key={f}
                      onClick={() => toggleFeature(f)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                        config.features.includes(f)
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-secondary/30 border-border/50 text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {config.type === "custom" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Custom Requirements</label>
                  <textarea
                    value={config.customPrompt}
                    onChange={(e) => setConfig(prev => ({ ...prev, customPrompt: e.target.value }))}
                    placeholder="Describe your custom contract logic in detail..."
                    rows={4}
                    className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary/50 resize-none"
                  />
                </div>
              )}
            </div>

            <Button variant="gradient" className="w-full" size="lg" onClick={handleGenerate} disabled={isGenerating || !config.name}>
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isGenerating ? "Generating Solidity..." : "Generate Smart Contract"}
            </Button>
          </div>
        )}

        {/* Step: Code */}
        {step === "code" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="glass-card overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{config.name || "Contract"}.sol</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {codeCopied ? "Copied" : "Copy"}
                </Button>
              </div>
              <pre className="p-6 overflow-x-auto text-sm font-mono text-foreground/90 bg-background/50">
                <code>{generatedCode}</code>
              </pre>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">Security Analysis</span>
              </div>
              <p className="text-sm text-muted-foreground">No critical vulnerabilities detected. Uses OpenZeppelin audited contracts. Gas-optimized for Base Network.</p>
            </div>
          </div>
        )}

        {/* Step: Deploy */}
        {step === "deploy" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <span className="text-muted-foreground">Contract</span>
                <span className="font-medium">{config.name || "Contract"}.sol</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <span className="text-muted-foreground">Network</span>
                <span className="font-medium">Base Mainnet</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <span className="text-muted-foreground">Estimated Gas</span>
                <span className="font-medium">~0.002 ETH</span>
              </div>
              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">$SPAT Cost</span>
                  <span className="text-primary font-bold">{(selectedType?.cost || 0).toLocaleString()} $SPAT</span>
                </div>
              </div>

              <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Deploying to Base Mainnet is permanent. Please review your contract code carefully before proceeding.
                </p>
              </div>
            </div>

            <Button variant="gradient" size="lg" className="w-full" onClick={handleDeploy} disabled={isDeploying}>
              {isDeploying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
              {isDeploying ? "Deploying to Base..." : "Deploy Contract"}
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between max-w-2xl mx-auto mt-8">
          <Button variant="outline" onClick={() => setStep(steps[stepIndex - 1])} disabled={stepIndex === 0}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          {step !== "deploy" && step !== "code" && (
            <Button
              variant="glow"
              onClick={() => step === "type" ? setStep("configure") : handleGenerate()}
              disabled={step === "type" && !config.type}
            >
              {step === "configure" ? "Generate" : "Continue"} <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          {step === "code" && (
            <Button variant="glow" onClick={() => setStep("deploy")}>
              Deploy <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
