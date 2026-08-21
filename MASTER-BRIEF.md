# MASTER BRIEF — WHAT DO YOU SEE IN A MELON?

## Project definition

**Working title:** WHAT DO YOU SEE IN A MELON?  
**Subtitle:** From Agricultural Data to Digital Experience  
**Audience:** FAMA presentation audience / stakeholders  
**Format:** single-page immersive web presentation, operated live by a presenter  
**Status:** interactive futuristic prototype with production GLB hero, DOA melon dataset exploration and YouTube-hosted MAHA finale film integrated. Record-specific Scene 02 values remain intentionally absent; Scene 03 numbers come only from the supplied DOA CSV.

## Core idea

One melon is used as the continuous visual anchor. Each chapter changes what the audience understands it to represent: object → data → digital build → MAHA theme → participation → conversation → lived experience.

The current hero uses the supplied `earls-favourite-melon.glb` model with its embedded mesh and PBR materials. The source model had an off-centre pivot, so the implementation calculates its bounding box, recentres the mesh inside a wrapper and rotates that wrapper around the melon’s true centre. The melon remains fixed in position and scale, with only a slow turntable rotation on its vertical axis.

The original procedural sphere and photo-mapped sphere approaches have been superseded and are no longer the active hero implementation.

## Experience map

| # | Scene | Purpose and primary copy | Motion / interaction | Suggested timing |
|---|---|---|---|---|
| 01 | SEE | “What do you see in a melon?” Begin with what the audience can immediately recognise. | Slow melon rotation; subtle orbit lines; next on click/key. | 0:00–0:45 |
| 02 | KNOW | “Every melon carries information.” Introduce five general information categories without showing any record-specific values. | `SCAN` routes here automatically, then five connected category labels appear in sequence. | 0:45–1:45 |
| 03 | BUILD / KIRO | “From data, we see the bigger picture.” Turn the supplied DOA records into a geographic and time-series view. | A compact Malaysia production map and production trend appear together. Clicking either panel opens a focused popup; the map drills from state to district and the trend compares three melon commodities from 2011–2024. | 1:45–3:15 |
| 04 | MELON / MAHA | “One fruit. Many stories to discover.” Explain why melon is central to this MAHA story and invite visitors to discover its varieties, origins and information. | The official MAHA poster replaces the analytics view with restrained ambient motion. This is a narrative scene only; it does not launch video. | 3:15–4:00 |
| 05 | ASK / DASHBOARD | “Ask a clear question. See the data clearly.” Move from finding information to having a focused conversation with a live dashboard. | The Melon Supply Intelligence dashboard appears as a framed preview. The CTA or `Q` opens `https://pantauharga.vercel.app/Melon-MAHA2026-v2.html` in the same themed popup pattern used for Sisda Games. | 4:00–5:15 |
| 06 | PLAY | “Now, let’s put it to the test.” Move from explanation to audience participation. | The dashboard transitions out and three animated Sisda Games previews transition in. CTA and cards open `https://gamesv2.sisda.my/` inside a themed popup window. | 5:15–6:30 |
| 07 | EXPERIENCE / MAHA | “The story continues beyond the screen.” Reconnect digital tools with agriculture, communities and the wider MAHA experience. | `V` launches the full-screen video surface. If the video is missing, the designed finale frame remains visible. | 6:30–7:45 |

## Presenter story flow

The text on screen is intentionally brief. These cues explain the idea the presenter should communicate in each scene; they are not scripts that must be memorised word for word.

### 01 — SEE

**On-screen message:** What do you see in a melon?

**Presenter cue:** Begin with the obvious answer: a fruit with a familiar shape, colour and texture. Then invite the audience to consider what cannot be seen from the surface alone.

**Transition:** “To see more, we need to know more.”

### 02 — KNOW

**On-screen message:** Every melon carries information.

**Presenter cue:** Explain that useful information may include origin, harvest timing, grade and movement through the supply chain. Do not state actual values until an approved FAMA dataset is connected.

**Interaction cue:** Activate `SCAN` to make the idea of looking beneath the surface visible.

The scan can be activated from any scene. It runs the holographic sweep, moves the presentation automatically to Scene 02, confirms completion and reveals five insight cards in sequence.

**Transition:** “Information becomes useful when people can understand and act on it.”

### 03 — BUILD / KIRO

**On-screen message:** From data, we see the bigger picture.

**Presenter cue:** Explain that structured agricultural records can be explored at several levels: a national overview, a selected state, its districts and a production trend over time. The interface displays `Watermelon`, `Honeydew` and `Rockmelon` and presents planted area, harvested area and production without inventing values. These English labels map directly to the supplied DOA source categories `Tembikai`, `Tembikai Susu` and `Tembikai Wangi`.

**Screen behaviour:** The 3D melon scales down, softens and fades. A compact two-panel analytics view materialises vertically: the 2024 map sits above the annual trend. The map uses the full panel and shades every state or territory using combined production across all three varieties. Each state is connected to a dynamically sized label box containing the state name and only its available 2024 variety figures; zero-value rows are omitted. The boxes use enlarged state names, English variety labels and figures, with colours matching the trend series. Negeri Sembilan is aligned directly beside Selangor. The east-coast-to-Melaka labels use a calculated vertical stack with minimum spacing; Johor and Melaka are offset slightly to the right so the southern labels cannot overlap. Labuan, Sabah and Sarawak are ordered from top to bottom to keep their connectors short and uncrossed. The trend title runs vertically beside the chart, while its 14-year context sits in a separate footer so it does not overlap the plot. A persistent table to the right of the compact chart shows the exact production figures for all three varieties; it begins at 2024 and updates to the inspected year. Enlarged year labels, legend text and figures keep the chart readable during projection. Hover inspection also shows a crosshair, while the focused popup uses a larger year detail box. Both panels have explicit English titles, and the shared source strip reads `DOA Crop Production Statistics`. Clicking the map opens a large popup with year and variety filters, state selection, three state totals and a district table. State selection uses direct polygon hit detection so the selected state, totals and district rows update immediately. In this focused view the map is scaled and shifted left to keep Sabah fully visible beside the enlarged, presentation-readable data table. Clicking the trend opens a separate large popup titled `Production trend by variety` with the complete 2011–2024 series and the same hover details. The popup closes from its button, backdrop or `Esc` without leaving the presentation.

**Data pipeline:** `DOA CSV → YEAR / COMMODITY FILTER → STATE → DISTRICT / TREND`.

**Transition:** “But why begin this experience with a melon?”

### 04 — MELON / MAHA

**On-screen message:** One fruit. Many stories to discover.

**Presenter cue:** Explain that melon is a central theme for MAHA 2026. The aim is to draw visitors in through one familiar fruit, then help them discover different melon varieties, where they come from and the information connected to each fruit.

**Screen behaviour:** The Scene 03 analytics view resolves into the official MAHA 2026 poster. The poster uses the same restrained floating, breathing-light and glass-sweep motion as the finale scene, but no video control is shown and advancing simply moves to Scene 05.

**Transition:** “Once visitors are curious, we can help them explore the information through conversation.”

### 05 — ASK / DASHBOARD

**On-screen message:** Ask a clear question. See the data clearly.

**Presenter cue:** Open the Melon Supply Intelligence dashboard and demonstrate how melon information can be explored in one focused view. Use only questions and observations supported by the approved data.

**Screen behaviour:** The MAHA poster recedes and the live Melon Supply Intelligence dashboard appears as a framed preview. The CTA or `Q` opens the full dashboard inside the shared themed popup. `Esc`, the close button or the dimmed backdrop closes it without leaving the presentation.

**Live dashboard:** `https://pantauharga.vercel.app/Melon-MAHA2026-v2.html`

**Transition:** “Once the information is understood, we can turn learning into participation.”

### 06 — PLAY

**On-screen message:** Now, let’s put it to the test.

**Presenter cue:** Invite the audience into the interactive game. Briefly explain the objective, how to make a choice and how to reset before starting.

**Screen behaviour:** The dashboard recedes and three game cards enter with staggered motion, then continue a subtle floating loop. The cards represent `Tap The Fruits`, `Grab The Fruits` and `Buy & Sell Simulation`. Each card and the main CTA opens the live Sisda Games platform inside a large themed popup window, preserving the presentation context and avoiding a disruptive tab switch. `Esc`, the close button or the dimmed backdrop closes the window.

**Live platform:** `https://gamesv2.sisda.my/`

**Transition:** “But technology is not the end of the story. It must connect back to people.”

### 07 — EXPERIENCE / MAHA

**On-screen message:** The story continues beyond the screen.

**Visual and motion:** The supplied official MAHA 2026 poster returns as the Scene 07 focal visual. It has restrained floating, breathing-light and glass-sweep motion so it remains alive without distracting from the presenter. A prominent, presentation-scale QR card beside the poster links to `https://mahaofficial.com.my/`, uses a subtle floating loop and remains large enough to scan from the audience. The YouTube player starts preloading one scene earlier, from Scene 06, with captions disabled. Activating the CTA or advancing past Scene 07 resets the film to `0:00`, unmutes and starts it within the presenter action, pushes the camera into the poster, then resolves smoothly into the full-screen finale. Closing the finale pauses and resets the film to `0:00` for the next presentation run.

**Presenter cue:** Introduce MAHA as the point where information, agriculture and people meet in a wider physical experience. Before playing the finale, invite the audience to scan the QR code for more information from the official MAHA website. Then press `Next`, `Space` or `V` to move through the poster into the finale film and let the film carry the emotional close.

## Presenter controls

- `←` / `Page Up`: previous scene
- `→` / `Page Down` / `Space`: next scene; from Scene 07, launch the finale film
- `1`–`7`: jump directly to a scene
- `Home` / `End`: first / final scene
- `F`: browser fullscreen
- `Q`: open the Melon Supply Intelligence dashboard popup
- `V`: MAHA finale takeover
- `Esc`: close takeover or menu
- Top-right menu: touch/mouse scene index

## Scene-level visual direction

- **Base world:** near-black agricultural green, neon mint and violet accents, depth grid, particle field, technical HUD, telemetry and restrained film grain.
- **SEE:** lime highlight; melon feels mysterious and tactile.
- **KNOW:** mint accent; small data labels appear without claiming values. `SCAN` reveals the mesh-following holographic analysis layer.
- **BUILD / KIRO:** yellow–mint accent; scanning transition from the melon into a Malaysia data-command map, pulsing focus-state markers and a restrained price-motion graph.
- **MELON / MAHA:** official MAHA 2026 poster with restrained ambient motion; a narrative bridge explaining why melon anchors the visitor experience, with no video action.
- **PLAY:** orange accent; action becomes more prominent.
- **ASK / DASHBOARD:** cyan–mint accent; live dashboard preview with a light sweep and themed popup handoff.
- **EXPERIENCE / MAHA:** pale lime, cinematic fade and full-screen film.
- Typography is currently system-based for reliability. A licensed brand/display font may be introduced later.

## Current 3D and scan behaviour

- The GLB is loaded through Three.js `GLTFLoader` from `public/assets/earls-favourite-melon.glb`.
- The production GLB is approximately 8 MB, reduced from 24 MB by resizing its embedded PBR textures from 4096 px to 2048 px while retaining the original mesh geometry. The untouched source is archived outside `public/` under `work/source-assets/` and is excluded from builds.
- Bounding-box normalisation centres and scales the model consistently regardless of its original export coordinates.
- The Three.js renderer remains mounted through Scenes 01–03 so the scan story does not reload the model. It renders continuously only while the melon or scan is visible, idles while hidden by the Scene 03 transition, and unmounts for later scenes to release GPU resources.
- The melon is stationary at the centre of the hero and rotates slowly around the vertical axis. It does not orbit, bob, pulse, follow the pointer or change scale.
- Lighting uses a soft hemisphere light, a warm key light and a mint rim light to preserve the PBR texture in the dark interface.
- The scan wireframe is a clone of the actual GLB mesh, including the stalk. It is scaled only `1.003×` to avoid surface flicker.
- Scan mode uses an additive holographic shader, pulsing base lines, a bright travelling energy band and a soft cyan halo.
- The existing screen-space scan line continues to travel vertically within the visual bounds of the melon.

## Scan-to-data transition

Pressing `SCAN` runs a timed narrative sequence:

1. Clear any previously revealed insight cards.
2. Activate the mesh-following holographic scan and vertical scan line while Scene 01 remains visible.
3. Finish the full scan pass before moving to Scene 02 after approximately `2.1` seconds.
4. Display `SCAN COMPLETE` on Scene 02 as its own confirmation beat.
5. Remove the confirmation, then reveal the five insight cards sequentially after approximately `2.85` seconds. The cards never appear simultaneously with the active scan.
6. Change the action to `RESCAN` so the sequence can be repeated during rehearsal.

This sequence is the single route from Scene 01 to Scene 02. Clicking `SCAN`, pressing the next arrow, using the right-arrow/Page Down/space presenter keys, choosing Scene 02 from the index, or pressing `2` all trigger the same ordered scan transition.

The five current fields are:

- `Nama komoditi / Commodity name`
- `Gred / Grade`
- `Saiz / Size`
- `Indeks kematangan / Maturity index`
- `Asal / Origin`

Scene 02 intentionally shows category names only. Every box uses a small Bahasa Melayu descriptor above a larger English label. It does not display a commodity record, location, grade value, maturity value or size value.

## Copy rules

1. Never manufacture FAMA metrics, production totals, prices, grades, locations, grower profiles or performance claims.
2. Use `PLACEHOLDER`, `—`, or an explicit demo statement until the owner supplies and approves data.
3. Keep presenter copy short. Supporting facts belong in speaker notes or the interactive demo, not dense scene text.
4. “KIRO”, “Quick”, “MAHA” and FAMA naming/capitalisation need final stakeholder confirmation.
5. Prefer concrete words such as `origin`, `grade`, `harvest`, `people` and `tools` over abstract phrases such as `data becomes meaning`.
6. Every headline must be easy to say aloud and understandable on first hearing.
7. Decorative interface labels must not resemble verified measurements. No invented numbers may appear in telemetry.

## Required assets / decisions

| Priority | Item | Required format / decision | Current fallback |
|---|---|---|---|
| Integrated; approval pending | FAMA logo and brand guide | Supplied transparent PNG is used in the presentation header; confirm official approval, colours and clear-space rules | Bundled at `/public/assets/fama-logo.png` |
| Integrated; approval pending | DOA melon dataset and field definitions | Supplied CSV covering 2011–2024; confirm publication approval, owner and reporting definitions | Bundled read-only copy at `/public/assets/doa-melon-data.csv` |
| Integrated; approval pending | State/district production series | `Tembikai`, `Tembikai Susu`, `Tembikai Wangi`; planted HA, harvested HA and production MT | Scene 03 reads directly from the bundled supplied CSV; no values are fabricated |
| Complete | MAHA finale video | YouTube video `ni3vYEiDPzA` embedded from the supplied permanent watch link | Designed loading frame remains available |
| Complete | MAHA 2026 poster | Production WebP stored at `/public/assets/maha-2026-poster.webp`; lossless source archived outside `public/` | Used in Scenes 04 and 07; Scene 07 is the finale transition surface |
| Complete | Melon Supply Intelligence dashboard | `https://pantauharga.vercel.app/Melon-MAHA2026-v2.html` | Live iframe preview and themed popup; internet access required |
| Complete | Sisda Games link | `https://gamesv2.sisda.my/` opens in an in-presentation iframe popup from Scene 06 | Three supplied game-card screenshots are shown in the presentation |
| P1 | Kiro build footage | 16:9 MP4/WebM or approved live demo flow | Static transformation pipeline |
| P1 | Audio | Licensed soundtrack/sting; cue and target levels | MAHA YouTube finale requests sound at full volume from the presenter launch action; browser autoplay policy still requires that user interaction |
| P2 | Approved photos | MAHA/farmers/market/audience, usage rights | No stock imagery added |
| Complete | Optimised melon model | 8 MB GLB with 2048 px embedded PBR textures and unchanged mesh geometry | Original 24 MB source is archived outside the production bundle |

## Technical architecture

- **Runtime:** React 19 on Vinext/Vite, single route, Cloudflare-compatible output.
- **Presentation controller:** one top-level client component owns `activeScene`, menu and takeover state. Keyboard handling is centralised.
- **3D layer:** Three.js renderer mounted in a React effect; `GLTFLoader` loads the optimised 8 MB GLB; bounding-box centring corrects its pivot; a wrapper provides fixed-axis turntable rotation; capped device pixel ratio; rendering idles when the canvas is hidden and GPU resources are disposed on unmount.
- **Scan layer:** a cloned GLB mesh uses a custom additive wireframe shader. Shader uniforms control activation, pulse and the moving highlight band while preserving exact geometric alignment with the visible model.
- **Scene 03 data layer:** the supplied CSV is bundled read-only as `public/assets/doa-melon-data.csv`, parsed once per browser session, cached in memory and aggregated on demand by year, commodity, state and district. The current file covers 2011–2024, three melon commodities, 14 states/territories and 145 district names. Units are retained from the source columns: hectares (HA) and metric tonnes (MT).
- **Map and trend layer:** responsive Canvas 2D map loaded once and cached from `public/assets/malaysia-states.geojson`, paired with an SVG time-series chart. State shading is based on the filtered production total; clicking a state updates its three metrics and district table. Sabah and Sarawak are compositionally shifted closer to Peninsular Malaysia for presentation readability without changing polygon shapes, so the view is not distance-accurate. The compact overview and both focused popup views use the same aggregates.
- **Transitions:** CSS, with `prefers-reduced-motion` support. Scene 03 uses scale, blur, opacity and a vertical scan pass to transform the melon view into the map without breaking the visual story.
- **Game integration:** replace the `Launch local game` click handler with either a lazy-loaded component or a same-origin local route. If iframe-based, define origin and presenter escape behaviour.
- **Dashboard integration:** Scene 05 uses a non-interactive iframe preview and opens the supplied Melon Supply Intelligence URL in the shared external-experience popup. The popup retains the presentation context and closes by button, backdrop or `Esc`. The live host must permit iframe embedding and requires internet access.
- **Media optimisation:** the MAHA poster and three game cards are production WebP assets. Their source PNG files and the original melon model remain outside `public/`, so they are not copied into the production deployment.
- **Video:** full-screen YouTube embed using video ID `ni3vYEiDPzA`; no MP4 is included in the website bundle. The player begins preloading from Scene 06 rather than at initial page load. Playback requests autoplay, sound, loop and inline presentation from a presenter action. YouTube controls remain available so the presenter can pause or seek; the designed frame appears while the player loads. Internet access is required during the presentation.
- **Accessibility:** labelled controls, keyboard navigation, visible focus, live scene text, reduced-motion handling, touch menu. Final QA still requires contrast and screen-reader testing.
- **Data:** Scene 03 has a typed client-side adapter for the supplied static DOA CSV. It is not a live API or production datastore. Preserve the raw file separately from presentation copy and replace it through a versioned, approved data pipeline when one is available.

## Production acceptance checklist

- Final copy and terminology approved by FAMA.
- Data source, reporting date, caveats and ownership recorded.
- Every displayed number traceable to its source; no placeholders remain unnoticed.
- Game works offline/on venue network and has a fast reset.
- Melon Supply Intelligence dashboard tested under normal and slow venue-network conditions; presenter knows the offline fallback plan.
- MAHA video tested from local disk in the target browser, resolution and projector.
- Presenter laptop prevents sleep/notifications; browser zoom is 100%; audio output is verified.
- Full run-through fits the agreed slot with at least 60 seconds contingency.
- A non-WebGL fallback screenshot is added if target hardware requires it.
- The optimised 8 MB GLB is tested on the actual presentation laptop and venue connection; the original source remains outside the deployment bundle.

## Next build slice

1. Review and approve the revised English scene copy with FAMA stakeholders.
2. Visually approve the optimised GLB on the target projector and presentation laptop.
3. Replace the provisional FAMA mark and lock final brand tokens.
4. Connect approved melon data through a typed local JSON adapter.
5. Integrate the real game and define reset/return-to-deck behaviour.
6. Connect Quick and author approved fallback responses.
7. Add and cue the MAHA film/audio, then conduct projector and offline rehearsal.
