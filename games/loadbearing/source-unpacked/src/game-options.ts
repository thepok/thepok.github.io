import { installProjectileRanges } from './projectile-ranges';
import './game-options.css';

type GameOptions = {
  resolution: number;
  sensitivity: number;
  invertY: boolean;
  shortcutHints: boolean;
  performanceTelemetry: boolean;
  soundEnabled: boolean;
  soundVolume: number;
};

type InstallOptions = {
  scene: any;
  vehicle: () => any;
  storagePrefix: string;
};

const DEFAULTS: GameOptions = {
  resolution: 1,
  sensitivity: 1,
  invertY: false,
  shortcutHints: true,
  performanceTelemetry: false,
  soundEnabled: true,
  soundVolume: .45,
};

const validResolution = (value: unknown): value is number => value === .75 || value === 1 || value === 1.5;
const validSensitivity = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= .5 && value <= 2;
const validVolume = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;

function readOptions(key: string): GameOptions {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? 'null') as Partial<GameOptions> | null;
    return {
      resolution: validResolution(parsed?.resolution) ? parsed.resolution : DEFAULTS.resolution,
      sensitivity: validSensitivity(parsed?.sensitivity) ? Math.round(parsed.sensitivity * 100) / 100 : DEFAULTS.sensitivity,
      invertY: typeof parsed?.invertY === 'boolean' ? parsed.invertY : DEFAULTS.invertY,
      shortcutHints: typeof parsed?.shortcutHints === 'boolean' ? parsed.shortcutHints : DEFAULTS.shortcutHints,
      performanceTelemetry: typeof parsed?.performanceTelemetry === 'boolean' ? parsed.performanceTelemetry : DEFAULTS.performanceTelemetry,
      soundEnabled: typeof parsed?.soundEnabled === 'boolean' ? parsed.soundEnabled : DEFAULTS.soundEnabled,
      soundVolume: validVolume(parsed?.soundVolume) ? Math.round(parsed.soundVolume * 100) / 100 : DEFAULTS.soundVolume,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

function writeOptions(key: string, options: GameOptions) {
  try { localStorage.setItem(key, JSON.stringify(options)); } catch { /* Local storage is optional. */ }
}

export function installGameOptions({ scene, vehicle, storagePrefix }: InstallOptions): { open: () => void } {
  const storageKey = `${storagePrefix}.options`;
  const options = readOptions(storageKey);
  const dialog = document.createElement('dialog');
  dialog.id = 'game-options-dialog';
  dialog.setAttribute('aria-labelledby', 'game-options-title');
  dialog.innerHTML = `
    <div class="game-options-heading">
      <div><span class="eyebrow">LOAD BEARING · SYSTEM</span><h2 id="game-options-title">Optionen</h2></div>
      <button type="button" class="game-options-close" data-options-close aria-label="Optionen schließen">×</button>
    </div>
    <p class="game-options-intro">Einstellungen werden auf diesem Gerät gespeichert.</p>
    <div class="game-options-fields">
      <label for="game-options-resolution">Renderauflösung <output id="game-options-resolution-value"></output></label>
      <select id="game-options-resolution">
        <option value="0.75">75% · schneller</option><option value="1">100% · nativ</option><option value="1.5">150% · schärfer</option>
      </select>
      <label for="game-options-sensitivity">Mausempfindlichkeit <output id="game-options-sensitivity-value"></output></label>
      <input id="game-options-sensitivity" type="range" min=".5" max="2" step=".05">
      <label class="game-options-check"><input id="game-options-invert" type="checkbox"><span>Y-Achse umkehren</span></label>
      <label class="game-options-check"><input id="game-options-hints" type="checkbox"><span>Tastenhinweise anzeigen</span></label>
      <label class="game-options-check"><input id="game-options-telemetry" type="checkbox"><span>Leistungsdaten anzeigen</span></label>
      <label class="game-options-check" data-help="Zerstörung klingt aus kurzen, lokal erzeugten Materialklängen."><input id="game-options-sound" type="checkbox"><span>Materialklänge</span></label>
      <label for="game-options-volume" data-help="Lautstärke der Materialklänge"><output id="game-options-volume-value"></output> Lautstärke</label>
      <input id="game-options-volume" type="range" min="0" max="1" step=".05"><button type="button" id="game-options-sound-test" data-help="Spielt ein Bruchgeräusch zum Prüfen der Lautstärke. Materialklänge müssen eingeschaltet sein.">Ton testen</button>
    </div>
    <label class="game-options-check" title="Verwendet alte Geschosse wieder. Auch ausgeschaltet werden bei vollem Trümmerlimit die ältesten Bauteilreste für neue Bauteilgeschosse entfernt."><input id="game-options-recycle-projectiles" type="checkbox"><span>Alte Geschosse wiederverwenden</span></label>
    <div class="game-options-debris" data-options-debris></div>
    <p class="game-options-saved" role="status" aria-live="polite">Änderungen gelten sofort.</p>
  `;
  document.body.append(dialog);
  installProjectileRanges(`${storagePrefix}.projectile-ranges`, dialog.querySelector<HTMLElement>('.game-options-saved')!);

  const recycle = dialog.querySelector<HTMLInputElement>('#game-options-recycle-projectiles')!;
  try{recycle.checked=localStorage.getItem(`${storagePrefix}.recycle-projectiles`)==='true'}catch{}
  recycle.onchange=()=>{try{localStorage.setItem(`${storagePrefix}.recycle-projectiles`,String(recycle.checked))}catch{}};
  const resolution = dialog.querySelector<HTMLSelectElement>('#game-options-resolution')!;
  const resolutionValue = dialog.querySelector<HTMLOutputElement>('#game-options-resolution-value')!;
  const sensitivity = dialog.querySelector<HTMLInputElement>('#game-options-sensitivity')!;
  const sensitivityValue = dialog.querySelector<HTMLOutputElement>('#game-options-sensitivity-value')!;
  const invert = dialog.querySelector<HTMLInputElement>('#game-options-invert')!;
  const hints = dialog.querySelector<HTMLInputElement>('#game-options-hints')!;
  const telemetry = dialog.querySelector<HTMLInputElement>('#game-options-telemetry')!;
  const sound = dialog.querySelector<HTMLInputElement>('#game-options-sound')!;
  const volume = dialog.querySelector<HTMLInputElement>('#game-options-volume')!;
  const volumeValue = dialog.querySelector<HTMLOutputElement>('#game-options-volume-value')!;
  const saved = dialog.querySelector<HTMLElement>('.game-options-saved')!;

  const applyRenderer = () => {
    const apply = () => {
      if (!scene?.renderer) return;
      scene.renderer.setPixelRatio(Math.min((window.devicePixelRatio || 1) * options.resolution, 2));
      scene.resize?.();
    };
    if (scene?.ready && typeof scene.ready.then === 'function') void scene.ready.then(apply).catch(() => undefined);
    else apply();
  };
  const applyVehicle = () => {
    const current = vehicle?.();
    if (current) { current.mouseSensitivity = options.sensitivity; current.invertMouseY = options.invertY; }
    if (scene?.audio) { scene.audio.enabled = options.soundEnabled; scene.audio.volume = options.soundVolume; scene.audio.update?.(); }
  };
  const applyBody = () => {
    document.body.classList.toggle('hide-game-hints', !options.shortcutHints);
    document.body.classList.toggle('show-performance', options.performanceTelemetry);
  };
  const persistAndApply = () => {
    writeOptions(storageKey, options);
    applyRenderer(); applyVehicle(); applyBody();
    saved.textContent = 'Lokal gespeichert · Änderungen gelten sofort.';
  };
  const sync = () => {
    resolution.value = String(options.resolution);
    resolutionValue.textContent = `${Math.round(options.resolution * 100)}%`;
    sensitivity.value = String(options.sensitivity);
    sensitivityValue.textContent = `${options.sensitivity.toFixed(2)}×`;
    invert.checked = options.invertY; hints.checked = options.shortcutHints; telemetry.checked = options.performanceTelemetry;
    sound.checked = options.soundEnabled; volume.value = String(options.soundVolume); volumeValue.textContent = `${Math.round(options.soundVolume * 100)}%`;
  };
  const debris = document.querySelector<HTMLElement>('.debris-setting');
  if (debris) dialog.querySelector<HTMLElement>('[data-options-debris]')!.append(debris);

  resolution.onchange = () => { const value = Number(resolution.value); if (validResolution(value)) { options.resolution = value; persistAndApply(); sync(); } };
  sensitivity.oninput = () => { const value = Number(sensitivity.value); if (validSensitivity(value)) { options.sensitivity = value; persistAndApply(); sync(); } };
  invert.onchange = () => { options.invertY = invert.checked; persistAndApply(); };
  hints.onchange = () => { options.shortcutHints = hints.checked; persistAndApply(); };
  telemetry.onchange = () => { options.performanceTelemetry = telemetry.checked; persistAndApply(); };
  dialog.querySelector<HTMLButtonElement>('#game-options-sound-test')!.onclick=async()=>{const played=await scene.audio?.preview();saved.textContent=played?'Testton abgespielt · Lautstärke oben einstellbar.':'Materialklänge einschalten, um den Ton zu testen.';};
  sound.onchange = () => { options.soundEnabled = sound.checked; persistAndApply(); };
  volume.oninput = () => { const value = Number(volume.value); if (validVolume(value)) { options.soundVolume = value; persistAndApply(); sync(); } };
  dialog.querySelector<HTMLButtonElement>('[data-options-close]')!.onclick = () => dialog.close();
  dialog.addEventListener('cancel', event => { event.preventDefault(); dialog.close(); });
  dialog.addEventListener('keydown', event => { if (event.key !== 'Escape') event.stopPropagation(); });
  sync(); applyVehicle(); applyBody(); applyRenderer();
  return { open: () => { if(document.pointerLockElement)document.exitPointerLock();sync(); dialog.showModal(); } };
}

