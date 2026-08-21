# Implementation Plan: FAMA Melon Presentation

## Overview

A single-page immersive web presentation ("What Do You See In A Melon?") built as a monolithic React 19 client component with Three.js 3D rendering, Canvas 2D geographic visualisation, SVG charting, and CSS-driven transitions. The implementation follows a layered approach: project scaffolding → layout and metadata → core navigation → 3D rendering → data visualisation → external integrations → visual polish → testing.

## Tasks

- [ ] 1. Set up project structure, configuration, and layout
  - [ ] 1.1 Initialise Vinext/Vite project with Cloudflare Workers configuration
    - Create `package.json` with React 19, Three.js, Vinext, Vite, Wrangler, TailwindCSS, TypeScript, ESLint dependencies
    - Create `vite.config.ts` with Cloudflare and React plugins
    - Create `tsconfig.json` with React JSX and module resolution settings
    - Create `worker/index.ts` with image optimisation proxy and Vinext handler delegation
    - Create `wrangler.jsonc` with site configuration, D1, and R2 bindings
    - _Requirements: 18.1, 18.2, 18.3, 18.4_

  - [ ] 1.2 Create layout component with metadata and fonts
    - Create `app/layout.tsx` as server component with HTML lang="en-MY"
    - Set page title "What Do You See in a Melon? | FAMA" and meta description
    - Load Geist and Geist Mono fonts via the font system with CSS custom properties
    - Import `globals.css`
    - _Requirements: 18.1, 18.2, 18.3, 18.4_

  - [ ] 1.3 Create base CSS with dark theme foundation and custom properties
    - Create `app/globals.css` with CSS reset and dark near-black background
    - Define colour custom properties (mint, lime, violet, orange, cyan accent palette)
    - Set up `100svh` height, system cursor hiding on fine-pointer devices
    - Add film grain overlay, perspective grid plane, and ambient beam light sweep
    - Add `@media (prefers-reduced-motion: reduce)` rule to suppress animations
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 13.5, 16.7_

  - [ ] 1.4 Place static assets in public directory
    - Add `public/assets/earls-favourite-melon.glb` (3D model)
    - Add `public/assets/doa-melon-data.csv` (DOA production dataset)
    - Add `public/assets/malaysia-states.geojson` (state boundary polygons)
    - Add `public/assets/fama-logo.png`, `public/assets/maha-2026-poster.webp`
    - Add `public/assets/game-tap-fruits.webp`, `game-grab-fruits.webp`, `game-buy-sell.webp`
    - _Requirements: 3.1, 5.2, 5.3, 6.1, 9.1, 17.6_

- [ ] 2. Implement core Home component with navigation state machine
  - [ ] 2.1 Create Home component shell with scene definitions and state
    - Create `app/page.tsx` as "use client" component
    - Define `scenes` array with 7 entries (id, number, label, kicker, title JSX, body text)
    - Define `melonInsights` array (5 items with id, icon, label, sublabel, position)
    - Define `gameCards` array (3 items with id, image, title, meta)
    - Set up all useState hooks: active, menuOpen, externalPopup, scanning, scanConfirmed, scanComplete, finale states, cursor, fullscreen
    - _Requirements: 1.1, 1.2, 1.4_

  - [ ] 2.2 Implement keyboard navigation controller
    - Add `useEffect` keydown listener with full keyboard mapping
    - Implement ArrowRight/PageDown/Space → advance, ArrowLeft/PageUp → retreat
    - Implement number keys 1-7 → direct jump, Home → scene 1, End → scene 7
    - Implement F → fullscreen toggle, Q → open dashboard popup, V → toggle finale
    - Implement Escape → close popup/finale/menu hierarchy
    - Block all keys except Escape and V when finale is open
    - Block all keys except Escape when external popup is open
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

  - [ ] 2.3 Implement `go()` navigation function with scan-gate logic
    - Enforce scan-to-enter-scene-2 rule (any navigation to scene 2 triggers runScan)
    - Enforce finale launch when advancing past scene 7
    - Clamp navigation targets to [0, 6]
    - Reset scan/finale states appropriately on scene change
    - _Requirements: 1.3, 4.9, 10.9_

  - [ ] 2.4 Implement scan sequence with timed state transitions
    - Create `runScan()` callback with early return if already scanning
    - Set scanning=true, then after 2100ms transition to scene 2 and set scanConfirmed
    - After 2850ms from start, clear scanConfirmed and set scanComplete
    - Store timeout handles in ref for cleanup on unmount
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 4.7, 4.8, 4.9_

  - [ ] 2.5 Render header, navigation bar, scene dots, and scene menu
    - Render top bar with FAMA logo, brand button (returns to scene 1), status dot, fullscreen and menu buttons
    - Render bottom chapter-nav with prev/next buttons and progress bar
    - Render scene-dots quick navigation strip
    - Render slide-out scene menu with keyboard shortcut hints
    - _Requirements: 2.11, 2.12, 2.13, 14.1, 14.2, 14.3, 14.4_

- [ ] 3. Checkpoint - Ensure navigation and layout render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implement 3D melon rendering (MelonCanvas component)
  - [ ] 4.1 Create MelonCanvas component with Three.js lifecycle
    - Create WebGLRenderer with alpha, antialias, powerPreference "high-performance", pixel ratio capped at 2
    - Set up PerspectiveCamera (32° FOV) at z=6.2
    - Add HemisphereLight (0xcaffed/0x101008, 2.1), warm DirectionalLight key (4.2), mint DirectionalLight rim (3.3)
    - Generate 520 particles in spherical shell (radius 2.4–6.2) with slow rotation
    - Implement resize handler and animation loop with idle when not active (180ms setTimeout)
    - Full disposal on unmount (geometries, materials, textures, renderer, DOM element)
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 17.1, 17.2, 17.3_

  - [ ] 4.2 Implement GLB model loading with bounding box centring
    - Load `/assets/earls-favourite-melon.glb` via GLTFLoader
    - Calculate bounding box, recentre mesh, scale to fit 3.45 units
    - Set up material properties (envMapIntensity, roughness, anisotropy)
    - Add constant Y-axis rotation at t*0.11
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ] 4.3 Implement holographic scan wireframe shader
    - Clone GLB mesh at 1.003× scale
    - Write custom GLSL vertex/fragment shaders with travelling energy band via sin(uTime)
    - Use additive blending, wireframe mode, transparent depth-write-off
    - Animate uActive uniform to smoothly toggle scan visibility
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 5. Implement agricultural data visualisation (SceneThreeAnalytics)
  - [ ] 5.1 Create SceneThreeAnalytics component with data loading and state
    - Create `app/scene-three-analytics.tsx` as "use client" component
    - Define types: RecordRow, Metric, GeoFeature
    - Implement module-level promise caching for CSV and GeoJSON fetches
    - Implement `parseCsv()` function (strip BOM, split lines, map to typed objects)
    - Set up component state: year, commodity, selected state, popup mode
    - Compute derived data via useMemo: filtered rows, stateMetrics, overviewMetrics, overviewBreakdown, districts
    - _Requirements: 5.1, 5.2, 5.3, 17.4_

  - [ ]* 5.2 Write property test for CSV parsing (Property 1)
    - **Property 1: CSV parsing preserves data integrity**
    - **Validates: Requirements 5.2, 15.1**
    - Use fast-check to generate arbitrary valid CSV rows
    - Assert parseCsv produces RecordRow with matching numeric and string fields

  - [ ]* 5.3 Write property test for state aggregation (Property 2)
    - **Property 2: State aggregation correctness**
    - **Validates: Requirements 5.3, 15.1**
    - Use fast-check to generate sets of RecordRow records with arbitrary year/commodity/state
    - Assert aggregated Metric.production equals sum of matching records

  - [ ]* 5.4 Write property test for trend series computation (Property 3)
    - **Property 3: Trend series computation correctness**
    - **Validates: Requirements 5.5, 15.1**
    - Use fast-check to generate sets of RecordRow records
    - Assert annual series value for a given year/commodity equals sum of matching records

  - [ ] 5.5 Implement MalaysiaMetricMap (Canvas 2D)
    - Load GeoJSON features asynchronously
    - Implement Mercator-like projection with Borneo shift (lon > 108 shifts -3.2°)
    - Render state polygons with production-intensity fill (sqrt scaling)
    - Implement compact mode with grouped label boxes showing variety breakdown per state
    - Implement hit detection via point-in-polygon for interactive state selection
    - Redraw on resize and data changes
    - _Requirements: 5.3, 5.4, 5.8, 5.12_

  - [ ] 5.6 Implement ProductionTrend (SVG)
    - Compute 3 series across unique years from RecordRow data
    - Render polylines in padded SVG viewBox with colour-coded legend
    - Implement hover interaction: crosshair, data points, tooltip
    - Implement compact mode with persistent aria-live figures panel
    - _Requirements: 5.5, 5.6, 5.7_

  - [ ] 5.7 Implement analytics popup dialogs (map drilldown and trend drilldown)
    - Map popup: year filter, variety filter, state selection, metric totals, district table
    - Trend popup: full-width chart with hover details
    - Close via button, backdrop click, or Escape
    - Display source attribution "DOA CROP PRODUCTION STATISTICS"
    - _Requirements: 5.8, 5.9, 5.10, 5.11_

- [ ] 6. Checkpoint - Ensure data visualisation renders correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement scene-specific content and external integrations
  - [ ] 7.1 Implement MAHA poster display (Scenes 04 and 07)
    - Render poster image from `/assets/maha-2026-poster.webp` with floating and breathing-light CSS animation
    - Add poster halo glow and glass-sweep overlay
    - In Scene 07: add QR code card linking to mahaofficial.com.my with floating animation
    - Display contextual metadata below poster per scene
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 7.2 Implement External Popup system
    - Create popup with loading state (spinner + "LOADING EXPERIENCE" text)
    - Transition to content-ready state on iframe load
    - Render header with title, "LIVE EXPERIENCE" subtitle, and close button
    - Close on button click, backdrop click, or Escape
    - Allow fullscreen and autoplay iframe permissions
    - Use dark semi-transparent backdrop with themed window frame
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ] 7.3 Implement Melon Supply Intelligence dashboard preview (Scene 05)
    - Render non-interactive framed iframe preview with tabIndex=-1
    - Add CTA button and Q keyboard shortcut to open full dashboard in External Popup
    - Display "LIVE DASHBOARD" header and title
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ] 7.4 Implement Sisda Games integration (Scene 06)
    - Render 3 game cards with staggered entry animations
    - Display screenshot, title, genre/duration metadata, external link indicator
    - Add continuous floating animation and hover scale/tilt effect
    - Open gamesv2.sisda.my in External Popup on click
    - Display header ("03 PLAYABLE EXPERIENCES") and platform link footer
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ] 7.5 Implement YouTube Finale video experience
    - Create finale overlay with YouTube iframe embed
    - Implement launchFinale(): reset to 0:00, unmute, volume 100, playVideo via postMessage
    - Implement closeFinale(): pause and reset to 0:00
    - Add 820ms transitioning state animation from poster to video
    - Display fallback frame while loading ("MAHA · FINALE" heading)
    - Begin YouTube preloading from Scene 06 onward (conditional iframe src)
    - Display controls with "AUDIO ON · YOUTUBE PLAYER" and close button
    - Configure embed: autoplay, loop, inline, modest branding, no related videos, captions disabled
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9_

- [ ] 8. Implement visual design, transitions, and accessibility
  - [ ] 8.1 Implement scene-specific accent colours and HUD elements
    - Apply scene-specific CSS classes with accent colour variables per scene
    - Render HUD corner brackets, telemetry labels, orbit rings with pulsing animation
    - Add side rail with vertical text "FAMA / DX-01" and "INTERACTIVE STORY"
    - Implement custom circular cursor with crosshair on fine-pointer devices
    - _Requirements: 11.5, 11.6, 11.7, 11.8, 11.9_

  - [ ] 8.2 Implement scene transitions and motion CSS
    - Scene 03 transition: scale down, blur, fade melon; materialise Analytics_View with scan pass
    - Scene 06 transition: fade/scale/blur melon; staggered 3D game card entry
    - Scene 04/07 transition: poster materialisation animation
    - Hide melon-related elements in non-melon scenes
    - Ensure prefers-reduced-motion reduces all durations to near-zero
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ] 8.3 Implement responsive layout
    - Two-column grid (46% copy, 54% visual) above 800px
    - Stacked layout with overlay gradient at 800px or narrower
    - Hide side rail, scene dots, HUD corners, "PRESENTATION MODE" on mobile
    - Reduce insight card sizes, typography, spacing for touch
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [ ] 8.4 Add accessibility attributes
    - Add visible focus indicators (2px solid accent, 4px offset) on all interactive elements
    - Add aria-live="polite" on stage region and insight layer
    - Label 3D canvas with aria-label="Interactive 3D rock melon model"
    - Label navigation sections, maps, charts, dialogs with descriptive aria-labels
    - Mark dialog popups with role="dialog" and aria-modal="true"
    - Mark decorative elements with aria-hidden="true"
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_

- [ ] 9. Checkpoint - Ensure full application renders and all scenes work
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Final testing and integration
  - [ ] 10.1 Wire all components together and verify end-to-end flow
    - Ensure MelonCanvas conditionally renders only in scenes 0-2
    - Ensure SceneThreeAnalytics renders in scene 2 (BUILD/KIRO)
    - Ensure poster stages render in scenes 3 and 6
    - Ensure game showcase renders in scene 5
    - Ensure dashboard preview renders in scene 4
    - Ensure finale overlay preloads from scene 5 onward
    - Verify all keyboard shortcuts produce correct navigation
    - _Requirements: 1.1, 1.3, 3.7, 3.8, 10.5, 17.5_

  - [ ]* 10.2 Write integration test for rendered HTML structure
    - Extend `tests/rendered-html.test.mjs` to validate output HTML
    - Verify scene content elements, navigation structure, and accessibility attributes
    - _Requirements: 1.1, 16.4, 16.5, 16.6_

- [ ] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document using fast-check
- Unit tests validate specific examples and edge cases
- The application is a single-route SPA; `app/page.tsx` contains the bulk of the implementation (~400 lines)
- `app/scene-three-analytics.tsx` is extracted as a separate module for the data visualisation layer (~200 lines)
- All styling is in `app/globals.css` (~800+ lines) — no component-level CSS modules
- Module-level promise caching is used for data fetches instead of React state or external libraries
- The Three.js lifecycle is self-contained in MelonCanvas with full cleanup on unmount

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.4"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.4", "2.5"] },
    { "id": 4, "tasks": ["4.1", "5.1"] },
    { "id": 5, "tasks": ["4.2", "4.3", "5.2", "5.3", "5.4", "5.5", "5.6"] },
    { "id": 6, "tasks": ["5.7", "7.1", "7.2"] },
    { "id": 7, "tasks": ["7.3", "7.4", "7.5"] },
    { "id": 8, "tasks": ["8.1", "8.2", "8.3", "8.4"] },
    { "id": 9, "tasks": ["10.1"] },
    { "id": 10, "tasks": ["10.2"] }
  ]
}
```
