/** Optional slider bounds, expressed in the same units as the visible readouts. */
export function installProjectileRanges(storageKey: string, before: HTMLElement) {
 const panel=document.createElement('details');panel.className='projectile-ranges';
 panel.innerHTML='<summary title="Eigene Von-bis-Grenzen für die Kugelregler einstellen.">Kugelregler: Von–bis-Bereiche</summary>';
 let saved:Record<string,number[]>={};try{saved=JSON.parse(localStorage.getItem(storageKey)||'{}')||{}}catch{}
 const configs=[{key:'mass',label:'Masse (t)',factor:1000},{key:'speed',label:'Tempo (m/s)',factor:1},{key:'radius',label:'Durchmesser (m)',factor:.5}];
 const resets:(()=>void)[]=[];
 for(const config of configs){
  const slider=document.getElementById('projectile-'+config.key) as HTMLInputElement;
  const defaults=[Number(slider.min)/config.factor,Number(slider.max)/config.factor];
  const row=document.createElement('div');row.className='projectile-range-row';
  row.innerHTML=`<span>${config.label}</span><label>Von <input type="number" step="any" aria-label="${config.label}: Von" title="Kleinster Wert des Schiebereglers; muss positiv sein."></label><label>Bis <input type="number" step="any" aria-label="${config.label}: Bis" title="Größter Wert des Schiebereglers; muss größer als Von sein."></label>`;
  const [lower,upper]=Array.from(row.querySelectorAll('input'));
  const valid=(v:number[])=>v.length===2&&v.every(n=>Number.isFinite(n)&&n>0&&Number.isFinite(n*config.factor))&&v[1]>v[0];
  const apply=(bounds:number[])=>{
   const current=Number(slider.value);slider.min=String(bounds[0]*config.factor);slider.max=String(bounds[1]*config.factor);
   slider.step='any';slider.value=String(Math.min(Number(slider.max),Math.max(Number(slider.min),current)));
   lower.value=String(bounds[0]);upper.value=String(bounds[1]);upper.setCustomValidity('');
   slider.dispatchEvent(new Event('input'));saved[config.key]=bounds;
  };
  const persist=()=>{try{localStorage.setItem(storageKey,JSON.stringify(saved))}catch{}};
  const change=()=>{const bounds=[Number(lower.value),Number(upper.value)];if(!valid(bounds)){upper.setCustomValidity('Bitte positive Grenzen eingeben: Bis muss größer als Von sein.');upper.reportValidity();return}apply(bounds);persist()};
  lower.addEventListener('change',change);upper.addEventListener('change',change);
  const initial=saved[config.key];apply(Array.isArray(initial)&&valid(initial)?initial:defaults);
  resets.push(()=>apply(defaults));panel.append(row);
 }
 const reset=document.createElement('button');reset.type='button';reset.textContent='Standardbereiche';reset.title='Die ursprünglichen Grenzen aller drei Kugelregler wiederherstellen.';
 reset.onclick=()=>{resets.forEach(reset=>reset());try{localStorage.removeItem(storageKey)}catch{}};panel.append(reset);
 before.before(panel);
}
