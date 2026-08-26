"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import SceneThreeAnalytics from "./scene-three-analytics";

const scenes = [
  { id: "see", number: "01", label: "SEE", kicker: "Start with the surface", title: <>What do you see<br />in a melon?</>, body: "At first, we see a familiar fruit—its shape, colour and texture. But there is more here than meets the eye." },
  { id: "know", number: "02", label: "KNOW", kicker: "Look beneath the surface", title: <>Every melon<br />carries information.</>, body: "We can learn where it came from, when it was harvested, how it was graded and how it moves through the supply chain." },
  { id: "build", number: "03", label: "BUILD / KIRO", kicker: "Turn information into action", title: <>From data, we see<br />the bigger picture.</>, body: "With Kiro, approved agricultural data can reveal growing areas and show how prices move over time." },
  { id: "melon-theme", number: "04", label: "MELON / MAHA", kicker: "Why melon at MAHA?", title: <>One fruit.<br />Many stories to discover.</>, body: "Melon is a central theme at MAHA 2026—inviting visitors to discover its varieties, origins and the information behind every fruit." },
  { id: "problem", number: "05", label: "PROBLEM / SOLUTION", kicker: "From problem to solution", title: <>A clear problem.<br />A focused idea.</>, body: "How do we share melon information and spark visitor interest at MAHA? We turned that question into a plan—discussed it with Kiro, then translated the idea into a game and a dedicated melon dashboard so visitors can explore and play at the same time." },
  { id: "ask", number: "06", label: "ASK / DASHBOARD", kicker: "Move from search to conversation", title: <>Ask a clear question.<br />See the data clearly.</>, body: "Melon Supply Intelligence brings melon information into one interactive dashboard for a clearer conversation." },
  { id: "play", number: "07", label: "PLAY", kicker: "Learn by doing", title: <>Now, let’s put it<br />to the test.</>, body: "This interactive game turns sorting, timing and decision-making into a simple hands-on experience." },
  { id: "experience", number: "08", label: "EXPERIENCE / MAHA", kicker: "Bring technology back to people", title: <>The story continues<br />beyond the screen.</>, body: "At MAHA, digital tools become part of a wider experience—connecting information, agriculture and people." },
] as const;

const problemFlow = [
  { id: "problem", tag: "PROBLEM", title: "Engage the visitor", body: "How do we share melon information and spark real interest during MAHA?" },
  { id: "idea", tag: "IDEA", title: "Explore + play", body: "Let visitors discover melon data while having fun—learning by doing." },
  { id: "kiro", tag: "KIRO", title: "Plan with Kiro", body: "We discussed the idea with Kiro and shaped it into a clear build plan." },
  { id: "output", tag: "OUTPUT", title: "Dashboard + games", body: "A dedicated melon dashboard and interactive games, delivered together." },
] as const;

const melonInsights = [
  { id: "commodity", icon: "ID", label: "Commodity name", sublabel: "Nama komoditi", position: "bottom-left" },
  { id: "origin", icon: "⌖", label: "Origin", sublabel: "Asal", position: "top-left" },
  { id: "grade", icon: "◇", label: "Grade", sublabel: "Gred", position: "top-right" },
  { id: "maturity", icon: "◉", label: "Maturity index", sublabel: "Indeks kematangan", position: "mid-left" },
  { id: "size", icon: "↔", label: "Size", sublabel: "Saiz", position: "mid-right" },
] as const;

const gameCards = [
  { id: "tap", image: "/assets/game-tap-fruits.webp", title: "Tap The Fruits", meta: "Action · 60 sec" },
  { id: "grab", image: "/assets/game-grab-fruits.webp", title: "Grab The Fruits", meta: "Racing · Fuel challenge" },
  { id: "market", image: "/assets/game-buy-sell.webp", title: "Buy & Sell Simulation", meta: "Strategy · 3 min" },
] as const;

const introBubbles = [
  { from: "me", text: "Kiro, can you build a presentation website about melon for me?" },
  { from: "kiro", text: "Sure. What's the concept?" },
  { from: "me", text: "I want to tell a story—start with a 3D melon, scan it to reveal data beneath the surface, then show production analytics on a map, explain why melon matters, present a live dashboard, let visitors play games, and close with a finale video." },
  { from: "kiro", text: "That's a solid narrative arc. I'll structure it as eight scenes—object, data, analytics, theme, problem-solution, dashboard, games, and the MAHA experience. Each scene transitions cinematically. Sound good?" },
  { from: "me", text: "Perfect. Let's build it." },
  { from: "kiro", text: "On it. Let me start building the website now." },
  { from: "kiro", text: "Done—ready to present. Take a look." },
] as const;

const mahaYouTubeUrl = "https://www.youtube.com/embed/CDq1bIV2fYc?autoplay=0&loop=1&playlist=CDq1bIV2fYc&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&cc_load_policy=0&cc_lang_pref=en&hl=en&iv_load_policy=3";
const mahaOfficialUrl = "https://mahaofficial.com.my/";
const mahaQrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(mahaOfficialUrl)}&size=600&margin=2&dark=06140f&light=ffffff&ecLevel=H`;
const melonSupplyIntelligenceUrl = "https://pantauharga.vercel.app/Melon-MAHA2026-v2.html";
const kiroDemoYouTubeUrl = "https://www.youtube.com/embed/lX-1suvdvqg?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&cc_load_policy=0";

function MelonCanvas({ scanning = false, active = true }: { scanning?: boolean; active?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const scanningRef = useRef(scanning);
  const activeRef = useRef(active);

  useEffect(() => { scanningRef.current = scanning; }, [scanning]);
  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    if (!mountRef.current) return;
    const host = mountRef.current;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);
    const melon = new THREE.Group();
    scene.add(melon);
    let loadedModel: THREE.Object3D | null = null;
    const scanShell = new THREE.Group();
    const scanMaterials: THREE.ShaderMaterial[] = [];
    melon.add(scanShell);
    const loader = new GLTFLoader();
    loader.load("/assets/earls-favourite-melon.glb", (gltf) => {
      loadedModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(loadedModel);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const fit = 3.45 / Math.max(size.x, size.y, size.z);
      loadedModel.position.copy(center).multiplyScalar(-1);
      const centeredModel = new THREE.Group();
      centeredModel.scale.setScalar(fit);
      centeredModel.rotation.z = -.08;
      centeredModel.add(loadedModel);
      loadedModel.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true; object.receiveShadow = true;
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.envMapIntensity = 1.25; mat.roughness = Math.min(.82, mat.roughness + .08);
              if (mat.map) { mat.map.anisotropy = renderer.capabilities.getMaxAnisotropy(); mat.map.needsUpdate = true; }
            }
          });
        }
      });
      melon.add(centeredModel);

      const wireSource = loadedModel.clone(true);
      wireSource.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          const wireMaterial = new THREE.ShaderMaterial({
            uniforms: {
              uTime: { value: 0 },
              uActive: { value: scanningRef.current ? 1 : 0 },
            },
            wireframe: true,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            polygonOffset: true,
            polygonOffsetFactor: -1,
            vertexShader: `
              varying float vWorldY;
              void main(){
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldY = worldPosition.y;
                gl_Position = projectionMatrix * viewMatrix * worldPosition;
              }
            `,
            fragmentShader: `
              varying float vWorldY;
              uniform float uTime;
              uniform float uActive;
              void main(){
                float travel = 0.5 + 0.5 * sin(uTime * 3.14159265 - 1.5707963);
                float scanY = mix(-1.85, 1.85, travel);
                float band = exp(-pow((vWorldY - scanY) * 8.0, 2.0));
                float pulse = 0.78 + 0.22 * sin(uTime * 5.5);
                vec3 base = vec3(0.18, 0.72, 0.58);
                vec3 hot = vec3(0.72, 1.0, 0.9);
                vec3 color = mix(base, hot, band);
                float alpha = uActive * (0.22 * pulse + band * 0.78);
                gl_FragColor = vec4(color, alpha);
              }
            `,
          });
          scanMaterials.push(wireMaterial);
          object.material = wireMaterial;
          object.renderOrder = 4;
        }
      });
      const centeredWire = new THREE.Group();
      centeredWire.scale.setScalar(fit * 1.003);
      centeredWire.rotation.z = -.08;
      centeredWire.add(wireSource);
      scanShell.add(centeredWire);
    });

    scene.add(new THREE.HemisphereLight(0xcaffed, 0x101008, 2.1));
    const keyLight = new THREE.DirectionalLight(0xfff4d2, 4.2); keyLight.position.set(-3.5, 4.2, 5); scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x66ffd0, 3.3); rimLight.position.set(4, 1, -3); scene.add(rimLight);

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 520;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 3.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i*3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = radius * Math.cos(phi);
      positions[i*3+2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0xb9ffdf, size: .014, transparent: true, opacity: .44 }));
    scene.add(particles);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      renderer.setSize(w, h, false); camera.aspect = w / Math.max(h, 1); camera.updateProjectionMatrix();
    };
    resize(); window.addEventListener("resize", resize);
    const clock = new THREE.Clock(); let frame = 0; let idleTimer = 0;
    const tick = () => {
      const t=clock.getElapsedTime();
      if (activeRef.current) {
        melon.position.set(0, 0, 0);
        melon.scale.setScalar(1);
        melon.rotation.set(0, t*.11, 0);
        scanMaterials.forEach((material) => {
          material.uniforms.uTime.value = t;
          material.uniforms.uActive.value += ((scanningRef.current ? 1 : 0) - material.uniforms.uActive.value) * .12;
        });
        particles.rotation.y=t*.009;
        camera.lookAt(0,0,0); renderer.render(scene,camera);
        frame = requestAnimationFrame(tick);
      } else {
        idleTimer = window.setTimeout(tick, 180);
      }
    };
    tick();
    return () => { cancelAnimationFrame(frame); window.clearTimeout(idleTimer); window.removeEventListener("resize", resize); loadedModel?.traverse((object) => { if (object instanceof THREE.Mesh) { object.geometry?.dispose(); const materials=Array.isArray(object.material)?object.material:[object.material]; materials.forEach((mat:THREE.Material)=>mat.dispose()); } }); scanMaterials.forEach((material)=>material.dispose()); particleGeometry.dispose(); (particles.material as THREE.Material).dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, []);
  return <div className={`melon-canvas ${scanning ? "scan-active" : ""}`} ref={mountRef} aria-label="Interactive 3D rock melon model" />;
}

export default function Home() {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [externalPopup, setExternalPopup] = useState<{ title: string; url: string } | null>(null);
  const [externalReady, setExternalReady] = useState(false);
  const [finale, setFinale] = useState(false);
  const [finaleVideoReady, setFinaleVideoReady] = useState(false);
  const [finaleTransitioning, setFinaleTransitioning] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanConfirmed, setScanConfirmed] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [introDone, setIntroDone] = useState(false);
  const [introExiting, setIntroExiting] = useState(false);
  const [introBubbleIndex, setIntroBubbleIndex] = useState(0);
  const introLogRef = useRef<HTMLDivElement>(null);
  const scanTimers = useRef<number[]>([]);
  const finaleTimer = useRef<number | null>(null);
  const finalePlayer = useRef<HTMLIFrameElement>(null);
  const [kiroDemo, setKiroDemo] = useState(false);
  const [autoStep, setAutoStep] = useState(0);
  const [analyticsPopup, setAnalyticsPopup] = useState<"map"|"trend"|null>(null);
  const [analyticsState, setAnalyticsState] = useState("JOHOR");
  const scene = scenes[active];
  const openExternalPopup = useCallback((title: string, url: string) => {
    setExternalReady(false);
    setExternalPopup({ title, url });
  }, []);

  const runScan = useCallback(() => {
    if (scanning) return;
    scanTimers.current.forEach(window.clearTimeout);
    scanTimers.current = [];
    setScanComplete(false);
    setScanConfirmed(false);
    setScanning(true);
    scanTimers.current.push(window.setTimeout(() => {
      setActive(1);
      setScanning(false);
      setScanConfirmed(true);
    }, 2100));
    scanTimers.current.push(window.setTimeout(() => {
      setScanConfirmed(false);
      setScanComplete(true);
    }, 2850));
  }, [scanning]);

  const launchFinale = useCallback(() => {
    if (finale || finaleTransitioning) return;
    const sendPlayerCommand = (func: string, args: unknown[] = []) => finalePlayer.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "https://www.youtube.com");
    sendPlayerCommand("unloadModule", ["captions"]);
    sendPlayerCommand("unloadModule", ["cc"]);
    sendPlayerCommand("setOption", ["captions", "track", {}]);
    sendPlayerCommand("seekTo", [0, true]);
    sendPlayerCommand("unMute");
    sendPlayerCommand("setVolume", [100]);
    sendPlayerCommand("playVideo");
    setFinaleTransitioning(true);
    if (finaleTimer.current) window.clearTimeout(finaleTimer.current);
    finaleTimer.current = window.setTimeout(() => {
      setFinale(true);
      setFinaleTransitioning(false);
      finaleTimer.current = null;
    }, 820);
  }, [finale, finaleTransitioning]);

  const closeFinale = useCallback(() => {
    const sendPlayerCommand = (func: string, args: unknown[] = []) => finalePlayer.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "https://www.youtube.com");
    sendPlayerCommand("pauseVideo");
    sendPlayerCommand("seekTo", [0, true]);
    setFinale(false);
  }, []);

  const finishIntro = useCallback(() => {
    setIntroExiting(true);
    window.setTimeout(() => { setIntroDone(true); setIntroExiting(false); }, 600);
  }, []);

  const go = useCallback((next: number) => {
    if (active === scenes.length - 1 && next > active) { launchFinale(); return; }
    const target = Math.max(0, Math.min(scenes.length - 1, next));
    if (target === 1 && active !== 1) { runScan(); return; }
    if (active === 4 && target === 5) {
      if (!kiroDemo) { setKiroDemo(true); return; }
      setKiroDemo(false);
    }
    // Scene 03 (BUILD, index 2): next → map JOHOR, next → map KELANTAN, next → proceed
    if (active === 2 && target === 3) {
      if (autoStep === 0) { setAnalyticsPopup("map"); setAnalyticsState("JOHOR"); setAutoStep(1); return; }
      if (autoStep === 1) { setAnalyticsState("KELANTAN"); setAutoStep(2); return; }
      setAnalyticsPopup(null); setAutoStep(0);
    }
    // Scene 06 (ASK, index 5): next → open dashboard popup, next → proceed
    if (active === 5 && target === 6) {
      if (autoStep === 0) { setExternalReady(false); setExternalPopup({ title: "MELON SUPPLY INTELLIGENCE · MAHA 2026", url: melonSupplyIntelligenceUrl }); setAutoStep(1); return; }
      setExternalPopup(null); setAutoStep(0);
    }
    // Scene 07 (PLAY, index 6): next → open games popup, next → proceed
    if (active === 6 && target === 7) {
      if (autoStep === 0) { setExternalReady(false); setExternalPopup({ title: "SISDA GAMES", url: "https://gamesv2.sisda.my/" }); setAutoStep(1); return; }
      setExternalPopup(null); setAutoStep(0);
    }
    scanTimers.current.forEach(window.clearTimeout);
    scanTimers.current = [];
    setFinale(false); setActive(target);
    if (target < 6) setFinaleVideoReady(false);
    if (target !== 1) { setScanning(false); setScanConfirmed(false); setScanComplete(false); }
    setAutoStep(0);
  }, [active, autoStep, kiroDemo, launchFinale, openExternalPopup, runScan]);

  useEffect(() => () => {
    scanTimers.current.forEach(window.clearTimeout);
    if (finaleTimer.current) window.clearTimeout(finaleTimer.current);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      // Intro scene — advance bubbles
      if (!introDone) {
        if (["ArrowRight", "PageDown", " ", "Enter"].includes(event.key)) {
          event.preventDefault();
          setIntroBubbleIndex(prev => {
            if (prev < introBubbles.length - 1) return prev + 1;
            finishIntro();
            return prev;
          });
          return;
        }
        if (event.key === "Escape" || /^[1-9]$/.test(event.key)) { finishIntro(); return; }
        return;
      }
      // Don't intercept keys when chatbot widget or any iframe/input has focus
      const target = event.target as HTMLElement;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "IFRAME" || target?.isContentEditable) return;
      if (document.activeElement?.tagName === "IFRAME") return;
      // Block navigation when chatbot or any overlay outside our app has focus
      if (target && !target.closest(".show") && !target.closest("nav") && !target.closest("header") && target !== document.body) return;
      if (analyticsPopup) {
        if (event.key === "Escape") { setAnalyticsPopup(null); setAutoStep(0); return; }
        if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); go(active + 1); return; }
        return;
      }
      if (externalPopup) {
        if (event.key === "Escape") { setExternalPopup(null); setAutoStep(0); return; }
        if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); go(active + 1); return; }
        return;
      }
      if (kiroDemo) {
        if (event.key === "Escape") { setKiroDemo(false); return; }
        if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); go(active + 1); return; }
        return;
      }
      if (finale && !["Escape", "v", "V"].includes(event.key)) return;
      if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); go(active + 1); }
      if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); go(active - 1); }
      if (event.key === "Home") go(0);
      if (event.key === "End") go(scenes.length - 1);
      if (/^[1-8]$/.test(event.key)) go(Number(event.key) - 1);
      if (event.key.toLowerCase() === "q") openExternalPopup("MELON SUPPLY INTELLIGENCE · MAHA 2026", melonSupplyIntelligenceUrl);
      if (event.key.toLowerCase() === "v") { if (finale) closeFinale(); else launchFinale(); }
      if (event.key.toLowerCase() === "f") document.documentElement.requestFullscreen?.();
      if (event.key === "Escape") { if (finale) closeFinale(); setMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [active, analyticsPopup, closeFinale, externalPopup, finale, finishIntro, go, introDone, kiroDemo, launchFinale, openExternalPopup]);

  useEffect(() => {
    const move = (e: PointerEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", move); return () => window.removeEventListener("pointermove", move);
  }, []);

  // Auto-scroll intro chat to the latest bubble
  useEffect(() => {
    if (introDone) return;
    const log = introLogRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
  }, [introBubbleIndex, introDone]);



  const enterFullscreen = async () => {
    if (!document.fullscreenElement) { await document.documentElement.requestFullscreen?.(); setFullscreen(true); }
    else { await document.exitFullscreen?.(); setFullscreen(false); }
  };

  return (
    <main className={`show scene-${scene.id} ${finaleTransitioning ? "finale-transitioning" : ""} ${!introDone ? "intro-active" : ""} ${introExiting ? "intro-transitioning" : ""}`}>
      {!introDone && <div className={`intro-chat ${introExiting ? "intro-exiting" : ""}`} aria-label="Conversation between presenter and Kiro">
        <div className="intro-chat-header"><span>BUILDING WITH KIRO</span></div>
        <div className="intro-chat-log" ref={introLogRef}>
          {introBubbles.slice(0, introBubbleIndex + 1).map((bubble, i) => (
            <div key={i} className={`chat-bubble chat-${bubble.from} ${i === introBubbleIndex ? "chat-latest" : ""}`}>
              <span className="chat-avatar">{bubble.from === "me" ? "ME" : <img src="/assets/kiro-avatar.png" alt="Kiro" />}</span>
              <p>{bubble.text}</p>
            </div>
          ))}
        </div>
        <div className="intro-chat-hint">
          <span>{introBubbleIndex < introBubbles.length - 1 ? "PRESS → OR SPACE TO CONTINUE" : "PRESS → TO BEGIN"}</span>
        </div>
      </div>}
      <div className="cursor-core" style={{ transform: `translate3d(${cursor.x}px,${cursor.y}px,0)` }} />
      <div className="grain" />
      <div className="grid-plane" />
      <div className="ambient-beam" />
      <header className="topbar">
        <button className="brand" onClick={() => go(0)} aria-label="Back to opening"><span className="brand-mark"><img src="/assets/fama-logo.png" alt="" /></span><span>FAMA · DIGITAL EXPERIENCE</span></button>
        <div className="top-actions">
          <span className="status-dot" /> <span className="desktop-only">PRESENTATION MODE</span>
          <button className="icon-button" onClick={enterFullscreen} aria-label="Toggle fullscreen">{fullscreen ? "↙" : "↗"}</button>
          <button className="icon-button" onClick={() => setMenuOpen(v => !v)} aria-label="Open scene menu">☰</button>
        </div>
      </header>

      <div className="side-rail" aria-hidden="true"><span>FAMA / DX-01</span><i/><span>INTERACTIVE STORY</span></div>
      <section className="stage" aria-live="polite">
        <div className="copy-panel" key={scene.id}>
          <p className="eyebrow"><span>{scene.number}</span>{scene.kicker}<i>● LIVE</i></p>
          <h1>{scene.title}</h1>
          <p className="lead">{scene.body}</p>
          {scene.id === "build" && <div className="pipeline"><span>LOCATION</span><i>→</i><span>KIRO</span><i>→</i><span>PRICE TREND</span></div>}
          {scene.id === "play" && <button className="primary game-cta" onClick={() => openExternalPopup("SISDA GAMES", "https://gamesv2.sisda.my/")}>Open Sisda Games <b>↗</b></button>}
          {scene.id === "ask" && <button className="primary" onClick={() => openExternalPopup("MELON SUPPLY INTELLIGENCE · MAHA 2026", melonSupplyIntelligenceUrl)}>Open Melon Supply Intelligence <b>Q</b></button>}
          {scene.id === "experience" && <button className="primary" onClick={launchFinale} disabled={finaleTransitioning}>Play the MAHA finale <b>V</b></button>}
        </div>
        <div className={`visual-panel ${scanComplete && active === 1 ? "insights-visible" : ""} ${scene.id === "build" ? "map-mode" : ""} ${scene.id === "melon-theme" ? "theme-mode" : ""} ${scene.id === "play" ? "game-mode" : ""} ${scene.id === "ask" ? "dashboard-mode" : ""} ${scene.id === "experience" ? "experience-mode" : ""} ${scene.id === "problem" ? "problem-mode" : ""}`}>
          <div className={`scan-layer ${scanning ? "active" : ""}`}><i/><span>SCANNING 3D SURFACE</span></div>
          <div className="hud-corner tl"/><div className="hud-corner tr"/><div className="hud-corner bl"/><div className="hud-corner br"/>
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
          {active <= 2 && <MelonCanvas scanning={scanning} active={active <= 1 || scanning} />}
          <div className="melon-shadow" />
          {scene.id === "problem" && <section className="problem-flow" aria-label="Problem to solution process">
            <div className="problem-flow-head"><span>OUR PROCESS</span><b>IDEA → BUILD</b></div>
            <div className="problem-flow-track">
              {problemFlow.map((step, index) => <div key={step.id} className={`flow-node flow-${step.id} ${step.id === "kiro" ? "flow-clickable" : ""}`} style={{ "--delay": `${index * 0.16}s` } as React.CSSProperties} onClick={step.id === "kiro" ? () => setKiroDemo(true) : undefined} role={step.id === "kiro" ? "button" : undefined} tabIndex={step.id === "kiro" ? 0 : undefined} aria-label={step.id === "kiro" ? "Watch Kiro demo video" : undefined}>
                <span className="flow-tag">{step.tag}</span>
                <strong>{step.title}</strong>
                <small>{step.body}</small>
                {step.id === "kiro" && <span className="flow-play-hint">▶ WATCH DEMO</span>}
                {index < problemFlow.length - 1 && <span className="flow-arrow" aria-hidden="true">→</span>}
              </div>)}
            </div>
            <p className="problem-flow-foot">From idea to output—planned with Kiro, delivered as a dashboard and games.</p>
          </section>}
          {scene.id === "build" && <SceneThreeAnalytics externalPopup={analyticsPopup} externalState={analyticsState} />}
          {scene.id === "play" && <section className="game-showcase" aria-label="Sisda mini games">
            <div className="game-showcase-head"><span>03 PLAYABLE EXPERIENCES</span><b>BUILT WITH KIRO</b></div>
            <div className="game-card-grid">
              {gameCards.map((game, index) => <button key={game.id} className={`game-preview game-${game.id}`} onClick={() => openExternalPopup(game.title.toUpperCase(), "https://gamesv2.sisda.my/")} style={{ animationDelay: `${150 + index * 150}ms` }}>
                <img src={game.image} alt={`${game.title} game card`} decoding="async" />
                <span><strong>{game.title}</strong><small>{game.meta}</small></span>
                <i>↗</i>
              </button>)}
            </div>
            <button className="game-platform-link" onClick={() => openExternalPopup("SISDA GAMES", "https://gamesv2.sisda.my/")}><span>ENTER THE FULL GAME PLATFORM</span><b>gamesv2.sisda.my ↗</b></button>
          </section>}
          {scene.id === "ask" && <section className="dashboard-showcase" aria-label="Melon Supply Intelligence dashboard preview">
            <div className="dashboard-preview-head"><span>LIVE DASHBOARD</span><b>MELON SUPPLY INTELLIGENCE · MAHA 2026</b></div>
            <div className="dashboard-preview-frame"><iframe src={melonSupplyIntelligenceUrl} title="Melon Supply Intelligence MAHA 2026 dashboard preview" tabIndex={-1}/><i/></div>
            <button onClick={() => openExternalPopup("MELON SUPPLY INTELLIGENCE · MAHA 2026", melonSupplyIntelligenceUrl)}><span>OPEN INTERACTIVE DASHBOARD</span><b>↗</b></button>
          </section>}
          {(scene.id === "melon-theme" || scene.id === "experience") && <section className="maha-poster-stage" aria-label={scene.id === "melon-theme" ? "MAHA 2026 melon theme poster" : "MAHA 2026 finale poster"}>
            <div className="poster-halo" />
            <div className="maha-poster-frame">
              <div className="maha-poster-art"><img src="/assets/maha-2026-poster.webp" alt="MAHA 2026, 28 August to 6 September 2026 at MAEPS Serdang, Selangor" decoding="async" /></div>
              <i className="poster-sweep" />
            </div>
            {scene.id === "experience" && <a className="maha-qr-card" href={mahaOfficialUrl} target="_blank" rel="noreferrer" aria-label="Scan or open the official MAHA website">
              <span>MAKLUMAT LANJUT</span>
              <strong>Discover more<br/>about MAHA</strong>
              <img src={mahaQrUrl} alt="QR code to mahaofficial.com.my" />
              <small>SCAN QR · MAHAOFFICIAL.COM.MY</small>
            </a>}
            <div className="maha-poster-meta"><span>{scene.id === "melon-theme" ? "MAHA 2026 · MELON THEME" : "MAHA 2026"}</span><b>{scene.id === "melon-theme" ? "DISCOVER THE MELONS BEHIND THE DATA" : "THE EXPERIENCE CONTINUES"}</b></div>
          </section>}
          <p className="spec-label left">REAL 3D<br/>MELON MODEL</p>
          <p className="spec-label right">DETAILED PBR<br/>SURFACE TEXTURE</p>
          <button className="scan-button" onClick={runScan} disabled={scanning}><span>{scanning ? "SCANNING" : scanComplete ? "RESCAN" : "SCAN"}</span><i>{scanning ? "◉" : "◎"}</i></button>
          <div className="telemetry"><span>ROTATION <b>AUTO</b></span><span>MODEL <b>CENTRED</b></span><span>SURFACE <b>{scanning ? "SCANNING" : "READY"}</b></span></div>
          {scanConfirmed && active === 1 && <div className="scan-confirmation"><i>✓</i><span>SCAN COMPLETE</span><b>6 DATA FIELDS FOUND</b></div>}
          <div className="insight-layer" aria-live="polite">
            {melonInsights.map((item, index) => <article key={item.id} className={`insight-card ${item.position}`} style={{ animationDelay: `${index * 130}ms` }}>
              <i className="connector" />
              <span className="insight-icon">{item.icon}</span>
              <div><small>{item.sublabel}</small><strong>{item.label}</strong></div>
            </article>)}
          </div>
        </div>
      </section>

      <nav className="chapter-nav" aria-label="Presentation scenes">
        <button onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous scene">←</button>
        <div className="progress"><i style={{ width: `${((active + 1) / scenes.length) * 100}%` }} /></div>
        <span>{String(active + 1).padStart(2,"0")} / {String(scenes.length).padStart(2,"0")}</span>
        <button onClick={() => go(active + 1)} disabled={finaleTransitioning} aria-label={active === scenes.length - 1 ? "Play finale video" : "Next scene"}>→</button>
      </nav>
      <nav className="scene-dots" aria-label="Quick scene navigation">{scenes.map((item,index)=><button key={item.id} className={index===active?"active":""} onClick={()=>go(index)} aria-label={`Go to ${item.label}`}><i/><span>{item.label}</span></button>)}</nav>

      <aside className={`scene-menu ${menuOpen ? "open" : ""}`}>
        <button className="close" onClick={() => setMenuOpen(false)}>×</button><p>SCENE INDEX</p>
        {scenes.map((item, index) => <button key={item.id} className={index === active ? "active" : ""} onClick={() => { go(index); setMenuOpen(false); }}><span>{item.number}</span>{item.label}</button>)}
        <small>← → navigate · 1–8 jump · F fullscreen<br/>Q dashboard · V finale · Esc close</small>
      </aside>

      {externalPopup && <div className={`external-popup ${externalReady ? "content-ready" : ""}`} role="dialog" aria-modal="true" aria-label={externalPopup.title}>
        <button className="external-backdrop" onClick={() => setExternalPopup(null)} aria-label="Close popup" />
        <section className="external-window">
          <header><div><i/><span>{externalPopup.title}</span><small>LIVE EXPERIENCE</small></div><button onClick={() => setExternalPopup(null)} aria-label="Close popup">CLOSE ×</button></header>
          <div className="external-loader"><i/><span>LOADING EXPERIENCE</span></div>
          <iframe src={externalPopup.url} title={externalPopup.title} allow="fullscreen; autoplay" onLoad={() => setExternalReady(true)} />
        </section>
      </div>}

      {kiroDemo && <div className="takeover kiro-demo" role="dialog" aria-modal="true" aria-label="Kiro demo video">
        <iframe src={kiroDemoYouTubeUrl} title="Kiro demo — building with AI" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
        <div className="kiro-demo-controls">
          <span>KIRO DEMO · YOUTUBE</span>
          <button onClick={() => setKiroDemo(false)}>CLOSE ×</button>
        </div>
      </div>}

      <div className={`takeover finale ${finale ? "finale-open" : "finale-preloaded"} ${finaleVideoReady ? "video-ready" : ""}`} aria-hidden={!finale}>
        <iframe ref={finalePlayer} src={active >= 6 ? mahaYouTubeUrl : "about:blank"} title="MAHA finale video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen onLoad={() => { if (active >= 6) setFinaleVideoReady(true); }} />
        <div className="finale-fallback"><span>MAHA · FINALE</span><h2>The story<br/>continues beyond<br/>the screen.</h2><p>LOADING MAHA FILM</p></div>
        <div className="finale-controls"><span>AUDIO ON · YOUTUBE PLAYER</span><button onClick={closeFinale}>CLOSE ×</button></div>
      </div>
    </main>
  );
}
