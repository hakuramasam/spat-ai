import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import {
  Send,
  Globe,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Hash,
  Clock,
  CheckCircle,
  Loader2,
  Sparkles,
  ArrowUpRight,
  Coins,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Platform = "x" | "farcaster" | "zora" | "baseapp";

interface PostDraft {
  content: string;
  platforms: Platform[];
  mediaUrl: string;
  scheduledAt: string;
  isContentCoin: boolean;
  contentCoinName: string;
}

const platformConfig: Record<Platform, { name: string; icon: string; color: string; costSPAT: number }> = {
  x: { name: "X (Twitter)", icon: "𝕏", color: "hsl(var(--foreground))", costSPAT: 25000 },
  farcaster: { name: "Farcaster", icon: "🟣", color: "hsl(280 100% 60%)", costSPAT: 15000 },
  zora: { name: "Zora", icon: "✦", color: "hsl(var(--success))", costSPAT: 30000 },
  baseapp: { name: "Baseapp", icon: "🔵", color: "hsl(var(--primary))", costSPAT: 10000 },
};

const recentPosts = [
  { id: "1", platform: "x" as Platform, content: "Just deployed a new token on Base! 🚀", status: "posted", timestamp: "10m ago", engagement: "142 likes" },
  { id: "2", platform: "farcaster" as Platform, content: "Building the future of social tokens on @base", status: "posted", timestamp: "1h ago", engagement: "89 recasts" },
  { id: "3", platform: "zora" as Platform, content: "New content coin minted ✦", status: "posted", timestamp: "3h ago", engagement: "0.5 ETH earned" },
  { id: "4", platform: "x" as Platform, content: "Market analysis thread incoming...", status: "scheduled", timestamp: "In 2h", engagement: "—" },
];

export default function SocialHub() {
  const [isConnected] = useState(true);
  const [walletAddress] = useState("0x4E26fc6eb05a1CDbD762609fDE9958e5b8CC754d");
  const [draft, setDraft] = useState<PostDraft>({
    content: "",
    platforms: [],
    mediaUrl: "",
    scheduledAt: "",
    isContentCoin: false,
    contentCoinName: "",
  });
  const [isPosting, setIsPosting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const togglePlatform = (p: Platform) => {
    setDraft(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter(x => x !== p)
        : [...prev.platforms, p],
    }));
  };

  const totalCost = draft.platforms.reduce((sum, p) => sum + platformConfig[p].costSPAT, 0);

  const handlePost = async () => {
    if (!draft.content.trim() || draft.platforms.length === 0) {
      toast.error("Please write content and select at least one platform");
      return;
    }
    setIsPosting(true);
    try {
      const { data, error } = await supabase.functions.invoke("social-post", {
        body: {
          action: "post",
          platforms: draft.platforms,
          content: draft.content,
          contentCoinName: draft.contentCoinName,
        },
      });
      if (error) throw error;
      
      const results = data?.results || {};
      const successes = Object.entries(results).filter(([, r]: any) => r.success);
      const failures = Object.entries(results).filter(([, r]: any) => !r.success);
      
      if (successes.length > 0) {
        toast.success(`Posted to ${successes.map(([p]) => p).join(", ")}!`);
      }
      failures.forEach(([platform, result]: any) => {
        toast.info(`${platform}: ${result.message}`);
      });
      
      setDraft({ content: "", platforms: [], mediaUrl: "", scheduledAt: "", isContentCoin: false, contentCoinName: "" });
    } catch (e) {
      toast.error("Failed to post");
    } finally {
      setIsPosting(false);
    }
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("social-post", {
        body: {
          action: "generate",
          content: draft.content || "Generate an engaging post about the Base Network ecosystem and $SPAT token",
        },
      });
      if (error) throw error;
      setDraft(prev => ({ ...prev, content: data?.content || prev.content }));
      toast.success("AI-generated content ready!");
    } catch (e) {
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={isConnected} walletAddress={walletAddress} onConnectWallet={() => {}} />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Social Hub</h1>
          <p className="text-muted-foreground">Cross-platform social posting with AI assistance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compose */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-4">Compose Post</h2>

              {/* Platform Selector */}
              <div className="flex flex-wrap gap-3 mb-4">
                {(Object.entries(platformConfig) as [Platform, typeof platformConfig[Platform]][]).map(([id, cfg]) => (
                  <button
                    key={id}
                    onClick={() => togglePlatform(id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                      draft.platforms.includes(id)
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-secondary/30 border-border/50 text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <span>{cfg.icon}</span>
                    {cfg.name}
                  </button>
                ))}
              </div>

              {/* Content */}
              <textarea
                value={draft.content}
                onChange={(e) => setDraft(prev => ({ ...prev, content: e.target.value }))}
                placeholder="What's on your mind? Write or let AI generate..."
                rows={5}
                className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors resize-none mb-4"
              />

              {/* Zora Content Coin Option */}
              {draft.platforms.includes("zora") && (
                <div className="p-4 bg-success/10 border border-success/30 rounded-xl mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.isContentCoin}
                      onChange={(e) => setDraft(prev => ({ ...prev, isContentCoin: e.target.checked }))}
                      className="w-4 h-4 rounded border-border accent-success"
                    />
                    <span className="text-sm font-medium">Create as Content Coin on Zora</span>
                  </label>
                  {draft.isContentCoin && (
                    <input
                      type="text"
                      value={draft.contentCoinName}
                      onChange={(e) => setDraft(prev => ({ ...prev, contentCoinName: e.target.value }))}
                      placeholder="Content coin name..."
                      className="mt-3 w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-success/50"
                    />
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon"><ImageIcon className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon"><Video className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon"><Hash className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon"><Clock className="w-4 h-4" /></Button>
                  <Button variant="glass" size="sm" onClick={handleAIGenerate} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    AI Generate
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  {totalCost > 0 && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      {totalCost.toLocaleString()} $SPAT
                    </span>
                  )}
                  <Button variant="glow" onClick={handlePost} disabled={isPosting || !draft.content.trim()}>
                    {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold mb-4">Recent Posts</h2>
            <div className="space-y-3">
              {recentPosts.map(post => (
                <div key={post.id} className="p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{platformConfig[post.platform].icon}</span>
                    <span className="text-xs text-muted-foreground">{platformConfig[post.platform].name}</span>
                    <span className="ml-auto">
                      {post.status === "posted" ? (
                        <CheckCircle className="w-3 h-3 text-success" />
                      ) : (
                        <Clock className="w-3 h-3 text-warning" />
                      )}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2 mb-2">{post.content}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.timestamp}</span>
                    <span>{post.engagement}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
