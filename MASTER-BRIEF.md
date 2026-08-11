# MASTER BRIEF — WHAT DO YOU SEE IN A MELON?

## Project definition

**Working title:** WHAT DO YOU SEE IN A MELON?  
**Subtitle:** From Agricultural Data to Digital Experience  
**Audience:** FAMA presentation audience / stakeholders  
**Format:** single-page immersive web presentation, operated live by a presenter  
**Status:** first functional scaffold; all agricultural facts and metrics are explicitly placeholders until approved data is supplied.

## Core idea

One melon is used as the continuous visual anchor. Each chapter changes what the audience understands it to represent: object → data → digital build → participation → conversation → lived experience. The hero is Plan B: a procedural `SphereGeometry` with a custom WebGL shader. The shader synthesises cantaloupe colour variation, netting, pores, roughness-like diffusion, rim light and a normal-like surface disturbance. No paid GLB is required.

## Experience map

| # | Scene | Purpose and primary copy | Motion / interaction | Suggested timing |
|---|---|---|---|---|
| 01 | SEE | “What do you see in a melon?” Establish curiosity and the visible surface. | Slow melon rotation; subtle orbit lines; next on click/key. | 0:00–0:45 |
| 02 | KNOW | “When we know more, we see more.” Reveal origin, grade, season, movement and opportunity as data categories only. | Data tags appear. All values remain `PLACEHOLDER` or `—`. | 0:45–1:45 |
| 03 | BUILD / KIRO | “From raw signals to a digital experience.” Explain the transformation from data to interface/story. | DATA → KIRO → EXPERIENCE pipeline. Later: screen capture or live build insert. | 1:45–3:15 |
| 04 | PLAY | “Don’t just watch. Try it.” Invite participation. | `Launch local game` is a deliberate integration hook. Replace alert handler with local route/component. | 3:15–4:45 |
| 05 | ASK / QUICK | “Ask the data. Get to the point.” Hand over to live conversational demo. | Full-screen demo takeover. `Q` opens/closes it. Current view is an offline-safe fallback with no invented answer. | 4:45–6:15 |
| 06 | EXPERIENCE / MAHA | “Data becomes meaning when people experience it.” Emotional close. | `V` launches full-screen video surface. If video is missing, the designed finale frame remains visible. | 6:15–7:30 |

## Presenter controls

- `←` / `Page Up`: previous scene
- `→` / `Page Down` / `Space`: next scene
- `1`–`6`: jump directly to a scene
- `Home` / `End`: first / final scene
- `F`: browser fullscreen
- `Q`: Quick demo takeover
- `V`: MAHA finale takeover
- `Esc`: close takeover or menu
- Top-right menu: touch/mouse scene index

## Scene-level visual direction

- **Base world:** near-black agricultural green, warm off-white typography, fine technical lines, restrained film grain.
- **SEE:** lime highlight; melon feels mysterious and tactile.
- **KNOW:** mint accent; small data labels appear without claiming values.
- **BUILD / KIRO:** yellow accent; transformation pipeline.
- **PLAY:** orange accent; action becomes more prominent.
- **ASK / QUICK:** cyan accent; clean, conversational full-screen terminal.
- **EXPERIENCE / MAHA:** pale lime, cinematic fade and full-screen film.
- Typography is currently system-based for reliability. A licensed brand/display font may be introduced later.

## Copy rules

1. Never manufacture FAMA metrics, production totals, prices, grades, locations, grower profiles or performance claims.
2. Use `PLACEHOLDER`, `—`, or an explicit demo statement until the owner supplies and approves data.
3. Keep presenter copy short. Supporting facts belong in speaker notes or the interactive demo, not dense scene text.
4. “KIRO”, “Quick”, “MAHA” and FAMA naming/capitalisation need final stakeholder confirmation.

## Required assets / decisions

| Priority | Item | Required format / decision | Current fallback |
|---|---|---|---|
| P0 | Approved FAMA logo and brand guide | SVG/PNG, colours, clear-space rules | Typographic `F` mark — not represented as official logo |
| P0 | Approved agricultural dataset and field definitions | JSON/CSV/API plus source/date/owner | Clear placeholders only |
| P0 | MAHA finale film | H.264 MP4, ideally 1080p, web-optimised; place at `public/assets/maha-finale.mp4` | Designed cinematic title frame |
| P0 | Quick demo details | URL/endpoint, auth model, approved prompts and rehearsed answers | Offline-safe static handoff screen |
| P1 | Local game | Route, iframe URL, or React component; input/output contract | Integration button with explicit developer message |
| P1 | Kiro build footage | 16:9 MP4/WebM or approved live demo flow | Static transformation pipeline |
| P1 | Audio | Licensed soundtrack/sting; cue and target levels | Muted by default |
| P2 | Approved photos | MAHA/farmers/market/audience, usage rights | No stock imagery added |

## Technical architecture

- **Runtime:** React 19 on Vinext/Vite, single route, Cloudflare-compatible output.
- **Presentation controller:** one top-level client component owns `activeScene`, menu and takeover state. Keyboard handling is centralised.
- **3D layer:** Three.js renderer mounted in a React effect; procedural high-resolution sphere; custom GLSL vertex/fragment shaders; capped device pixel ratio; all GPU resources disposed on unmount.
- **Transitions:** CSS, with `prefers-reduced-motion` support. Scene changes reuse one persistent visual language.
- **Game integration:** replace the `Launch local game` click handler with either a lazy-loaded component or a same-origin local route. If iframe-based, define origin and presenter escape behaviour.
- **Quick integration:** takeover is intentionally isolated. Connect only after the endpoint, authentication, approved prompt list, response timeout and offline fallback are confirmed.
- **Video:** native `<video playsInline>` at `/assets/maha-finale.mp4`; muted autoplay for browser compatibility; visible fallback remains when the asset is missing.
- **Accessibility:** labelled controls, keyboard navigation, visible focus, live scene text, reduced-motion handling, touch menu. Final QA still requires contrast and screen-reader testing.
- **Data:** no production data store in this scaffold. Add a typed adapter once the approved source is provided; keep raw records separate from presentation copy.

## Production acceptance checklist

- Final copy and terminology approved by FAMA.
- Data source, reporting date, caveats and ownership recorded.
- Every displayed number traceable to its source; no placeholders remain unnoticed.
- Game works offline/on venue network and has a fast reset.
- Quick demo rehearsed under normal, slow and offline conditions.
- MAHA video tested from local disk in the target browser, resolution and projector.
- Presenter laptop prevents sleep/notifications; browser zoom is 100%; audio output is verified.
- Full run-through fits the agreed slot with at least 60 seconds contingency.
- A non-WebGL fallback screenshot is added if target hardware requires it.

## Next build slice

1. Replace provisional FAMA mark and lock final brand tokens.
2. Connect approved melon data through a typed local JSON adapter.
3. Integrate the real game and define reset/return-to-deck behaviour.
4. Connect Quick and author approved fallback responses.
5. Add and cue the MAHA film/audio, then conduct projector and offline rehearsal.
