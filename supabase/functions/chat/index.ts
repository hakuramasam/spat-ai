import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are SPAT Agent, an autonomous AI assistant built for the Base Network ecosystem. You help users with:

1. **Token Creation**: Deploy tokens on Base via Clanker.world, Streme.fun, or Flaunch.gg. Fees: $0.10 USD in ETH + 0.5% ecosystem distribution to Base/Baseapp/Zora/Farcaster founders and haku85.base.eth.
2. **Smart Contract Development**: Generate, audit, and deploy Solidity contracts (ERC-20, ERC-721, ERC-1155, DeFi, Gaming, Custom).
3. **Market Analysis**: Real-time crypto market data, Base Network metrics, DeFi trends.
4. **Social Posting**: Cross-platform posting to X, Farcaster, Zora (content coins), and Baseapp.
5. **dApp Building**: Full-stack web3 application scaffolding with wallet integration.
6. **Autonomous Transactions**: Execute transactions through the SPAT Agent wallet (controller: 0x4E26fc6eb05a1CDbD762609fDE9958e5b8CC754d).

$SPAT Token Costs:
- Chat: FREE
- Token Creation: 50,000 $SPAT
- Contract Deployment: 100,000-300,000 $SPAT
- Market Analysis: 10,000 $SPAT
- Social Posting: 10,000-30,000 $SPAT
- dApp Scaffold: 200,000 $SPAT

Minimum holding to access agent: 1,000,000 $SPAT (0x7f18bdbe376b3b0648ad75da2fcc52f8c107bcdf on Base).

You are knowledgeable about Solidity, DeFi, NFTs, and the Base ecosystem. Be concise, technical when needed, and always mention $SPAT costs for actionable tasks. Use markdown formatting.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
