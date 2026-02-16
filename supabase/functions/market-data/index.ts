import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type } = await req.json();

    if (type === "prices") {
      // Fetch ETH and trending token prices from CoinGecko free API
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,usd-coin&vs_currencies=usd&include_24hr_change=true"
      );
      const data = await res.json();
      return new Response(JSON.stringify({ prices: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "defi") {
      // Fetch Base chain DeFi TVL from DeFiLlama
      const res = await fetch("https://api.llama.fi/v2/chains");
      const chains: Array<{ name: string; [key: string]: unknown }> = await res.json();
      const base = chains.find((c) => c.name === "Base");
      return new Response(JSON.stringify({ base: base || null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "trending") {
      // Fetch trending coins from CoinGecko
      const res = await fetch("https://api.coingecko.com/api/v3/search/trending");
      const data = await res.json();
      return new Response(JSON.stringify({ trending: data.coins?.slice(0, 5) || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "eth_history") {
      // Fetch ETH price history (7 days)
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7&interval=daily"
      );
      const data = await res.json();
      return new Response(JSON.stringify({ history: data.prices || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown type" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("market-data error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
