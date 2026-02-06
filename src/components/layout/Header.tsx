import { Button } from "@/components/ui/button";
import { AgentIcon } from "@/components/icons/AgentIcon";
import { Wallet, Menu, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  isConnected: boolean;
  walletAddress?: string;
  onConnectWallet: () => void;
}

export function Header({ isConnected, walletAddress, onConnectWallet }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <AgentIcon animated />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-gradient">SPAT Agent</span>
            <span className="text-xs text-muted-foreground">Base Network AI</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </a>
        </nav>

        {/* Wallet Button */}
        <div className="flex items-center gap-3">
          <Button
            variant={isConnected ? "glass" : "glow"}
            onClick={onConnectWallet}
            className="hidden sm:flex"
          >
            <Wallet className="w-4 h-4" />
            {isConnected ? truncateAddress(walletAddress!) : "Connect Wallet"}
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </a>
            <Button
              variant={isConnected ? "glass" : "glow"}
              onClick={onConnectWallet}
              className="w-full sm:hidden"
            >
              <Wallet className="w-4 h-4" />
              {isConnected ? truncateAddress(walletAddress!) : "Connect Wallet"}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
