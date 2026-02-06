import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { ChatInterface } from "@/components/agent/ChatInterface";
import { WalletModal } from "@/components/agent/WalletModal";
import { TokenApprovalModal } from "@/components/agent/TokenApprovalModal";
import { toast } from "sonner";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const handleConnectWallet = () => {
    if (isConnected) {
      // Disconnect
      setIsConnected(false);
      setWalletAddress(undefined);
      toast.success("Wallet disconnected");
    } else {
      setIsWalletModalOpen(true);
    }
  };

  const handleWalletConnect = (walletType: string) => {
    // Simulate wallet connection
    const mockAddress = "0x4E26fc6eb05a1CDbD762609fDE9958e5b8CC754d";
    setWalletAddress(mockAddress);
    setIsConnected(true);
    setIsWalletModalOpen(false);
    
    toast.success(`Connected with ${walletType}`, {
      description: `Address: ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`
    });

    // Show approval modal for initial 500K SPAT
    setTimeout(() => {
      setIsApprovalModalOpen(true);
    }, 1000);
  };

  const handleApprove = () => {
    setIsApprovalModalOpen(false);
    toast.success("$SPAT Approved!", {
      description: "You can now use SPAT Agent"
    });
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
        walletAddress={walletAddress}
        onConnectWallet={handleConnectWallet}
      />
      
      <main>
        <HeroSection onLaunchAgent={handleLaunchAgent} />
        <FeaturesSection />
        <PricingSection />
      </main>

      <FooterSection />

      {/* Modals */}
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
