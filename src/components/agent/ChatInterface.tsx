import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AgentIcon } from "@/components/icons/AgentIcon";
import { Send, Loader2, Sparkles, Code, Coins, Globe, X } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  onConnectWallet: () => void;
  hasMinimumSPAT: boolean;
}

const quickActions = [
  { icon: Coins, label: "Create Token", prompt: "Help me create a new token on Base" },
  { icon: Code, label: "Deploy Contract", prompt: "I want to deploy a smart contract" },
  { icon: Globe, label: "Market Analysis", prompt: "Analyze the current crypto market trends" },
  { icon: Sparkles, label: "Build dApp", prompt: "Help me build a decentralized application" },
];

export function ChatInterface({ isOpen, onClose, isConnected, onConnectWallet, hasMinimumSPAT }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm SPAT Agent, your autonomous Base companion. I can execute transactions through my agent wallet, run token-based workflows, build web3 dApps, and coordinate tasks for channels like moltbook.com and openclaw.ai. What should we automate first?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        token: `I can help you create a token on Base Network! Here's what I'll do:

1. **Choose Platform**: Clanker, Streme.fun, or Flaunch.gg
2. **Configure Token**: Name, symbol, supply, and metadata
3. **Deploy**: Automatic deployment with fee distribution

**Fees:**
- $0.10 USD in ETH (platform fee)
- 0.5% tokens distributed to ecosystem founders

**$SPAT Cost**: 50,000 tokens for token creation

I can execute the Base transaction flow once your task policy is confirmed

Would you like to proceed? Please approve the $SPAT spend first.`,
        contract: `I'll help you deploy a smart contract! Here's my process:

1. **Analyze Requirements**: What should your contract do?
2. **Generate Code**: AI-powered Solidity generation
3. **Security Review**: Automated vulnerability scanning
4. **Deploy**: Gas-optimized deployment to Base

**$SPAT Cost**: 100,000 tokens for contract deployment

I can send deployment transactions autonomously from the SPAT Agent wallet after approval

What type of contract do you need? (NFT, ERC20, DeFi, Gaming, etc.)`,
        market: `📊 **Current Market Analysis**

**Base Network Metrics:**
- TVL: $7.2B (+12% 7d)
- Daily Transactions: 4.2M
- Active Addresses: 890K

**Top Opportunities:**
1. DEX liquidity provision (APY: 15-45%)
2. NFT minting surge on Zora
3. Social token momentum on Farcaster

**$SPAT Cost**: 10,000 tokens for detailed analysis

Want me to dive deeper into any specific area?`,
        dapp: `Let's build your dApp! I can help with:

**Frontend:**
- React/Next.js setup
- Wallet integration (RainbowKit)
- Base Network connection

**Backend:**
- Smart contract architecture
- Database design
- API endpoints

**$SPAT Cost**: 200,000 tokens for full dApp scaffold

I can also prep integrations for moltbook.com and openclaw.ai experiences.

What's your dApp idea? Gaming, Social, DeFi, or something else?`,
      };

      let response = "I understand your request. Let me analyze it and provide the best approach. Could you provide more details about what you'd like to accomplish?";
      
      const lowerText = messageText.toLowerCase();
      if (lowerText.includes("token") || lowerText.includes("create")) {
        response = responses.token;
      } else if (lowerText.includes("contract") || lowerText.includes("deploy")) {
        response = responses.contract;
      } else if (lowerText.includes("market") || lowerText.includes("analy")) {
        response = responses.market;
      } else if (lowerText.includes("dapp") || lowerText.includes("app") || lowerText.includes("build")) {
        response = responses.dapp;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 md:inset-8 lg:inset-12 flex flex-col glass-card overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              <AgentIcon />
            </div>
            <div>
              <h3 className="font-semibold text-gradient">SPAT Agent</h3>
              <p className="text-xs text-muted-foreground">Base Network AI Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(!isConnected || !hasMinimumSPAT) && (
              <Button variant="glow" size="sm" onClick={onConnectWallet}>
                Connect / Verify Wallet
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] md:max-w-[60%] p-4 rounded-2xl ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary/50 border border-border/50 rounded-bl-md"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                <p className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary/50 border border-border/50 p-4 rounded-2xl rounded-bl-md">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 border-t border-border/50">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="glass"
                size="sm"
                onClick={() => handleSend(action.prompt)}
                className="shrink-0"
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Ask SPAT Agent anything..."
              className="flex-1 bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
            <Button
              variant="glow"
              size="icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="h-12 w-12"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            💬 Chat is free • Agent actions require $SPAT • Minimum access: 1,000,000 $SPAT
          </p>
        </div>
      </div>
    </div>
  );
}
