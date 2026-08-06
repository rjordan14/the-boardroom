import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

/**
 * Robinhood Chain's RPC URL / chain ID aren't finalized yet (see plan's
 * Flags section). Sepolia stands in as a real, connectable placeholder
 * so this config is testable today — swap it for the actual chain
 * definition once those details exist. Nothing in the four in-scope
 * screens (lobby/room/compare/sealed) reads wagmi state directly; they
 * go through lib/chain/hooks.ts's mock adapter. This config exists so
 * the wallet-connection plumbing is real and ready, not a promise.
 */
export const wagmiConfig = getDefaultConfig({
  appName: "The Boardroom",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "PLACEHOLDER_PROJECT_ID",
  chains: [sepolia],
  ssr: true,
});
