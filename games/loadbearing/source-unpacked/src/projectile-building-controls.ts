import { installProjectilePreview } from './projectile-preview';
import { normalizeBuildingProjectile, type BuildingProjectileOptions } from './block-projectile';

export function installProjectileBuildingControls(storagePrefix:string,onChange:()=>void){
 let initial:BuildingProjectileOptions=normalizeBuildingProjectile();
 try{initial=normalizeBuildingProjectile(JSON.parse(localStorage.getItem(storagePrefix+'.projectile-building')||'null'))}catch{}
 const host=document.createElement('div');host.id='projectile-building-controls';
 host.innerHTML=`<label for="projectile-building-parts">Bauteile <output id="projectile-building-parts-value"></output></label><input id="projectile-building-parts" type="range" min="16" max="320" step="16" title="Erzeugt verbundene Räume und Stockwerke aus festen Bauteilgrößen. Mehr Teile ergeben ein größeres Gebäude.">
 <label for="projectile-building-strength">Betonfestigkeit <output id="projectile-building-strength-value"></output></label><input id="projectile-building-strength" type="range" min="0.25" max="2.5" step="0.05" title="Festigkeit der Betonteile im Hausgeschoss. Höhere Werte machen den Beton stärker und dunkler; seine Masse bleibt unverändert.">
 <label for="projectile-building-rebar">Bewehrung <output id="projectile-building-rebar-value"></output></label><input id="projectile-building-rebar" type="range" min="0" max="2.5" step="0.05" title="Stärke der Bewehrung im Hausgeschoss. Null bedeutet unbewehrten Beton. Glas bleibt unverändert.">`;
 document.getElementById('projectile-type-help')!.after(host);
 const preview=installProjectilePreview(host);
 const parts=host.querySelector<HTMLInputElement>('#projectile-building-parts')!,strength=host.querySelector<HTMLInputElement>('#projectile-building-strength')!,rebar=host.querySelector<HTMLInputElement>('#projectile-building-rebar')!;
 parts.value=String(initial.parts);strength.value=String(initial.concreteStrength);rebar.value=String(initial.reinforcement);
 const values=()=>normalizeBuildingProjectile({parts:Number(parts.value),concreteStrength:Number(strength.value),reinforcement:Number(rebar.value)});
 const refresh=()=>{const value=values();preview.update(value);host.querySelector('output#projectile-building-parts-value')!.textContent=String(value.parts);host.querySelector('output#projectile-building-strength-value')!.textContent=value.concreteStrength.toFixed(2)+'×';host.querySelector('output#projectile-building-rebar-value')!.textContent=value.reinforcement.toFixed(2)+'×';};
 for(const input of [parts,strength,rebar])input.oninput=()=>{refresh();try{localStorage.setItem(storagePrefix+'.projectile-building',JSON.stringify(values()))}catch{}onChange();};
 refresh();return {values,setVisible:(visible:boolean)=>{host.hidden=!visible}};
}
