# Requirements Document

## Introduction

A single-page immersive web presentation titled "What Do You See In A Melon?" for FAMA (Federal Agricultural Marketing Authority of Malaysia). The presentation is operated live by a presenter for MAHA 2026 stakeholders, using one melon as a continuous visual anchor across seven scenes. Each scene progressively reframes the melon from a physical object through data, analytics, theme, interaction, participation and lived experience.

The application is built with React 19 on Vinext/Vite for Cloudflare deployment, uses Three.js for 3D rendering, Canvas 2D and SVG for data visualisation, and CSS animations for transitions.

## Glossary

- **Presentation**: The single-page web application comprising seven sequential scenes navigable by keyboard or touch
- **Scene**: One of seven discrete visual-and-narrative chapters of the Presentation
- **Presenter**: The human operator who controls the Presentation live in front of an audience
- **Melon_Model**: The optimised 8 MB GLB file (`earls-favourite-melon.glb`) rendered via Three.js with PBR materials
- **Scan_Sequence**: The timed holographic analysis animation triggered by the SCAN action that moves from Scene 01 to Scene 02
- **Insight_Cards**: Five category labels (Commodity name, Grade, Size, Maturity index, Origin) revealed after Scan_Sequence completes
- **Analytics_View**: The Scene 03 dual-panel visualisation consisting of a Malaysia production map and a production trend chart
- **Popup**: A themed overlay window used to display external content (games, dashboard) or detailed data views without leaving the Presentation
- **Finale**: The full-screen YouTube video experience launched from Scene 07 as the emotional close
- **DOA_Dataset**: The bundled static CSV file containing Department of Agriculture melon production records (2011–2024, 3 varieties, 14 states, 145 districts)
- **Navigation_Controller**: The centralised keyboard and click handler that manages scene transitions, menu state, and takeover modes
- **External_Popup**: The themed window component used to embed external URLs (Sisda Games, Melon Supply Intelligence dashboard) within the Presentation context
- **HUD**: Heads-up display decorative elements including corner brackets, telemetry labels, orbit rings, and side rail
- **Renderer**: The Three.js WebGLRenderer instance responsible for drawing the 3D melon and scan wireframe

## Requirements

### Requirement 1: Seven-Scene Sequential Presentation

**User Story:** As a presenter, I want to navigate through seven distinct scenes in sequence, so that I can tell a coherent story from surface observation to lived experience.

#### Acceptance Criteria

1. THE Presentation SHALL contain exactly seven scenes identified as SEE, KNOW, BUILD/KIRO, MELON/MAHA, ASK/DASHBOARD, PLAY, and EXPERIENCE/MAHA
2. WHEN a scene is active, THE Presentation SHALL display its unique headline, body copy, kicker text, and scene number
3. WHEN the presenter advances past Scene 07, THE Presentation SHALL launch the Finale instead of looping
4. THE Presentation SHALL display a progress indicator showing the current scene position relative to total scenes
5. WHEN a scene becomes active, THE Presentation SHALL animate the copy panel entry using a slide-up with fade transition

### Requirement 2: Keyboard and Touch Navigation

**User Story:** As a presenter, I want to control the presentation with keyboard shortcuts and touch, so that I can operate it smoothly during a live event.

#### Acceptance Criteria

1. WHEN the right arrow, Page Down, or Space key is pressed, THE Navigation_Controller SHALL advance to the next scene
2. WHEN the left arrow or Page Up key is pressed, THE Navigation_Controller SHALL return to the previous scene
3. WHEN a number key 1 through 7 is pressed, THE Navigation_Controller SHALL jump directly to the corresponding scene
4. WHEN the Home key is pressed, THE Navigation_Controller SHALL jump to Scene 01
5. WHEN the End key is pressed, THE Navigation_Controller SHALL jump to Scene 07
6. WHEN the F key is pressed, THE Navigation_Controller SHALL toggle browser fullscreen mode
7. WHEN the Q key is pressed, THE Navigation_Controller SHALL open the Melon Supply Intelligence dashboard in an External_Popup
8. WHEN the V key is pressed and the Finale is not active, THE Navigation_Controller SHALL launch the Finale
9. WHEN the V key is pressed and the Finale is active, THE Navigation_Controller SHALL close the Finale
10. WHEN the Escape key is pressed, THE Navigation_Controller SHALL close the active Popup, External_Popup, Finale, or scene menu
11. THE Presentation SHALL provide on-screen previous and next navigation buttons in the bottom chapter navigation bar
12. THE Presentation SHALL provide a scene-dots quick navigation strip with dot indicators for each scene
13. THE Presentation SHALL provide a slide-out scene menu accessible from the top-right hamburger button

### Requirement 3: 3D Melon Model Rendering

**User Story:** As a presenter, I want a realistic 3D melon model as the visual centrepiece, so that the audience immediately recognises the subject.

#### Acceptance Criteria

1. THE Renderer SHALL load the Melon_Model from `/assets/earls-favourite-melon.glb` using Three.js GLTFLoader
2. THE Renderer SHALL calculate the bounding box, recentre the mesh, and scale it to a consistent size regardless of export coordinates
3. THE Melon_Model SHALL rotate slowly around its vertical axis at a constant speed
4. THE Melon_Model SHALL remain fixed in position and scale without orbiting, bobbing, pulsing, or following the pointer
5. THE Renderer SHALL use hemisphere light, warm key light, and mint rim light to preserve PBR textures in the dark interface
6. THE Renderer SHALL cap the device pixel ratio at 2 to limit GPU load
7. THE Renderer SHALL render continuously only while the melon or scan is visible in Scenes 01 through 02
8. WHILE Scene 03 or later is active, THE Renderer SHALL idle or unmount to release GPU resources
9. THE Renderer SHALL generate ambient particles distributed in a sphere around the melon with subtle rotation

### Requirement 4: Holographic Scan Sequence

**User Story:** As a presenter, I want a holographic scanning animation, so that I can visually dramatise the act of looking beneath the melon's surface.

#### Acceptance Criteria

1. WHEN the SCAN button is clicked or any advance-to-Scene-02 action is triggered, THE Scan_Sequence SHALL activate the holographic wireframe overlay and vertical scan line
2. THE Scan_Sequence SHALL use a cloned GLB mesh scaled at 1.003x with an additive wireframe shader displaying pulsing base lines and a travelling energy band
3. THE Scan_Sequence SHALL complete the scan pass and transition to Scene 02 after approximately 2.1 seconds
4. WHEN Scene 02 becomes active after scanning, THE Presentation SHALL display a "SCAN COMPLETE" confirmation overlay
5. WHEN the confirmation disappears (approximately 2.85 seconds from scan start), THE Presentation SHALL reveal the five Insight_Cards sequentially with staggered animation
6. THE Insight_Cards SHALL display only category names (Bahasa Melayu sublabel above English label) without showing actual values
7. WHILE scanning is in progress, THE SCAN button SHALL be disabled and display "SCANNING"
8. WHEN the Scan_Sequence has completed at least once, THE SCAN button SHALL display "RESCAN" to allow repeating the sequence
9. THE Scan_Sequence SHALL be the single route to enter Scene 02 regardless of whether triggered by button, keyboard, or menu

### Requirement 5: Agricultural Data Visualisation (Scene 03)

**User Story:** As a presenter, I want to show DOA melon production data on an interactive map and trend chart, so that the audience sees how structured agricultural data reveals patterns.

#### Acceptance Criteria

1. WHEN Scene 03 becomes active, THE Analytics_View SHALL display a compact two-panel layout with a Malaysia production map and a production trend chart
2. THE Analytics_View SHALL parse the DOA_Dataset CSV once per session, cache it in memory, and aggregate on demand by year, commodity, state, and district
3. THE Analytics_View map SHALL shade each state using combined 2024 production across all three varieties (Watermelon, Honeydew, Rockmelon)
4. THE Analytics_View map SHALL display connected label boxes for each state showing the state name and non-zero variety production figures in metric tonnes
5. THE Analytics_View trend chart SHALL display three polyline series (one per variety) across 2011–2024 with colour-coded legend
6. WHEN the presenter hovers over the trend chart, THE Analytics_View SHALL display a crosshair, data points, and a tooltip with year and per-variety production figures
7. THE Analytics_View SHALL display a persistent figures panel beside the compact trend showing exact production values that update on hover
8. WHEN the map panel is clicked, THE Analytics_View SHALL open a large Popup with year filter, variety filter, state selection via polygon hit detection, three state metric totals, and a district-level data table
9. WHEN the trend panel is clicked, THE Analytics_View SHALL open a large Popup titled "Production trend by variety" showing the complete 2011–2024 series with hover details
10. THE Analytics_View Popups SHALL close from their close button, backdrop click, or Escape key without leaving the Presentation
11. THE Analytics_View SHALL display the source attribution "DOA CROP PRODUCTION STATISTICS" beneath the panels
12. THE Analytics_View map SHALL compositionally shift Sabah and Sarawak closer to Peninsular Malaysia for presentation readability without altering polygon shapes

### Requirement 6: MAHA 2026 Poster Display (Scenes 04 and 07)

**User Story:** As a presenter, I want to display the official MAHA 2026 poster with restrained ambient motion, so that I can anchor the melon theme and provide a visual bridge between analytical and experiential content.

#### Acceptance Criteria

1. WHEN Scene 04 is active, THE Presentation SHALL display the MAHA 2026 poster image from `/assets/maha-2026-poster.webp` with restrained floating and breathing-light motion
2. WHEN Scene 07 is active, THE Presentation SHALL display the same MAHA 2026 poster with a QR code card linking to `https://mahaofficial.com.my/`
3. THE Presentation SHALL display a poster halo glow effect and a glass-sweep animation overlay on the poster in both scenes
4. THE QR code card in Scene 07 SHALL be large enough to scan from the audience and use a subtle floating loop animation
5. THE Presentation SHALL display contextual metadata below the poster ("MAHA 2026 · MELON THEME" in Scene 04, "MAHA 2026" with "THE EXPERIENCE CONTINUES" in Scene 07)

### Requirement 7: External Experience Popup System

**User Story:** As a presenter, I want to open external web experiences (games, dashboard) in a themed popup window, so that I can demonstrate live tools without leaving the presentation context.

#### Acceptance Criteria

1. WHEN an external experience is triggered, THE External_Popup SHALL display a loading state with a spinner and "LOADING EXPERIENCE" text
2. WHEN the iframe content finishes loading, THE External_Popup SHALL transition to a "content-ready" state revealing the iframe
3. THE External_Popup SHALL display a header with the experience title, "LIVE EXPERIENCE" subtitle, and a close button
4. THE External_Popup SHALL close when the close button is clicked, the backdrop is clicked, or the Escape key is pressed
5. THE External_Popup SHALL allow fullscreen and autoplay permissions on the embedded iframe
6. THE External_Popup SHALL use a dark semi-transparent backdrop with a themed window frame consistent with the presentation design

### Requirement 8: Melon Supply Intelligence Dashboard (Scene 05)

**User Story:** As a presenter, I want to preview and open the Melon Supply Intelligence dashboard, so that I can demonstrate how melon information can be explored conversationally.

#### Acceptance Criteria

1. WHEN Scene 05 is active, THE Presentation SHALL display a non-interactive framed iframe preview of the dashboard at `https://pantauharga.vercel.app/Melon-MAHA2026-v2.html`
2. WHEN the CTA button is clicked or the Q key is pressed, THE Presentation SHALL open the full dashboard in an External_Popup
3. THE dashboard preview section SHALL display a "LIVE DASHBOARD" header with "MELON SUPPLY INTELLIGENCE · MAHA 2026" title
4. THE dashboard preview iframe SHALL have tabIndex -1 to prevent accidental keyboard focus during navigation

### Requirement 9: Sisda Games Integration (Scene 06)

**User Story:** As a presenter, I want to show three interactive game cards and open the Sisda Games platform, so that I can invite audience participation.

#### Acceptance Criteria

1. WHEN Scene 06 is active, THE Presentation SHALL display three game cards (Tap The Fruits, Grab The Fruits, Buy & Sell Simulation) with staggered entry animations
2. THE game cards SHALL display a screenshot image, title, genre/duration metadata, and an external link indicator
3. THE game cards SHALL use a continuous subtle floating animation after initial entry
4. WHEN any game card or the main CTA is clicked, THE Presentation SHALL open `https://gamesv2.sisda.my/` in an External_Popup
5. THE game showcase SHALL display a header ("03 PLAYABLE EXPERIENCES") and a platform link footer with the domain name
6. WHEN hovered, THE game cards SHALL scale up slightly with a 3D perspective tilt effect and enhanced border glow

### Requirement 10: YouTube Finale Video

**User Story:** As a presenter, I want a full-screen finale film experience that transitions smoothly from the poster, so that the presentation ends with emotional impact.

#### Acceptance Criteria

1. WHEN the Finale is launched from Scene 07, THE Presentation SHALL reset the YouTube player to 0:00, unmute, set volume to 100, and start playback
2. THE Finale SHALL use a transitioning state (approximately 820ms) to animate from the poster into full-screen video
3. WHILE the YouTube player is loading, THE Presentation SHALL display a designed fallback frame with "MAHA · FINALE" heading and scene text
4. WHEN the YouTube iframe reports loaded and the active scene is 06 or later, THE Presentation SHALL mark the video as ready and show the player
5. THE YouTube player SHALL begin preloading from Scene 06 onwards rather than at initial page load
6. THE Finale SHALL display controls showing "AUDIO ON · YOUTUBE PLAYER" and a close button
7. WHEN the Finale is closed, THE Presentation SHALL pause the video and reset it to 0:00 for the next presentation run
8. THE YouTube embed SHALL request autoplay, loop, inline presentation, modest branding, no related videos, and captions disabled
9. WHILE the Finale is open, THE Navigation_Controller SHALL block all keyboard input except Escape and V

### Requirement 11: Dark Futuristic Visual Design

**User Story:** As a presenter, I want a dark, futuristic HUD-style interface with neon accents, so that the presentation looks technically sophisticated on a projector.

#### Acceptance Criteria

1. THE Presentation SHALL use a near-black background with radial gradient accents in mint and violet
2. THE Presentation SHALL display a perspective depth grid plane with continuous drift animation
3. THE Presentation SHALL apply a subtle film grain overlay across the entire viewport
4. THE Presentation SHALL display an ambient beam light sweep with slow oscillation
5. WHEN a scene is active, THE Presentation SHALL apply a scene-specific accent colour (lime for SEE, mint for KNOW, yellow for BUILD, default for MELON, cyan for ASK, orange for PLAY, pale lime for EXPERIENCE)
6. THE Presentation SHALL display HUD corner brackets in the visual panel and telemetry status labels
7. THE Presentation SHALL display orbit ring decorations with pulsing opacity animation around the melon
8. THE Presentation SHALL use a side rail with vertical text "FAMA / DX-01" and "INTERACTIVE STORY"
9. THE Presentation SHALL render a custom circular cursor with crosshair dot on fine-pointer devices while hiding the system cursor

### Requirement 12: Scene Transitions and Motion

**User Story:** As a presenter, I want smooth, cinematic transitions between scenes, so that the narrative flow feels continuous.

#### Acceptance Criteria

1. WHEN transitioning to Scene 03, THE Presentation SHALL scale down, blur, and fade the melon while materialising the Analytics_View with a vertical scan pass effect
2. WHEN transitioning to Scene 06, THE Presentation SHALL fade, scale, and blur the melon while bringing in game cards with staggered 3D entry
3. WHEN transitioning to Scene 04 or 07, THE Presentation SHALL display the poster with a materialisation animation
4. THE Presentation SHALL hide the melon-related elements (canvas, shadow, orbits, spec labels, telemetry, scan button, HUD corners) in scenes that use alternative visual content
5. WHEN `prefers-reduced-motion` is active, THE Presentation SHALL reduce all animation and transition durations to near-zero

### Requirement 13: Responsive Layout

**User Story:** As a presenter, I want the presentation to work on both desktop projector and mobile devices, so that it can be demonstrated on different screens.

#### Acceptance Criteria

1. THE Presentation SHALL use a two-column grid layout (46% copy, 54% visual) on viewports wider than 800px
2. WHEN the viewport is 800px or narrower, THE Presentation SHALL stack the visual panel above the copy panel with an overlay gradient
3. WHEN the viewport is 800px or narrower, THE Presentation SHALL hide the side rail, scene dots, HUD corners, and "PRESENTATION MODE" label
4. WHEN the viewport is 800px or narrower, THE Presentation SHALL reduce insight card sizes, typography, and spacing for touch operation
5. THE Presentation SHALL use `100svh` for the main height to account for mobile browser chrome

### Requirement 14: Header and Brand Identity

**User Story:** As a presenter, I want a consistent branded header, so that FAMA identity is always visible.

#### Acceptance Criteria

1. THE Presentation SHALL display a top bar with the FAMA logo from `/assets/fama-logo.png` and the text "FAMA · DIGITAL EXPERIENCE"
2. THE Presentation SHALL display a pulsing green status dot and "PRESENTATION MODE" indicator in the top bar
3. WHEN the brand button is clicked, THE Presentation SHALL return to Scene 01
4. THE Presentation SHALL provide fullscreen toggle and scene menu buttons in the top-right corner

### Requirement 15: Data Integrity and Copy Rules

**User Story:** As a stakeholder, I want the presentation to only show verified data and never fabricate metrics, so that displayed information is trustworthy.

#### Acceptance Criteria

1. THE Presentation SHALL source all displayed numeric values exclusively from the bundled DOA_Dataset CSV
2. THE Presentation SHALL display category labels only (not values) in Scene 02 Insight_Cards
3. THE Presentation SHALL retain source units (hectares for area, metric tonnes for production) from the DOA_Dataset without conversion
4. THE Presentation SHALL display the data source attribution "DOA CROP PRODUCTION STATISTICS" on any view showing DOA figures
5. THE Presentation SHALL not display fabricated numbers in telemetry labels or decorative interface elements

### Requirement 16: Accessibility

**User Story:** As a user with accessibility needs, I want the presentation to support keyboard navigation and screen readers, so that I can access the content.

#### Acceptance Criteria

1. THE Presentation SHALL provide visible focus indicators (2px solid accent with 4px offset) on all interactive elements
2. THE Presentation SHALL use `aria-live="polite"` on the stage region and insight layer so screen readers announce scene changes
3. THE Presentation SHALL label the 3D canvas with `aria-label="Interactive 3D rock melon model"`
4. THE Presentation SHALL label all navigation sections, maps, charts, and dialogs with descriptive `aria-label` attributes
5. THE Presentation SHALL mark dialog popups with `role="dialog"` and `aria-modal="true"`
6. THE Presentation SHALL mark decorative elements with `aria-hidden="true"`
7. WHEN `prefers-reduced-motion` is active, THE Presentation SHALL suppress motion-intensive animations

### Requirement 17: Performance and Resource Management

**User Story:** As a presenter on a venue laptop, I want the application to manage GPU and memory resources efficiently, so that performance remains smooth throughout the presentation.

#### Acceptance Criteria

1. THE Renderer SHALL cap device pixel ratio at 2
2. WHILE the melon is not visible (Scene 03 onward), THE Renderer SHALL stop rendering frames and idle
3. WHEN the component unmounts, THE Renderer SHALL dispose all geometries, materials, textures, and the WebGL context
4. THE Presentation SHALL load the DOA_Dataset and GeoJSON once per session and cache the parsed result in memory
5. THE Presentation SHALL begin YouTube preloading only from Scene 06 onward, not at initial page load
6. THE Presentation SHALL use optimised WebP format for poster and game card images
7. THE Melon_Model SHALL use 2048px embedded PBR textures (reduced from 4096px source) to balance quality and file size

### Requirement 18: Page Metadata and Configuration

**User Story:** As a developer, I want correct page metadata and language configuration, so that the application is properly identified and localised.

#### Acceptance Criteria

1. THE Presentation SHALL set the page title to "What Do You See in a Melon? | FAMA"
2. THE Presentation SHALL set the meta description to "From Agricultural Data to Digital Experience — an immersive FAMA presentation."
3. THE Presentation SHALL set the HTML lang attribute to "en-MY"
4. THE Presentation SHALL use Geist and Geist Mono fonts loaded via the font system with CSS custom properties
