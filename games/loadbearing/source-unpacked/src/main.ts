import { SandboxWorld } from './sandbox-world';
import { rotate } from './catalog';
import { DetachedLaunchers } from './detached-launchers';
import { installProjectileBuildingControls } from './projectile-building-controls';
import { storeyProjectileLayout } from './storey-projectile';
const readProjectileType=(value:unknown):'solid'|'blocks'|'storey'=>value==='blocks'||value==='storey'?value:'solid';
import { FreeCameraKeys } from './free-camera-keys';
import { walkingEntry, walkingSpawn } from './building-accessibility';
import { WalkerMode } from './walker-mode';
import {installMobileUI} from './mobile-ui';
import {installHoverHelp} from './hover-help';
import {DemoMode} from './demo-mode';
import {installInterface} from './ui-shell';
import { createIcons, Save, Download, Upload, CircleHelp, Flag, Trash2, BookOpen, FilePlus2, Activity, Box, Scan, PanelTop, PanelLeft, Grid2x2, MousePointer2, Undo2, Redo2, RotateCcw, RotateCw, PencilRuler, Square, Play, Pause, X, ShieldCheck, TriangleAlert, Crosshair } from 'lucide';
import { GameScene } from './scene';
import { Simulation } from './simulation-client';
import { PARTS, SCENARIOS, sample, cost, validateBlueprint, type Kind, type Piece, type Scenario, type V3 } from './catalog';
import { CHALLENGES, DEFAULT_CHALLENGE, getChallenge } from './challenges';
import { CAMPAIGN_LEVELS, getCampaignLevel, starterPieces, normalizeProgress, isUnlocked, recordCompletion } from './campaign';
import { evaluateBuilding } from './building-objective';
import { SHOWCASES, showcasePieces } from './showcases';
import { PREFABS, expandPrefab } from './prefabs';
import { BUILDING_STYLES, generateDemolitionBuilding, type BuildingStyle } from './procedural-buildings';
import './style.css';
import { VehicleWorkshop } from './vehicle-workshop';
import { validateVehicle } from './vehicle-blueprint';
import type { VehiclePart } from './vehicle-blueprint';
import { installConcreteControls, concreteValuesFor, type ConcreteValues } from './concrete-controls';
import { isConcrete } from './concrete-materials';

const $=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
const icons={Save,Download,Upload,CircleHelp,Flag,Trash2,BookOpen,FilePlus2,Activity,Box,Scan,PanelTop,PanelLeft,Grid2x2,MousePointer2,Undo2,Redo2,RotateCcw,RotateCw,PencilRuler,Square,Play,Pause,X,ShieldCheck,TriangleAlert,Crosshair};
const icon=(name:string)=>`<i data-lucide="${name}"></i>`;
const money=(n:number)=>'$'+n.toLocaleString('en-US');
const initialFragmentLimit=(()=>{try{const value=Number(localStorage.getItem('loadbearing.fragment-limit'));return Number.isFinite(value)&&value>=24&&value<=3000?Math.round(value):1000}catch{return 1000}})();
const initialProjectileType=(()=>{try{return readProjectileType(localStorage.getItem('loadbearing.projectile-type'))}catch{return 'solid'}})();
document.querySelector('#app')!.innerHTML=`
 <header class="topbar">
  <a class="brand" href="./" aria-label="Load Bearing home"><svg viewBox="0 0 34 32" aria-hidden="true"><path d="M3 28V4h6v18h16V4h6v24M9 6l16 16M9 22L25 6"/></svg><span>LOAD<span class="brand-light">BEARING</span></span><small>STRUCTURAL SANDBOX</small></a>
  <div class="top-actions"><span class="version">WORKSHOP / 0.1</span><button id="save" class="quiet">${icon('save')}<span>Save</span></button><button id="export" class="quiet" title="Export your blueprint">${icon('download')}<span>Export</span></button><button id="import" class="quiet" title="Import a blueprint">${icon('upload')}<span>Import</span></button><button id="help" class="icon-button" title="How to play">${icon('circle-help')}</button></div>
 </header>
 <main class="workspace">
  <aside class="sidebar">
   <div class="sidebar-top"><span class="eyebrow">DEINE BAUPROJEKTE</span><span class="live-dot"></span></div>
   <nav class="play-mode" aria-label="Spielmodus"><button id="campaign-mode">Kampagne</button><button id="workshop-mode">Freies Bauen</button></nav>
   <div id="campaign-summary" hidden><div><span class="eyebrow" id="campaign-chapter"></span><button id="campaign-map">Alle Levels ${icon('grid-2x2')}</button></div><div class="campaign-progress-track"><i id="campaign-progress-fill"></i></div><small id="campaign-progress-text"></small></div>
   <nav class="mode-tabs" id="workshop-tabs" aria-label="Game mode"><button id="bridge-mode" class="active">Bridges</button><button id="disaster-mode">Resilience</button><button id="loads-mode">Loads</button><button id="sandbox-mode">Sandbox</button></nav>
   <section class="scenario-section"><div id="workshop-selectors"><label for="scenario" class="eyebrow">CHALLENGE</label><select id="scenario">${Object.entries(SCENARIOS).map(([key,s])=>`<option value="${key}">${s.name}</option>`).join('')}</select><select id="challenge" aria-label="Challenge variant"></select></div><div id="campaign-current" hidden><span class="eyebrow" id="campaign-number"></span><h3 id="campaign-title"></h3></div><p id="description"></p><div class="objective">${icon('flag')}<span id="target"></span></div><p id="campaign-brief" hidden></p><div id="building-goal" hidden><strong id="building-goal-progress"></strong><small id="building-goal-reason"></small></div></section>
   <section id="showcase-picker" hidden><label for="showcase" class="eyebrow">BAUWERKE ZUM ZERSTÖREN</label><select id="showcase">${SHOWCASES.map(b=>`<option value="${b.id}">${b.name} · ${b.height} m</option>`).join('')}</select><p id="showcase-detail">${SHOWCASES[0]?.detail??''}</p><small id="showcase-meta">${SHOWCASES[0]?.count??0} Bauteile · ${money(SHOWCASES[0]?.cost??0)}</small><button id="load-showcase">${icon('box')} Bauwerk laden</button><div class="procedural-builder"><label for="procedural-style" class="eyebrow">BAUSTIL</label><select id="procedural-style" data-help="Wählt die Architektur des nächsten Zufallsgebäudes. Zufall mischt alle Baustile; jede Erzeugung ergibt einen neuen Entwurf."><option value="random">Zufall · alle Baustile</option>${BUILDING_STYLES.map(style=>`<option value="${style.id}">${style.name}</option>`).join('')}</select><p id="procedural-style-detail">Jeder Entwurf hat eine eigene Silhouette und Materialwahl.</p><label for="procedural-count"><span class="eyebrow">PROZEDURALER ARCHITEKT</span><output id="procedural-count-value">500 Teile</output></label><div class="procedural-count"><input id="procedural-count" type="range" min="24" max="1000" step="1" value="500"/><input id="procedural-count-number" type="number" min="24" max="1000" step="1" value="500" aria-label="Gewünschte Bauteilzahl"/></div><small id="procedural-meta">Zahl wählen · jede Variante wird neu entworfen</small><button id="generate-building">${icon('pencil-ruler')} Fancy Bauwerk erzeugen</button></div></section>
   <section class="parts-section"><div class="section-heading"><span class="eyebrow">BUILDING ELEMENTS</span><span class="muted">${Object.keys(PARTS).length} Teile</span></div><div class="parts">${Object.entries(PARTS).map(([key,p],i)=>`<button class="part" data-part="${key}" title="${p.detail}"><span class="part-visual part-${key}">${partSVG(key as Kind)}</span><span class="part-name">${p.name}</span><span class="part-cost">${money(p.cost)}</span><kbd>${i+1}</kbd></button>`).join('')}</div></section>
   <section class="prefabs-section"><div class="section-heading"><span class="eyebrow">STANDARD-BAUGRUPPEN</span><span class="muted">1 Klick</span></div><div class="prefabs">${PREFABS.map(p=>`<button class="prefab" data-prefab="${p.id}" title="${p.detail}">${icon(p.id==='column-wall-bay'?'panel-top':p.id==='floor-bay'?'box':p.id==='braced-frame'?'grid-2x2':p.id==='retaining-module'?'panel-left':'pencil-ruler')}<span><b>${p.name}</b><small>${p.count} Teile · ${money(p.cost)}</small></span></button>`).join('')}</div></section>
   <section class="inspector"><div class="section-heading"><span id="inspector-title" class="eyebrow">SELECT AN ELEMENT</span><button id="delete" class="icon-button" title="Delete selected element" disabled>${icon('trash-2')}</button></div><p id="part-detail">Choose a part, then click the grid to place it.</p><div class="part-stats"><span>Mass <b id="part-mass">—</b></span><span>Nominal capacity <b id="part-strength">—</b></span></div></section>
   <section id="concrete-controls" class="concrete-controls"></section>
   <section class="blueprint-actions"><button id="reference">${icon('book-open')} Reference design</button><button id="clear">${icon('file-plus-2')} Start empty</button></section>
   <div class="engine-note"><span class="live-dot" id="engine-dot"></span><span id="engine-label">Loading Jolt Physics…</span><span class="mono">WASM</span></div>
  </aside>
  <section class="stage"><div id="viewport" aria-label="Interactive 3D construction viewport"></div>
   <div class="scene-heading"><span class="eyebrow" id="scene-label">BRIDGE ENGINEERING</span><h1 id="scene-name">Alder crossing<span>01</span></h1><div class="scene-subtitle" id="scene-subtitle">ALDER RIVER · 24 M SPAN</div></div>
   <div class="view-tools"><button id="stress" title="Show stress in physical connections">${icon('activity')} Stress</button><span class="tool-divider"></span><button class="icon-button" data-view="perspective" title="Perspective view">${icon('box')}</button><button class="icon-button" data-view="top" title="Top view">${icon('scan')}</button><button class="icon-button" data-view="front" title="Front view">${icon('panel-top')}</button><button class="icon-button" data-view="side" title="Side view">${icon('panel-left')}</button><button id="grid" class="icon-button active" title="Toggle construction grid">${icon('grid-2x2')}</button></div>
   <div class="edit-tools"><button id="select-tool" class="active" title="Select elements (Esc)">${icon('mouse-pointer-2')}</button><button id="undo" title="Undo (Ctrl+Z)" disabled>${icon('undo-2')}</button><button id="redo" title="Redo (Ctrl+Y)" disabled>${icon('redo-2')}</button><span></span><button id="rotate" title="Rotate selected part or placement (R)">${icon('rotate-cw')}</button><div class="level-control"><label for="level">BUILD LEVEL</label><button id="level-down" title="Lower build plane">−</button><output id="level-value">0 m</output><button id="level-up" title="Raise build plane">+</button></div></div>
   <div class="legend" id="stress-legend" hidden><span>CONNECTION LOAD</span><div></div><small>0% <span>50%</span>100% / failure</small></div>
   <div class="load-hud" id="load-hud" hidden><span class="eyebrow">LIVE CONTENTS LOAD</span><strong id="payload-mass">0.0 <small>tonnes</small></strong><span id="payload-wave">Waiting for occupants</span><div class="payload-track"><i id="payload-fill"></i></div><small>People & furnishings → storage → machinery</small></div>
   <div class="launcher" id="launcher" hidden><div class="section-heading"><span class="eyebrow">DEMOLITION RIG</span>${icon('crosshair')}</div><label for="projectile-mass">Object mass <output id="projectile-mass-value">5.0 t</output></label><input id="projectile-mass" type="range" min="250" max="20000" step="250" value="5000"/><label for="projectile-speed">Launch speed <output id="projectile-speed-value">35 m/s</output></label><input id="projectile-speed" type="range" min="5" max="65" step="1" value="35"/><label for="projectile-radius">Ball diameter <output id="projectile-radius-value">1.4 m</output></label><input id="projectile-radius" type="range" min="0.3" max="10" step="0.1" value="0.7"/><div class="debris-setting"><label for="fragment-limit">Active debris <output id="fragment-limit-value">${initialFragmentLimit} parts</output></label><input id="fragment-limit" type="range" min="24" max="3000" step="1" value="${initialFragmentLimit}"/></div><div class="sandbox-hazards" aria-label="Naturkräfte kombinieren"><span class="hazard-label">NATURKRÄFTE · KOMBINIERBAR</span><div class="hazard-toggles"><button type="button" class="hazard-toggle" data-hazard="wind" aria-pressed="false">Wind</button><button type="button" class="hazard-toggle" data-hazard="earthquake" aria-pressed="false">Beben</button><button type="button" class="hazard-toggle" data-hazard="flood" aria-pressed="false">Wasser</button><button type="button" class="hazard-toggle" data-hazard="meteors" aria-pressed="false" title="Meteoritenschauer ein- oder ausschalten">Meteoriten</button><button type="button" class="hazard-toggle" data-hazard="attack" aria-pressed="false" title="Ein selbstfahrendes Kanonenfahrzeug greift das Gebäude an. Ausschalten parkt es und beendet den Beschuss.">Angriffsauto</button></div><small id="sandbox-hazard-note"></small></div><button id="aim-launch" class="primary">${icon('crosshair')} Aim & launch</button><div class="detached-launchers"><button id="pin-launcher" type="button" title="K: Speichert die aktuelle Abschussposition und die Blickrichtung in der Bildmitte. Weitere Male setzen zusätzliche Kanonen.">Kanone setzen · K</button><button id="clear-launchers" type="button" title="Umschalt+K: Entfernt alle gespeicherten Kanonen. Danach schießt du wieder von der Kamera.">Alle entfernen</button><output id="launcher-count" aria-live="polite">Kamera-Schuss</output></div><p id="launcher-help">Press F to start and fire at the pointer.</p><span class="launcher-energy" id="launcher-energy">3.06 MJ impact energy</span></div>
   <div class="compass"><svg viewBox="0 0 60 60"><path d="M30 42V13M30 42L9 51M30 42l20 10"/><path class="north" d="M30 12l-4 9h8Z"/><text x="27" y="9">Y</text><text x="2" y="55">X</text><text x="51" y="57">Z</text></svg></div>
   <div id="toast" role="status" aria-live="polite"></div>
   <div class="viewport-hint" id="viewport-hint"><span><b>LEFT</b> Select / pan</span><span><b>RIGHT</b> Orbit</span><span><b>SCROLL</b> Zoom</span><span><b>R</b> Rotate part</span></div>
   <div class="result-panel" id="result-panel" hidden><div id="result-icon"></div><span class="eyebrow">TEST REPORT</span><h2 id="result-title"></h2><p id="result-text"></p><div id="result-stats"></div><button id="result-next" class="primary" hidden>Nächstes Level →</button><button id="result-edit" class="primary">${icon('pencil-ruler')} Return to workshop</button><button id="result-close" class="quiet">Inspect the result</button></div>
  </section>
 </main>
 <footer class="controlbar"><div class="build-stats"><div><span class="eyebrow">CONSTRUCTION COST</span><strong id="cost">$0</strong><span class="budget" id="budget">/ $36,000</span><div class="budget-track"><i id="budget-fill"></i></div></div><div><span class="eyebrow">ELEMENTS</span><strong id="count">0</strong><small id="total-mass">0 t</small></div></div><div class="simulation-settings"><label for="intensity">LOAD INTENSITY <output id="intensity-value">1.0×</output></label><input type="range" id="intensity" min="0.5" max="2" step="0.1" value="1"/><div class="speeds"><button data-speed="0.25">¼×</button><button data-speed="0.5">½×</button><button data-speed="1" class="active">1×</button><button data-speed="2">2×</button></div></div><div class="test-progress"><div><span id="status">EDIT MODE</span><span id="timer">00.0 s</span></div><div class="progress-track"><i id="progress"></i></div><small id="telemetry">120 Hz physics · ready to build</small></div><button id="stop" class="stop-button" title="Stop test and restore blueprint" disabled>${icon('square')}</button><button id="restart" class="stop-button restart-button" title="Restore the building and immediately restart with the same active hazards" disabled>${icon('rotate-ccw')}<span>Restart</span></button><button id="run" class="run-button" disabled>${icon('play')}<span>Test structure</span><kbd>SPACE</kbd></button></footer>
 <dialog id="help-dialog"><button id="help-close" class="dialog-close icon-button" title="Close help">${icon('x')}</button><span class="eyebrow">A LITTLE ENGINEERING GOES A LONG WAY</span><h2>Build. Test. Learn.</h2><p>Combine solid construction elements into bridges, buildings, or retaining walls. Every module is a physical body; matching sockets form breakable structural joints.</p><ol><li><b>Pick a challenge.</b> Bridges carry a truck; resilience structures resist earthquakes, wind, floods, or landslides.</li><li><b>Place your parts.</b> Select a part and click the grid. Placement snaps to 2 m. Raise the build plane for upper floors. Press R to rotate; Esc returns to selection.</li><li><b>Connect and anchor.</b> Align module corners and endpoints. Foundations anchor only at ground level. Bridge banks anchor connections at either end of the gap.</li><li><b>Test the structure.</b> Press Space. Turn on Stress to see connection loads. Red joints can fail; detached pieces fall and collide.</li></ol><p class="help-note">This is a game simulation: rigid modules and breakable connections, simplified wind and water forces, and individual landslide boulders. It does not model soil mechanics or material deformation for engineering design.</p><div class="help-shortcuts">Ctrl+Z / Ctrl+Y · Undo / redo &nbsp; Delete · Remove &nbsp; [ / ] · Build level &nbsp; 1–9 · Parts</div></dialog>
 <dialog id="campaign-dialog"><button id="campaign-close" class="dialog-close icon-button" title="Schließen">${icon('x')}</button><span class="eyebrow">VOM ERSTEN TRÄGER ZUM HÄRTETEST</span><h2>Deine Baukampagne</h2><p id="campaign-map-progress"></p><div id="campaign-level-list"></div></dialog>
 <input type="file" id="file-input" accept="application/json,.json" hidden />`;
createIcons({icons});
document.querySelector('label[for="projectile-mass"]')!.insertAdjacentHTML('beforebegin',`<label for="projectile-type">Geschosstyp</label><select id="projectile-type" title="Massive Kugel, Baustein-Kugel oder ein kleines Stockwerk mit Platten, Stützen, Wänden und Fenstern. Das Stockwerk nutzt automatisch die Masse und Eigenschaften seiner Bauteile."><option value="solid">Massive Kugel</option><option value="blocks">Zerstörbare Baustein-Kugel</option><option value="storey">Generiertes Hausgeschoss</option></select><small id="projectile-type-help">Verbundgeschosse können selbst zerbrechen. Durchmesser bestimmt ihre Gesamtgröße.</small>`);
$<HTMLSelectElement>('projectile-type').value=initialProjectileType;
const buildingProjectileControls=installProjectileBuildingControls('loadbearing',()=>updateProjectileControls());

function partSVG(kind:Kind) {
 const drawings:Record<Kind,string>={
  core:'<path d="M10 43V13l22-8 26 9v29H43V27H26v16Z" fill="#7f8e89" stroke="#405951" stroke-width="3"/><path d="m10 13 22 8 26-7M32 21v6" stroke="#c5d2ca" stroke-width="3"/>',
  doorway:'<path d="M12 44V10h44v34H42V24H26v20Z" fill="#b68a5b"/>',
  stairwell:'<path d="m8 24 32-14 26 12-32 15Z m14 0 13 6 17-7-13-6Z" fill="#9aa69e" fill-rule="evenodd"/>',
  stair:'<path d="M8 44V36h10v-8h10v-8h10v-8h10V4h10v40Z" fill="#c2a477"/>',
  facade:'<path d="M14 42V14L59 5v28Z" fill="#92c8d9" fill-opacity=".7" stroke="#c8ddd9" stroke-width="3"/><path d="M36 9v28M14 28l45-10" stroke="#e0e8df" stroke-width="2"/>',
  deck:'<path d="m8 26 31-14 27 12-31 15Z" fill="#778b8b"/><path d="m8 26 27 13 31-15v6L35 45 8 32Z" fill="#485f62"/><path d="m24 28 8-4m8-4 8-4" stroke="#f0d491" stroke-width="2"/>',
  girder:'<path d="m9 34 43-21 10 4-43 22Z M9 39l43-21 10 4-43 22Z" fill="#d8b363"/><path d="m15 35 42-20v7L15 43Z" fill="#9d8658"/>',
  truss:'<path d="M10 36V17l45-9v19Zm0-19 23 15L55 8M10 36l23-23 22 14M33 13v19" fill="none" stroke="#ddb968" stroke-width="2.5"/>',
  column:'<path d="m28 9 10-4 10 5v31l-10 5-10-5Z" fill="#aab8ad"/><path d="M38 15v31l10-5V10Z" fill="#738d84"/>',
  brace:'<path d="m16 37 34-28 7 4-34 29Z" fill="#d4ac71"/><path d="m16 37 7 5v4l-7-4Z" fill="#8c795d"/>',
  slab:'<path d="m8 23 31-13 27 13-31 15Z" fill="#b3c0b2"/><path d="m8 23 27 15 31-15v5L35 43 8 29Z" fill="#78938a"/>',
  wall:'<path d="M15 38V16L53 6l5 3v24L20 45Z" fill="#a3b4a9"/><path d="m20 45 38-12V9L20 20Z" fill="#839c92"/><path d="m20 28 38-12M20 36l38-12" stroke="#b2c2b2"/>',
  foundation:'<path d="m10 25 31-13 25 12v12L35 48 10 36Z" fill="#7f9b8f"/><path d="m10 25 25 12 31-13-25-12Z" fill="#a3b7a7"/><path d="M22 27v-9m12 14V21m12 7V16" stroke="#d5b76d" stroke-width="2"/>',
 };return `<svg viewBox="0 0 76 52" aria-hidden="true">${drawings[kind]}</svg>`;
}

let scenario:Scenario='bridge', challenge=getChallenge(DEFAULT_CHALLENGE.bridge), pieces:Piece[]=sample('bridge'), part:Kind|null=null, rotation=0, selected:number|null=null, nextId=1000;
let concreteDefaults:ConcreteValues={concreteStrength:1,reinforcement:1};
try { const saved=JSON.parse(localStorage.getItem('loadbearing.concrete-defaults')??'null'); if(saved&&Number.isFinite(saved.concreteStrength)&&Number.isFinite(saved.reinforcement)) concreteDefaults={concreteStrength:Math.min(2.5,Math.max(.25,saved.concreteStrength)),reinforcement:Math.min(2.5,Math.max(0,saved.reinforcement))}; } catch {}
let demo:DemoMode|undefined;
let mobileUI:ReturnType<typeof installMobileUI>|undefined;
let firstVisit=false;try{firstVisit=localStorage.getItem('loadbearing.demo-seen')===null&&localStorage.getItem('loadbearing.last-mode')===null;}catch{firstVisit=true;}
let interfaceUI:{refresh:()=>void}|undefined;
let sim:Simulation|null=null, paused=false, speed=1, level=0, aim:V3=[0,0,0], engine:any={}, accumulator=0, resultShown=false, aiming=false, runGeneration=0, restarting=false;
let fragmentLimit=initialFragmentLimit;
type SandboxHazard='wind'|'earthquake'|'flood'|'meteors'|'attack';
const sandboxHazardKinds:SandboxHazard[]=['wind','earthquake','flood','meteors','attack'];
let sandboxHazards:Record<SandboxHazard,boolean>={wind:false,earthquake:false,flood:false,meteors:false,attack:false};
let history:Piece[][]=[], future:Piece[][]=[];const stored=new Map<string,Piece[]>(), storedIntensities=new Map<string,number>();
let workshopInitialized=false;let prefab:string|null=null;
let campaignProgress=readCampaignProgress();
const scene=new GameScene($('viewport'));
const detachedLaunchers=new DetachedLaunchers();scene.scene.add(detachedLaunchers.group);
let walkerMode:WalkerMode|undefined;
let sandboxWorld:SandboxWorld|undefined;
let buildingPlacement:{pieces:Piece[];name:string}|null=null;
let syncedPieces:Piece[]=[];
let worldEditPromise:Promise<void>=Promise.resolve(),worldEditBusy=false;
const usedPieceIds=new Set<number>();
let vehicleWorkshop:VehicleWorkshop|undefined,vehicleBuild:VehiclePart[]|undefined;
let concreteControls:{refresh:()=>void}|undefined;
let toastTimer:ReturnType<typeof setTimeout>;
function toast(message:string){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),3000);}
function currentIntensity(){return Number($<HTMLInputElement>('intensity').value)}
function validIntensity(value:unknown):value is number{return typeof value==='number'&&Number.isFinite(value)&&value>=.5&&value<=2}
function autosave(){try{localStorage.setItem('loadbearing.'+challenge.id,JSON.stringify({version:1,scenario,challengeId:challenge.id,intensity:currentIntensity(),pieces}));return true}catch{toast('Browser storage is unavailable. Export a blueprint to keep it.');return false}}
function loadStored(s:Scenario,id:string){try{const raw=localStorage.getItem('loadbearing.'+id);if(raw){const data=JSON.parse(raw);if(validateBlueprint(data)&&data.scenario===s){const intensity=(data as {intensity?:number}).intensity;if(validIntensity(intensity))storedIntensities.set(id,intensity);return data.pieces}}}catch{}return null;}
function referencePieces(){const campaign=getCampaignLevel(challenge.id);return (campaign?starterPieces(campaign):sample(scenario)).filter(p=>!challenge.allowedParts||challenge.allowedParts.includes(p.kind));}
function readCampaignProgress(){try{return normalizeProgress(JSON.parse(localStorage.getItem('loadbearing.campaign-progress')??'{}'))}catch{return normalizeProgress({})}}
function rememberMode(vehicle=false,driving=false,walking=false){try{localStorage.setItem('loadbearing.last-mode',JSON.stringify({challengeId:challenge.id,vehicle,driving,walking}));}catch{}}
function resumeCampaign(){let saved;try{saved=getCampaignLevel(localStorage.getItem('loadbearing.campaign-current')??'')}catch{}return saved&&isUnlocked(saved.id,campaignProgress)&&!campaignProgress[saved.id]?saved:CAMPAIGN_LEVELS.find(l=>!campaignProgress[l.id])??CAMPAIGN_LEVELS[0];}
function updateCampaignUI(){
 const current=getCampaignLevel(challenge.id),active=!!current,done=Object.keys(campaignProgress).length;
 $('campaign-mode').classList.toggle('active',active);$('workshop-mode').classList.toggle('active',!active);$('campaign-summary').hidden=!active;$('campaign-current').hidden=!active;$('workshop-tabs').hidden=active;$('workshop-selectors').hidden=active;$('campaign-brief').hidden=!active;
 if(current){$('campaign-number').textContent=`LEVEL ${String(current.order).padStart(2,'0')} / ${CAMPAIGN_LEVELS.length}`;$('campaign-title').textContent=current.name.split(' / ')[1];$('campaign-chapter').textContent=['GRUNDLAGEN','BELASTUNGSPROBEN','MEISTERKLASSE'][current.tier-1];$('campaign-progress-text').textContent=`${done} / ${CAMPAIGN_LEVELS.length} geschafft${campaignProgress[current.id]?' · Bestkosten '+money(campaignProgress[current.id].cost):''}`;$('campaign-progress-fill').style.width=done/CAMPAIGN_LEVELS.length*100+'%';$('campaign-brief').textContent=current.brief;}
 $('reference').innerHTML=icon('book-open')+(active?' Startaufbau':' Reference design');$('reference').title=active?'Startaufbau wiederherstellen (rückgängig möglich)':'Reference design';
 $<HTMLInputElement>('intensity').disabled=!!sim||active;$('intensity').title=active?'Die Belastung ist in der Kampagne fest vorgegeben.':'Stärke der Belastung';
}
function renderCampaignMap(){
 const names=['Grundlagen','Belastungsproben','Meisterklasse'];const modes:Record<string,string>={bridge:'Brücke',earthquake:'Erdbeben',wind:'Sturm',flood:'Hochwasser',landslide:'Erdrutsch',occupancy:'Nutzlast'};
 $('campaign-map-progress').textContent=`${Object.keys(campaignProgress).length} von ${CAMPAIGN_LEVELS.length} Levels abgeschlossen. Jeder Erfolg schaltet das nächste Level frei.`;
 $('campaign-level-list').innerHTML=names.map((name,i)=>`<section class="campaign-chapter"><h3><span>0${i+1}</span> ${name}</h3>${CAMPAIGN_LEVELS.filter(l=>l.tier===i+1).map(l=>{const done=campaignProgress[l.id],unlocked=isUnlocked(l.id,campaignProgress);return `<button data-campaign="${l.id}" class="campaign-level ${done?'complete':''} ${challenge.id===l.id?'current':''}" ${unlocked?'':'disabled'}><b>${String(l.order).padStart(2,'0')}</b><span><strong>${l.name.split(' / ')[1]}</strong><small>${modes[l.scenario]} · ${l.target}</small><em>${money(l.budget)} Budget${done?' · Bestkosten '+money(done.cost):''}</em></span><span class="level-state">${done?'✓':unlocked?'→':'Gesperrt'}</span></button>`}).join('')}</section>`).join('');
}
function sync(){
 if(sim&&scenario==='sandbox'){
  const previous=new Map(syncedPieces.map(p=>[p.id,p]));
  pieces=pieces.map(p=>{const old=previous.get(p.id);if((old&&(old.kind!==p.kind||old.rotation!==p.rotation||old.p.some((v,i)=>v!==p.p[i])))||(!old&&usedPieceIds.has(p.id))){const id=nextId++;if(selected===p.id)selected=id;return {...p,id};}return p;});
  const target=structuredClone(pieces),candidate=sim;worldEditBusy=true;
  worldEditPromise=worldEditPromise.then(async()=>{
   if(sim!==candidate)return;
   const old=new Map(syncedPieces.map(p=>[p.id,p])),next=new Set(target.map(p=>p.id));
   const add=target.filter(p=>!old.has(p.id)),remove=syncedPieces.filter(p=>!next.has(p.id)).map(p=>p.id),updated=target.filter(p=>old.has(p.id)&&JSON.stringify(old.get(p.id))!==JSON.stringify(p));
   if(add.length||remove.length){await candidate.editWorldPieces(add,remove);scene.removeWorldPieces(remove);scene.addWorldPieces(add);for(const p of add)usedPieceIds.add(p.id);scene.updatePhysics(candidate);}
   for(const piece of updated)await candidate.updateConcrete([piece.id],{concreteStrength:piece.concreteStrength??1,reinforcement:piece.reinforcement??1});
   if(updated.length){scene.removeWorldPieces(updated.map(p=>p.id));scene.addWorldPieces(updated);scene.updatePhysics(candidate);}
   syncedPieces=target;
   autosave();
  }).catch(error=>{toast(error instanceof Error?error.message:String(error));pieces=structuredClone(syncedPieces);}).finally(()=>{worldEditBusy=false;updateUI();});
 }else{scene.setPieces(pieces);syncedPieces=structuredClone(pieces);autosave();}
 updateUI();
}
function checkpoint(){history.push(structuredClone(pieces));if(history.length>60)history.shift();future=[];}
function updateBuildingGoal(){
 const required=['earthquake','wind','flood','occupancy'].includes(scenario);$('building-goal').hidden=!required;if(!required)return;
 const status=sim?sim.buildingStatus():evaluateBuilding(pieces,{minHeight:challenge.rules.minHeight??8,minFloorArea:challenge.rules.minFloorArea??32});
 $('building-goal-progress').textContent=`${status.completedFloors} / ${status.requiredFloors} Geschosse · je ${status.minFloorArea} m²`;
 $('building-goal-reason').textContent=status.passed?(sim?'Geschosse stehen und sind verankert.':'Bauziel erfüllt – jetzt Belastungstest bestehen.'):status.reason;
 $('building-goal').classList.toggle('complete',status.passed);
}
function updateSandboxHazardsUI(){
 const active=sim?.sandboxHazards??sandboxHazards;
 for(const kind of sandboxHazardKinds){const button=document.querySelector<HTMLButtonElement>(`[data-hazard="${kind}"]`);if(!button)continue;button.classList.toggle('active',!!active[kind]);button.setAttribute('aria-pressed',String(!!active[kind]));}
 $('sandbox-hazard-note').textContent=sim&&paused?'Wirkt beim Fortsetzen weiter.':'';
}
function updateUI(){updateBuildingGoal();
 const budget=challenge.budget,total=cost(pieces);$('cost').textContent=money(total);$('cost').classList.toggle('over-budget',total>budget);$('budget').textContent='/ '+money(budget);$('budget-fill').style.width=Math.min(100,total/budget*100)+'%';$('budget-fill').classList.toggle('over',total>budget);$('count').textContent=String(pieces.length);$('total-mass').textContent=(pieces.reduce((n,p)=>n+PARTS[p.kind].mass,0)/1000).toFixed(1)+' t';
 ($('undo') as HTMLButtonElement).disabled=!history.length;($('redo') as HTMLButtonElement).disabled=!future.length;($('delete') as HTMLButtonElement).disabled=selected===null;
  ($('run') as HTMLButtonElement).disabled=restarting||!engine||(!sim&&pieces.length===0&&scenario!=='sandbox');($('stop') as HTMLButtonElement).disabled=!sim;($('restart') as HTMLButtonElement).disabled=restarting||!sim;($('intensity') as HTMLInputElement).disabled=!!sim;
 ($('load-showcase') as HTMLButtonElement).disabled=scenario!=='sandbox';
 updateSandboxHazardsUI();$('aim-launch').classList.toggle('active',aiming);$('viewport').classList.toggle('aiming',aiming&&(!!sim||detachedLaunchers.count>0));$('launcher-help').textContent=!sim?'Press F to start and fire at the pointer.':aiming?'Click / F: fire · WASD: move camera · right-drag: look.':'F: fire · WASD: move camera · Aim & launch enables mouse shots.';updateLauncherUI();
 document.querySelectorAll<HTMLButtonElement>('[data-part]').forEach(b=>{b.classList.toggle('active',part===b.dataset.part);b.disabled=!!challenge.allowedParts&&!challenge.allowedParts.includes(b.dataset.part as Kind)});
 $('select-tool').classList.toggle('active',part===null&&prefab===null); $('viewport').classList.toggle('placing',(part!==null||prefab!==null||!!buildingPlacement||!!sandboxWorld?.placement));
 document.querySelectorAll<HTMLButtonElement>('[data-prefab]').forEach(b=>{b.classList.toggle('active',prefab===b.dataset.prefab);b.disabled=!!challenge.allowedParts&&expandPrefab(b.dataset.prefab!,[0,0,0]).some(p=>!challenge.allowedParts!.includes(p.kind))});
 const chosen=selected===null?null:pieces.find(p=>p.id===selected);const kind=chosen?.kind??part;
 $('inspector-title').textContent=chosen?'SELECTED / #'+chosen.id:kind?'ELEMENT SPECIFICATION':'SELECT AN ELEMENT';
 $('part-detail').textContent=kind?PARTS[kind].detail+(chosen?` · ${chosen.p.join(', ')} m`:' · R to rotate'): 'Choose a part, then click the grid to place it.';
 $('part-mass').textContent=kind?(PARTS[kind].mass/1000).toFixed(2)+' t':'—';const concreteFactor=chosen&&isConcrete(chosen.kind)?(chosen.concreteStrength??1):1;$('part-strength').textContent=kind?(PARTS[kind].force*concreteFactor/1000).toFixed(0)+' kN':'—';
 const group=PREFABS.find(p=>p.id===prefab);if(group){$('inspector-title').textContent=group.name;$('part-detail').textContent=group.detail+' · R drehen · gemeinsame Stützen werden wiederverwendet';$('part-mass').textContent=(expandPrefab(group.id,[0,0,0]).reduce((n,p)=>n+PARTS[p.kind].mass,0)/1000).toFixed(2)+' t';$('part-strength').textContent='je Einzelteil';}
 $('viewport-hint').innerHTML=`<span><b>LEFT</b> ${group?'Setze '+group.name:part?'Place '+PARTS[part].name.toLowerCase():'Select / pan'}</span><span><b>RIGHT</b> Orbit</span><span><b>SCROLL</b> Zoom</span><span><b>R</b> Rotate · ${rotation*90}°</span>`;
 concreteControls?.refresh();sandboxWorld?.refresh();
 $('run').innerHTML=icon(sim&&!paused&&!sim.result?'pause':'play')+`<span>${sim?sim.result?'Erneut testen':paused?'Weiter':'Pause':scenario==='sandbox'?'Simulation starten':'Bauwerk testen'}</span><kbd>SPACE</kbd>`;updateCampaignUI();createIcons({icons});interfaceUI?.refresh();mobileUI?.refresh();
}
async function applyConcrete(values:ConcreteValues, scope:'selected'|'building'){
 await worldEditPromise;
 const targets=pieces.filter(p=>isConcrete(p.kind)&&(scope==='building'||p.id===selected));
 if(!targets.length){toast(scope==='selected'?'Zuerst ein Betonteil auswählen.':'Keine Betonteile vorhanden.');return;}
 const ids=new Set(targets.map(p=>p.id)),candidate=sim;
 try{
  if(candidate){await candidate.updateConcrete([...ids],values);if(sim!==candidate)return;}
  checkpoint();pieces=pieces.map(p=>ids.has(p.id)?{...p,...values}:p);syncedPieces=structuredClone(pieces);
  if(candidate){scene.removeWorldPieces([...ids]);scene.addWorldPieces(pieces.filter(p=>ids.has(p.id)));scene.updatePhysics(candidate);}else scene.setPieces(pieces);
  autosave();updateUI();toast('Beton und Bewehrung aktualisiert.');
 }catch(error){toast(error instanceof Error?error.message:String(error));}
}

concreteControls=installConcreteControls($('concrete-controls'),{
 getDefaults:()=>concreteDefaults,
 getSelected:()=>selected===null?null:pieces.find(p=>p.id===selected)??null,
 onDefaultsChange:values=>{concreteDefaults=values;try{localStorage.setItem('loadbearing.concrete-defaults',JSON.stringify(values))}catch{}},
 onApplySelected:values=>applyConcrete(values,'selected'),
 onApplyBuilding:values=>applyConcrete(values,'building'),
});
function changeScenario(s:Scenario,id=DEFAULT_CHALLENGE[s]){sandboxWorld?.leave();buildingPlacement=null;vehicleWorkshop?.disable();vehicleBuild=undefined;document.body.classList.remove('vehicle-driving');scene.controls.enabled=true;const campaign=getCampaignLevel(id);if(campaign&&!isUnlocked(id,campaignProgress)){toast('Schließe zuerst das vorherige Level ab.');return}if(sim)stop();sandboxHazards={wind:false,earthquake:false,flood:false,meteors:false,attack:false};if(workshopInitialized){stored.set(challenge.id,structuredClone(pieces));storedIntensities.set(challenge.id,currentIntensity());}workshopInitialized=true;scenario=s;challenge=campaign??getChallenge(id);pieces=structuredClone(stored.get(id)??loadStored(s,id)??referencePieces());nextId=Math.max(1000,...pieces.map(p=>p.id))+1;history=[];future=[];selected=null;part=null;prefab=null;level=0;rotation=0;
 scene.buildEnvironment(s);scene.setPieces(pieces);syncedPieces=structuredClone(pieces);usedPieceIds.clear();for(const piece of pieces)usedPieceIds.add(piece.id);if(s==='sandbox')scene.fitStructure();setLevel(0);const data=SCENARIOS[s];$<HTMLSelectElement>('scenario').value=s;$<HTMLSelectElement>('challenge').innerHTML=CHALLENGES.filter(c=>c.scenario===s).map(c=>`<option value="${c.id}">${c.name.split(' / ')[1]}${c.id===DEFAULT_CHALLENGE[s]?' · standard':''}</option>`).join('');$<HTMLSelectElement>('challenge').value=id;$('description').textContent=challenge.description;$('target').textContent=challenge.target;$('scene-label').textContent=data.label;$('scene-name').innerHTML=challenge.name.split(' / ')[1]+`<span>${challenge.name.split(' / ')[0]}</span>`;
 const intensity=campaign?challenge.intensity:storedIntensities.get(id)??challenge.intensity;$<HTMLInputElement>('intensity').value=String(intensity);$('intensity-value').textContent=intensity.toFixed(1)+'×';$('load-hud').hidden=s!=='occupancy';$('launcher').hidden=s!=='sandbox';$('showcase-picker').hidden=s!=='sandbox';$('payload-mass').innerHTML='0.0 <small>tonnes</small>';$('payload-wave').textContent='Six waves of increasing contents';$('payload-fill').style.width='0%';aiming=false;if(campaign){try{localStorage.setItem('loadbearing.campaign-current',id)}catch{}}$('result-next').hidden=true;
 $('scene-subtitle').textContent=s==='bridge'?'ALDER RIVER · 24 M SPAN':s==='landslide'?'HILLSIDE · PROTECT THE HOUSE':s==='occupancy'?'OCCUPANCY TEST · PROGRESSIVE FLOOR LOADS':s==='sandbox'?'FREE PLAY · EVERY IMPACT IS PHYSICAL':`STRUCTURAL TEST SITE · ${challenge.rules.minHeight??8} M MINIMUM`;$('bridge-mode').classList.toggle('active',s==='bridge');$('disaster-mode').classList.toggle('active',!['bridge','occupancy','sandbox'].includes(s));$('loads-mode').classList.toggle('active',s==='occupancy');$('sandbox-mode').classList.toggle('active',s==='sandbox');$('status').textContent='EDIT MODE';$('timer').textContent='00.0 s';$('progress').style.width='0%';updateUI();rememberMode();}
function beginEdit(){if(sim&&scenario==='sandbox'){if(!paused){paused=true;sim.pause(true);}scene.grid.visible=true;}else if(sim)stop();}
function setPart(kind:Kind|null){if(kind)beginEdit();buildingPlacement=null;sandboxWorld?.cancelPlacement();aiming=false;prefab=null;if(kind&&challenge.allowedParts&&!challenge.allowedParts.includes(kind)){toast('This challenge restricts that material. Choose an allowed part.');return}part=kind;selected=null;scene.select(null);refreshGhost();updateUI();}
function refreshGhost(){if(sandboxWorld?.placement){sandboxWorld.updateGhost(aim);return;}if(buildingPlacement){scene.setGhostAssembly(buildingPlacement.pieces.map(p=>({...p,p:rotate(p.p,rotation),rotation:(p.rotation+rotation)%4})),aim);return;}if(prefab)scene.setGhostAssembly(expandPrefab(prefab,[0,0,0],rotation),aim);else scene.setGhost(part?{id:-1,kind:part,p:aim,rotation}:null)}
function setPrefab(id:string){beginEdit();buildingPlacement=null;sandboxWorld?.cancelPlacement();aiming=false;const members=expandPrefab(id,[0,0,0]);if(!members.length||challenge.allowedParts&&members.some(p=>!challenge.allowedParts!.includes(p.kind)))return;prefab=id;part=null;selected=null;scene.select(null);refreshGhost();updateUI()}
function samePiece(a:Piece,b:Piece){return a.kind===b.kind&&(a.kind==='column'||a.rotation===b.rotation)&&a.p.every((v,i)=>Math.abs(v-b.p[i])<.001)}
function setLevel(n:number){beginEdit();level=Math.max(0,Math.min(scenario==='sandbox'?200:32,n));scene.setLevel(level);aim[1]=level;$('level-value').textContent=level+' m';if(part||prefab)refreshGhost();}
function editRotate(){if(sandboxWorld?.placement){sandboxWorld.rotate();return;}beginEdit();if(part||prefab||buildingPlacement){rotation=(rotation+1)%4;refreshGhost()}else if(selected!==null){checkpoint();const p=pieces.find(p=>p.id===selected)!;p.rotation=(p.rotation+1)%4;sync();scene.select(selected)}updateUI();}
function remove(){if(selected===null)return;beginEdit();checkpoint();pieces=pieces.filter(p=>p.id!==selected);selected=null;sync();}
function undo(){if(!history.length)return;beginEdit();future.push(structuredClone(pieces));pieces=history.pop()!;selected=null;sync();}
function redo(){if(!future.length)return;beginEdit();history.push(structuredClone(pieces));pieces=future.pop()!;selected=null;sync();}
scene.onPick=(p,id)=>{
 if(walkerMode?.active||vehicleWorkshop?.driving||worldEditBusy)return;
 if(sandboxWorld?.placement){void sandboxWorld.place(p);return;}
 if(sandboxWorld?.choosingTarget){if(id!==null)sandboxWorld.target(scene.hoverPoint??p);else toast('Bitte ein Gebäude als Ziel anklicken.');return;}
 if(buildingPlacement){
  const placed=buildingPlacement.pieces.map(q=>({...q,id:nextId++,p:rotate(q.p,rotation).map((v,i)=>v+p[i]) as V3,rotation:(q.rotation+rotation)%4}));
  if(placed.some(q=>q.p.some(v=>Math.abs(v)>475))){toast('Bitte innerhalb des Geländes platzieren.');return;}
  if(pieces.length+placed.length>6000){toast('Maximal 6.000 Bauteile in einer Sandbox-Welt.');return;}
  beginEdit();checkpoint();pieces.push(...placed);const name=buildingPlacement.name;buildingPlacement=null;scene.setGhost(null);sync();toast(name+' platziert. Die bestehende Welt bleibt erhalten.');return;
 }
 const shooting=scenario==='sandbox'&&document.body.dataset.sandboxTab==='projectiles'&&!part&&!prefab;
 if(shooting){void fireSandbox();return;}
 if(scene.hoverVehicleId!==null){sandboxWorld?.select(scene.hoverVehicleId);selected=null;scene.select(null);updateUI();return;}
 sandboxWorld?.select(null);
 if(sim&&scenario!=='sandbox')return;
 if(prefab){let group=expandPrefab(prefab,p,rotation,nextId).filter(q=>!pieces.some(existing=>samePiece(existing,q)));if(!group.length){toast('Diese Baugruppe steht bereits hier.');return;}
  if(group.some(q=>Math.abs(q.p[0])>(scenario==='sandbox'?475:28)||Math.abs(q.p[2])>(scenario==='sandbox'?475:24)||q.p[1]>(scenario==='sandbox'?200:32))){toast('Baugruppe außerhalb des Baubereichs.');return;}
  if(pieces.length+group.length>(scenario==='sandbox'?6000:1000)){toast('Bauteillimit erreicht.');return;}
  group=group.map(q=>({...q,...concreteValuesFor(q.kind,concreteDefaults)}));beginEdit();checkpoint();pieces.push(...group);nextId=Math.max(nextId,...group.map(q=>q.id))+1;sync();return;
 }
 if(part){if(Math.abs(p[0])>(scenario==='sandbox'?475:28)||Math.abs(p[2])>(scenario==='sandbox'?475:24)){toast('Bitte innerhalb des Baubereichs platzieren.');return;}
  if(pieces.length>=(scenario==='sandbox'?6000:1000)){toast('Bauteillimit erreicht.');return;}
  if(pieces.some(x=>x.kind===part&&x.rotation===rotation&&x.p.every((v,i)=>v===p[i]))){toast('Dieses Teil steht bereits hier.');return;}
  beginEdit();checkpoint();pieces.push({id:nextId++,kind:part,p:[...p],rotation,...concreteValuesFor(part,concreteDefaults)});sync();
 }else{selected=id;scene.select(id);updateUI();}
};
$('viewport').addEventListener('aim',(event)=>{aim=(event as CustomEvent).detail.p;if(sandboxWorld?.placement)sandboxWorld.moveGhost(aim);else if((part||prefab||buildingPlacement)&&scene.ghost)scene.ghost.position.set(...aim);});
document.addEventListener('sandbox-tool-change',(event)=>{const tab=(event as CustomEvent).detail.tab;part=null;prefab=null;buildingPlacement=null;sandboxWorld?.cancelPlacement();scene.setGhost(null);aiming=tab==='projectiles';updateUI();});
$('viewport').addEventListener('pointerleave',e=>{if(e.pointerType!=='touch'&&scene.ghost)scene.ghost.visible=false});$('viewport').addEventListener('pointerenter',()=>{if(scene.ghost)scene.ghost.visible=true});
document.querySelectorAll<HTMLElement>('[data-part]').forEach(b=>b.onclick=()=>setPart(b.dataset.part as Kind));
document.querySelectorAll<HTMLElement>('[data-prefab]').forEach(b=>b.onclick=()=>setPrefab(b.dataset.prefab!));
document.querySelectorAll<HTMLElement>('[data-view]').forEach(b=>b.onclick=()=>{scene.resetCamera(b.dataset.view);if(scenario==='sandbox'&&b.dataset.view==='perspective')scene.fitStructure()});
document.querySelectorAll<HTMLElement>('[data-speed]').forEach(b=>b.onclick=()=>{speed=Number(b.dataset.speed);sim?.setSpeed(speed);document.querySelectorAll('[data-speed]').forEach(x=>x.classList.toggle('active',x===b))});
$<HTMLSelectElement>('scenario').onchange=e=>changeScenario((e.target as HTMLSelectElement).value as Scenario);
$<HTMLSelectElement>('challenge').onchange=e=>changeScenario(scenario,(e.target as HTMLSelectElement).value);
$('campaign-mode').onclick=()=>{const l=resumeCampaign();changeScenario(l.scenario,l.id)};$('workshop-mode').onclick=()=>changeScenario('sandbox');
$('campaign-map').onclick=()=>{renderCampaignMap();$<HTMLDialogElement>('campaign-dialog').showModal()};$('campaign-close').onclick=()=>$<HTMLDialogElement>('campaign-dialog').close();
$('campaign-level-list').onclick=e=>{const b=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-campaign]');const l=getCampaignLevel(b?.dataset.campaign??'');if(l&&isUnlocked(l.id,campaignProgress)){$<HTMLDialogElement>('campaign-dialog').close();changeScenario(l.scenario,l.id)}};
$('result-next').onclick=()=>{const l=getCampaignLevel(challenge.id),next=l&&CAMPAIGN_LEVELS[l.order];if(next&&isUnlocked(next.id,campaignProgress))changeScenario(next.scenario,next.id)};
$('bridge-mode').onclick=()=>changeScenario('bridge');$('disaster-mode').onclick=()=>changeScenario('landslide');$('loads-mode').onclick=()=>changeScenario('occupancy');$('sandbox-mode').onclick=()=>{if(scenario==='sandbox'&&sim){walkerMode?.leave();sim.setWalker(null);parkVehicleView();scene.controls.enabled=true;scene.hideCannonTrajectory();rememberMode(false,false,false);updateUI();}else changeScenario('sandbox');};
$('showcase').onchange=()=>{const selected=SHOWCASES.find(b=>b.id===$<HTMLSelectElement>('showcase').value);$('showcase-detail').textContent=selected?.detail??'';$('showcase-meta').textContent=selected?`${selected.count} Bauteile · ${money(selected.cost)}`:''};
 $('load-showcase').onclick=()=>{if(scenario!=='sandbox')return;const id=$<HTMLSelectElement>('showcase').value,design=showcasePieces(id),name=SHOWCASES.find(b=>b.id===id)?.name??'Gebäude';beginBuildingPlacement(design,name);};
const proceduralStyle=$<HTMLSelectElement>('procedural-style');
try{const saved=localStorage.getItem('loadbearing.procedural-style');if(saved&&Array.from(proceduralStyle.options).some(o=>o.value===saved))proceduralStyle.value=saved;}catch{}
const describeProceduralStyle=()=>{$('procedural-style-detail').textContent=BUILDING_STYLES.find(s=>s.id===proceduralStyle.value)?.description??'Jeder Entwurf hat eine eigene Silhouette und Materialwahl.';};
proceduralStyle.onchange=()=>{describeProceduralStyle();try{localStorage.setItem('loadbearing.procedural-style',proceduralStyle.value)}catch{}};describeProceduralStyle();
$<HTMLInputElement>('procedural-count').oninput=e=>{const value=Number((e.target as HTMLInputElement).value);$<HTMLInputElement>('procedural-count-number').value=String(value);$('procedural-count-value').textContent=value.toLocaleString('de-DE')+' Teile';};
$<HTMLInputElement>('procedural-count-number').oninput=e=>{const input=e.target as HTMLInputElement,value=Math.max(24,Math.min(1000,Math.round(Number(input.value)||24)));$<HTMLInputElement>('procedural-count').value=String(value);$('procedural-count-value').textContent=value.toLocaleString('de-DE')+' Teile';};
function beginBuildingPlacement(design:Piece[],name:string){
 if(!design.length)return;parkVehicleView();walkerMode?.leave();sim?.setWalker(null);part=null;prefab=null;sandboxWorld?.cancelPlacement();buildingPlacement={pieces:structuredClone(design),name};rotation=0;level=0;aim[1]=0;scene.setLevel(0);aiming=false;refreshGhost();toast('Gebäude platzieren: Boden anklicken · R drehen · Esc abbrechen.');updateUI();
}
$('generate-building').onclick=()=>{if(scenario!=='sandbox')return;const generated=generateDemolitionBuilding(Number($<HTMLInputElement>('procedural-count-number').value),Date.now(),$<HTMLSelectElement>('procedural-style').value as BuildingStyle|'random');$('procedural-meta').textContent=`${generated.pieces.length} Teile · ${generated.height} m`;beginBuildingPlacement(generated.pieces,generated.name);};
$('select-tool').onclick=()=>setPart(null);$('rotate').onclick=editRotate;$('delete').onclick=remove;$('undo').onclick=undo;$('redo').onclick=redo;
$('level-up').onclick=()=>setLevel(level+4);$('level-down').onclick=()=>setLevel(level-4);
 $('reference').onclick=async()=>{if(scenario==='sandbox'){beginBuildingPlacement(referencePieces(),'Referenzgebäude');return;}const wasWalking=!!walkerMode?.active,wasSim=!!sim,hazards={...(sim?.sandboxHazards??sandboxHazards)};if(wasSim)stop();checkpoint();pieces=referencePieces();nextId=Math.max(nextId,...pieces.map(p=>p.id))+1;selected=null;sync();toast(getCampaignLevel(challenge.id)?'Startaufbau wiederhergestellt. Jetzt vervollständigen!':'Reference design loaded. Modify it or test its limits.');if(wasSim){await run();if(sim){for(const kind of sandboxHazardKinds)if(hazards[kind])sim.setSandboxHazard(kind,true);sandboxHazards=hazards;updateUI();if(wasWalking)await startWalking();}}};
 $('clear').onclick=()=>{beginEdit();checkpoint();pieces=[];selected=null;sync();toast('Empty blueprint. Undo restores the previous design.');};
$('save').onclick=()=>{sandboxWorld?.save();if(autosave())toast('Blueprint saved on this device.');};
$('export').onclick=()=>{const blob=new Blob([JSON.stringify({version:1,scenario,challengeId:challenge.id,intensity:currentIntensity(),pieces,vehicles:scenario==='sandbox'?sandboxWorld?.specs:undefined},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`load-bearing-${challenge.id}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('Blueprint exported.');};
 $('import').onclick=()=>$<HTMLInputElement>('file-input').click();
$<HTMLInputElement>('file-input').onchange=async e=>{const input=e.target as HTMLInputElement,file=input.files?.[0];if(!file)return;try{if(file.size>2000000)throw Error();const data=JSON.parse(await file.text());if(!validateBlueprint(data))throw Error();const requested=(data as {challengeId?:string}).challengeId;const match=[...CHALLENGES,...CAMPAIGN_LEVELS].find(c=>c.id===requested&&c.scenario===data.scenario);if(match&&getCampaignLevel(match.id)&&!isUnlocked(match.id,campaignProgress)){toast('Dieses Kampagnenlevel ist noch gesperrt.');input.value='';return}changeScenario(data.scenario,match?.id??DEFAULT_CHALLENGE[data.scenario]);const intensity=(data as {intensity?:number}).intensity;if(!getCampaignLevel(challenge.id)&&validIntensity(intensity)){$<HTMLInputElement>('intensity').value=String(intensity);$('intensity-value').textContent=intensity.toFixed(1)+'×';}if(data.scenario==='sandbox'&&Array.isArray((data as any).vehicles)){sandboxWorld?.importVehicles((data as any).vehicles);sandboxWorld?.save();}checkpoint();pieces=data.pieces;nextId=Math.max(1000,...pieces.map(p=>p.id))+1;sync();if(data.scenario==='sandbox'&&sandboxWorld?.specs.length)await ensureWorldSimulation();toast('Blueprint imported.');}catch{toast('Invalid blueprint. Choose a valid Load Bearing JSON file.');}input.value='';};
$('help').onclick=()=>$<HTMLDialogElement>('help-dialog').showModal();$('help-close').onclick=()=>$<HTMLDialogElement>('help-dialog').close();
$('stress').onclick=()=>{scene.stress=!scene.stress;$('stress').classList.toggle('active',scene.stress);$('stress-legend').hidden=!scene.stress;if(!sim)scene.setPieces(pieces);toast(scene.stress?'Stress overlay enabled. Run a test to measure joint loads.':'Material colors restored.');};
$<HTMLSelectElement>('projectile-type').onchange=e=>{try{localStorage.setItem('loadbearing.projectile-type',readProjectileType((e.target as HTMLSelectElement).value))}catch{}};
$('grid').onclick=()=>{scene.grid.visible=!scene.grid.visible;$('grid').classList.toggle('active',scene.grid.visible);};
$<HTMLInputElement>('intensity').oninput=e=>{$('intensity-value').textContent=Number((e.target as HTMLInputElement).value).toFixed(1)+'×';autosave()};
function updateProjectileControls(){
 const massInput=$<HTMLInputElement>('projectile-mass'),velocity=Number($<HTMLInputElement>('projectile-speed').value),radius=Number($<HTMLInputElement>('projectile-radius').value),storey=$<HTMLSelectElement>('projectile-type').value==='storey';
 const mass=storey?storeyProjectileLayout(buildingProjectileControls.values().parts).mass:Number(massInput.value);
 massInput.disabled=storey;massInput.hidden=storey;buildingProjectileControls.setVisible(storey);$<HTMLInputElement>('projectile-radius').hidden=storey;document.querySelector<HTMLElement>('label[for="projectile-radius"]')!.hidden=storey;
 $('projectile-mass-value').textContent=(mass/1000).toFixed(2)+' t'+(storey?' · aus Bauteilen':'');
 $('projectile-type-help').textContent=storey?'Feste Bauteilgrößen. Masse automatisch aus den Bauteilen; Festigkeit und Bewehrung gelten nur für Beton.':'Verbundgeschosse können selbst zerbrechen. Durchmesser bestimmt ihre Gesamtgröße.';
 $('projectile-speed-value').textContent=velocity+' m/s';$('projectile-radius-value').textContent=(radius*2).toFixed(1)+' m';$('launcher-energy').textContent=(.5*mass*velocity*velocity/1e6).toFixed(2)+' MJ launch energy';
}
for(const name of ['mass','speed','radius'])$<HTMLInputElement>('projectile-'+name).oninput=updateProjectileControls;
$<HTMLSelectElement>('projectile-type').addEventListener('change',updateProjectileControls);
updateProjectileControls();
$<HTMLInputElement>('fragment-limit').oninput=e=>{fragmentLimit=Number((e.target as HTMLInputElement).value);$('fragment-limit-value').textContent=fragmentLimit+' parts';try{localStorage.setItem('loadbearing.fragment-limit',String(fragmentLimit))}catch{}sim?.setFragmentLimit(fragmentLimit);};
 document.querySelectorAll<HTMLButtonElement>('[data-hazard]').forEach(button=>button.onclick=async()=>{const kind=button.dataset.hazard as SandboxHazard;const next=!((sim?.sandboxHazards??sandboxHazards)[kind]);if(!sim)await run();if(!sim)return;sim.setSandboxHazard(kind,next);sandboxHazards={...sandboxHazards,[kind]:next};if(paused)toast('Die Änderung wirkt beim Fortsetzen.');updateUI();});
 $('aim-launch').onclick=()=>{document.querySelector<HTMLButtonElement>('[data-sandbox-tab=projectiles]')?.click();if(!sim){aiming=true;paused=false;updateUI();void run();return}aiming=!aiming;paused=false;updateUI();};
function sandboxLauncherAvailable(){return scenario==='sandbox'&&!demo?.active&&!walkerMode?.active&&!vehicleWorkshop?.enabled&&!vehicleBuild;}
function projectileSettings(){
 const building=buildingProjectileControls.values(),projectileType=readProjectileType($<HTMLSelectElement>('projectile-type').value),layout=projectileType==='storey'?storeyProjectileLayout(building.parts):undefined;
 return {building,projectileType,radius:layout?.radius??Number($<HTMLInputElement>('projectile-radius').value),mass:layout?.mass??Number($<HTMLInputElement>('projectile-mass').value),speed:Number($<HTMLInputElement>('projectile-speed').value),recycle:$<HTMLInputElement>('game-options-recycle-projectiles').checked};
}
function updateLauncherUI(){
 const count=detachedLaunchers.count;
 $('launcher-count').textContent=count?`${count} feste Kanone${count===1?'':'n'} · F / Klick: Salve`:'Kamera-Schuss · K: Kanone setzen';
 $<HTMLButtonElement>('clear-launchers').disabled=!count;
 if(count)$('launcher-help').textContent='Abschussorte und Richtungen sind fixiert. Kamera frei bewegen · K: weitere Kanone · Umschalt+K: alle entfernen.';
}
function pinLauncher(){
 if(!sandboxLauncherAvailable())return;
 const direction=scene.camera.getWorldDirection(scene.camera.position.clone());
 detachedLaunchers.add(scene.camera.position.clone().addScaledVector(direction,projectileSettings().radius+2),direction);
 aiming=true;updateUI();updateLauncherUI();toast(`Kanone ${detachedLaunchers.count} gesetzt. F feuert alle gemeinsam ab.`);
}
function clearLaunchers(){detachedLaunchers.clear();updateUI();updateLauncherUI();toast('Kanonen entfernt. Du schießt wieder von der Kamera.');}
$('pin-launcher').onclick=pinLauncher;$('clear-launchers').onclick=clearLaunchers;
function launch(_point:V3){
 if(!sim||!sandboxLauncherAvailable())return;
 const settings=projectileSettings();
 let shots=detachedLaunchers.shots(settings.speed);
 if(!shots.length){
  scene.ray.setFromCamera(scene.pointer,scene.camera);
  const direction=scene.ray.ray.direction.clone();
  shots=[{position:scene.camera.position.clone().addScaledVector(direction,settings.radius+2).toArray() as V3,velocity:direction.multiplyScalar(settings.speed).toArray() as V3}];
 }
 sim.launchVolley(shots,settings.mass,settings.radius,settings.projectileType,settings.recycle,settings.building);
 scene.updatePhysics(sim);updateLauncherUI();
}
let sandboxShotPending=false;
async function fireSandbox(){
 if(walkerMode?.active||scenario!=='sandbox'||vehicleWorkshop?.enabled||vehicleBuild||restarting||sandboxShotPending)return;
 sandboxShotPending=true;part=null;prefab=null;buildingPlacement=null;sandboxWorld?.cancelPlacement();scene.setGhost(null);
 try{
  if(!sim)await run();
  const candidate=sim;if(!candidate)return;
  await candidate.ready;
  if(sim!==candidate||scenario!=='sandbox'||restarting||vehicleWorkshop?.enabled||vehicleBuild)return;
  if(paused){paused=false;candidate.pause(false);$('status').textContent='SIMULATING';updateUI();}
  launch(aim);
 }finally{sandboxShotPending=false;}
}
async function run(){
 if(restarting)return;await worldEditPromise;
 if(!engine||(!pieces.length&&scenario!=='sandbox'))return;
 if(sim?.result)stop();
 if(sim){paused=!paused;sim.pause(paused);scene.updatePhysics(sim);$('status').textContent=paused?'PAUSED':'SIMULATING';updateUI();return}
 if(scenario!=='sandbox'&&cost(pieces)>challenge.budget){toast('Over budget. Remove some elements before testing.');return}
 if(challenge.allowedParts&&pieces.some(p=>!challenge.allowedParts!.includes(p.kind))){toast('Remove restricted materials before testing this challenge.');return}
 const generation=++runGeneration,candidate=new Simulation(engine,structuredClone(pieces),scenario,getCampaignLevel(challenge.id)?.intensity??currentIntensity(),{...challenge.rules,fragmentLimit,worldVehicles:scenario==='sandbox'?sandboxWorld?.specs:undefined});
 try {sim=candidate;syncedPieces=structuredClone(pieces);for(const p of pieces)usedPieceIds.add(p.id);$('status').textContent='STARTING PHYSICS';candidate.attachTrees(scene.windTrees.map(tree=>({x:tree.root.userData.baseX,y:tree.root.userData.baseY,z:tree.root.userData.baseZ,height:tree.height})));await Promise.all([candidate.ready,scene.prepareDestruction(pieces)]);if(generation!==runGeneration||sim!==candidate){candidate.dispose();return}scene.beginSimulation();scene.updatePhysics(candidate);paused=false;accumulator=0;resultShown=false;$('result-panel').hidden=true;$('status').textContent='SIMULATING';if(vehicleBuild&&vehicleWorkshop){vehicleWorkshop.driving=true;document.body.classList.add('vehicle-driving');$('vehicle-hud').hidden=false;scene.controls.enabled=false;}updateUI(); }
 catch(error){if(generation!==runGeneration||sim!==candidate)return;console.error(error);candidate.dispose();sim=null;toast('Physics could not start. Check the browser console for details.');updateUI();}
}
function stop(){sandboxWorld?.exit();if(walkerMode?.active)rememberMode();walkerMode?.leave();scene.hideCannonTrajectory();scene.fadeVehicleOccluders();if(vehicleWorkshop){vehicleWorkshop.driving=false;vehicleWorkshop.keys.clear();}document.body.classList.remove('vehicle-driving');$('vehicle-hud')?.setAttribute('hidden','');scene.controls.enabled=true;runGeneration++;restarting=false;if(sim){sim.dispose();sim=null}sandboxHazards={wind:false,earthquake:false,flood:false,meteors:false,attack:false};paused=false;accumulator=0;resultShown=false;$('result-panel').hidden=true;scene.clear(scene.extras);scene.restorePieces(pieces);if(scenario==='landslide')scene.addHouse();scene.water.position.y=scenario==='bridge'?-6:-2;scene.grid.visible=true;$('grid').classList.add('active');$('status').textContent='EDIT MODE';$('timer').textContent='00.0 s';$('progress').style.width='0%';if(part||prefab)refreshGhost();updateUI();}
$('restart').onclick=async()=>{await worldEditPromise;if(!sim||restarting)return;const candidate=sim,generation=++runGeneration,hazards={...sandboxHazards};restarting=true;$('status').textContent='RESETTING';updateUI();try{await candidate.restart(hazards);if(generation!==runGeneration||sim!==candidate)return;scene.restorePieces(pieces);scene.beginSimulation();scene.updatePhysics(candidate);sandboxHazards=hazards;paused=false;accumulator=0;resultShown=false;$('result-panel').hidden=true;$('status').textContent='SIMULATING';$('timer').textContent='00.0 s';$('progress').style.width=challenge.rules.sandbox?'100%':'0%';if(sandboxWorld?.drivenId!==null&&sandboxWorld?.drivenId!==undefined&&vehicleWorkshop){vehicleWorkshop.startDriving();vehicleWorkshop.keys.clear();document.body.classList.add('vehicle-driving');$('vehicle-hud').hidden=false;scene.controls.enabled=false;}}catch(error){if(generation===runGeneration&&sim===candidate){console.error(error);toast('Physics could not restart.');}}finally{if(generation===runGeneration){restarting=false;updateUI();}}};
$('run').onclick=run;$('stop').onclick=()=>{if(scenario==='sandbox'){beginEdit();document.querySelector<HTMLButtonElement>('[data-sandbox-tab=build]')?.click();updateUI();}else stop();};$('result-edit').onclick=stop;$('result-close').onclick=()=>$('result-panel').hidden=true;
// World reset must also work while a slider or button owns keyboard focus.
window.addEventListener('keydown',e=>{
 if(e.code!=='KeyR'&&e.key.toLowerCase()!=='r')return;
 const target=e.target instanceof HTMLElement?e.target:null;
 const typing=target instanceof HTMLTextAreaElement||(target instanceof HTMLInputElement&&!['range','checkbox','radio','button','submit','reset'].includes(target.type))||target?.isContentEditable;
 const dialog=document.querySelector('dialog[open]');
 if(!typing&&!dialog&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&(part||prefab||buildingPlacement||sandboxWorld?.placement)&&scenario==='sandbox'){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)editRotate();return;}
 if(!sim||demo?.active||typing||e.ctrlKey||e.metaKey||e.altKey||e.isComposing||(dialog&&dialog.id!=='game-options-dialog'))return;
 e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)$('restart').click();
},true);
window.addEventListener('keydown',e=>{
 if(e.code!=='KeyK'||!sandboxLauncherAvailable()||e.ctrlKey||e.metaKey||e.altKey||e.isComposing||document.querySelector('dialog[open]'))return;
 const target=e.target instanceof HTMLElement?e.target:null;
 if(target?.isContentEditable||target instanceof HTMLTextAreaElement||(target instanceof HTMLInputElement&&!['range','checkbox','radio','button'].includes(target.type)))return;
 e.preventDefault();e.stopImmediatePropagation();if(!e.repeat){if(e.shiftKey)clearLaunchers();else pinLauncher();}
},true);
// Handle shooting before focused controls can consume keyboard events. Touch uses fireSandbox too.
window.addEventListener('keydown',e=>{
 if(e.code!=='KeyF'&&e.key.toLowerCase()!=='f')return;
 const target=e.target instanceof HTMLElement?e.target:null;
 const typing=target instanceof HTMLTextAreaElement||(target instanceof HTMLInputElement&&!['range','number','checkbox','radio','button','submit','reset'].includes(target.type))||target?.isContentEditable;
 if(e.ctrlKey||e.metaKey||e.altKey||e.isComposing||typing||document.querySelector('dialog[open]')||demo?.active||walkerMode?.active||scenario!=='sandbox'||vehicleWorkshop?.enabled||vehicleBuild)return;
 e.preventDefault();e.stopPropagation();if(!e.repeat)void fireSandbox();
},true);
document.addEventListener('keydown',e=>{if(demo?.active||walkerMode?.active)return;if((e.target as HTMLElement).isContentEditable||document.querySelector('dialog[open]')||['INPUT','SELECT','TEXTAREA'].includes((e.target as HTMLElement).tagName)||$<HTMLDialogElement>('help-dialog').open||$<HTMLDialogElement>('campaign-dialog').open)return;if(vehicleWorkshop?.driving){if(e.code==='KeyR'&&!e.ctrlKey&&!e.metaKey){e.preventDefault();if(!e.repeat)$('restart').click();}return;}if(e.code==='Space'){e.preventDefault();run()}else if(e.key==='Escape'){buildingPlacement=null;sandboxWorld?.cancelPlacement();setPart(null)}else if(e.key.toLowerCase()==='r'&&!e.ctrlKey&&!e.metaKey){if(sim){if(!e.repeat)$('restart').click();}else editRotate();}else if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();remove()}else if(e.key==='[')setLevel(level-4);else if(e.key===']')setLevel(level+4);else if(e.ctrlKey&&e.key==='z'){e.preventDefault();e.shiftKey?redo():undo()}else if(e.ctrlKey&&e.key==='y'){e.preventDefault();redo()}else if(/^[1-9]$/.test(e.key))setPart(Object.keys(PARTS)[Number(e.key)-1] as Kind)});
function showResult(){if(!sim||resultShown)return;resultShown=true;const passed=sim.result==='passed';$('status').textContent=passed?'TEST PASSED':'TEST FAILED';$('result-panel').classList.toggle('failed',!passed);$('result-icon').innerHTML=icon(passed?'shield-check':'triangle-alert');$('result-title').textContent=passed?'Built to withstand.':'Find the weak point.';$('result-text').textContent=sim.reason;$('result-stats').textContent=`${sim.elapsed.toFixed(1)} s tested · ${sim.broken} failed joints · ${money(cost(pieces))}`;const campaign=getCampaignLevel(challenge.id);$('result-next').hidden=true;
 if(campaign){$('result-edit').innerHTML=icon('pencil-ruler')+' Weiterbauen';if(passed){campaignProgress=recordCompletion(campaignProgress,campaign.id,cost(pieces));try{localStorage.setItem('loadbearing.campaign-progress',JSON.stringify(campaignProgress))}catch{toast('Fortschritt konnte nicht gespeichert werden. Browser-Speicher prüfen.')}const next=CAMPAIGN_LEVELS[campaign.order];$('result-title').textContent=next?'Level geschafft!':'Kampagne geschafft!';$('result-next').hidden=!next;if(next)$('result-next').textContent=`Weiter zu Level ${next.order} →`;}}
 else $('result-edit').innerHTML=icon('pencil-ruler')+' Return to workshop';
 $('result-panel').hidden=false;updateUI();}
const freeCameraKeys=new FreeCameraKeys(scene,()=>scenario==='sandbox'&&!demo?.active&&!walkerMode?.active&&!vehicleWorkshop?.enabled&&!vehicleBuild&&scene.controls.enabled);
let last=performance.now(),lastTelemetry=0,lastGoalUpdate=0;
function frame(now:number){
// Give worker messages a normal task turn before requesting another high-priority frame.
 // Otherwise sustained keyboard input plus slow rendering can starve snapshot delivery.
 setTimeout(()=>requestAnimationFrame(frame),0);const dt=Math.min(.1,(now-last)/1000);last=now;
 detachedLaunchers.group.visible=sandboxLauncherAvailable();detachedLaunchers.update(scene.camera.position);
 if(demo?.active){demo.update(dt);return;}
 if(sim){sim.step();scene.updatePhysics(sim as any);sandboxWorld?.refresh();for(const vehicle of sim.worldVehicles)if(vehicle.id!==sandboxWorld?.drivenId)scene.aimAutonomousVehicle(vehicle.chassisId,vehicle.yaw,vehicle.pitch);if(sim.attacker)scene.aimAutonomousVehicle(sim.attacker.id,sim.attacker.yaw,sim.attacker.pitch);if(sim.result)showResult();}
 if(now-lastTelemetry>200){lastTelemetry=now;
  if(sim){$('damage-stats').textContent=`${sim.broken} Verbindungen gebrochen · ${sim.fragments}/${fragmentLimit} Trümmer`; $('timer').textContent=sim.elapsed.toFixed(1).padStart(4,'0')+' s';$('progress').style.width=challenge.rules.sandbox?'100%':Math.min(100,sim.elapsed/sim.duration*100)+'%';$('telemetry').textContent=`${sim.broken} failed joints · ${sim.fragments}/${fragmentLimit} debris · peak ${Math.round(sim.peakStress*100)}% · ${sim.physicsMs.toFixed(1)} ms/step · ${Math.round(scene.fps)} fps${sim.rate<speed*.8?' · '+sim.rate.toFixed(2)+'× realtime':''}`;
   if(sim.occupancy){$('payload-mass').innerHTML=sim.occupancy.tonnes.toFixed(1)+' <small>tonnes</small>';$('payload-wave').textContent=`Wave ${sim.occupancy.wave} / 6 · ${sim.occupancy.count} physical loads`;$('payload-fill').style.width=sim.occupancy.wave/6*100+'%';}
  }else $('telemetry').textContent=`120 Hz physics · ${Math.round(scene.fps)} fps · ${level} m build plane`;
 }if(sim&&now-lastGoalUpdate>1000){lastGoalUpdate=now;updateBuildingGoal();}if(vehicleWorkshop?.driving&&sim){const chassis=sim.items.find(i=>i.id===sandboxWorld?.driven?.chassisId);if(chassis){const v=chassis.body.GetLinearVelocity();const q=scene.meshes.get(chassis.id)?.quaternion;const heading=q?Math.atan2(2*(q.x*q.z+q.w*q.y),1-2*(q.x*q.x+q.y*q.y)):0;vehicleWorkshop.update(dt,Math.hypot(v.GetX(),v.GetY(),v.GetZ()),heading);scene.followVehicle(chassis,dt,vehicleWorkshop.yaw,vehicleWorkshop.pitch,vehicleWorkshop.touchDriving);scene.aimVehicle(vehicleWorkshop.yaw,vehicleWorkshop.pitch,chassis);} }if(walkerMode?.active)walkerMode.update(dt,sim?.walker);freeCameraKeys.update(dt);scene.render(dt);
}
vehicleWorkshop=new VehicleWorkshop({leave:()=>{sandboxWorld?.exit();rememberMode();updateUI();},mode:()=>{if(scenario!=='sandbox')changeScenario('sandbox');},edit:()=>{},send:input=>sandboxWorld?.send(input),drive:async parts=>{sandboxWorld?.beginPlacement(parts,'Eigenes Fahrzeug');}});
let lastMode:{challengeId?:string;vehicle?:boolean;driving?:boolean;walking?:boolean}|null=null;
try{lastMode=JSON.parse(localStorage.getItem('loadbearing.last-mode')??'null');}catch{}
const savedCampaign=getCampaignLevel(lastMode?.challengeId??'');
const savedChallenge=CHALLENGES.find(c=>c.id===lastMode?.challengeId);
const initialChallenge=savedCampaign&&isUnlocked(savedCampaign.id,campaignProgress)?savedCampaign:savedChallenge??getChallenge(DEFAULT_CHALLENGE.sandbox);
changeScenario(initialChallenge.scenario,initialChallenge.id);
requestAnimationFrame(frame);
const updateEngineLabel=(mode?:string,threads=0)=>{$('engine-label').textContent=`${scene.rendererBackend==='webgpu'?'WebGPU':'WebGL'} · Jolt Worker${mode==='multithread'?` · ${threads} threads`:' · single-thread'}`;};
scene.ready.then(()=>updateEngineLabel()).catch(()=>updateEngineLabel());
window.addEventListener('simulation-preparing',()=>{$('status').textContent='GEBÄUDE EINREGELN…';});
window.addEventListener('simulation-ready',(event:any)=>updateEngineLabel(event.detail.mode,event.detail.threads));
window.addEventListener('simulation-warning',(event:any)=>toast(event.detail.message));
$('engine-label').textContent='Renderer + physics worker starting…';$('engine-dot').classList.add('ready');updateUI();
// Readable diagnostics for local development and end-to-end checks.
Object.defineProperty(window,'__loadBearing',{value:{get sandboxWorld(){return sandboxWorld},get buildingPlacement(){return buildingPlacement},get demo(){return demo?.diagnostics},get walkerMode(){return walkerMode},get vehicleWorkshop(){return vehicleWorkshop},get scene(){return scene},get simulation(){return sim},get pieces(){return pieces},get scenario(){return scenario},get ready(){return !!engine&&scene.effectsReady&&scene.rendererBackend!=='initializing'},get campaignLevel(){return getCampaignLevel(challenge.id)},get campaignProgress(){return structuredClone(campaignProgress)}}});

interfaceUI=installInterface(scene,()=>({scenario,sim,paused,vehicle:vehicleWorkshop,challenge}),id=>{const l=getCampaignLevel(id);if(l)changeScenario(l.scenario,l.id);},'loadbearing');
interfaceUI.refresh();


function parkVehicleView(){
 if(sandboxWorld?.drivenId!==null&&sandboxWorld?.drivenId!==undefined){sandboxWorld.exit();return;}if(!vehicleWorkshop?.enabled&&!vehicleBuild)return;
 sim?.vehicleInput({throttle:0,steer:0,brake:true,fire:false,yaw:vehicleWorkshop?.yaw??0,pitch:vehicleWorkshop?.pitch??0});
 vehicleWorkshop?.close();vehicleWorkshop?.disable();vehicleBuild=undefined;
 document.body.classList.remove('vehicle-driving');scene.controls.enabled=true;
 scene.hideCannonTrajectory();scene.fadeVehicleOccluders();
}

async function startWalking(){
 if(scenario!=='sandbox'||restarting)return;
 if(walkerMode?.active)return;
 parkVehicleView();
 buildingPlacement=null;sandboxWorld?.cancelPlacement();part=null;prefab=null;selected=null;scene.select(null);refreshGhost();aiming=false;
 if(!sim)await run();const candidate=sim;if(!candidate)return;
 await candidate.ready;if(sim!==candidate||scenario!=='sandbox')return;
 paused=false;candidate.pause(false);scene.hideCannonTrajectory();scene.grid.visible=false;
 const spawn=walkingSpawn(pieces);
 candidate.setWalker(spawn);walkerMode!.enter();const entry=walkingEntry(pieces);if(entry)walkerMode!.setHeading(Math.atan2(entry.inside[0]-spawn[0],-(entry.inside[2]-spawn[2])));document.body.classList.remove('mobile-tools-open');rememberMode(false,false,true);updateUI();
}
walkerMode=new WalkerMode(scene,{send:input=>sim?.walkerInput(input),exit:()=>{walkerMode?.leave();sim?.setWalker(null);rememberMode();updateUI();},reset:()=>$('restart').click()});
if(lastMode?.walking&&initialChallenge.scenario==='sandbox')void scene.ready.then(()=>startWalking());
const walkButton=document.createElement('button');walkButton.id='walk-mode';walkButton.textContent='🚶 Gebäude erkunden';walkButton.title='In die bestehende Welt einsteigen, ohne Schäden oder Trümmer zurückzusetzen. WASD laufen, Maus umsehen, Umschalt rennen, Leertaste springen. Am Handy mit dem Daumenstick.';walkButton.dataset.help=walkButton.title;walkButton.onclick=()=>void startWalking();$('showcase-picker').prepend(walkButton);

installHoverHelp();
mobileUI=installMobileUI(scene,()=>({scenario,sim,placing:!!(part||prefab||buildingPlacement||sandboxWorld?.placement),selected:selected!==null,vehicle:vehicleWorkshop,walking:!!walkerMode?.active,demo:!!demo?.active}),fireSandbox,()=>scene.onPick?.(aim,scene.hoverId));
demo=new DemoMode(scene,{enter:()=>{sandboxWorld?.exit();sandboxWorld?.cancelPlacement();buildingPlacement=null;walkerMode?.leave();sim?.setWalker(null);sim?.pause(true);vehicleWorkshop?.keys.clear();},restore:()=>{scene.buildEnvironment(scenario);scene.setPieces(pieces);if(sim){scene.beginSimulation();scene.updatePhysics(sim);sim.pause(paused);}else{if(scenario==='landslide')scene.addHouse();if(part||prefab)refreshGhost();if(selected!==null)scene.select(selected);}updateUI();}},'loadbearing');
export const startupReady=firstVisit?demo.start():scene.ready;

async function ensureWorldSimulation(){if(restarting)return null;await worldEditPromise;if(!sim)await run();const candidate=sim;if(!candidate)return null;await candidate.ready;candidate.step();return sim===candidate?candidate:null;}
sandboxWorld=new SandboxWorld(scene,{simulation:()=>sim,ensureSimulation:ensureWorldSimulation,workshop:()=>vehicleWorkshop!,isSandbox:()=>scenario==='sandbox'&&!demo?.active,isPaused:()=>paused,pause:value=>{paused=value;sim?.pause(value);updateUI();},leaveWalker:()=>{walkerMode?.leave();sim?.setWalker(null);},changed:updateUI,toast,clearTools:()=>{part=null;prefab=null;buildingPlacement=null;aiming=false;scene.setGhost(null);}},'loadbearing');
// Saved world vehicles are independent objects, rather than a special startup mode.
if(!firstVisit&&(scenario as Scenario)==='sandbox'&&sandboxWorld.specs.length)void ensureWorldSimulation();

$('vehicle-return').onclick=()=>sandboxWorld?.edit();
