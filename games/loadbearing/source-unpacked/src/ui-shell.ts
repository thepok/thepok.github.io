import {createLevelPreview} from './level-preview';
import { CAMPAIGN_LEVELS, getCampaignLevel } from './campaign';
import { installGameOptions } from './game-options';
import './ui-shell.css';

type State={scenario:string;sim:any;paused:boolean;vehicle:any;challenge:any};
export function installInterface(scene:any,getState:()=>State,selectLevel:(id:string)=>void,storagePrefix:string){
 const $=(id:string)=>document.getElementById(id)!;
 const el=(tag:string,cls:string,html='')=>{const e=document.createElement(tag);e.className=cls;e.innerHTML=html;return e;};
 document.body.classList.add('interface-v2');
 const brand=document.querySelector('.brand')!;brand.textContent='LOAD BEARING';
 const options=installGameOptions({scene,vehicle:()=>getState().vehicle,storagePrefix});
 const top=document.querySelector('.topbar')!;
 const nav=el('nav','primary-modes');nav.setAttribute('aria-label','Spielmodus');
 // Keep legacy buttons in the DOM for main.ts, but expose only the three top modes.
 for(const [id,label] of [['sandbox-mode','Sandbox'],['campaign-mode','Herausforderungen']]){const b=$(id);b.textContent=label;nav.append(b);}
 const demoButton=document.getElementById('show-demo');if(demoButton)nav.append(demoButton);
 top.querySelector('.brand')!.after(nav);
 const campaignOriginal=($('campaign-mode') as HTMLButtonElement).onclick;
 $('campaign-mode').onclick=e=>{campaignOriginal?.call($('campaign-mode'),e);$('campaign-map').click();};
 const optionButton=el('button','options-button','⚙ <span>Optionen</span>');optionButton.id='open-options';optionButton.setAttribute('aria-label','Optionen öffnen');optionButton.onclick=options.open;top.append(optionButton);
 const sidebar=document.querySelector('.sidebar')!,stage=document.querySelector('.stage')!;
 const editNav=el('div','editor-tabs','<button data-edit-tab="parts" class="active">Bauteile</button><button data-edit-tab="assemblies">Baugruppen</button>');sidebar.insertBefore(editNav,document.querySelector('.parts-section'));
 editNav.querySelectorAll<HTMLButtonElement>('button').forEach(b=>b.onclick=()=>{sidebar.setAttribute('data-edit-tab',b.dataset.editTab!);editNav.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));});
 const sandbox=el('section','sandbox-console','<nav class="sandbox-tabs" aria-label="Sandbox-Werkzeuge"><button data-sandbox-tab="build" class="active">Bauen</button><button data-sandbox-tab="buildings">Gebäude</button><button data-sandbox-tab="vehicles">Fahrzeuge</button><button data-sandbox-tab="projectiles">Beschuss</button><button data-sandbox-tab="disasters">Naturkräfte</button></nav>');sidebar.prepend(sandbox);
 const buildings=el('div','sandbox-pane');buildings.dataset.pane='buildings';buildings.append($('showcase-picker'));
 const vehicles=el('div','sandbox-pane');vehicles.dataset.pane='vehicles';const vehiclePanel=document.getElementById('vehicle-panel');if(vehiclePanel)vehicles.append(vehiclePanel);const vehicleLibrary=el('div','world-vehicle-library');vehicleLibrary.id='world-vehicle-library';vehicles.append(vehicleLibrary);
 const projectiles=el('div','sandbox-pane');projectiles.dataset.pane='projectiles';projectiles.append($('launcher'));
 const disasters=el('div','sandbox-pane');disasters.dataset.pane='disasters';disasters.append(projectiles.querySelector('.sandbox-hazards')!);
 const strength=el('div','hazard-strength');const label=document.querySelector('label[for="intensity"]')!;label.childNodes[0].textContent='Belastungsstärke ';strength.append(label,$('intensity'));disasters.append(strength);sandbox.append(buildings,vehicles,projectiles,disasters); 
 let sandboxTab='build';const setTab=(tab:string)=>{sandboxTab=tab;document.body.dataset.sandboxTab=tab;sandbox.querySelectorAll<HTMLButtonElement>('[data-sandbox-tab]').forEach(b=>b.classList.toggle('active',b.dataset.sandboxTab===tab));document.dispatchEvent(new CustomEvent('sandbox-tool-change',{detail:{tab}}));scene.resize();};sandbox.querySelectorAll<HTMLButtonElement>('[data-sandbox-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.sandboxTab!));setTab(sandboxTab);
 const speeds=document.querySelector('.speeds')!;const speedLabel=el('span','speed-label','Simulationszeit');speeds.prepend(speedLabel);
 const simSettings=document.querySelector('.simulation-settings')!;simSettings.append(speeds);
 $('telemetry').classList.add('performance-hud');stage.append($('telemetry'));
 const damageStats=el('div','damage-stats','');damageStats.id='damage-stats';stage.append(damageStats);
 const stop=$('stop');stop.innerHTML='↶ <span>Weiterbauen</span>';stop.title='Simulation beenden und Bauplan wiederherstellen';
 $('restart').innerHTML='↻ <span>Welt zurücksetzen</span><kbd>R</kbd>';
 const breadcrumb=el('div','scene-breadcrumb');breadcrumb.id='scene-breadcrumb';stage.prepend(breadcrumb);
 const worldButton=el('button','world-controls','☰ Weltsteuerung');worldButton.id='world-controls';worldButton.onclick=()=>{if(document.pointerLockElement)document.exitPointerLock();document.body.classList.toggle('world-panel-open');scene.resize();};stage.append(worldButton);
 const hide=el('button','panel-toggle','◧ Werkzeuge');hide.id='toggle-panels';hide.onclick=()=>{document.body.classList.toggle('panels-hidden');scene.resize();};stage.append(hide);
 const driveOptions=el('button','drive-options','⚙');driveOptions.setAttribute('aria-label','Optionen');driveOptions.onclick=options.open;stage.append(driveOptions);
 // One full-screen vehicle workspace, with a real 3D placement surface.
 const vd=$('vehicle-dialog'),editor=vd.querySelector('.vehicle-editor')!,left=editor.firstElementChild!,preview=editor.lastElementChild!;
 vd.querySelector('h2')!.textContent='Fahrzeugwerkstatt';const workshopOptions=el('button','workshop-options','⚙ Optionen');workshopOptions.onclick=options.open;vd.querySelector('.vehicle-dialog-heading')!.insertBefore(workshopOptions,$('vehicle-close'));
 const vehicleStats=el('aside','vehicle-inspector','<h3>Dein Fahrzeug</h3>');vehicleStats.append($('vehicle-summary'),$('vehicle-validation'));
 const presetLabel=el('label','vehicle-preset-label','Schnellstart');presetLabel.append($('vehicle-preset'));left.prepend(presetLabel);
 const plan=el('details','vehicle-plan','<summary>2D-Bauplan & Ebene</summary>');
 for(const node of Array.from(left.children))if(node!==presetLabel&&node.id!=='vehicle-tools')plan.append(node);vehicleStats.append(plan);editor.append(vehicleStats);
 const vehicleFooter=el('footer','vehicle-workspace-footer','<span>Automatisch auf diesem Gerät gespeichert · Klick setzt · Rechtsklick entfernt · Ziehen dreht die Ansicht</span>');vehicleFooter.append($('vehicle-drive'));vd.append(vehicleFooter);
 const layer=el('label','vehicle-layer','Bauebene ');layer.append($('vehicle-level'));preview.append(layer);
 // Choose a level first, then explicitly enter its build state.
 const map=$('campaign-dialog'),list=$('campaign-level-list'),mapBody=el('div','campaign-browser'),detail=el('section','campaign-detail','<span class="eyebrow">DEIN NÄCHSTES BAUPROJEKT</span><div class="level-illustration">▱<span>BAUEN · TESTEN · VERBESSERN</span></div><h3 id="level-preview-title"></h3><p id="level-preview-target"></p><p id="level-preview-brief"></p><strong id="level-preview-budget"></strong><button id="level-preview-start" class="primary">Dieses Level bauen →</button>');list.before(mapBody);mapBody.append(list,detail);
 let renderPreview:ReturnType<typeof createLevelPreview>|undefined;let previewId='';const previewLevel=(id:string)=>{const l=getCampaignLevel(id);if(!l)return;previewId=id;const host=detail.querySelector<HTMLElement>('.level-illustration')!;renderPreview??=createLevelPreview(host);renderPreview(l);$('level-preview-title').textContent=l.name;$('level-preview-target').textContent=l.target;$('level-preview-brief').textContent=l.brief;$('level-preview-budget').textContent=`Budget $${l.budget.toLocaleString('en-US')}`;list.querySelectorAll<HTMLElement>('[data-campaign]').forEach(b=>b.classList.toggle('preview-selected',b.dataset.campaign===id));};
 list.onclick=e=>{const b=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-campaign]');if(b&&!b.disabled)previewLevel(b.dataset.campaign!);};
 $('level-preview-start').onclick=()=>{if(previewId){map instanceof HTMLDialogElement&&map.close();selectLevel(previewId);}};
 new MutationObserver(()=>{if((map as HTMLDialogElement).open)previewLevel(getCampaignLevel(getState().challenge.id)?.id??CAMPAIGN_LEVELS[0].id);}).observe(map,{attributes:true,attributeFilter:['open']});
 let previous='';
 const refresh=()=>{const s=getState(),driving=!!s.vehicle?.driving;const state=driving?'drive':s.scenario==='sandbox'?'sandbox':s.sim?'test':'build';document.body.dataset.gameState=state;document.body.classList.toggle('has-simulation',!!s.sim);document.body.classList.toggle('is-paused',s.paused);document.body.classList.toggle('is-campaign',!!getCampaignLevel(s.challenge.id));
  const name=s.challenge.name.split(' / ').slice(1).join(' / ')||s.challenge.name;breadcrumb.textContent=(driving?'Fahrzeuge':s.scenario==='sandbox'?'Sandbox':getCampaignLevel(s.challenge.id)?'Kampagne':'Freies Bauen')+' / '+name;
  stop.innerHTML=s.scenario==='sandbox'?'▣ <span>Bauen / Pause</span>':'↶ <span>Weiterbauen</span>';
  const target=s.scenario==='sandbox'?'sandbox-mode':getCampaignLevel(s.challenge.id)?'campaign-mode':'sandbox-mode';nav.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.id===target));
  const signature=state+!!s.sim;if(previous!==signature){previous=signature;document.body.classList.remove('panels-hidden','world-panel-open');scene.resize();}
  document.body.dataset.sandboxTab=sandboxTab;
  if(s.sim)$('viewport-hint').textContent=driving?'WASD fahren · Maus zielen · F feuern · E aussteigen':s.scenario==='sandbox'?'F: Kugel abfeuern · Rechts ziehen: umsehen · R: Welt zurücksetzen':'Leertaste: Pause / weiter · R: Test neu starten';
  const strengthParent=s.scenario==='sandbox'?disasters:document.querySelector('.scenario-section')!;if(strength.parentElement!==strengthParent)strengthParent.append(strength);
 };
 new MutationObserver(refresh).observe(document.body,{attributes:true,attributeFilter:['class']});
 const observer=new ResizeObserver(()=>scene.resize());observer.observe(stage);
 refresh();return {refresh};
}
