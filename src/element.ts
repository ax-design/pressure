// <ax-pressure>, built on the surface engine. Markup and the --pressure-* properties are
// unchanged; the tilt is the surface tilt, so other surfaces inside (a reveal, a button with a
// shape) map the pointer through it and keep their borders even.
import { AxSurface } from '@ax-design/surface';
import type { Values } from '@ax-design/surface';
import type { TiltParams } from '@ax-design/shape';
import type { PropertySpec } from '@ax-design/typed-om';

const length = (name: string, initial: string): PropertySpec => ({ name, syntax: { type: 'length' }, initial, inherits: true });

// Read through the surface engine. register() registers them with their original definitions.
export const PRESSURE_SCHEMA: PropertySpec[] = [
    { name: '--pressure-invert', syntax: { type: 'keyword', values: ['true', 'false'] }, initial: 'false', inherits: true },
    { name: '--pressure-tilt-factor', syntax: { type: 'number' }, initial: '2', inherits: true },
    length('--pressure-tilt-depth', '1px'),
    { name: '--pressure-tilt-mode', syntax: { type: 'keyword', values: ['absolute', 'relative'] }, initial: 'absolute', inherits: true },
    length('--pressure-perspective', '25px'),
    length('--pressure-zoom', '0.8px'),
];

export class AxPressure extends AxSurface {
    static readonly ElementName = 'ax-pressure';
    static schemaKey = 'ax-pressure';
    static extraSchema = PRESSURE_SCHEMA;

    protected layerNames_(): string[] {
        return [];
    }

    protected tiltPerspective(v: Values): number {
        return v.length('--pressure-perspective');
    }

    // The original formula of pressureManager.setPressedStyle: the element leans away from the
    // pressed point and sinks by --pressure-zoom.
    protected tiltParams(v: Values, width: number, height: number, x: number, y: number): TiltParams | null {
        const invert = v.keyword('--pressure-invert') === 'true';
        const centerX = x - width / 2;
        const centerY = y - height / 2;
        let degX: number;
        let degY: number;
        if (v.keyword('--pressure-tilt-mode') === 'relative') {
            degX = degY = v.number('--pressure-tilt-factor');
        } else {
            const depth = v.length('--pressure-tilt-depth');
            const sinX = depth / (width / 2);
            const sinY = depth / (height / 2);
            degX = (Math.asin(sinX > 0.99 ? 0.99 : sinX) * 180) / Math.PI;
            degY = (Math.asin(sinY > 0.99 ? 0.99 : sinY) * 180) / Math.PI;
        }
        const ax = (centerX / width) * degX * (invert ? -1 : 1);
        const ay = (centerY / height) * degY * (invert ? 1 : -1);
        const z = (centerX * centerX + centerY * centerY) / ((width / 2) ** 2 + (height / 2) ** 2) - 1;
        return {
            width,
            height,
            perspective: this.tiltPerspective(v),
            rotateX: ay,
            rotateY: ax,
            translateZ: z * v.length('--pressure-zoom'),
        };
    }
}
