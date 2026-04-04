import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { AgentIcon } from "@/components/icons/AgentIcon";
import { Send, Loader2, Sparkles, Code, Coins, Globe, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { streamChat, type ChatMsg } from "@/lib/ai-stream";
import { toast } from "sonner";

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
  { icon: Coins, label: "Create Token", prompt: "Help me create a new token on Base using Clanker, Streme.fun, or Flaunch.gg" },
  { icon: Code, label: "Deploy Contract", prompt: "I want to deploy a smart contract on Base Network" },
  { icon: Globe, label: "Market Analysis", prompt: "Analyze the current crypto market trends and Base Network metrics" },
  { icon: Sparkles, label: "Build dApp", prompt: "Help me build a decentralized application on Base" },
];

export function ChatInterface({ isOpen, onClose, isConnected, onConnectWallet, hasMinimumSPAT }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm **SPAT Agent**, your autonomous Base companion. I can execute transactions, create tokens, deploy contracts, analyze markets, and post to social platforms.\n\n💬 Chat is **free** — agent actions cost **$SPAT**.\n\nWhat should we work on?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Build history for AI
    const history: ChatMsg[] = messages
      .filter((m) => m.id !== "1") // skip initial greeting
      .map((m) => ({ role: m.role, content: m.content }));
    history.push({ role: "user", content: messageText });

    let assistantContent = "";

    const upsertAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.id.startsWith("stream-")) {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [
          ...prev,
          { id: `stream-${Date.now()}`, role: "assistant" as const, content: assistantContent, timestamp: new Date() },
        ];
      });
    };

    try {
      await streamChat({
        messages: history,
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
        onError: (err) => {
          toast.error("AI Error", { description: err });
          setIsLoading(false);
        },
      });
    } catch (e) {
      toast.error("Failed to reach AI agent");
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

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
              <p className="text-xs text-muted-foreground">AI-Powered • Base Network</p>
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
                {message.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                )}
                <p className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
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
                disabled={isLoading}
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
              disabled={isLoading}
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
