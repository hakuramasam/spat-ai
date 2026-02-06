import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, Coins, X } from "lucide-react";

interface TokenApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  amount: string;
  action: string;
}

export function TokenApprovalModal({ 
  isOpen, 
  onClose, 
  onApprove, 
  amount, 
  action 
}: TokenApprovalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gradient">Token Approval Required</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount to Approve</p>
              <p className="text-2xl font-bold text-gradient">{amount} $SPAT</p>
            </div>
          </div>

          <div className="p-4 bg-secondary/30 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Action</p>
            <p className="font-medium">{action}</p>
          </div>

          <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/30 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning mb-1">Important</p>
              <p className="text-muted-foreground">
                This will allow SPAT Agent to spend {amount} $SPAT from your wallet. 
                Tokens are used for ecosystem liquidity.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="gradient" className="flex-1" onClick={onApprove}>
            <Check className="w-4 h-4" />
            Approve $SPAT
          </Button>
        </div>

        {/* Token Info */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-center text-muted-foreground font-mono">
            $SPAT: 0x7f18bdbe376b3b0648ad75da2fcc52f8c107bcdf
          </p>
        </div>
      </div>
    </div>
  );
}
