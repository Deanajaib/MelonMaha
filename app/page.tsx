"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const scenes = [
  { id: "see", number: "01", label: "SEE", kicker: "The visible layer", title: <>What do you see<br />in a melon?</>, body: "A fruit. A colour. A familiar shape. But the surface is only the beginning." },
  { id: "know", number: "02", label: "KNOW", kicker: "The intelligence layer", title: <>When we know more,<br />we see more.</>, body: "Agricultural data turns the melon into signals: origin, season, grade, movement and opportunity." },
  { id: "build", number: "03", label: "BUILD / KIRO", kicker: "The making layer", title: <>From raw signals<br />to a digital experience.</>, body: "We connect data, interface and story — then make the invisible understandable." },
  { id: "play", number: "04", label: "PLAY", kicker: "The participation layer", title: <>Don’t just watch.<br />Try it.</>, body: "A local mini-game gives the room a playful way to explore sorting, timing and choice." },
  { id: "ask", number: "05", label: "ASK / QUICK", kicker: "The conversation layer", title: <>Ask the data.<br />Get to the point.</>, body: "A live Quick demo can take over here. If connectivity fails, the rehearsed fallback keeps the story moving." },
  { id: "experience", number: "06", label: "EXPERIENCE / MAHA", kicker: "The human layer", title: <>Data becomes meaning<br />when people experience it.</>, body: "The finale opens into MAHA: full-screen film, sound and the people behind the agricultural ecosystem." },
] as const;

function MelonCanvas({ intensity = 1 }: { intensity?: number }) {
  const mountRef = useRef<HTMLDivElement>(null);

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
    const geometry = new THREE.SphereGeometry(1.72, 160, 120);
    geometry.scale(1, 0.93, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uLight: { value: new THREE.Vector3(-2.4, 3.2, 4.5).normalize() },
        uIntensity: { value: intensity },
      },
      vertexShader: `
        varying vec3 vNormal; varying vec3 vPosition; varying vec2 vUv;
        uniform float uTime;
        float hash(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
        void main(){
          vUv=uv; vec3 p=position; float pores=(hash(floor(p*42.0))-0.5)*0.018;
          p += normal*pores; vNormal=normalize(normalMatrix*normal); vPosition=(modelViewMatrix*vec4(p,1.)).xyz;
          gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
        }`,
      fragmentShader: `
        varying vec3 vNormal; varying vec3 vPosition; varying vec2 vUv;
        uniform vec3 uLight; uniform float uTime; uniform float uIntensity;
        float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
        float noise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y); }
        float fbm(vec2 p){ float v=0.,a=.5; for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+11.7;a*=.5;}return v;}
        void main(){
          vec2 p=vec2(vUv.x*20.,vUv.y*13.); float a=fbm(p); float b=fbm(p*1.7+8.);
          float web=smoothstep(.48,.60,abs(a-b)+.32*fbm(p*3.));
          float pores=smoothstep(.78,.88,noise(p*7.));
          vec3 rind=mix(vec3(.55,.36,.08),vec3(.88,.67,.24),fbm(p*.7));
          vec3 skin=mix(rind,vec3(.91,.79,.48),web*.82); skin*=1.-pores*.24;
          vec3 n=normalize(vNormal+vec3((a-b)*.19)); float diff=max(dot(n,uLight),0.);
          float rim=pow(1.-max(dot(n,normalize(-vPosition)),0.),2.5);
          float spec=pow(max(dot(reflect(-uLight,n),normalize(-vPosition)),0.),38.)*.18;
          vec3 color=skin*(.22+diff*.86)+vec3(1.,.68,.25)*rim*.34+spec;
          color=mix(color,color*vec3(.85,1.02,.91),clamp(uIntensity-1.,0.,1.)*.25);
          gl_FragColor=vec4(color,1.);
        }`,
    });
    const melon = new THREE.Mesh(geometry, material);
    melon.rotation.z = -0.08;
    scene.add(melon);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      renderer.setSize(w, h, false); camera.aspect = w / Math.max(h, 1); camera.updateProjectionMatrix();
    };
    resize(); window.addEventListener("resize", resize);
    const clock = new THREE.Clock(); let frame = 0;
    const tick = () => { frame = requestAnimationFrame(tick); const t=clock.getElapsedTime(); material.uniforms.uTime.value=t; material.uniforms.uIntensity.value=intensity; melon.rotation.y=t*.075; melon.rotation.x=Math.sin(t*.24)*.035; renderer.render(scene,camera); };
    tick();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, [intensity]);
  return <div className="melon-canvas" ref={mountRef} aria-label="Procedural 3D rock melon" />;
}

export default function Home() {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [finale, setFinale] = useState(false);
  const [muted, setMuted] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const scene = scenes[active];

  const go = useCallback((next: number) => {
    setFinale(false); setQuickOpen(false); setActive(Math.max(0, Math.min(scenes.length - 1, next)));
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); go(active + 1); }
      if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); go(active - 1); }
      if (event.key === "Home") go(0);
      if (event.key === "End") go(scenes.length - 1);
      if (/^[1-6]$/.test(event.key)) go(Number(event.key) - 1);
      if (event.key.toLowerCase() === "q") setQuickOpen(v => !v);
      if (event.key.toLowerCase() === "v") setFinale(v => !v);
      if (event.key.toLowerCase() === "f") document.documentElement.requestFullscreen?.();
      if (event.key === "Escape") { setQuickOpen(false); setFinale(false); setMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [active, go]);

  const enterFullscreen = async () => {
    if (!document.fullscreenElement) { await document.documentElement.requestFullscreen?.(); setFullscreen(true); }
    else { await document.exitFullscreen?.(); setFullscreen(false); }
  };

  return (
    <main className={`show scene-${scene.id}`}>
      <div className="grain" />
      <header className="topbar">
        <button className="brand" onClick={() => go(0)} aria-label="Back to opening"><span className="brand-mark">F</span><span>FAMA · DIGITAL EXPERIENCE</span></button>
        <div className="top-actions">
          <span className="status-dot" /> <span className="desktop-only">PRESENTATION READY</span>
          <button className="icon-button" onClick={enterFullscreen} aria-label="Toggle fullscreen">{fullscreen ? "↙" : "↗"}</button>
          <button className="icon-button" onClick={() => setMenuOpen(v => !v)} aria-label="Open scene menu">☰</button>
        </div>
      </header>

      <section className="stage" aria-live="polite">
        <div className="copy-panel" key={scene.id}>
          <p className="eyebrow"><span>{scene.number}</span>{scene.kicker}</p>
          <h1>{scene.title}</h1>
          <p className="lead">{scene.body}</p>
          {scene.id === "know" && <div className="signal-row"><span>ORIGIN <b>PLACEHOLDER</b></span><span>GRADE <b>—</b></span><span>SEASON <b>—</b></span></div>}
          {scene.id === "build" && <div className="pipeline"><span>DATA</span><i>→</i><span>KIRO</span><i>→</i><span>EXPERIENCE</span></div>}
          {scene.id === "play" && <button className="primary" onClick={() => alert("LOCAL GAME INTEGRATION POINT\n\nReplace this handler with the final local game URL or embedded component.")}>Launch local game <b>↗</b></button>}
          {scene.id === "ask" && <button className="primary" onClick={() => setQuickOpen(true)}>Open Quick demo <b>Q</b></button>}
          {scene.id === "experience" && <button className="primary" onClick={() => setFinale(true)}>Play MAHA finale <b>V</b></button>}
        </div>
        <div className="visual-panel">
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
          <MelonCanvas intensity={active > 0 ? 1.25 : 1} />
          <div className="melon-shadow" />
          <p className="spec-label left">PROCEDURAL<br/>SPHERE GEOMETRY</p>
          <p className="spec-label right">PBR-STYLE<br/>SURFACE SHADER</p>
        </div>
      </section>

      <nav className="chapter-nav" aria-label="Presentation scenes">
        <button onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous scene">←</button>
        <div className="progress"><i style={{ width: `${((active + 1) / scenes.length) * 100}%` }} /></div>
        <span>{String(active + 1).padStart(2,"0")} / {String(scenes.length).padStart(2,"0")}</span>
        <button onClick={() => go(active + 1)} disabled={active === scenes.length - 1} aria-label="Next scene">→</button>
      </nav>

      <aside className={`scene-menu ${menuOpen ? "open" : ""}`}>
        <button className="close" onClick={() => setMenuOpen(false)}>×</button><p>SCENE INDEX</p>
        {scenes.map((item, index) => <button key={item.id} className={index === active ? "active" : ""} onClick={() => { go(index); setMenuOpen(false); }}><span>{item.number}</span>{item.label}</button>)}
        <small>← → navigate · 1–6 jump · F fullscreen<br/>Q Quick · V finale · Esc close</small>
      </aside>

      {quickOpen && <div className="takeover quick-takeover"><div className="takeover-bar"><span>QUICK · LIVE DEMO HANDOFF</span><button onClick={() => setQuickOpen(false)}>×</button></div><div className="quick-terminal"><p className="eyebrow">CONNECTED EXPERIENCE / FALLBACK MODE</p><h2>What would you like<br/>to know about the melon?</h2><div className="prompt"><span>Ask Quick</span><em>“Show a verified insight when the final data source is connected.”</em><b>↗</b></div><p className="placeholder-note">DEMO FALLBACK — No live agricultural facts are shown in this scaffold. Replace with the approved Quick endpoint and rehearsed responses.</p></div></div>}

      {finale && <div className="takeover finale"><video autoPlay loop muted={muted} playsInline poster=""><source src="/assets/maha-finale.mp4" type="video/mp4" /></video><div className="finale-fallback"><span>MAHA · FINALE</span><h2>Experience<br/>changes what<br/>we see.</h2><p>FINAL FULL-SCREEN VIDEO REQUIRED<br/>/public/assets/maha-finale.mp4</p></div><div className="finale-controls"><button onClick={() => setMuted(v => !v)}>{muted ? "UNMUTE" : "MUTE"}</button><button onClick={() => setFinale(false)}>CLOSE ×</button></div></div>}
    </main>
  );
}
