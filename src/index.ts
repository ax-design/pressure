// @ax-design/pressure: the tilt effect of Axiom Design System, on the @ax-design/surface engine.
import { register as registerSurface } from '@ax-design/surface';
import { AxPressure } from './element.js';

export { AxPressure, PRESSURE_SCHEMA } from './element.js';

// The original definitions. They are a permanent contract: older copies of this package may
// have registered them first, and the first registration wins.
const PROPERTIES = [
    { name: '--pressure-invert', syntax: '<custom-ident>', initialValue: 'false', inherits: true },
    { name: '--pressure-tilt-factor', syntax: '<number>', initialValue: '2', inherits: true },
    { name: '--pressure-tilt-depth', syntax: '<length>', initialValue: '1px', inherits: true },
    { name: '--pressure-tilt-mode', syntax: '<custom-ident>', initialValue: 'absolute', inherits: true },
    { name: '--pressure-perspective', syntax: '<length>', initialValue: '25px', inherits: true },
    { name: '--pressure-zoom', syntax: '<length>', initialValue: '0.8px', inherits: true },
];

let registered = false;

export function register(): void {
    if (registered) return;
    registered = true;
    const css = typeof CSS !== 'undefined' ? (CSS as unknown as { registerProperty?: (d: unknown) => void }) : null;
    if (css && css.registerProperty) {
        for (const definition of PROPERTIES) {
            try {
                css.registerProperty(definition);
            } catch (error) {
                if (!error || (error as Error).name !== 'InvalidModificationError') throw error;
            }
        }
    }
    registerSurface();
    if (!customElements.get(AxPressure.ElementName)) customElements.define(AxPressure.ElementName, AxPressure);
}
