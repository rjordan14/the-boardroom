# Handoff: The Boardroom

## Overview
The Boardroom is a standalone crypto pitch-competition platform. Vetted projects submit short prerecorded pitches and compete head-to-head in a single-elimination bracket (season 1: Round of 16 → Quarterfinal → Semifinal → Final). The community watches both pitches in a matchup, casts one sealed ballot per wallet per room, and the winner earns a real token launch. Voting is free. Separately, wallets can optionally escrow $STONKBROKER behind the project they voted for — this never buys extra votes, but converts into an allocation of the winner's token if it launches, or is refunded if it doesn't.

Chain: **Robinhood Chain**. Token used for eligibility, voting weight reference, and backing: **$STONKBROKER** (this platform has no native token of its own).

## About the Design Files
The bundled file (`The Boardroom - prototype.dc.html`) is a **design reference built in HTML** — a clickable prototype showing intended look, copy, layout, and micro-interactions. It is not production code to copy directly. The task is to **recreate this design in your target codebase's environment** (React, Vue, native, etc.) using your stack's own component patterns, state management, and wallet/contract integration — or choose the most appropriate framework if none exists yet.

To view it: open the `.dc.html` file directly in a browser. It's a single self-contained prototype (no build step) with inline styles throughout — every color, spacing, and font value is visible in the markup itself, so treat the file as the spec of record for exact pixel values.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and animation timings are final/intentional. Recreate pixel-perfectly using your codebase's component system. The 24 "state coverage" cards on the `/states` screen (see below) are lower-fidelity — they're intentionally sketched to define scope, not to be pixel-matched.

## Screens / Views

### 1. Lobby (`data-screen-label="Lobby"`)
- Hero: full-width pixel-art conference room image (`marks/room.png`, `aspect-ratio:1920/1080`), with a scanline flicker overlay and a "CONFERENCE ROOM · THE BOARDROOM" + live seated-count plate top-right (dark blurred backing plate, `border:1px solid rgba(204,255,0,0.22)`, text `#B9C9A2`, count in `#CCFF00`).
- Headline: "THE COMMUNITY DECIDES WHO LAUNCHES" (`font:800`, JetBrains Mono, `clamp(15px,9.2cqw,68px)`), subhead: "16 projects pitch. You vote. One launches." Sub-subhead: "The community picks the next crypto project to get a real token launch — no gatekeepers, no leaderboard to game, no ticker to front-run."
- Three-step explainer row ("CLOCK IN", "WATCH BOTH", "SEAL YOUR VOTE" — auto-fit grid, `minmax(190px,1fr)`).
- Countdown panel: dashed lime border, `#CCFF00` on `linear-gradient(#141B08,#0F1407)`, huge countdown digits (`clamp(34px,3.6vw,52px)`) with a slow 2s opacity pulse (`tickPulse` keyframe), "9,204 ballots sealed" below. No running vote tally is ever shown — ballots are sealed until close.
- Two-panel explainer: **VOTING** (free, one wallet one vote, plain border) vs. **BACKING** (optional, amber `#E5B531`, animated gold glow + sheen sweep, pulsing dot) — copy: "After you vote, you can escrow $STONKBROKER on a project. If it wins and launches, you can claim an allocation. If it loses, it's returned."
- Round-of-16 elimination strip: 8 struck-through eliminated project chips + "8 eliminated · 24,118 ballots sealed".
- 4 matchup rows (Quarterfinal Rooms 01–04): each is a grid `clamp(40px,4vw,64px) minmax(0,1fr) clamp(90px,10vw,190px) minmax(0,1fr) clamp(200px,18vw,250px)` — room number, Project A (name right-aligned over its mark, mark hover-pops `scale(1.14) rotate(-4deg)`), floating VS mark (`marks/vs.png`, continuous `floaty` bob), Project B (mirrored), status/CTA. Project names and marks are clickable → Project Profile screen.
- "FROM THE FLOOR" — real audience Q&A preview, 2 cards, auto-fit grid: each has an upvote box (44×44 min tap target, click = optimistic +1 with a `votePop`-style press scale via `style-active`), question text, tap-to-expand answer (or "awaiting answer" state), "ALL QUESTIONS ↗" link into that project's profile.
- Bracket ("THE ROAD TO LAUNCH"): Round of 16 → Quarterfinal (live) → Semifinal → Final, with connector lines; collapses to single column and hides connectors under 1024px.
- Footer: "THEBOARDROOM.XYZ · ROBINHOOD CHAIN MAINNET" + "● ONLINE".
- Header (sticky, all screens): wordmark "THE BOARDROOM" (`#CCFF00`, underlined), wallet chip (connected/eligible in plain border, not-eligible in amber `#E5B531`), and a "BUILD SPEC" link to the `/states` screen.

### 2. Room (`data-screen-label="Room"`, pitch playback)
- Door/leg-walk entrance reveal animation on first entry (`phase:'door'`), then pitch video plays (`phase:'playing'`), progress bar fills, "SKIP" and "FINISH" controls.
- Tab bar at bottom: both project names + marks with a colored underline showing which pitch is active/watched (`tabAColor`/`tabBColor`), oversized project wordmarks so they don't get overshadowed by the center VS mark.
- Must watch pitch A fully before B unlocks (`s.pA>0` gates B). Scrubbing/seeking does not count as watched — this is a **soft, client-side gate only** (see Decisions Locked).
- "VOTE CLOSES" countdown shown in the room header.

### 3. Compare + Ballot (`data-screen-label="Compare and vote"`)
- Two side-by-side project cards (`flex:1 1 240px`, wraps on mobile), VS mark centered between them.
- Each card: mark + name (clickable → profile modal), TRACTION/TOKEN PLAN/DISCLOSED RISKS facts grid, **THESIS** (team's own words), **DOXXED** chip row (team member handles, each a clickable `x.com/@handle` link with an X glyph), project's own X and site links.
- Pick a card → "CLOCK IN · CAST BALLOT" button enables (press feedback via `style-active: translateY(4px)`).
- **Ballot ceremony (3 beats):** select → stamp slams onto the screen with a screen-shake (`shake` keyframe) + crowd cheer + ink-ring burst → a time card ejects (`cardEject`) as the receipt. This entire sequence should fire **on transaction confirmation**, not on click, once wired to a real chain (see Decisions Locked #1).
- Backing panel appears after the ballot is sealed: amber themed, amount stepper (25% / 50% / MAX presets), expandable "what happens to my $STONKBROKER?" detail (three bullet outcomes: win-and-launch, oversubscribed, nothing-burns-early), min 25 / max 888 $STONKBROKER for season 1.
- Modal: clicking a mark opens a project detail modal (facts, thesis, team roster with doxxed handles, close on backdrop click via `stopClick` guard).

### 4. Sealed (`data-screen-label="Ballot sealed"`)
- Confirmation state: "ROOM 01 · BALLOT SEALED" header chip, "RESULT IN {{ countdown }}", "ONE OF US! ONE OF US!" marquee.

### 5. Result (`data-screen-label="Result"`)
- Winner reveal over the room art, trophy hop animation with sparkle bursts (`trophyHop`/`trophyGlint`/`sparkA-C`), "WHAT HAPPENS NOW" explainer strip.

### 6. Project Profile (`data-screen-label="Project profile"`)
- Full pitch replay, **THESIS** block, **TEAM** roster grid (auto-fit `minmax(220px,1fr)`) — each member shows name + role, and an X handle chip *only if doxxed* (`sc-if value="p.doxxed"`); anonymous members show name/role with no link.
- Project's own X and website as clickable chips.
- Full Q&A feed for that project (ask, upvote, answered/unanswered).

### 7. Build Spec (`data-screen-label` not yet set — screen key `atStates`, reachable via the header "BUILD SPEC" link)
This is a documentation screen for engineering, not a user-facing screen — 24 states across 6 categories (Wallet & Network, Vote Transaction, Backing & Escrow, Round Lifecycle, Q&A/Activity, Contract Surface), each a card showing the UI state plus an engineering note on what the contract/indexer must expose. Useful as a checklist while implementing, not something to ship as-is.

## Interactions & Behavior
- **Navigation is fully client-state driven** in the prototype (`s.screen`) — no URLs. Recreate with real routing per screen (lobby, room/:id, compare/:id, profile/:projectId, my-activity).
- **Watch-gating:** Project B's pitch is locked until A reaches 100% watched; this is enforced only in prototype state, not cryptographically.
- **Ballot ceremony:** select → stamp (screen shake + cheer) → card eject → confirmed. In production this whole sequence should be gated on tx confirmation, with a pending/awaiting-signature/rejected/reverted state in between (see Build Spec screen 02).
- **Backing flow:** amount entry → (production: ERC-20 approve, ideally skipped via Permit2/ERC-2612) → escrow tx → receipt with withdraw/add-more actions → post-round: claim allocation (winner) or withdraw refund (loser).
- **Animations:** all authored as inline CSS `@keyframes` in `<helmet>` (~40 keyframes) — key ones: `stampSlam`/`shake`/`inkRing` (vote ceremony), `trophyHop`/`sparkA-C` (result), `goldGlow`/`sheen` (backing panel pulse), `floaty` (VS mark idle bob), `tickPulse` (countdown), `markPop`-style hover pop on clickable project marks (`transform:scale(1.14) rotate(-4deg)`, 160ms), `cardFeed` (marquee ticker card).
- **Responsive:** no fixed min-width; fluid via `clamp()` throughout; grids use `auto-fit`/`minmax`; one `@media (max-width:1024px)` block stacks matchup rows, collapses the bracket to a single column, and hides bracket connectors/headers.

## State Management
Prototype state (single component, for reference — recreate with your own state layer):
- `screen`: lobby | room | compare | sealed | result | profile | states
- `current`: 'A' | 'B' (which pitch is active in Room)
- `phase`: door | playing | done (pitch playback)
- `pA`, `pB`: 0–100 watch progress per project
- `choice`: selected project key for the current room's ballot
- `signing`, `sealed`: ballot ceremony transaction state
- `profileKey`, `modalKey`: which project's profile/modal is open
- `floorOpen`, `fup_<id>`: floor-question expand/upvote state
- `backAmt`, `backed`, `backDetail`: backing panel state
- `qup_<projectKey>_<id>`: per-project Q&A upvote state

**Real implementation will need additional state not in the prototype:** wallet connection status, chain ID, live $STONKBROKER balance, per-wallet per-room ballot-cast status (read from chain), pending-transaction tray (survives refresh), backing escrow balance + claim/refund eligibility, round schedule/open-close timestamps, tiebreak state.

## Decisions Locked (confirmed by the founder — treat as requirements, not options)
1. **Gas:** voter pays gas for the vote transaction (justified as the price of admission to unlock backing).
2. **Eligibility:** **live** $STONKBROKER balance per round (not a snapshot), gated by a minimum threshold — **no NFT-gated access**. Rationale: live balance lets people join mid-competition; an NFT gate would shrink the voter pool to existing holders.
3. **Tally visibility:** **commit-reveal** ballots — votes are hidden (as the "sealed ballot" ceremony already implies) until the round closes, to prevent bandwagon voting in the final hours.
4. **Backing conversion:** **fixed price set before the round** (not floating with launch price), so backers know the deal upfront.
5. **Vesting:** winner allocations vest with a **decaying early-exit penalty** (e.g., large penalty if claimed immediately, tapering to zero over ~90 days) rather than a hard lockup — the exact curve is still open (see below).
6. **Watch-to-vote enforcement:** **soft client-side gate only**, stated plainly to users. A contract cannot verify a video played; do not attempt a trust-minimized enforcement for season 1.
7. **Backing amount:** season 1 minimum is **888 $STONKBROKER**; low enough to be inclusive. Max should scale as a % of a wallet's voting-eligible balance (exact % still open).

## Still Open (need answers before contracts are final)
- Whether $STONKBROKER NFT holders get a **separate tiebreak-only vote** (deciding vote in the event of a tie) — agreed in concept as reasonable NFT utility that doesn't distort the main ballot; not yet speced as UI or contract logic.
- Exact **vesting penalty curve** (start %, decay shape, duration) for winner allocations.
- Exact **max backing per wallet** as a % of voting balance.
- Who funds winner allocations (see Build Spec screen, category 06).

## Design Tokens
- **Background:** `#08090A` (page), `#04060A` (media/hero panels), `#0B0E08`/`#0E110C` (cards), `#0C1008`/`#0C0F07` (success-tinted panels), `#12100A`/`#14100A` (amber-tinted panels), `#170D0A` (error/rejected panels).
- **Accent (lime, primary):** `#CCFF00` — CTAs, active states, wordmark, vote-related highlights.
- **Accent (amber, backing/money):** `#E5B531` — all backing/escrow/gold UI, warnings.
- **Success green:** `#4ADE80`. **Error/revert red:** `#F0644B`.
- **Text:** `#F2F5EF`/`#E3EDD2` (primary/headings), `#C4CCBB` (body), `#8A9184`/`#8CA05A` (secondary/muted), `#6C7563`/`#4E5747` (tertiary/disabled).
- **Borders:** `#2C3327`/`#23271F` (neutral), `#3D4A2B` (voting panel), `#5A4A1E`/`#3A2E14` (amber/backing), `#5A2A20`/`#3A1C16` (error).
- **Typography:** JetBrains Mono throughout (400/700/800 weights), all-caps labels with `letter-spacing:0.08–0.22em`. Headline sizes use `clamp()`, e.g. hero `clamp(15px,9.2cqw,68px)`, section titles `clamp(19px,2.8vw,26px)`.
- **Spacing:** page gutters `clamp(14px,4vw,48px)`; card padding typically `16–26px`; grid gaps `10–16px`.
- **Radius/shadows:** the design is intentionally square (no border-radius on cards); depth comes from borders + colored glows (e.g. `box-shadow:0 0 0 1px rgba(204,255,0,0.10), 0 14px 44px rgba(204,255,0,0.13)` on the countdown panel), not drop shadows.

## Assets
All in `/marks`: `room.png` (pixel-art conference room, hero background across Lobby/Room/Result), `vs.png` (VS mark), and one pixel-art project mark per project (`ledgerboy.png`, `vaultmouse.png`, `tickertape.png`, `margincallfm.png`, `sevenfiguresoda.png`, `dividenddiner.png`, `filingcabinet.png`, `paperhands.png`). All marks render with `image-rendering:pixelated`. Two more project marks (for projects E/F in the current 8-project roster, if kept at 8 rather than expanded to 16) are referenced in copy but should be confirmed against the final project roster before implementation — the hero copy currently says "16 projects" while the bracket/marks assets only cover 8; **reconcile this before building** (either supply 8 more project marks, or update copy back to 8/8-project rounds).

## Additional Tools (Admin, Project Portal, Apply)

Three more prototypes round out the full product surface, all in the same visual system (dark JetBrains Mono UI, lime `#CCFF00` primary, amber `#E5B531` for money/backing):

### The Boardroom - Admin.dc.html
Operator tool, gated behind a wallet-connect screen (operator allowlist — deny state included). Tabs:
- **Overview** — tournament status, ballots/backing/questions stats, start/pause/cancel with a confirm step on cancel, recent activity feed.
- **Tournament Setup** — configure the *next* season: description, project count (8/16/32), voting round duration, min $STONKBROKER to vote/back, start/end dates.
- **Bracket** — quarterfinal matchups shown locked once live; semifinal matchups explicitly unlock for editing only after all quarterfinal rooms have a winner (auto-seed 1v4/2v3 by ballot count, admin can override).
- **Projects** — invite by email/wallet (generates an invite link + token), roster table with status and asset-completion count, click into a project for a detail modal (video/traction/X/site/team) with approve / request changes / remove-from-season (remove has the same confirm-step pattern as Cancel Tournament).
- **Submissions** — video pitch review queue, approve/reject.
- **Q&A Moderation** — hide/notify per question, spam auto-flagged with a red left-border treatment.
- **Waitlist** — applications from the public Apply page; invite moves an applicant into the same invite flow as Projects, decline removes them from the list.

### The Boardroom - Project Portal.dc.html
Self-serve tool for project teams, gated behind a project-wallet-connect screen. First-time entry via an invite link (`?invite=<token>`) shows a short **claim-your-invite onboarding step** (project name, founder name, X profile) before the full portal unlocks; returning teams skip straight to the tabs. Tabs: Overview (status + setup checklist), Pitch Video (upload/replace, review-gated), Project Info (editable form — name, one-liner, thesis, traction, token plan, risks, X, site), Team (add/remove members, doxxed toggle via X handle presence), Q&A (answer/reply inline), Backing (read-only — total backed, backer count, rank), Notifications (per-event toggles).

### The Boardroom - Apply.dc.html
Public waitlist application, linked from the main app's footer ("APPLY FOR SEASON 02"). Single-page form (project name, one-liner, traction, site, project X, founder name + optional founder X for doxxing, email, wallet, "why now") → confirmation screen. Submissions land in Admin's Waitlist tab.

**Registration flow, end to end:** Admin invites a project directly (Projects tab) **or** approves a Waitlist application (Waitlist tab, which reuses the same invite action) → an invite link with a token is generated → the project opens Project Portal with that link → completes the short onboarding step → lands in the full portal to fill in the rest before their room opens.

**Still open / needs a product decision before engineering finalizes these:**
- Whether waitlist upvoting/Q&A should be public-facing (the founder was actively considering gamifying the waitlist itself — public upvotes and community Q&A on applicants before they're invited — not yet designed).
- Auth is only stubbed as a connect/deny toggle in both Admin and Project Portal — real wallet-based role-checking (operator allowlist, project-to-room binding) needs to be designed with the eng team, not assumed from this prototype.
- Bracket screen only covers manual re-seed for semis; it doesn't yet show what happens with a tie or a walkover (see the main README's Build Spec section — those states are designed on the public app's `/states` screen but not wired into Admin's Bracket tab yet).

## Files
- `The Boardroom - prototype.dc.html` — the full interactive prototype (all 7 public-facing screens described above).
- `The Boardroom - Admin.dc.html` — operator tool.
- `The Boardroom - Project Portal.dc.html` — project self-serve tool.
- `The Boardroom - Apply.dc.html` — public waitlist application.
- `marks/` — all pixel-art image assets referenced by the prototypes.
- `image-slot.js` — logo upload placeholder component used in Project Portal (Overview tab).
