import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, platforms, content, contentCoinName } = await req.json();

    // AI content generation
    if (action === "generate") {
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
            { role: "system", content: "You are a crypto/web3 social media expert. Generate engaging, viral content for Base Network ecosystem posts. Include relevant emojis and hashtags. Keep it under 280 characters for X compatibility." },
            { role: "user", content: content || "Generate an engaging post about the Base Network ecosystem and $SPAT token" },
          ],
        }),
      });

      if (!response.ok) throw new Error("AI generation failed");
      const data = await response.json();
      return new Response(JSON.stringify({ content: data.choices?.[0]?.message?.content || "" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Post to platforms
    if (action === "post") {
      const results: Record<string, { success: boolean; message: string }> = {};

      for (const platform of platforms || []) {
        switch (platform) {
          case "x": {
            const hasKeys = Deno.env.get("TWITTER_CONSUMER_KEY") && Deno.env.get("TWITTER_ACCESS_TOKEN");
            if (!hasKeys) {
              results.x = { success: false, message: "X API keys not configured. Add TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET." };
            } else {
              // Real X posting would go here with OAuth 1.0a signing
              results.x = { success: false, message: "X posting ready - OAuth signing required. Keys configured." };
            }
            break;
          }
          case "farcaster": {
            const farcasterKey = Deno.env.get("FARCASTER_API_KEY");
            if (!farcasterKey) {
              results.farcaster = { success: false, message: "Farcaster API key not configured. Add FARCASTER_API_KEY (Neynar API key)." };
            } else {
              try {
                const fcRes = await fetch("https://api.neynar.com/v2/farcaster/cast", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "api_key": farcasterKey,
                  },
                  body: JSON.stringify({
                    signer_uuid: Deno.env.get("FARCASTER_SIGNER_UUID"),
                    text: content,
                  }),
                });
                if (fcRes.ok) {
                  results.farcaster = { success: true, message: "Posted to Farcaster!" };
                } else {
                  const err = await fcRes.text();
                  results.farcaster = { success: false, message: `Farcaster error: ${err}` };
                }
              } catch (e) {
                results.farcaster = { success: false, message: `Farcaster error: ${e}` };
              }
            }
            break;
          }
          case "zora": {
            results.zora = { 
              success: false, 
              message: contentCoinName 
                ? "Zora content coin creation requires on-chain transaction via the connected wallet. Use the Zora Protocol SDK from the frontend."
                : "Zora posting requires on-chain minting via connected wallet."
            };
            break;
          }
          case "baseapp": {
            results.baseapp = { success: false, message: "Baseapp API integration pending. Coming soon." };
            break;
          }
        }
      }

      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("social-post error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
