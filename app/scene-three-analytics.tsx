"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type RecordRow = { year:number; commodity:string; state:string; district:string; planted:number; harvested:number; production:number };
type Metric = { planted:number; harvested:number; production:number };
type GeoFeature = { properties:{name:string}; geometry:{coordinates:number[][][][]} };
const commodities = ["ALL", "TEMBIKAI", "TEMBIKAI SUSU", "TEMBIKAI WANGI"];
const palette:Record<string,string> = { TEMBIKAI:"#d7ff45", "TEMBIKAI SUSU":"#79ffd0", "TEMBIKAI WANGI":"#67a7ff" };
const varietyLabels:Record<string,string> = { ALL:"ALL VARIETIES", TEMBIKAI:"WATERMELON", "TEMBIKAI SUSU":"HONEYDEW", "TEMBIKAI WANGI":"ROCKMELON" };
const varietyLabel = (commodity:string) => varietyLabels[commodity] || commodity;
const number = new Intl.NumberFormat("en-MY", { maximumFractionDigits:1 });
const emptyMetric = ():Metric => ({ planted:0, harvested:0, production:0 });
let malaysiaFeaturesPromise: Promise<GeoFeature[]> | null = null;
let melonRowsPromise: Promise<RecordRow[]> | null = null;

function loadMalaysiaFeatures() {
  malaysiaFeaturesPromise ??= fetch("/assets/malaysia-states.geojson")
    .then(response => {
      if (!response.ok) throw new Error(`Unable to load Malaysia map (${response.status})`);
      return response.json();
    })
    .then(data => data.features as GeoFeature[]);
  return malaysiaFeaturesPromise;
}

function loadMelonRows() {
  melonRowsPromise ??= fetch("/assets/doa-melon-data.csv")
    .then(response => {
      if (!response.ok) throw new Error(`Unable to load DOA data (${response.status})`);
      return response.text();
    })
    .then(parseCsv);
  return melonRowsPromise;
}

function parseCsv(text:string):RecordRow[] {
  return text.replace(/^\uFEFF/,"").trim().split(/\r?\n/).slice(1).map(line => {
    const [year,,commodity,state,district,planted,harvested,production] = line.split(",");
    return { year:+year, commodity, state, district, planted:+planted, harvested:+harvested, production:+production };
  });
}

function MalaysiaMetricMap({ metrics, breakdown, selected, onSelect, compact=false }:{ metrics:Map<string,Metric>; breakdown?:Map<string,Map<string,number>>; selected?:string; onSelect?:(state:string)=>void; compact?:boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [features, setFeatures] = useState<GeoFeature[]>([]);
  useEffect(() => {
    let cancelled = false;
    loadMalaysiaFeatures().then(data => {
      if (!cancelled) setFeatures(data);
    }).catch(error => console.error(error));
    return () => { cancelled = true; };
  }, []);
  const draw = () => {
    const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext("2d");if(!ctx)return;
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio,2);canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    const w=rect.width,h=rect.height,minLon=99.4,maxLon=113.1,minLat=.7,maxLat=7.5;
    const scale=Math.min(w*(compact?.91:.83)/(maxLon-minLon),h*(compact?.72:.68)/(maxLat-minLat));
    const ox=(w-(maxLon-minLon)*scale)/2-(compact?0:w*.045),oy=h*(compact?.12:.14);
    const project=([lon,lat]:number[])=>{const xlon=lon>108?lon-3.2:lon;return[ox+(xlon-minLon)*scale,oy+(maxLat-lat)*scale]};
    const max=Math.max(1,...Array.from(metrics.values()).map(v=>v.production));
    ctx.clearRect(0,0,w,h);
    features.forEach(feature=>{
      const key=feature.properties.name.toUpperCase(),value=metrics.get(key)?.production||0,intensity=Math.sqrt(value/max),active=key===selected;
      ctx.beginPath();feature.geometry.coordinates.forEach(poly=>poly.forEach(ring=>ring.forEach((p,i)=>{const[x,y]=project(p);if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y)})));ctx.closePath();
      ctx.fillStyle=value?`rgba(121,255,208,${.12+intensity*.6})`:"rgba(17,51,43,.5)";ctx.strokeStyle=active?"#d7ff45":value?"rgba(184,255,224,.82)":"rgba(121,255,208,.28)";ctx.lineWidth=active?2:1;ctx.shadowColor=active?"#d7ff45":"transparent";ctx.shadowBlur=active?14:0;ctx.fill("evenodd");ctx.stroke();ctx.shadowBlur=0;
    });
    if(compact){
      const short:Record<string,string>={"WP KUALA LUMPUR":"KL","WP PUTRAJAYA":"PUTRAJAYA","WP LABUAN":"LABUAN","NEGERI SEMBILAN":"N. SEMBILAN","PULAU PINANG":"P. PINANG"};
      const boxW=146,groups=[
        {states:["PERLIS","KEDAH","PULAU PINANG","PERAK","SELANGOR"],x:Math.max(7,w*.08),left:true},
        {states:["WP KUALA LUMPUR","WP PUTRAJAYA"],x:Math.max(boxW+15,w*.21),left:true},
        {states:["KELANTAN","TERENGGANU","PAHANG","JOHOR"],x:Math.min(w-boxW-7,w*.42),left:false},
        {states:["WP LABUAN","SABAH","SARAWAK"],x:Math.min(w-boxW-7,w*.79),left:false}
      ];
      const layout=new Map<string,{x:number;y:number;height:number;left:boolean;rows:Array<[string,number]>}>();
      groups.forEach(group=>{
        const entries=group.states.map(key=>{const values=breakdown?.get(key);const rows=commodities.slice(1).map(name=>[name,values?.get(name)||0] as [string,number]).filter(([,value])=>value>0);return{key,rows,height:25+rows.length*13}});
        const total=entries.reduce((sum,item)=>sum+item.height,0),gap=Math.max(4,(h-42-total)/Math.max(1,entries.length-1));let cursor=30;
        entries.forEach(item=>{layout.set(item.key,{x:group.x,y:cursor,height:item.height,left:group.left,rows:item.rows});cursor+=item.height+gap});
      });
      const reposition=(key:string,x:number,y:number)=>{const item=layout.get(key);if(item)layout.set(key,{...item,x:Math.min(w-boxW-7,Math.max(7,x)),y:Math.min(h-item.height-7,Math.max(7,y))})};
      const placeSouthern=(key:string,x:number,y:number)=>{const values=breakdown?.get(key);const rows=commodities.slice(1).map(name=>[name,values?.get(name)||0] as [string,number]).filter(([,value])=>value>0),height=25+rows.length*13;layout.set(key,{x:Math.min(w-boxW-7,Math.max(7,x)),y:Math.min(h-height-7,Math.max(7,y)),height,left:true,rows})};
      const selangor=layout.get("SELANGOR");
      placeSouthern("NEGERI SEMBILAN",(selangor?.x||w*.08)+boxW+10,selangor?.y||h*.65);
      placeSouthern("MELAKA",w*.46,7);
      const eastKeys=["KELANTAN","TERENGGANU","PAHANG","JOHOR","MELAKA"];
      const eastTotal=eastKeys.reduce((sum,key)=>sum+(layout.get(key)?.height||0),0);
      const eastGap=Math.max(5,Math.min(10,(h-eastTotal-14)/(eastKeys.length-1)));
      let eastY=7;
      eastKeys.forEach(key=>{reposition(key,key==="JOHOR"||key==="MELAKA"?w*.46:w*.42,eastY);eastY+=(layout.get(key)?.height||0)+eastGap});
      features.filter(feature=>metrics.has(feature.properties.name.toUpperCase())).forEach(feature=>{
        const key=feature.properties.name.toUpperCase();
        const points=feature.geometry.coordinates.flat(2).map(project);
        const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
        const cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;
        const item=layout.get(key);if(!item)return;const labelX=item.x,labelY=item.y,boxH=item.height;
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(item.left?labelX+boxW:labelX,labelY+boxH/2);ctx.strokeStyle="rgba(121,255,208,.42)";ctx.lineWidth=.65;ctx.stroke();
        ctx.beginPath();ctx.arc(cx,cy,2,0,Math.PI*2);ctx.fillStyle="#d7ff45";ctx.fill();
        ctx.fillStyle="rgba(3,20,14,.91)";ctx.fillRect(labelX,labelY,boxW,boxH);ctx.strokeStyle="rgba(121,255,208,.38)";ctx.strokeRect(labelX+.5,labelY+.5,boxW-1,boxH-1);
        ctx.fillStyle="rgba(232,255,246,.98)";ctx.font="700 11.5px Arial";ctx.fillText(short[key]||key,labelX+8,labelY+17);
        item.rows.forEach(([commodity,value],i)=>{const color=palette[commodity],yLine=labelY+31+i*13;ctx.fillStyle=color;ctx.fillRect(labelX+8,yLine-7,6,6);ctx.fillStyle="rgba(156,190,179,.98)";ctx.font="700 7.8px Arial";ctx.fillText(varietyLabel(commodity),labelX+20,yLine);ctx.fillStyle="rgba(235,255,248,.98)";ctx.font="700 8.3px Arial";ctx.textAlign="right";ctx.fillText(`${number.format(value)} MT`,labelX+boxW-8,yLine);ctx.textAlign="left"});
      });
    }
    if(!compact){ctx.fillStyle="rgba(234,255,247,.7)";ctx.font="700 9px Arial";ctx.fillText("SHADE = PRODUCTION (MT)",16,h-14)}
    (canvas as HTMLCanvasElement & { _hit?:typeof hit })._hit=hit;
    function pointInRing(x:number,y:number,ring:number[][]){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const[xi,yi]=project(ring[i]),[xj,yj]=project(ring[j]);if((yi>y)!==(yj>y)&&x<((xj-xi)*(y-yi))/(yj-yi)+xi)inside=!inside}return inside}
    function hit(x:number,y:number){for(const feature of [...features].reverse()){const found=feature.geometry.coordinates.some(poly=>{const outer=poly[0];return !!outer&&pointInRing(x,y,outer)&&!poly.slice(1).some(hole=>pointInRing(x,y,hole))});if(found)return feature.properties.name.toUpperCase();}}
  };
  useEffect(draw,[metrics,breakdown,selected,compact,features]);
  // The resize listener intentionally captures the same render inputs as the immediate draw above.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{const resize=()=>draw();window.addEventListener("resize",resize);return()=>window.removeEventListener("resize",resize)},[metrics,breakdown,selected,compact,features]);
  return <canvas ref={ref} onClick={e=>{if(!onSelect)return;const rect=e.currentTarget.getBoundingClientRect();const hit=(e.currentTarget as HTMLCanvasElement & {_hit?:(x:number,y:number)=>string})._hit?.(e.clientX-rect.left,e.clientY-rect.top);if(hit&&metrics.has(hit))onSelect(hit)}} className={onSelect?"interactive-map":""} aria-label="Malaysia production map by state"/>;
}

function ProductionTrend({ rows, compact=false }:{rows:RecordRow[];compact?:boolean}) {
  const [hovered,setHovered]=useState<number|null>(null);
  const years=Array.from(new Set(rows.map(r=>r.year))).sort((a,b)=>a-b);
  const series=commodities.slice(1).map(commodity=>({commodity,values:years.map(year=>rows.filter(r=>r.year===year&&r.commodity===commodity).reduce((s,r)=>s+r.production,0))}));
  const max=Math.max(1,...series.flatMap(s=>s.values)),W=900,H=compact?250:440,pad={l:compact?20:70,r:20,t:28,b:compact?28:56};
  const x=(i:number)=>pad.l+i*(W-pad.l-pad.r)/Math.max(1,years.length-1),y=(v:number)=>pad.t+(H-pad.t-pad.b)*(1-v/max);
  const hoverX=hovered===null?null:x(hovered);
  const activeIndex=hovered??Math.max(0,years.length-1);
  return <div className={`production-trend ${compact?"compact":""}`}><svg
    viewBox={`0 0 ${W} ${H}`}
    role="img"
    aria-label="Annual production trend for three melon varieties"
    onPointerMove={e=>{
      const rect=e.currentTarget.getBoundingClientRect();
      const px=(e.clientX-rect.left)*W/rect.width;
      const index=Math.round((px-pad.l)/(W-pad.l-pad.r)*(years.length-1));
      setHovered(Math.max(0,Math.min(years.length-1,index)));
    }}
    onPointerLeave={()=>setHovered(null)}
  >
    {[0,.25,.5,.75,1].map(t=><line key={t} x1={pad.l} x2={W-pad.r} y1={y(max*t)} y2={y(max*t)} className="trend-grid"/>)}
    {!compact&&[0,.25,.5,.75,1].map(t=><text key={t} x={pad.l-10} y={y(max*t)+4} textAnchor="end">{number.format(max*t)}</text>)}
    {series.map(s=><polyline key={s.commodity} points={s.values.map((v,i)=>`${x(i)},${y(v)}`).join(" ")} fill="none" stroke={palette[s.commodity]} strokeWidth={compact?4:3}/>) }
    {hovered!==null&&hoverX!==null&&<><line x1={hoverX} x2={hoverX} y1={pad.t} y2={H-pad.b} className="trend-crosshair"/>{series.map(s=><circle key={s.commodity} cx={hoverX} cy={y(s.values[hovered])} r={compact?6:5} fill={palette[s.commodity]} className="trend-point"/>)}</>}
    <rect x={pad.l} y={pad.t} width={W-pad.l-pad.r} height={H-pad.t-pad.b} fill="transparent" className="trend-hit-area"/>
    {years.map((year,i)=>(!compact||i===0||i===years.length-1||i%3===0)&&<text key={year} x={x(i)} y={H-12} textAnchor="middle">{year}</text>)}
  </svg>{hovered!==null&&!compact&&<div className="trend-tooltip" style={{left:`${Math.min(78,Math.max(16,(hoverX||0)/W*100))}%`}}><strong>{years[hovered]}</strong>{series.map(s=><span key={s.commodity}><i style={{background:palette[s.commodity]}}/><em>{varietyLabel(s.commodity)}</em><b>{number.format(s.values[hovered])} MT</b></span>)}</div>}{compact&&<aside className="trend-figures" aria-live="polite"><strong>{years[activeIndex]}</strong><small>PRODUCTION (MT)</small>{series.map(s=><span key={s.commodity}><i style={{background:palette[s.commodity]}}/><em>{varietyLabel(s.commodity)}</em><b>{number.format(s.values[activeIndex])} MT</b></span>)}</aside>}<div className="trend-legend">{series.map(s=><span key={s.commodity}><i style={{background:palette[s.commodity]}}/>{varietyLabel(s.commodity)}</span>)}</div></div>;
}

export default function SceneThreeAnalytics(){
  const [rows,setRows]=useState<RecordRow[]>([]),[popup,setPopup]=useState<"map"|"trend"|null>(null),[year,setYear]=useState(2024),[commodity,setCommodity]=useState("ALL"),[selected,setSelected]=useState("JOHOR");
  useEffect(()=>{let cancelled=false;loadMelonRows().then(data=>{if(!cancelled)setRows(data)}).catch(error=>console.error(error));return()=>{cancelled=true}},[]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==="Escape")setPopup(null)};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[]);
  const filtered=useMemo(()=>rows.filter(r=>r.year===year&&(commodity==="ALL"||r.commodity===commodity)),[rows,year,commodity]);
  const stateMetrics=useMemo(()=>{const map=new Map<string,Metric>();filtered.forEach(r=>{const m=map.get(r.state)||emptyMetric();m.planted+=r.planted;m.harvested+=r.harvested;m.production+=r.production;map.set(r.state,m)});return map},[filtered]);
  const overviewMetrics=useMemo(()=>{const map=new Map<string,Metric>();rows.filter(r=>r.year===2024).forEach(r=>{const m=map.get(r.state)||emptyMetric();m.planted+=r.planted;m.harvested+=r.harvested;m.production+=r.production;map.set(r.state,m)});return map},[rows]);
  const overviewBreakdown=useMemo(()=>{const map=new Map<string,Map<string,number>>();rows.filter(r=>r.year===2024).forEach(r=>{const state=map.get(r.state)||new Map<string,number>();state.set(r.commodity,(state.get(r.commodity)||0)+r.production);map.set(r.state,state)});return map},[rows]);
  const districts=useMemo(()=>{const map=new Map<string,Metric>();filtered.filter(r=>r.state===selected).forEach(r=>{const m=map.get(r.district)||emptyMetric();m.planted+=r.planted;m.harvested+=r.harvested;m.production+=r.production;map.set(r.district,m)});return Array.from(map.entries()).sort((a,b)=>b[1].production-a[1].production)},[filtered,selected]);
  const selectedMetric=stateMetrics.get(selected)||emptyMetric();
  return <>
    <section className="analytics-overview" aria-label="Agricultural data overview">
      <button className="analytics-card map-card" onClick={()=>setPopup("map")}><header><span>01 / GEOGRAPHIC DATA</span><b aria-label="Open map">⌖</b></header><h3 className="panel-title map-title">PRODUCTION BY STATE · 2024<br/><small>Watermelon · Honeydew · Rockmelon</small></h3><MalaysiaMetricMap metrics={overviewMetrics} breakdown={overviewBreakdown} compact/></button>
      <button className="analytics-card trend-card" onClick={()=>setPopup("trend")}><header><span>02</span><b aria-label="Open trend">↗</b></header><h3 className="panel-title trend-side-title">Production trend</h3><ProductionTrend rows={rows} compact/><footer><strong>14</strong><span>YEARS OF DATA · 2011—2024<br/><b>HOVER FOR PRODUCTION DETAILS</b></span></footer></button>
      <div className="analytics-source">SOURCE: <b>DOA CROP PRODUCTION STATISTICS</b></div>
    </section>
    {popup&&<div className="data-popup" role="dialog" aria-modal="true"><button className="data-backdrop" onClick={()=>setPopup(null)} aria-label="Close data view"/><section className="data-window"><header><div><i/><span>{popup==="map"?`PRODUCTION BY STATE · ${year}`:"PRODUCTION TREND BY VARIETY"}</span><small>DOA DATA · 2011—2024</small></div><button onClick={()=>setPopup(null)}>CLOSE ×</button></header>
      {popup==="map"?<div className="map-drilldown"><div className="data-filters"><label>YEAR<select value={year} onChange={e=>setYear(+e.target.value)}>{Array.from({length:14},(_,i)=>2024-i).map(y=><option key={y}>{y}</option>)}</select></label><label>VARIETY<select value={commodity} onChange={e=>setCommodity(e.target.value)}>{commodities.map(c=><option key={c} value={c}>{varietyLabel(c)}</option>)}</select></label><strong className="map-popup-title">PRODUCTION BY STATE · {year}</strong></div><div className="map-main"><MalaysiaMetricMap metrics={stateMetrics} selected={selected} onSelect={setSelected}/><aside><p>SELECTED STATE</p><h2>{selected}</h2><div className="metric-grid"><span>PLANTED AREA<b>{number.format(selectedMetric.planted)} HA</b></span><span>HARVESTED AREA<b>{number.format(selectedMetric.harvested)} HA</b></span><span>PRODUCTION<b>{number.format(selectedMetric.production)} MT</b></span></div><div className="district-table"><header><span>DISTRICT</span><span>PLANTED HA</span><span>HARVESTED HA</span><span>PRODUCTION MT</span></header>{districts.map(([name,m])=><div key={name}><strong>{name}</strong><span>{number.format(m.planted)}</span><span>{number.format(m.harvested)}</span><b>{number.format(m.production)}</b></div>)}</div></aside></div></div>:<div className="trend-drilldown"><div className="trend-title"><span>ANNUAL PRODUCTION</span><h2>Production trend<br/>by variety.</h2><p>Unit: metric tonnes (MT) · Source: supplied DOA dataset</p></div><ProductionTrend rows={rows}/></div>}
    </section></div>}
  </>;
}
