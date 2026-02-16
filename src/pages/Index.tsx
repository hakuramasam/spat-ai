import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { ChatInterface } from "@/components/agent/ChatInterface";
import { WalletModal } from "@/components/agent/WalletModal";
import { TokenApprovalModal } from "@/components/agent/TokenApprovalModal";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";
import { parseUnits } from "viem";

const MINIMUM_SPAT_HOLDING = parseUnits("1000000", 18);

const Index = () => {
  const { address, isConnected, connectors, connect, disconnect, spatBalance } = useWallet();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const hasMinimumSPAT = !!spatBalance && spatBalance >= MINIMUM_SPAT_HOLDING;

  const handleConnectWallet = () => {
    if (isConnected) {
      disconnect();
      toast.success("Wallet disconnected");
    } else {
      setIsWalletModalOpen(true);
    }
  };

  const handleWalletConnect = (walletType: string) => {
    const connector = connectors.find(c => c.id === walletType) || connectors[0];
    if (connector) {
      connect({ connector });
      setIsWalletModalOpen(false);
      toast.success(`Connecting with ${connector.name}...`);
      setTimeout(() => setIsApprovalModalOpen(true), 1500);
    }
  };

  const handleApprove = () => {
    setIsApprovalModalOpen(false);
    toast.success("$SPAT Approved!", { description: "You can now run autonomous SPAT workflows" });
  };

  const handleLaunchAgent = () => {
    if (!isConnected) {
      setIsWalletModalOpen(true);
      toast.info("Please connect your wallet first");
    } else if (!hasMinimumSPAT) {
      toast.error("Insufficient $SPAT balance", {
        description: "SPAT Agent access requires at least 1,000,000 $SPAT in your connected wallet.",
      });
    } else {
      setIsChatOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isConnected={isConnected}
        walletAddress={address}
        onConnectWallet={handleConnectWallet}
        hasMinimumSPAT={hasMinimumSPAT}
      />
      
      <main>
        <HeroSection onLaunchAgent={handleLaunchAgent} />
        <FeaturesSection />
        <PricingSection />
      </main>

      <FooterSection />

      <ChatInterface 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        isConnected={isConnected}
        onConnectWallet={handleConnectWallet}
        hasMinimumSPAT={hasMinimumSPAT}
      />
      
      <WalletModal 
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={handleWalletConnect}
      />

      <TokenApprovalModal 
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onApprove={handleApprove}
        amount="1,000,000"
        action="SPAT Agent Autonomous Task Access"
      />
    </div>
  );
};

export default Index;
