import Mux from "@mux/mux-node";

/**
 * Whether real Mux credentials are configured. False today (no tokens
 * generated yet — see docs/decisions.md) — callers use this to fall
 * back to the existing mock upload behavior instead of crashing.
 */
export const muxConfigured = !!(
  process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET
);

let client: Mux | null = null;

/** Throws if called while !muxConfigured — check that first. */
export function getMuxClient(): Mux {
  if (!muxConfigured) {
    throw new Error(
      "Mux is not configured — set MUX_TOKEN_ID and MUX_TOKEN_SECRET in .env.local."
    );
  }
  if (!client) {
    client = new Mux({
      tokenId: process.env.MUX_TOKEN_ID,
      tokenSecret: process.env.MUX_TOKEN_SECRET,
      webhookSecret: process.env.MUX_WEBHOOK_SECRET,
    });
  }
  return client;
}
