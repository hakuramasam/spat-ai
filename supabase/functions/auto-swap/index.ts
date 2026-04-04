import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Contract addresses on Base mainnet
const SPAT_TOKEN = "0x7f18bdbe376b3b0648ad75da2fcc52f8c107bcdf";
const AGENT_VAULT = "0x4E26fc6eb05a1CDbD762609fDE9958e5b8CC754d";
const WETH_BASE = "0x4200000000000000000000000000000000000006";

// Uniswap V3 Router on Base
const UNISWAP_V3_ROUTER = "0x2626664c2603336E57B271c5C0b26F421741e481";
// Uniswap V3 Quoter on Base
const UNISWAP_V3_QUOTER = "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a";

interface SwapQuote {
  spatAmount: string;
  ethAmount: string;
  rate: number;
  priceImpact: number;
  route: string;
}

interface LiquidityAction {
  action: "swap" | "add_liquidity" | "quote" | "status";
  spatAmount?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, spatAmount } = (await req.json()) as LiquidityAction;

    switch (action) {
      case "quote": {
        // Get a swap quote for SPAT -> ETH
        // In production, this would call Uniswap V3 Quoter contract
        const spatValue = parseFloat(spatAmount || "0");
        if (spatValue <= 0) {
          return jsonResponse({ error: "Invalid SPAT amount" }, 400);
        }

        // Fetch current ETH price to calculate USD-equivalent swap
        let ethPrice = 3500; // fallback
        try {
          const priceRes = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
          );
          if (priceRes.ok) {
            const priceData = await priceRes.json();
            ethPrice = priceData.ethereum?.usd || ethPrice;
          }
        } catch (_) {}

        // Calculate: if user sent $X USD worth of SPAT, convert to exactly $X USD worth of ETH
        // SPAT price is derived from the pool; here we use a reference rate
        const spatPriceUsd = 0.001; // Reference price per SPAT token
        const usdValue = spatValue * spatPriceUsd;
        const ethEquivalent = usdValue / ethPrice;
        const priceImpact = spatValue > 1000000 ? 2.5 : spatValue > 100000 ? 0.8 : 0.3;

        const quote: SwapQuote = {
          spatAmount: spatValue.toString(),
          ethAmount: ethEquivalent.toFixed(8),
          rate: spatPriceUsd / ethPrice * 1e18,
          priceImpact,
          route: `SPAT → WETH (Uniswap V3, 1% fee tier on Base)`,
        };

        return jsonResponse({ quote, ethPrice, spatPriceUsd });
      }

      case "swap": {
        // Build the unsigned swap transaction for SPAT -> ETH via Uniswap V3
        const spatValue = parseFloat(spatAmount || "0");
        if (spatValue <= 0) {
          return jsonResponse({ error: "Invalid SPAT amount" }, 400);
        }

        // Convert to wei (18 decimals)
        const amountInWei = BigInt(Math.floor(spatValue * 1e18)).toString();

        // Uniswap V3 exactInputSingle params
        const swapParams = {
          tokenIn: SPAT_TOKEN,
          tokenOut: WETH_BASE,
          fee: 10000, // 1% fee tier
          recipient: AGENT_VAULT,
          deadline: Math.floor(Date.now() / 1000) + 1800, // 30 min
          amountIn: amountInWei,
          amountOutMinimum: "0", // Should set slippage in production
          sqrtPriceLimitX96: "0",
        };

        // Return unsigned transaction data for the controller wallet to sign
        return jsonResponse({
          message: "Swap transaction prepared",
          transaction: {
            to: UNISWAP_V3_ROUTER,
            chainId: 8453, // Base mainnet
            data: encodeExactInputSingle(swapParams),
            value: "0",
          },
          params: swapParams,
          note: "This transaction must be signed by the controller wallet (0x4E26...754d)",
        });
      }

      case "add_liquidity": {
        // After swap, the ETH received is used to add liquidity to SPAT/ETH pool
        return jsonResponse({
          message: "Liquidity provision prepared",
          pool: {
            token0: SPAT_TOKEN,
            token1: WETH_BASE,
            feeTier: 10000,
            chain: "Base (8453)",
          },
          strategy: "50/50 split: Half of swapped ETH paired with equivalent SPAT for LP position",
          note: "Liquidity addition requires on-chain transaction signed by controller wallet",
        });
      }

      case "status": {
        // Return current auto-swap mechanism status
        return jsonResponse({
          status: "active",
          controllerWallet: AGENT_VAULT,
          spatToken: SPAT_TOKEN,
          swapRouter: UNISWAP_V3_ROUTER,
          chain: "Base Mainnet (8453)",
          mechanism: {
            description: "Received $SPAT auto-converts to equivalent USD value in $ETH",
            conversionRule: "1 USD of $SPAT → 1 USD of $ETH",
            liquidityTarget: "ETH/SPAT Uniswap V3 pool (1% fee tier)",
          },
          poolInfo: {
            dex: "Uniswap V3",
            pair: "SPAT/WETH",
            feeTier: "1% (10000)",
            baseChainId: 8453,
          },
        });
      }

      default:
        return jsonResponse({ error: "Invalid action. Use: quote, swap, add_liquidity, status" }, 400);
    }
  } catch (e) {
    console.error("auto-swap error:", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Encode Uniswap V3 exactInputSingle function call
function encodeExactInputSingle(params: {
  tokenIn: string;
  tokenOut: string;
  fee: number;
  recipient: string;
  deadline: number;
  amountIn: string;
  amountOutMinimum: string;
  sqrtPriceLimitX96: string;
}): string {
  // Function selector for exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))
  const selector = "0x414bf389";
  
  const pad = (hex: string) => hex.replace("0x", "").padStart(64, "0");
  const toHex = (n: number | bigint) => BigInt(n).toString(16);

  return selector +
    pad(params.tokenIn) +
    pad(params.tokenOut) +
    pad("0x" + toHex(params.fee)) +
    pad(params.recipient) +
    pad("0x" + toHex(params.deadline)) +
    pad("0x" + toHex(BigInt(params.amountIn))) +
    pad("0x" + toHex(BigInt(params.amountOutMinimum))) +
    pad("0x" + toHex(BigInt(params.sqrtPriceLimitX96)));
}
