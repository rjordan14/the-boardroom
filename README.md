# The Boardroom

**The community decides who launches.**

The Boardroom is a crypto pitch-competition platform. Vetted projects submit
short pitches and compete head-to-head in a single-elimination bracket
(Quarterfinal → Semifinal → Final). The community watches both pitches in a
matchup, casts one sealed ballot per wallet per room, and the winner earns a
real token launch. Voting is free and equal — no gatekeepers, no leaderboard
to game, no ticker to front-run. Separately, wallets can optionally escrow
$STONKBROKER behind the project they voted for; it never buys extra votes,
but converts into an allocation of the winner's token if it launches, or is
fully reclaimable if it doesn't.

Live: **[the-boardroom-app.vercel.app](https://the-boardroom-app.vercel.app)**
/ **[clocktfin.xyz](https://clocktfin.xyz)**

## Status

This is a demo/v1 build — the full voting UX, bracket progression (a round
closing automatically pairs its winners into the next round, all the way to
a champion), Q&A, comments, and an admin console for running the season are
real and working. What's still simulated rather than backed by a real chain
or backend:

- **Voting and wallets** run against a mock chain adapter
  (`lib/chain/mockAdapter.ts`) — no real contracts or transactions yet. See
  `docs/decisions.md` for the target design (voter-pays-gas, an
  encrypted-commit/reveal ballot scheme) once real integration starts.
- **Pitch playback** is simulated on a fixed timer rather than real video,
  though pitch uploads do go through a real [Mux](https://mux.com) pipeline
  into Admin's Submissions queue when `MUX_TOKEN_ID`/`MUX_TOKEN_SECRET` are
  configured (see `.env.local.example`).
- **Round/result state** lives in an in-memory server store
  (`lib/tournament/store.ts`) — real and shared across everyone hitting the
  deployed instance, but resets on server restart. No database yet.

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Zustand (with
`persist` for per-wallet client state) · Vitest + Testing Library

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin console is at
`/admin` (mock operator-wallet gate, no real auth yet).

To enable real video uploads, copy `.env.local.example` to `.env.local` and
fill in Mux credentials — without them, uploads fall back to the existing
mock "queued for review" flow.

## Project structure

- `lib/mock/` — seed data (projects, rooms, Q&A, comments, results).
- `lib/api/` — the swap point between mock and real data; pages import from
  here, not from `lib/mock/` directly, so a real backend can replace the
  mock layer without touching UI code.
- `lib/tournament/` — server-side round-progression state (closing a round,
  generating the next one, undoing a close).
- `lib/chain/` — the mock wallet/voting adapter and its typed interface.
- `store/useBoardroomStore.ts` — per-wallet client state (watch progress,
  ballots, comments, points), persisted to `localStorage`.
- `app/admin/` — the operator console (bracket, submissions, Q&A
  moderation, waitlist).

## Testing

```bash
npm run lint
npx tsc --noEmit
npx vitest run
npm run build
```
