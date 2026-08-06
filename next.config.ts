import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // RainbowKit's default connector set statically imports Coinbase's
  // Smart Wallet (Base Account) connector, which pulls in
  // @coinbase/cdp-sdk. That package resolves x402 payment-protocol
  // subpaths via optional dynamic imports that aren't installed
  // (unrelated to wallet connection) — bundling it for the server
  // fails at build time. Treating it as external skips bundling and
  // lets Node's own require() handle the optional imports at runtime.
  serverExternalPackages: ["@coinbase/cdp-sdk", "@base-org/account"],
};

export default nextConfig;
