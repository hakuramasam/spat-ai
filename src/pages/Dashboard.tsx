import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw,
  Copy,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Coins,
  Activity
} from "lucide-react";
import { toast } from "sonner";

// Mock data for demonstration
const mockTransactions = [
  { id: "1", type: "in", amount: "1,000,000", token: "$SPAT", from: "0x742d...35Cb", timestamp: "2 min ago", status: "confirmed" },
  { id: "2", type: "out", amount: "50,000", token: "$SPAT", to: "0x8f3d...9a2E", timestamp: "15 min ago", status: "confirmed" },
  { id: "3", type: "out", amount: "0.05", token: "ETH", to: "Token Creation Fee", timestamp: "1 hour ago", status: "confirmed" },
  { id: "4", type: "in", amount: "500,000", token: "$SPAT", from: "0x1a2b...3c4d", timestamp: "3 hours ago", status: "confirmed" },
  { id: "5", type: "out", amount: "100,000", token: "$SPAT", to: "Smart Contract Deploy", timestamp: "1 day ago", status: "confirmed" },
];

const tokenStats = {
  spat: {
    balance: "2,450,000",
    usdValue: "$24,500",
    change24h: "+12.5%",
    isPositive: true
  },
  eth: {
    balance: "1.234",
    usdValue: "$4,567",
    change24h: "-2.3%",
    isPositive: false
  }
};

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(true);
  const [walletAddress] = useState("0x4E26fc6eb05a1CDbD762609fDE9958e5b8CC754d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Wallet data refreshed");
    }, 1500);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Address copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isConnected={isConnected}
        walletAddress={walletAddress}
        onConnectWallet={() => {}}
      />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Agent Dashboard</h1>
            <p className="text-muted-foreground">Monitor your SPAT Agent wallet and activity</p>
          </div>
          <Button variant="glass" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Wallet Info Card */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Agent Wallet Address</p>
              <div className="flex items-center gap-2">
                <code className="text-sm md:text-base font-mono text-foreground">
                  {walletAddress}
                </code>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyAddress}>
                  <Copy className="w-4 h-4" />
                </Button>
                <a 
                  href={`https://basescan.org/address/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/30 rounded-lg">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm">
              <span className="text-primary font-medium">Controller: </span>
              <span className="text-muted-foreground font-mono">0x4E26fc...e5b8CC754d</span>
            </span>
          </div>
        </div>

        {/* Token Balances */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* SPAT Token */}
          <div className="glass-card p-6 hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">$SPAT Token</h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    0x7f18...bcdf
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                tokenStats.spat.isPositive 
                  ? "bg-success/20 text-success" 
                  : "bg-destructive/20 text-destructive"
              }`}>
                {tokenStats.spat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {tokenStats.spat.change24h}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gradient">{tokenStats.spat.balance}</p>
              <p className="text-sm text-muted-foreground">≈ {tokenStats.spat.usdValue} USD</p>
            </div>
          </div>

          {/* ETH Balance */}
          <div className="glass-card p-6 hover:border-accent/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-success flex items-center justify-center">
                  <span className="text-xl">Ξ</span>
                </div>
                <div>
                  <h3 className="font-semibold">Ethereum</h3>
                  <p className="text-xs text-muted-foreground">Base Network</p>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                tokenStats.eth.isPositive 
                  ? "bg-success/20 text-success" 
                  : "bg-destructive/20 text-destructive"
              }`}>
                {tokenStats.eth.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {tokenStats.eth.change24h}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gradient-accent">{tokenStats.eth.balance} ETH</p>
              <p className="text-sm text-muted-foreground">≈ {tokenStats.eth.usdValue} USD</p>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Transaction History</h2>
            <Button variant="ghost" size="sm">
              View All
              <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-3">
            {mockTransactions.map((tx) => (
              <div 
                key={tx.id}
                className="flex items-center gap-4 p-4 bg-secondary/30 hover:bg-secondary/50 rounded-xl transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === "in" 
                    ? "bg-success/20 text-success" 
                    : "bg-primary/20 text-primary"
                }`}>
                  {tx.type === "in" ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {tx.type === "in" ? "Received" : "Sent"}
                    </span>
                    <span className={`font-bold ${tx.type === "in" ? "text-success" : "text-foreground"}`}>
                      {tx.type === "in" ? "+" : "-"}{tx.amount} {tx.token}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {tx.type === "in" ? `From: ${tx.from}` : `To: ${tx.to}`}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{tx.timestamp}</p>
                  <span className="text-xs text-success">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
