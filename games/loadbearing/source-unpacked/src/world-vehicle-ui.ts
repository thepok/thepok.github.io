import './world-vehicle-ui.css';
import {VEHICLE_PRESETS} from './vehicle-blueprint';
export type WorldVehicleInfo={id:string|number;name:string;mode?:string;parts?:unknown[]};
export type WorldVehicleUIHooks={
 placePreset:(id:string)=>void;create:()=>void;enter:()=>void;exit:()=>void;attack:()=>void;park:()=>void;edit:()=>void;duplicate:()=>void;remove:()=>void;cancelPlacement:()=>void;
};

/** Compact library and in-world context actions for the shared Sandbox vehicle layer. */
export function installWorldVehicleUI(hooks:WorldVehicleUIHooks){
 const library=document.getElementById('world-vehicle-library')??(()=>{const e=document.createElement('section');e.id='world-vehicle-library';document.querySelector('.stage')?.append(e);return e;})();
 library.className='world-vehicle-library';library.setAttribute('aria-label','Fahrzeugbibliothek');
 const context=document.createElement('aside');context.id='world-vehicle-context';context.className='world-vehicle-context';context.setAttribute('aria-label','Fahrzeugaktionen');context.hidden=true;document.querySelector('.stage')?.append(context);
 const action=(id:string,label:string,help:string,fn:()=>void)=>{const b=document.createElement('button');b.id=`world-vehicle-${id}`;b.type='button';b.textContent=label;b.dataset.help=help;b.onclick=fn;return b;};let previous='';
 const render=(selected:WorldVehicleInfo|null,driving:boolean,placing:boolean)=>{const signature=`${selected?.id??''}:${selected?.name??''}:${selected?.mode??''}:${driving}:${placing}`;if(signature===previous)return;previous=signature;
   library.innerHTML='<div class="world-vehicle-heading"><b>FAHRZEUGE</b><small>Gemeinsame Welt</small></div>';
   const create=action('create','＋ Neuer Bauplan','Öffnet einen leeren Fahrzeugbauplan, ohne die aktuelle Welt zurückzusetzen.',hooks.create);library.append(create);
   const list=document.createElement('div');list.className='world-vehicle-presets';for(const preset of VEHICLE_PRESETS){const b=action(`preset-${preset.id}`,preset.name,'Platziert diesen Fahrzeugentwurf in der gemeinsamen Welt.',()=>hooks.placePreset(preset.id));b.dataset.vehiclePreset=preset.id;list.append(b);}library.append(list);
   context.hidden=!selected&&!placing&&!driving;context.innerHTML='';
   if(selected){const title=document.createElement('strong');title.textContent=selected.name;context.append(title);const state=document.createElement('span');state.className='world-vehicle-state';state.textContent=selected.mode==='attack'?'ANGRIFF':driving?'FÄHRT':placing?'PLATZIERUNG':'AUSGEWÄHLT';context.append(state);const row=document.createElement('div');row.className='world-vehicle-actions';if(driving)row.append(action('exit','Ausstieg','Beendet die Fahrt und gibt die Fahrzeugsteuerung frei.',hooks.exit));else{row.append(action('enter','Fahren','Steigt in das ausgewählte Fahrzeug ein.',hooks.enter),action('park','Parken','Parkt das Fahrzeug und beendet die aktive Fahrt.',hooks.park));}row.append(action('attack','Angreifen','Wählt zuerst ein Ziel. Danach fährt das Fahrzeug autonom dorthin und feuert selbstständig.',hooks.attack),action('edit','Bearbeiten','Öffnet den Bauplan dieses Fahrzeugs, ohne es sofort neu zu platzieren.',hooks.edit),action('duplicate','Duplizieren','Erzeugt eine Kopie dieses Fahrzeugs zur Platzierung.',hooks.duplicate),action('remove','Entfernen','Entfernt das ausgewählte Fahrzeug aus der Welt.',hooks.remove));context.append(row);}
   if(placing)context.append(action('cancel-placement','Abbrechen','Bricht die Fahrzeugplatzierung ab und behält die Welt unverändert.',hooks.cancelPlacement));
 };
 render(null,false,false);return {refresh:(selected:WorldVehicleInfo|null,driving=false,placing=false)=>render(selected,driving,placing)};
}
