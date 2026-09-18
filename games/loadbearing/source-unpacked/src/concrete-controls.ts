import { isConcrete, materialProperties } from './concrete-materials';
import type { Kind, Piece } from './catalog';

export type ConcreteValues = { concreteStrength: number; reinforcement: number };
type Callbacks = {
  getDefaults: () => ConcreteValues;
  getSelected: () => Piece | null;
  onDefaultsChange: (values: ConcreteValues) => void;
  onApplySelected: (values: ConcreteValues) => void;
  onApplyBuilding: (values: ConcreteValues) => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const value = (input: HTMLInputElement, min: number, max: number) => { const parsed = Number(input.value); return clamp(Number.isFinite(parsed) ? parsed : 1, min, max); };

/** Mounts the compact concrete/rebar editor and returns a refresh hook for selection changes. */
export function installConcreteControls(host: HTMLElement, callbacks: Callbacks) {
  host.innerHTML = `
    <details><summary class="section-heading" title="Tune concrete and reinforcement defaults or override a selected concrete part."><span class="eyebrow">CONCRETE &amp; REBAR</span><span class="muted" id="concrete-scope">BUILDING DEFAULTS</span></summary>
    <p class="concrete-note" id="concrete-note">New concrete parts use these defaults. Existing parts keep their own values.</p>
    <div class="concrete-field"><label for="concrete-strength">Concrete strength <output id="concrete-strength-value">1.00×</output></label><input id="concrete-strength" type="range" min="0.25" max="2.5" step="0.01" value="1" data-help="Scales concrete compression and fracture resistance. 1× is the normal material. Darker concrete is stronger." /></div>
    <div class="concrete-field"><label for="concrete-reinforcement">Reinforcement <output id="concrete-reinforcement-value">1.00×</output></label><input id="concrete-reinforcement" type="range" min="0" max="2.5" step="0.01" value="1" data-help="Scales rebar contribution at concrete connections. 0× is unreinforced; 1× is normal. More edge stripes and steel dots indicate more reinforcement." /></div>
    <div class="concrete-presets"><span class="muted">PRESETS</span><button type="button" data-concrete-preset="standard" title="Normal concrete and rebar">Standard</button><button type="button" data-concrete-preset="tough" title="Stronger concrete, normal rebar">Tough mix</button><button type="button" data-concrete-preset="rebar" title="Normal concrete, heavy rebar">Rebar heavy</button><button type="button" data-concrete-preset="brittle" title="Strong concrete with no reinforcement">Brittle</button><button type="button" data-concrete-preset="crumbly" title="Weak concrete with light reinforcement">Crumbly</button></div>
    <div class="concrete-actions"><button type="button" id="concrete-apply-selected" data-help="Apply the staged values to the selected concrete part. Die laufende Welt und vorhandene Schäden bleiben erhalten." disabled>Apply to selected</button><button type="button" id="concrete-apply-building" data-help="Apply the staged values to every concrete part. Die laufende Welt und vorhandene Schäden bleiben erhalten.">Apply to building</button></div></details>`;
  const strength = host.querySelector<HTMLInputElement>('#concrete-strength')!;
  const rebar = host.querySelector<HTMLInputElement>('#concrete-reinforcement')!;
  const strengthValue = host.querySelector<HTMLOutputElement>('#concrete-strength-value')!;
  const rebarValue = host.querySelector<HTMLOutputElement>('#concrete-reinforcement-value')!;
  const scope = host.querySelector<HTMLElement>('#concrete-scope')!;
  const note = host.querySelector<HTMLElement>('#concrete-note')!;
  const selectedButton = host.querySelector<HTMLButtonElement>('#concrete-apply-selected')!;
  const values = (): ConcreteValues => ({ concreteStrength: value(strength, .25, 2.5), reinforcement: value(rebar, 0, 2.5) });
  const render = (next: ConcreteValues) => {
    strength.value = String(next.concreteStrength); rebar.value = String(next.reinforcement);
    strengthValue.textContent = `${next.concreteStrength.toFixed(2)}×`; rebarValue.textContent = `${next.reinforcement.toFixed(2)}×`;
  };
  const changed = () => { const next = values(); render(next); if (!(callbacks.getSelected() && isConcrete(callbacks.getSelected()!.kind))) callbacks.onDefaultsChange(next); };
  strength.addEventListener('input', changed); rebar.addEventListener('input', changed);
  host.querySelectorAll<HTMLButtonElement>('[data-concrete-preset]').forEach(button => button.onclick = () => {
    const presets: Record<string, ConcreteValues> = { standard: { concreteStrength: 1, reinforcement: 1 }, tough: { concreteStrength: 1.5, reinforcement: 1 }, rebar: { concreteStrength: 1, reinforcement: 1.75 }, brittle: { concreteStrength: 1.5, reinforcement: 0 }, crumbly: { concreteStrength: .5, reinforcement: .4 } };
    const next = presets[button.dataset.concretePreset!]; render(next);
    if (!(callbacks.getSelected() && isConcrete(callbacks.getSelected()!.kind))) callbacks.onDefaultsChange(next);
  });
  selectedButton.onclick = () => callbacks.onApplySelected(values());
  host.querySelector<HTMLButtonElement>('#concrete-apply-building')!.onclick = () => callbacks.onApplyBuilding(values());
  return {
    refresh() {
      const selected = callbacks.getSelected();
      const concrete = selected && isConcrete(selected.kind);
      const next = concrete ? materialProperties(selected!) : callbacks.getDefaults();
      render(next);
      scope.textContent = concrete ? `SELECTED / #${selected!.id}` : 'BUILDING DEFAULTS';
      selectedButton.disabled = !concrete;
      note.textContent = concrete ? 'Edit this part, or apply the values to every concrete part in the building.' : 'New concrete parts use these defaults. Select a concrete part for a per-part override.';
    },
  };
}

export function concreteValuesFor(kind: Kind, defaults: ConcreteValues): Partial<Piece> {
  return isConcrete(kind) ? { concreteStrength: defaults.concreteStrength, reinforcement: defaults.reinforcement } : {};
}

