import { http, createPublicClient, createWalletClient, custom } from "viem";
import { base } from "viem/chains";

export const basePublicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export const baseWalletClient = createWalletClient({
  chain: base,
  transport: http(),
});
