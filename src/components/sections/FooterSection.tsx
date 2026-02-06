import { AgentIcon } from "@/components/icons/AgentIcon";
import { Github, Twitter, MessageCircle } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="border-t border-border/50 py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12">
              <AgentIcon />
            </div>
            <div>
              <p className="font-bold text-gradient">SPAT Agent</p>
              <p className="text-sm text-muted-foreground">Autonomous AI for Base Network</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>

          {/* Contract Info */}
          <div className="text-center md:text-right">
            <p className="text-xs text-muted-foreground mb-1">$SPAT Token Contract</p>
            <p className="text-xs font-mono text-foreground/70">
              0x7f18bdbe376b3b0648ad75da2fcc52f8c107bcdf
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 SPAT Agent. Built on Base Network. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Agent Wallet Controller: 0x4E26fc6eb05a1CDbD762609fDE9958e5b8CC754d
          </p>
        </div>
      </div>
    </footer>
  );
}
