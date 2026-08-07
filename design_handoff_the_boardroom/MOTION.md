# The Boardroom — Motion spec

The animations live in the design prototype (`The Boardroom - prototype.dc.html`) but were not carried into the build. Everything is plain CSS `@keyframes` + `animation:` shorthands — no libraries, no JS timelines except where noted.

- **`animations.css`** — all 51 `@keyframes` blocks, extracted verbatim. Drop this into the app's global stylesheet and the names below resolve.
- Source of truth for *where* each one is applied: the prototype file. Search it for `animation:` to see the element each belongs to.

## How to hand this to Claude Code

Point it at both files and be explicit that the prototype is the reference implementation:

> Read `design_handoff_the_boardroom/animations.css` and `design_handoff_the_boardroom/MOTION.md`. Import animations.css globally. Then open `design_handoff_the_boardroom/The Boardroom - prototype.dc.html` and, for each element in our built app that corresponds to one in the prototype, copy the exact `animation:` shorthand from the prototype onto it — same durations, delays and easings. Do not substitute your own values or a library. Start with the vote ceremony, then the ambient/idle set, then the entrance set.

Two things it will get wrong unless told:
1. **Don't re-time anything.** The delays are choreographed against each other (the vote ceremony is a 4-beat sequence; the walker is 7 animations sharing one 1320ms delay). Changing one duration desyncs the group.
2. **Animations must survive re-render.** Anything on a component that re-renders (vote counts, ticker) needs a stable `key`, or the animation restarts on every state change.

## Vote ceremony — the signature moment

Fires in order on ballot submit. All delays are measured from the same t=0.

| Element | Animation |
|---|---|
| Card / stage wrapper | `shake 420ms 340ms cubic-bezier(0.36,0.07,0.19,0.97) both` |
| Ink ring 1 | `inkRing 700ms 340ms ease-out both` |
| Ink ring 2 | `inkRing 700ms 460ms ease-out both` |
| SLAM stamp | `stampSlam 380ms 340ms cubic-bezier(0.3,1.5,0.5,1) both` |
| Ballot card ejecting | `cardEject 620ms cubic-bezier(0.2,0.9,0.3,1) both` |

Related, used elsewhere for confirmed/sealed states: `stampin 600ms cubic-bezier(0.3,1.4,0.5,1) both`, `votePop`, `ctaPop`.

## Entrances

| Purpose | Animation |
|---|---|
| Headline slam | `slamin 700ms 200ms cubic-bezier(0.2,1.5,0.4,1) both, glow 5s 1s ease-in-out infinite` |
| Headline slam (secondary) | `slamin 640ms 240ms cubic-bezier(0.2,1.6,0.4,1) both, glow 4s 1s ease-in-out infinite` |
| List/table rows | `rowIn 300ms ease-out both` (hero variant: `rowIn 500ms 800ms ease-out both`) |
| Screen power-on | `poweron 1000ms cubic-bezier(0.2,0,0.2,1) both` |
| Door reveal | `doorOpen 1100ms 220ms cubic-bezier(0.45,0,0.25,1) both` |
| Spill / drop-in | `spill 700ms 320ms both` |

## Ambient / idle loops

Always-on texture. Long durations on purpose — they should read as a room that's alive, not as UI feedback.

| Purpose | Animation |
|---|---|
| CRT flicker | `flicker 7s infinite` |
| Scanline | `scan 6s linear infinite` |
| Cursor | `blink 1.1s steps(1) infinite` |
| Metal sheen sweep | `sheen 4.5s / 6s / 9s / 11s ease-in-out infinite` (stagger by surface size) |
| Gold panel breathing | `goldGlow 3.2s ease-in-out infinite` |
| LED indicators | `ledPulse 1.2s` and `1.6s ease-in-out infinite` |
| Generic status dot | `pulse` — 1s, 1.1s, 1.2s, 1.5s, 1.6s, 2s, 2.2s, 2.6s variants; stagger siblings by `0.15s` / `0.3s` |
| Ticker / marquee | `marquee 42s linear infinite` (fast variant `9s`) |
| Float on stacked cards | `floaty 5.6s / 6.2s / 6.8s ease-in-out infinite` with `0.35s` / `0.7s` / `1.05s` delays |
| Nudge, arrow hint | `nudge 4.5s ease-in-out infinite`, `arrowNudge 1.5s ease-in-out infinite` |
| Bracket dashed connector | `dashDrift 1.4s linear infinite` |
| Progress segment | `segFill 3.2s ease-in-out infinite` |
| Countdown tick | `tickPulse 2s ease-in-out infinite` |
| Logo mark bob | `markBob 5.5s ease-in-out infinite`, `markPop` on hover |

## Winner celebration

Six animations on one 2.6s clock — keep them identical or the squash/shadow/sparkle desync.

```
trophyHop     2.6s cubic-bezier(0.3,0.9,0.4,1) infinite
trophyShadow  2.6s cubic-bezier(0.3,0.9,0.4,1) infinite
trophyGlint   2.6s ease-in-out infinite
sparkA        2.6s ease-in-out infinite
sparkB        2.6s ease-in-out 0.18s infinite
sparkC        2.6s ease-in-out 0.32s infinite
```

Confetti: 8 pieces on `fall`, durations 2.4–3.4s, delays 0–1.4s, `linear infinite`.
Crowd: **8 copies of the same asset — `marks/stonkbroker.png`** — in a centered flex row, `gap:26px`, `align-items:flex-end`, absolutely positioned at `bottom:12px`. Each is a different size + hue, all on `jump 0.9s infinite` with staggered delays. Left to right:

| Size | Filter | Delay |
|---|---|---|
| 66px | `hue-rotate(30deg)` | — |
| 78px | `hue-rotate(120deg)` | `0.1s` |
| 70px | `hue-rotate(200deg)` | `0.2s` |
| 92px | none (the real mascot, largest, center) | `0.05s` |
| 70px | `hue-rotate(280deg)` | `0.25s` |
| 78px | `hue-rotate(330deg)` | `0.15s` |
| 66px | `hue-rotate(90deg)` | `0.3s` |

Only one image file is needed; the crowd is that one mascot hue-shifted seven ways. Requires `image-rendering:pixelated` on the img.

## Walker sequence

Seven animations, all delayed `1320ms`, all `2500ms` except the leg cycle:

```
walkPath   2500ms 1320ms cubic-bezier(0.35,0,0.65,1) both, walkerAppear 1ms 1320ms both
walkScale  2500ms 1320ms cubic-bezier(0.35,0,0.65,1) both
shadowWalk 2500ms 1320ms cubic-bezier(0.35,0,0.65,1) both
legsOff    2500ms 1320ms linear both
bob         300ms 1320ms ease-in-out 6 both
legL        300ms 1320ms ease-in-out infinite
legR        300ms 1320ms ease-in-out infinite
```

## Reduced motion

Wrap the ambient and celebration loops in `@media (prefers-reduced-motion: reduce) { animation: none !important; }`. Keep the vote ceremony's stamp as a static end-state (no shake, no rings).
