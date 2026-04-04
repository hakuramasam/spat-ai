import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}

function generateNonce(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function createOAuth1Signature(
  method: string,
  url: string,
  oauthParams: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string,
): Promise<string> {
  // Sort and encode params (no body params for JSON content type)
  const sortedParams = Object.entries(oauthParams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${percentEncode(k)}=${percentEncode(v)}`)
    .join("&");

  const baseString = `${method.toUpperCase()}&${percentEncode(url)}&${percentEncode(sortedParams)}`;
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(signingKey),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(baseString));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function postToX(content: string): Promise<{ success: boolean; message: string; tweetId?: string }> {
  const consumerKey = Deno.env.get("TWITTER_CONSUMER_KEY");
  const consumerSecret = Deno.env.get("TWITTER_CONSUMER_SECRET");
  const accessToken = Deno.env.get("TWITTER_ACCESS_TOKEN");
  const accessTokenSecret = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET");

  if (!consumerKey || !consumerSecret || !accessToken || !accessTokenSecret) {
    return { success: false, message: "X API keys not configured" };
  }

  const url = "https://api.x.com/2/tweets";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = generateNonce();

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  const signature = await createOAuth1Signature("POST", url, oauthParams, consumerSecret, accessTokenSecret);
  oauthParams.oauth_signature = signature;

  const authHeader = "OAuth " + Object.entries(oauthParams)
    .map(([k, v]) => `${percentEncode(k)}="${percentEncode(v)}"`)
    .join(", ");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: content }),
    });

    const data = await res.json();
    if (res.ok && data.data?.id) {
      return { success: true, message: `Posted to X! Tweet ID: ${data.data.id}`, tweetId: data.data.id };
    }
    return { success: false, message: `X API error: ${JSON.stringify(data)}` };
  } catch (e) {
    return { success: false, message: `X request failed: ${e}` };
  }
}

async function postToFarcaster(content: string): Promise<{ success: boolean; message: string }> {
  const apiKey = Deno.env.get("FARCASTER_API_KEY");
  const signerUuid = Deno.env.get("FARCASTER_SIGNER_UUID");

  if (!apiKey) {
    return { success: false, message: "Farcaster API key not configured" };
  }
  if (!signerUuid) {
    return { success: false, message: "Farcaster signer UUID not configured. Add FARCASTER_SIGNER_UUID." };
  }

  try {
    const res = await fetch("https://api.neynar.com/v2/farcaster/cast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        api_key: apiKey,
      },
      body: JSON.stringify({
        signer_uuid: signerUuid,
        text: content,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, message: `Posted to Farcaster! Hash: ${data?.cast?.hash || "success"}` };
    }
    const err = await res.text();
    return { success: false, message: `Farcaster error: ${err}` };
  } catch (e) {
    return { success: false, message: `Farcaster request failed: ${e}` };
  }
}

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
          case "x":
            results.x = await postToX(content);
            break;
          case "farcaster":
            results.farcaster = await postToFarcaster(content);
            break;
          case "zora":
            results.zora = {
              success: false,
              message: contentCoinName
                ? "Zora content coin creation requires on-chain transaction via the connected wallet. Use the Zora Protocol SDK from the frontend."
                : "Zora posting requires on-chain minting via connected wallet.",
            };
            break;
          case "baseapp":
            results.baseapp = { success: false, message: "Baseapp API integration pending. Coming soon." };
            break;
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
