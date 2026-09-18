import {PARTS,type Kind} from './catalog';
import {PREFABS} from './prefabs';
import {getCampaignLevel} from './campaign';
import {vehicleHelp,vehiclePartHelp} from './vehicle-help';
import './hover-help.css';

const help:Record<string,string>={
 ...vehicleHelp,
 '.vehicle-stat-row':'Fahrzeugkennwert aus dem aktuellen Bauplan.',
 '.brand':'Startseite des Spiels neu laden. Dein Bauplan und deine Einstellungen bleiben im Browser gespeichert.',
 '.lab-badge':'Öffnet die stabile Fassung des Spiels.',
 '#campaign-mode':'Öffnet die Kampagne mit zunehmend schwierigeren Bauaufgaben und gespeicherten Freischaltungen.',
 '#workshop-mode':'Wechselt zum freien Bauen. Hier kannst du Szenarien, Belastungsstärke und Bauplan selbst wählen.',
 '#sandbox-mode':'Öffnet das freie Abbruchgelände: Gebäude laden, Kugeln abfeuern und Naturkatastrophen kombinieren.',
 '#show-demo':'Startet die automatische Vorführung mit Kugelbeschuss und Kanonenfahrzeug. Mit Esc kehrst du zu deinem Spiel zurück.',
 '#demo-skip':'Beendet die Vorführung und stellt deinen vorherigen Spielzustand wieder her. Tastenkürzel: Esc.',
 '#bridge-mode':'Öffnet die Brückenaufgaben. Baue eine tragfähige Verbindung für den belasteten Lastwagen.',
 '#disaster-mode':'Öffnet die Aufgaben zum Schutz von Bauwerken vor Naturkatastrophen.',
 '#loads-mode':'Öffnet Belastungsaufgaben mit immer schwereren Gebäudenutzungen und Einrichtungsgegenständen.',
 '#scenario':'Wählt das Szenario, etwa Brücke, Erdrutsch, Wind, Erdbeben oder Hochwasser. Der zugehörige Bauplan wird geladen.',
 '#challenge':'Wählt eine Aufgabenvariante innerhalb des Szenarios mit eigenen Zielen und Belastungen.',
 '#campaign-map':'Zeigt alle Kampagnenlevel, deinen Fortschritt und die Voraussetzungen für gesperrte Aufgaben.',
 '#campaign-close':'Schließt die Levelübersicht und kehrt zum aktuellen Bauprojekt zurück.',
 '#level-preview-start':'Lädt das in der Übersicht ausgewählte Level und seinen gespeicherten Bauplan bzw. Startentwurf.',
 '#save':'Speichert den aktuellen Bauplan für diese Aufgabe im Browser auf diesem Gerät.',
 '#export':'Lädt den aktuellen Bauplan als JSON-Datei herunter, damit du ihn sichern oder auf ein anderes Gerät übertragen kannst.',
 '#import,#file-input':'Lädt einen Bauplan aus einer exportierten JSON-Datei in das Spiel.',
 '#help':'Öffnet die Spielanleitung mit Bauregeln, Steuerung und Tastenkürzeln.',
 '#help-close':'Schließt die Spielanleitung.',
 '#open-options,.drive-options,.workshop-options':'Öffnet Grafik-, Maus- und Anzeigeoptionen sowie das Trümmerlimit. Änderungen werden auf diesem Gerät gespeichert.',
 '#delete':'Entfernt das ausgewählte Bauteil aus dem Bauplan. Tastenkürzel: Entf oder Rücktaste.',
 '#reference':'Lädt den Referenzentwurf der aktuellen Aufgabe als Ausgangspunkt zum Ausprobieren.',
 '#clear':'Entfernt alle Bauteile aus dem aktuellen Entwurf, damit du von vorne bauen kannst. Mit Rückgängig wiederherstellbar.',
 '#stress':'Färbt Bauteile nach der Belastung ihrer Verbindungen. Die Legende zeigt, wie nahe die Verbindungen am Versagen sind.',
 '#grid':'Blendet das Bauraster ein oder aus. Die aktuelle Bauebene bleibt unverändert.',
 '#select-tool':'Beendet die Bauteilplatzierung. Klicke danach ein vorhandenes Bauteil an, um es auszuwählen. Tastenkürzel: Esc.',
 '#undo':'Macht die letzte Änderung am Bauplan rückgängig. Tastenkürzel: Strg+Z.',
 '#redo':'Stellt die zuletzt rückgängig gemachte Bauplanänderung wieder her. Tastenkürzel: Strg+Y oder Strg+Umschalt+Z.',
 '#rotate':'Dreht das ausgewählte Bauteil oder die Platzierungsvorschau um 90 Grad. Im Baumodus auch mit R.',
 '#level-down':'Senkt die Bauebene um 4 Meter. Neue Teile werden auf dieser Höhe platziert. Tastenkürzel: [.',
 '#level-up':'Hebt die Bauebene um 4 Meter an, um höhere Stockwerke zu bauen. Tastenkürzel: ].',
 '#level-value,.level-control':'Höhe der aktuellen Bauebene über dem Boden. Die Plus- und Minustasten versetzen die Platzierungsebene.',
 '#stop':'Beendet den Physiktest und stellt den ursprünglichen Bauplan zum Weiterbauen wieder her.',
 '#restart':'Setzt die gesamte Welt auf den Bauplan zurück und startet sofort erneut, mit denselben aktiven Naturkräften. Im Fahrzeug bleibst du am Steuer. Tastenkürzel während der Simulation: R.',
 '#intensity,#intensity-value,.hazard-strength':'Skaliert die Stärke der Szenariobelastung: 1× ist normal, höhere Werte belasten das Bauwerk stärker. Das verändert die Kräfte bzw. Lasten, nicht die Simulationsgeschwindigkeit. In Kampagnenleveln ist die Stärke vorgegeben.',
 '#showcase':'Wählt ein vorbereitetes Gebäude zum Zerstören. Erst „Bauwerk laden“ setzt es in die Welt.',
 '#load-showcase':'Ersetzt den Bauplan durch das ausgewählte Gebäude. Eine laufende Simulation startet damit automatisch neu.',
 '#procedural-count,#procedural-count-number,#procedural-count-value':'Gewünschte Anzahl von Bauteilen für das zufällig entworfene Gebäude, von 24 bis 1000. Die tatsächlich verbaute Zahl liegt ungefähr bei diesem Ziel.',
 '#generate-building':'Erzeugt ein neues zufälliges Gebäude mit ungefähr der gewählten Teilezahl und lädt es in die Welt. Eine laufende Simulation startet neu.',
 '#projectile-mass,#projectile-mass-value':'Masse der Sandbox-Kugel in Kilogramm. Mehr Masse erhöht bei gleicher Geschwindigkeit die Aufprallenergie. Der Ausgabewert wird in Tonnen angezeigt.',
 '#projectile-speed,#projectile-speed-value':'Abschussgeschwindigkeit der Sandbox-Kugel in Metern pro Sekunde. Doppelte Geschwindigkeit ergibt bei gleicher Masse vierfache kinetische Energie.',
 '#projectile-radius,#projectile-radius-value':'Durchmesser der Sandbox-Kugel in Metern. Die Reglergrenzen sind unter Reglerbereiche anpassen einstellbar. Bestimmt ihre Größe und den Kontaktbereich; die Masse stellst du separat ein.',
 '#fragment-limit,#fragment-limit-value,.debris-setting':'Maximale Zahl physikalischer Trümmerstücke, bis 3000. Höhere Werte halten mehr Schutt in der Welt, benötigen aber mehr Rechenleistung. Alte Trümmer werden bei Bedarf entfernt.',
 '#aim-launch':'Schaltet den Beschuss per Linksklick ein oder aus und startet bei Bedarf die Simulation. F feuert in der Sandbox auch ohne diesen Schalter; im Fahrzeug bedienst du damit dessen Kanone.',
 '#launcher-energy':'Kinetische Energie der eingestellten Kugel beim Abschuss, berechnet aus Masse und Geschwindigkeit. Das ist kein garantierter Schadenswert.',
 '#launcher-help':'Sandbox-Steuerung: WASD bewegt die freie Kamera vor, zurück und seitwärts. F feuert eine Kugel zum Mauszeiger und startet bei Bedarf die Simulation. Die Kugelwerte gelten nicht für die Fahrzeugkanone.',
 '#sandbox-hazard-note,.hazard-label':'Naturkräfte lassen sich unabhängig einschalten und gleichzeitig kombinieren. In einer pausierten Simulation wirken Änderungen erst beim Fortsetzen.',
 '#world-controls':'Blendet die Sandbox-Werkzeuge während der Fahrt ein oder aus, um Gebäude, Geschosse und Naturkräfte zu steuern.',
 '#toggle-panels':'Blendet die Werkzeugleiste am Rand ein oder aus und schafft mehr Platz für die 3D-Ansicht.',
 '#result-next':'Öffnet nach bestandenem Test das nächste freigeschaltete Kampagnenlevel.',
 '#result-edit':'Kehrt zum ursprünglichen Bauplan zurück, damit du ihn nach dem Test verbessern kannst.',
 '#result-close':'Blendet den Ergebnisbericht aus, damit du den Zustand des getesteten Bauwerks betrachten kannst.',
 '#cost,#budget,.budget-track':'Kosten aller Teile im aktuellen Bauplan im Verhältnis zum Budget dieser Aufgabe.',
 '#count':'Anzahl der Bauteile im Bauplan. Entstandene Trümmer werden separat gezählt.',
 '#total-mass':'Gesamtmasse aller ursprünglichen Bauteile im Bauplan, in Tonnen.',
 '#part-mass':'Masse des ausgewählten Bauteils. Sie bestimmt sein Gewicht und seine Trägheit in der Simulation.',
 '#part-strength':'Nenn-Tragfähigkeit der Verbindung des ausgewählten Bauteils. Belastung und Hebelwirkung entscheiden, wann Verbindungen brechen.',
 '#part-detail,#inspector-title,.inspector':'Informationen zum ausgewählten Bauteil: Abmessungen, Masse und Verbindungsfestigkeit. Bauteile lassen sich im Auswahlmodus anklicken.',
 '#damage-stats':'Zählt gebrochene Verbindungen und aktuell vorhandene physikalische Trümmer im Verhältnis zum eingestellten Trümmerlimit.',
 '#telemetry':'Detaillierte Messwerte: gebrochene Verbindungen, Trümmer, Spitzenbelastung, Physikzeit pro Schritt und Bilder pro Sekunde. Realtime gibt die tatsächlich erreichte Simulationsgeschwindigkeit an.',
 '#timer':'Seit dem Start oder Neustart vergangene Simulationszeit. Pause hält sie an; die Geschwindigkeitstasten verändern ihren Ablauf.',
 '#status':'Aktueller Spielzustand: Bauen, laufender Test, Pause, Neustart oder Testergebnis.',
 '#progress,.progress-track':'Fortschritt des zeitlich begrenzten Tests. Die Sandbox läuft ohne festes Zeitlimit.',
 '#stress-legend':'Farblegende der Verbindungsbelastung: 100 Prozent entsprechen der Belastungsgrenze.',
 '#payload-mass,#payload-wave,#payload-fill,.payload-track,#load-hud':'Zusätzliche Last im Gebäude durch aufeinanderfolgende Wellen immer schwererer Inhalte. Diese Gegenstände belasten die Böden physikalisch.',
 '#engine-label,#engine-dot,.engine-note':'Zeigt den aktiven Grafik- und Physikbetrieb, einschließlich der verwendeten Physik-Worker und Threads.',
 '#campaign-progress-text,#campaign-progress-fill,#campaign-map-progress,.campaign-progress-track':'Zeigt, wie viele Kampagnenlevel du bereits abgeschlossen hast. Fortschritt und Bestwerte werden im Browser gespeichert.',
 '#campaign-chapter,#campaign-number,#campaign-title,#campaign-current':'Aktuelles Kampagnenlevel und seine Schwierigkeitsstufe.',
 '#description,#campaign-brief':'Beschreibt die aktuelle Bauaufgabe und gibt Hinweise zum Bestehen.',
 '#target,.objective':'Das Ziel der aktuellen Aufgabe. Dein Bauwerk muss diese Anforderungen im Physiktest erfüllen.',
 '#building-goal,#building-goal-progress,#building-goal-reason':'Prüft Höhe, nutzbare Geschossfläche und zusammenhängende Unterstützung des Bauwerks. Hier siehst du, welche Bauanforderungen noch fehlen.',
 '#showcase-detail,#showcase-meta':'Beschreibung, Bauteilzahl und Kosten des ausgewählten vorbereiteten Gebäudes.',
 '#procedural-meta':'Zeigt die Daten des zuletzt erzeugten Gebäudes. Jede neue Variante wird erneut zufällig entworfen.',
 '#level-preview-title,#level-preview-target,#level-preview-brief,#level-preview-budget,.level-illustration':'Vorschau der ausgewählten Aufgabe: Startbauwerk, Ziel, Hinweise und Budget. „Dieses Level bauen“ lädt sie.',
 '#result-title,#result-text,#result-stats,#result-icon':'Ergebnis des letzten Physiktests, mit Erfolgs- oder Fehlergrund, Testdauer, gebrochenen Verbindungen und Baukosten.',
 '#scene-breadcrumb,.scene-heading':'Name des aktuellen Spielmodus, der Aufgabe oder des geladenen Gebäudes.',
 '.compass':'Orientierung der 3D-Welt: Y zeigt nach oben, X und Z bilden die Bodenebene.',
 '#viewport-hint,.help-shortcuts':'Kurzübersicht der Maus- und Tastatursteuerung für den aktuellen Spielzustand.',
 '.speed-label':'Verändert den zeitlichen Ablauf der Simulation, ohne die eingestellte Belastungsstärke zu verändern.',
 '#demo-chapter,#demo-title,#demo-description,.demo-exit-hint,#demo-overlay header':'Automatische Vorführung mit echter Physik. Mit „Selbst spielen“ oder Esc kehrst du zu deinem Bauprojekt zurück.',
 '.sidebar-top,.parts-section .section-heading':'Bauteilkatalog: Ein Teil wählen und anschließend im Raster platzieren.',
 '.prefabs-section .section-heading':'Vorgefertigte Baugruppen bestehen aus normalen Bauteilen und werden gemeinsam platziert.',
 '#help-dialog':'Spielanleitung: So funktionieren Bauen, Verbindungen, Belastungstests und die Steuerung.',
 '#campaign-dialog > h2,#campaign-dialog > .eyebrow':'Übersicht der Baukampagne. Wähle ein freigeschaltetes Level aus, um seine Vorschau zu sehen.',
 '#boot-status,#boot-note,.boot-title,.boot-tag':'Das Spiel lädt Grafik und Physik. Beim ersten Besuch müssen die benötigten Ressourcen zunächst heruntergeladen und vorbereitet werden.',
 '#boot-retry':'Lädt die Seite erneut und versucht, das Spiel noch einmal zu starten.',
 '#toast':'Kurze Rückmeldung zur zuletzt ausgeführten Aktion.',
};
const parts:Record<Kind,string>={core:'Verstärkter Stahlbetonkern: hohler Schacht mit Eingang, steifen Wänden und starken Geschossverbindungen. Stapeln und mit Decken verbinden; widersteht deutlich mehr Beschuss als normale Wände.',doorway:'Wand mit begehbarer Türöffnung.',stairwell:'Geschossdecke mit offenem Treppenschacht.',stair:'Begehbare Treppe zwischen zwei Geschossen.',deck:'Fahrbahnsegment für Brücken; trägt den Verkehr.',girder:'Stahlträger zur Verbindung und Verstärkung des Tragwerks.',truss:'Fachwerkträger mit diagonaler Aussteifung für tragfähige Brückenspannen.',column:'Bewehrte Betonsäule als vertikale Stütze für Geschosse.',brace:'Diagonale Strebe gegen seitliches Verformen des Tragwerks.',slab:'Bewehrte Betonplatte als Geschossboden; überträgt Lasten auf ihre Stützen.',wall:'Massive Betonwand zur Aussteifung oder zum Abfangen von Lasten.',foundation:'Fundament zur Verankerung des Tragwerks am Boden.',facade:'Verglaste Fassade im Metallrahmen. Die Scheibe zerbricht bei starken Treffern in Glassplitter.'};
const hazards:Record<string,string>={attack:'Ein selbstfahrendes Kanonenfahrzeug fährt um das Gebäude und beschießt es. Ausschalten bremst das Fahrzeug und beendet weitere Schüsse. Weltreset startet einen neuen Angriff. Funktioniert auch beim Erkunden zu Fuß.',wind:'Wind mit Böen einschalten oder abschalten.',earthquake:'Erdbeben einschalten oder abschalten; der Untergrund erschüttert die Bauwerke.',flood:'Hochwasser mit Strömung einschalten oder abschalten.',meteors:'Meteoritenschauer einschalten oder abschalten; Meteoriten treffen Dächer und Hausseiten aus wechselnden Richtungen, mit 50 % mehr Masse und entsprechend stärkerem Einschlag.'};
const selectors=Object.keys(help),mappedSelector=selectors.join(',');
const controls='button,a[href],input:not([type=hidden]),select,textarea,summary,output,label';
export function describeHelp(el:HTMLElement,visited=new Set<HTMLElement>()):string{
 if(visited.has(el))return '';visited.add(el);
 if(el.id==='game-options-sound')return 'Materialabhängige Bruchgeräusche ein- oder ausschalten. Die Einstellung wird auf diesem Gerät gespeichert.';
 if(el.id==='game-options-volume')return 'Lautstärke der Bruchgeräusche. 0% ist stumm; Änderungen gelten sofort.';
 if((el.id.startsWith('mobile-')||el.hasAttribute('data-mobile-help'))&&el.dataset.help)return el.dataset.help;
 const d=el.dataset;
 if(el instanceof HTMLLabelElement){const c=el.control??el.querySelector<HTMLElement>('input,select');if(c)return describeHelp(c,visited);}
 if(el.matches('.vehicle-stat-row')){const key=el.firstElementChild?.textContent;return ({Bauteile:'Anzahl der Fahrzeugteile. Das Fahrzeug darf höchstens 80 Teile enthalten.',Räder:'Zahl der Räder. Zum Fahren sind mindestens vier Räder links und rechts an zwei Achsen nötig.',Motorverbund:'Größe der größten direkt zusammenhängenden Motorgruppe. Sie bestimmt den Bonus auf Drehmoment und Höchstgeschwindigkeit.',Kanonen:'Zahl der montierten Kanonen. Beim Feuern schießen die Kanonen gemeinsam.',Masse:'Gesamtmasse aller Fahrzeugteile. Mehr Masse verändert Trägheit und Aufprallwirkung.',Antriebsziel:'Aus der Motorgruppe berechnetes Geschwindigkeitsziel der Räder. Die tatsächlich erreichte Fahrgeschwindigkeit hängt auch von Belastung und Boden ab.'} as Record<string,string>)[key??'']??'';}
 if(d.part){const part=PARTS[d.part as Kind];return `${parts[d.part as Kind]} ${part.detail} Klicken zum Auswählen, dann im Bauraster platzieren.${(el as HTMLButtonElement).disabled?' In diesem Level nicht zugelassen.':''}`;}
 if(d.prefab){const p=PREFABS.find(p=>p.id===d.prefab);return p?`${p.name}: ${p.detail} Als Gruppe auswählen und im Raster platzieren; R dreht sie.${(el as HTMLButtonElement).disabled?' In diesem Level nicht zugelassen.':''}`:'';}
 if(d.vehiclePart)return vehiclePartHelp[d.vehiclePart]??'';
 if(d.speed)return `Simulation mit ${Number(d.speed).toLocaleString('de-DE')}× Normalgeschwindigkeit ablaufen lassen. Das verändert das Tempo, nicht die Kräfte oder Lasten.`;
 if(d.view)return `Kamera auf ${({perspective:'räumliche Perspektive',top:'Draufsicht von oben',front:'Frontansicht',side:'Seitenansicht'} as Record<string,string>)[d.view]} ausrichten.`;
 if(d.hazard)return `${hazards[d.hazard]} Mit anderen Naturkräften kombinierbar. Bei Bedarf startet die Simulation.`;
 if(d.editTab)return d.editTab==='parts'?'Zeigt einzelne Bauteile zum Auswählen und Platzieren.':'Zeigt vorbereitete Baugruppen, die du mit einem Klick aus mehreren Bauteilen platzierst.';
 if(d.sandboxTab)return ({buildings:'Vorbereitete Gebäude laden oder zufällige Gebäude entwerfen.',vehicles:'Fahrzeuge der gemeinsamen Welt platzieren, auswählen und bearbeiten.',projectiles:'Masse, Geschwindigkeit und Größe der Sandbox-Kugeln einstellen.',disasters:'Wind, Erdbeben, Wasser und Meteoriten unabhängig einschalten und kombinieren.',build:'Bauteile und Baugruppen zum Bearbeiten des Sandbox-Bauplans anzeigen.'} as Record<string,string>)[d.sandboxTab];
 if(d.campaign){const l=getCampaignLevel(d.campaign);return `${l?.name??'Level'}: ${l?.target??''} ${(el as HTMLButtonElement).disabled?'Noch gesperrt: zuerst das vorherige Level abschließen.':'Klicken, um Startbauwerk und Aufgabe in der Vorschau zu betrachten.'}`;}
 if(el.id==='run'){const paused=document.body.classList.contains('is-paused'),running=document.body.classList.contains('has-simulation');return `${running?(paused?'Setzt die pausierte Simulation fort.':'Pausiert die laufende Simulation oder startet nach dem Ergebnis einen neuen Test.'):'Startet den Physiktest des aktuellen Bauplans.'} Tastenkürzel: Leertaste.${(el as HTMLButtonElement).disabled?' Momentan nicht verfügbar: Bauteile fehlen oder die Simulation wird vorbereitet.':''}`;}
 for(const selector of selectors)if(el.matches(selector))return help[selector];
 if(el instanceof HTMLLabelElement){const c=el.control??el.querySelector<HTMLElement>('input,select');if(c)return describeHelp(c,visited);}
 if(el instanceof HTMLOutputElement){const c=el.id.endsWith('-value')?document.getElementById(el.id.slice(0,-6)):null;if(c)return describeHelp(c,visited);}
 if(el.matches('#vehicle-grid button'))return 'Bauplatz auf der gewählten Fahrzeug-Ebene: Linksklick setzt oder ersetzt das gewählte Teil, Rechtsklick entfernt es. Alle Teile müssen verbunden sein.';
 const parent=el.parentElement?.closest<HTMLElement>(mappedSelector);return parent?describeHelp(parent,visited):'';
}

export function installHoverHelp(){
 const tip=document.createElement('div');tip.id='hover-help';tip.setAttribute('role','tooltip');tip.setAttribute('popover','manual');tip.hidden=true;document.body.append(tip);
 const annotate=(root:Element)=>{const elements=[...(root.matches(controls+','+mappedSelector)?[root]:[]),...Array.from(root.querySelectorAll(controls+','+mappedSelector))];for(const e of elements){if(!(e instanceof HTMLElement)||e===tip)continue;const text=describeHelp(e);if(text){e.dataset.help=text;if(e.matches('button,a')&&!e.getAttribute('aria-label')&&!e.textContent?.trim())e.setAttribute('aria-label',text);e.removeAttribute('title');}}};
 annotate(document.body);
 // Only new element subtrees need registration; live statistics update text constantly.
 new MutationObserver(records=>{for(const r of records)for(const n of Array.from(r.addedNodes))if(n instanceof HTMLElement&&n!==tip&&!tip.contains(n))annotate(n);}).observe(document.body,{childList:true,subtree:true});
 let anchor:HTMLElement|null=null,timer=0,describedBefore:string|null=null;
 const hide=()=>{clearTimeout(timer);if(anchor){if(describedBefore===null)anchor.removeAttribute('aria-describedby');else anchor.setAttribute('aria-describedby',describedBefore);}anchor=null;describedBefore=null;if(tip.matches(':popover-open'))tip.hidePopover();tip.hidden=true;};
 const show=(target:HTMLElement)=>{if(!target.isConnected||document.pointerLockElement)return;const text=describeHelp(target)||target.dataset.help;if(!text)return;tip.textContent=text;tip.hidden=false;const parent=target.closest('dialog[open]')??document.body;if(tip.parentElement!==parent)parent.append(tip);tip.showPopover();const r=target.getBoundingClientRect(),box=tip.getBoundingClientRect();tip.style.left=Math.max(8,Math.min(innerWidth-box.width-8,r.left+r.width/2-box.width/2))+'px';tip.style.top=(r.bottom+box.height+12<innerHeight?r.bottom+8:Math.max(8,r.top-box.height-8))+'px';target.setAttribute('aria-describedby',[describedBefore,tip.id].filter(Boolean).join(' '));};
 const select=(event:Event,immediate=false)=>{if(document.body.classList.contains('mobile-ui')||(event instanceof PointerEvent&&event.pointerType==='touch'))return;if(!(event.target instanceof Element)||document.pointerLockElement)return;const target=event.target.closest<HTMLElement>('[data-help]');if(target===anchor)return;hide();if(!target)return;anchor=target;describedBefore=target.getAttribute('aria-describedby');timer=window.setTimeout(()=>{if(anchor===target)show(target);},immediate?0:350);};
 document.addEventListener('help-request',e=>{const target=(e as CustomEvent<HTMLElement>).detail;if(!(target instanceof HTMLElement))return;hide();anchor=target;describedBefore=target.getAttribute('aria-describedby');show(target);});
 document.addEventListener('pointerover',e=>select(e),true);
 document.addEventListener('focusin',e=>select(e,true));
 document.addEventListener('pointerout',e=>{if(e.pointerType==='touch')return;if(anchor&&(!(e.relatedTarget instanceof Node)||!anchor.contains(e.relatedTarget)))hide();},true);
 document.addEventListener('focusout',hide,true);document.addEventListener('pointerdown',hide,true);window.addEventListener('keydown',e=>{if(e.key==='Escape')hide();},true);document.addEventListener('scroll',hide,true);window.addEventListener('resize',hide);document.addEventListener('pointerlockchange',hide);
}
