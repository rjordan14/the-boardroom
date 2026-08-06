# Engineering Decisions

Durable record of decisions that resolve open questions flagged during the
build (see the design handoff's README "Still Open" section, and the
Flags raised while scaffolding the vertical slice). This lives here, not
in `design_handoff_the_boardroom/README.md`, because that file is a
read-only reference from the design handoff — this is the engineering
team's own record, and it'll grow as more decisions land.

## Pitch video: length cap, storage, and delivery

**Resolved 2026-08-06.** Max pitch length is **2 minutes 30 seconds**
(up from the design handoff's original "under 20 seconds" spec — that
copy, and the mock submission/pitch lengths that matched it, are now
updated throughout the app to 2:30).

**Storage/delivery: Mux.** Confirmed 2026-08-06 — not a bespoke
pipeline, and not Cloudflare Stream (the other option on the table).
Direct-from-browser signed upload via Mux's `direct_uploads` API (the
file never transits our own servers), async transcoding to adaptive
HLS, webhook-driven ready/error state (`video.asset.ready` /
`video.asset.errored`). The webhook is also where the 2:30 cap gets
*enforced*, not just suggested: check the `duration` field on the ready
payload and auto-reject over-length assets — a client-side check
before upload is a UX nicety, not the real gate, same posture as every
other client-side-soft/server-side-hard check already in this app
(watch-gating is the precedent). Playback via Mux's hosted HLS URL
(`@mux/mux-player-react` or a plain `<video>` + hls.js) once a backend
exists to mint playback IDs.

This maps directly onto flows already built: an upload lands in
Admin's Submissions queue in a pending state; approving it is what
promotes it to the live pitch. Project Portal's "re-uploading sends it
back for review before it replaces the live pitch" copy already
describes exactly this — new asset, not a replacement, until approved.

**Is any of this onchain?** No — and it can't be, on any chain,
including Robinhood Chain. Video bytes are too large for contract
storage/calldata at any sane gas cost; this isn't a Robinhood Chain
limitation, it's true everywhere today. What "onchain-adjacent" looks
like here: once a pitch is *approved* (not before — no point paying to
permanently archive rejected takes), push a durable copy to **Arweave**
(pay once, stored permanently — this is what backs the "permanent
profile, pitch and tournament history" promise already in the product's
own copy) and optionally record the resulting transaction ID in the
indexer or onchain. The Arweave ID is the actual onchain-relevant
surface, not the video itself.

Considered and set aside for now: **Livepeer** (a decentralized
transcoding/delivery network, the closest real onchain-native
alternative to Mux) is philosophically the better fit for a crypto-native
product, but for a season-1 launch it's a smaller, less battle-tested
network than Mux/Cloudflare Stream — similar operational trust profile
to "depend on one vendor," just a newer one. Worth revisiting once
video volume or brand positioning justifies the switch. **IPFS/Filecoin
alone** were ruled out for the live-delivery path specifically: neither
gives competitive adaptive-bitrate streaming today, and IPFS's
durability depends on someone continuing to pin the file — a different
flavor of "trust a third party," not a stronger guarantee than a CDN.

**Code impact:** `components/portal/VideoTab.tsx` copy and the mock
lengths in `lib/mock/submissions.ts` / `pitchSeconds` in
`lib/mock/projects.ts` now reflect 2:30 instead of ~20s. No real
upload/transcode/storage integration yet — there's no backend to wire
it to. This is the target spec for when that gets built.

**Blocked on, before real integration can start:** a Mux account +
API tokens (not created — nothing to configure yet), and some backend
surface to hold them and mint direct-upload URLs server-side (this app
has no API routes / backend service today, same gap that blocks real
chain integration). When both exist, the natural shape mirrors
`lib/chain/`'s adapter pattern — a typed interface plus a mock
implementation the UI already calls, swapped for a real one without
touching `VideoTab.tsx` or Admin's Submissions tab.

## Gas payment: voter pays

**Resolved 2026-08-06.** The voter pays gas for the vote transaction.
This was already the README's Decisions Locked #1 — the contradiction
was in the *prototype*, not the requirements: its ballot-ceremony copy
said "Gasless signature … No transaction, no fee," and the Build Spec
mock said "Gas est. < $0.01 · sponsored for eligible wallets." Both of
those were wrong and are superseded by this decision.

**Code impact:** none. The built app's ballot ceremony
(`components/ballot/Ceremony.tsx`) never rendered gas-cost or
"gasless" copy in the first place — it was built agnostic to this
question on purpose. Noting this so nobody adds "gasless"/"sponsored"
UI later while wiring up real contracts.

## Commit-reveal mechanism: encrypted commit + operator-published round key

**Resolved 2026-08-06.** Goal, per the founder: hold results until the
round closes to preserve suspense — a UX/product requirement, not a
demand for cryptographic trustlessness against the operator
specifically.

**Mechanism:**

1. At round open, a fresh keypair is generated for that room.
2. A vote transaction carries the ciphertext of the voter's choice,
   encrypted client-side with the round's *public* key, plus whatever
   eligibility/weight proof the contract needs. **One transaction, one
   signature** — nobody comes back for a second "reveal" tx. This is
   what makes it compatible with "voter pays gas" above without
   doubling everyone's gas cost.
3. At round close, the operator publishes the round's *private* key. A
   keeper process (can be the same backend that runs Admin) decrypts
   every on-chain ciphertext, computes the tally, and posts the
   result.
4. Because ciphertexts are on-chain and immutable from the moment each
   vote was cast, and the key is published at reveal, **anyone can
   independently re-derive the same tally** after the fact. A wrong
   tally is catchable. An early *peek* by the operator is not.

**Trust tradeoff, stated plainly:** this is not trustless against the
operator — a dishonest operator could decrypt locally before
officially publishing the key. It *is* trustless against everyone else
(voters, projects, the public) and self-auditing after the fact. The
operator role in this system already holds equivalent or greater
unilateral trust (pause/cancel a live tournament, approve/remove
projects mid-season, moderate public Q&A) — this doesn't introduce a
new, weaker assumption, it's consistent with the existing one.

**Why not something stronger for season 1:**

- *Threshold encryption / MPC* across independent key-holders removes
  the single-operator trust point, but adds a key-generation ceremony,
  share custody, and a liveness requirement across multiple parties at
  reveal time. Worth it once real backing dollars raise the stakes;
  premature for a first season.
- *Time-lock (VDF) encryption* removes trust entirely, including from
  the operator, without needing multiple parties — but the primitive
  is less battle-tested and a harder thing to get right on a first
  launch.
- *Plaintext on-chain + UI-only "sealed"* (just don't show the running
  tally in the app) is simplest, but doesn't actually hold the
  results — anyone reading raw chain data can compute the tally early.
  Rejected: it doesn't achieve the stated goal, it only hides it from
  people who aren't looking.

**Downstream dependency this confirms:** semifinal bracket auto-seeding
by ballot count can only run once the reveal/tally step finishes for
all four quarterfinal rooms — already modeled in the mock UI as the
"CLOSED · TALLYING" state (Build Spec) and the placeholder semifinal
panel in Admin's Bracket tab. No UI changes needed; this decision is
what that state represents once it's real.

**Code impact:** none yet — no real contracts exist to implement this
against. This is the target spec for whoever replaces
`lib/chain/mockAdapter.ts` with a real adapter: the mock's `castVote`
already models a single signing → pending → confirmed transaction,
which is the correct shape for step 2 above.
