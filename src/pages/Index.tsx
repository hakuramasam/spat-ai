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

const Index = () => {
  const { address, isConnected, connectors, connect, disconnect } = useWallet();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

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
    toast.success("$SPAT Approved!", { description: "You can now use SPAT Agent" });
  };

  const handleLaunchAgent = () => {
    if (!isConnected) {
      setIsWalletModalOpen(true);
      toast.info("Please connect your wallet first");
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
        amount="500,000"
        action="Initial Agent Access"
      />
    </div>
  );
};

export default Index;
