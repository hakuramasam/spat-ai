import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useEthPrice() {
  return useQuery({
    queryKey: ["eth-price"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("market-data", {
        body: { type: "prices" },
      });
      if (error) throw error;
      return data.prices;
    },
    refetchInterval: 60000, // refresh every minute
  });
}

export function useBaseTVL() {
  return useQuery({
    queryKey: ["base-tvl"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("market-data", {
        body: { type: "defi" },
      });
      if (error) throw error;
      return data.base;
    },
    refetchInterval: 300000, // refresh every 5 mins
  });
}

export function useTrending() {
  return useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("market-data", {
        body: { type: "trending" },
      });
      if (error) throw error;
      return data.trending;
    },
    refetchInterval: 120000,
  });
}

export function useEthHistory() {
  return useQuery({
    queryKey: ["eth-history"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("market-data", {
        body: { type: "eth_history" },
      });
      if (error) throw error;
      return data.history;
    },
    refetchInterval: 300000,
  });
}
