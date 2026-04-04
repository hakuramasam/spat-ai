import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SwapQuote {
  spatAmount: string;
  ethAmount: string;
  rate: number;
  priceImpact: number;
  route: string;
}

interface SwapStatus {
  status: string;
  controllerWallet: string;
  spatToken: string;
  swapRouter: string;
  chain: string;
  mechanism: {
    description: string;
    conversionRule: string;
    liquidityTarget: string;
  };
  poolInfo: {
    dex: string;
    pair: string;
    feeTier: string;
    baseChainId: number;
  };
}

export function useAutoSwap() {
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [status, setStatus] = useState<SwapStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getQuote = async (spatAmount: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("auto-swap", {
        body: { action: "quote", spatAmount },
      });
      if (error) throw error;
      setQuote(data?.quote || null);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const getStatus = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("auto-swap", {
        body: { action: "status" },
      });
      if (error) throw error;
      setStatus(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const prepareSwap = async (spatAmount: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("auto-swap", {
        body: { action: "swap", spatAmount },
      });
      if (error) throw error;
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  return { quote, status, isLoading, getQuote, getStatus, prepareSwap };
}
