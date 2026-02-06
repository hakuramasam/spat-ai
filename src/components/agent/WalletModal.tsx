import { Button } from "@/components/ui/button";
import { X, Wallet, ExternalLink } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (wallet: string) => void;
}

const wallets = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    description: "Connect with MetaMask wallet"
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "🔵",
    description: "Connect with Coinbase Wallet"
  },
  {
    id: "rainbow",
    name: "Rainbow",
    icon: "🌈",
    description: "Connect with Rainbow wallet"
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "🔗",
    description: "Connect via WalletConnect"
  }
];

export function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Connect Wallet</h3>
              <p className="text-sm text-muted-foreground">Choose your preferred wallet</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Wallets */}
        <div className="space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => onConnect(wallet.id)}
              className="w-full flex items-center gap-4 p-4 bg-secondary/30 hover:bg-secondary/50 border border-border/50 hover:border-primary/30 rounded-xl transition-all duration-200 group"
            >
              <span className="text-3xl">{wallet.icon}</span>
              <div className="flex-1 text-left">
                <p className="font-medium group-hover:text-gradient transition-all">{wallet.name}</p>
                <p className="text-sm text-muted-foreground">{wallet.description}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>

        {/* Base Network Info */}
        <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Base Network</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Make sure your wallet is connected to Base Network (Chain ID: 8453)
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground mt-4">
          By connecting, you agree to the Terms of Service
        </p>
      </div>
    </div>
  );
}
