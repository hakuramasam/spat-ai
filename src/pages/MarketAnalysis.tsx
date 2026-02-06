import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  Globe,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  Clock,
  Users
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from "recharts";

const priceData = [
  { time: "00:00", eth: 3650, spat: 0.0098 },
  { time: "04:00", eth: 3680, spat: 0.0102 },
  { time: "08:00", eth: 3720, spat: 0.0105 },
  { time: "12:00", eth: 3695, spat: 0.0103 },
  { time: "16:00", eth: 3750, spat: 0.0108 },
  { time: "20:00", eth: 3780, spat: 0.0112 },
  { time: "Now", eth: 3810, spat: 0.0115 },
];

const topTokens = [
  { name: "$BRETT", price: "$0.142", change: "+28.5%", isPositive: true, mcap: "$1.2B" },
  { name: "$DEGEN", price: "$0.0089", change: "+15.2%", isPositive: true, mcap: "$89M" },
  { name: "$HIGHER", price: "$0.0034", change: "-5.8%", isPositive: false, mcap: "$34M" },
  { name: "$TYBG", price: "$0.0012", change: "+45.3%", isPositive: true, mcap: "$12M" },
  { name: "$AERO", price: "$1.45", change: "+8.9%", isPositive: true, mcap: "$450M" },
];

const networkStats = [
  { label: "TVL", value: "$7.2B", change: "+12%", icon: BarChart3 },
  { label: "24h Volume", value: "$892M", change: "+8%", icon: Activity },
  { label: "Active Users", value: "892K", change: "+15%", icon: Users },
  { label: "Transactions", value: "4.2M", change: "+5%", icon: Zap },
];

const defiAllocation = [
  { name: "DEXs", value: 45, color: "hsl(217, 100%, 50%)" },
  { name: "Lending", value: 25, color: "hsl(180, 100%, 50%)" },
  { name: "Bridges", value: 15, color: "hsl(142, 76%, 45%)" },
  { name: "NFTs", value: 10, color: "hsl(38, 92%, 50%)" },
  { name: "Other", value: 5, color: "hsl(222, 47%, 30%)" },
];

const trendingTopics = [
  { topic: "Layer 2 Adoption", sentiment: "Bullish", score: 92 },
  { topic: "Farcaster Growth", sentiment: "Bullish", score: 88 },
  { topic: "Meme Coin Season", sentiment: "Neutral", score: 65 },
  { topic: "NFT Market", sentiment: "Bearish", score: 35 },
  { topic: "DeFi Yields", sentiment: "Bullish", score: 78 },
];

export default function MarketAnalysis() {
  const [isConnected] = useState(true);
  const [walletAddress] = useState("0x4E26fc6eb05a1CDbD762609fDE9958e5b8CC754d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("24h");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
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
            <h1 className="text-3xl font-bold text-gradient mb-2">Market Analysis</h1>
            <p className="text-muted-foreground">Real-time crypto market intelligence on Base Network</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-secondary/50 rounded-lg p-1">
              {(["24h", "7d", "30d"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    timeframe === t 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <Button variant="glass" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {networkStats.map((stat) => (
            <div key={stat.label} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-sm text-success">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Price Chart */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">ETH Price</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-gradient">$3,810</span>
                  <span className="flex items-center gap-1 text-success text-sm">
                    <TrendingUp className="w-4 h-4" />
                    +4.38%
                  </span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={priceData}>
                <defs>
                  <linearGradient id="ethGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217, 100%, 50%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(217, 100%, 50%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 18%)" />
                <XAxis dataKey="time" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} domain={['dataMin - 50', 'dataMax + 50']} />
                <Tooltip 
                  contentStyle={{ 
                    background: "hsl(222, 47%, 10%)", 
                    border: "1px solid hsl(222, 47%, 18%)",
                    borderRadius: "8px"
                  }}
                />
                <Area type="monotone" dataKey="eth" stroke="hsl(217, 100%, 50%)" fill="url(#ethGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* DeFi Allocation */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold mb-6">DeFi Allocation</h2>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPie>
                <Pie
                  data={defiAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {defiAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: "hsl(222, 47%, 10%)", 
                    border: "1px solid hsl(222, 47%, 18%)",
                    borderRadius: "8px"
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {defiAllocation.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Tokens */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Trending on Base</h2>
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {topTokens.map((token, index) => (
                <div 
                  key={token.name}
                  className="flex items-center gap-4 p-3 bg-secondary/30 hover:bg-secondary/50 rounded-lg transition-colors"
                >
                  <span className="w-6 text-center text-muted-foreground font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{token.name}</span>
                      <span className="text-xs text-muted-foreground">MCap: {token.mcap}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{token.price}</span>
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-medium ${
                    token.isPositive ? "text-success" : "text-destructive"
                  }`}>
                    {token.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {token.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Market Sentiment</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Updated 5m ago
              </div>
            </div>
            <div className="space-y-4">
              {trendingTopics.map((item) => (
                <div key={item.topic} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.topic}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.sentiment === "Bullish" 
                        ? "bg-success/20 text-success"
                        : item.sentiment === "Bearish"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-warning/20 text-warning"
                    }`}>
                      {item.sentiment}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        item.score >= 70 
                          ? "bg-gradient-to-r from-success to-accent"
                          : item.score >= 40
                          ? "bg-gradient-to-r from-warning to-accent"
                          : "bg-gradient-to-r from-destructive to-warning"
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-primary" />
                <span className="font-medium">AI Analysis</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Base Network showing strong momentum with increasing TVL and user adoption. 
                Social tokens and meme coins gaining traction on Farcaster.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
