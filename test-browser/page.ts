// Browser checks for <ax-pressure> on the surface engine.
import { register } from '../src/index.js';

interface Check {
    name: string;
    ok: boolean;
    detail: string;
}
declare global {
    interface Window {
        __result?: unknown;
        __step?: string;
        __ack?: string;
    }
}

const checks: Check[] = [];
const check = (name: string, ok: boolean, detail = '') => checks.push({ name, ok, detail });
const frames = (n: number) =>
    new Promise<void>((resolve) => {
        const step = () => (n-- <= 0 ? resolve() : requestAnimationFrame(step));
        requestAnimationFrame(step);
    });
const ask = async (step: string) => {
    window.__ack = '';
    window.__step = step;
    while (window.__ack !== step) await frames(1);
    await new Promise((r) => setTimeout(r, 150));
    await frames(2);
};
const transform = (id: string) => (document.getElementById(id)!.shadowRoot!.querySelector('.tilt') as HTMLElement).style.transform;
const numbers = (t: string) => (t.match(/-?\d+(\.\d+)?(e-?\d+)?/g) || []).map(Number);

// The original pressureManager formula, for a press at (x, y) of a w x h element.
function expected(w: number, h: number, x: number, y: number, o: { mode: string; depth: number; factor: number; invert: boolean; zoom: number }) {
    const cx = x - w / 2;
    const cy = y - h / 2;
    let dx: number;
    let dy: number;
    if (o.mode === 'absolute') {
        const sx = o.depth / (w / 2);
        const sy = o.depth / (h / 2);
        dx = (Math.asin(sx > 0.99 ? 0.99 : sx) * 180) / Math.PI;
        dy = (Math.asin(sy > 0.99 ? 0.99 : sy) * 180) / Math.PI;
    } else {
        dx = dy = o.factor;
    }
    const ax = (cx / w) * dx * (o.invert ? -1 : 1);
    const ay = (cy / h) * dy * (o.invert ? 1 : -1);
    const z = (cx * cx + cy * cy) / ((w / 2) ** 2 + (h / 2) ** 2) - 1;
    return [ay, ax, z * o.zoom];
}

async function pressCase(id: string, o: { mode: string; depth: number; factor: number; invert: boolean; zoom: number }) {
    await ask(`press-${id}`);
    const t = transform(id);
    // perspective(25px) rotateX(a) rotateY(b) translateZ(z)
    const [, rx, ry, tz] = numbers(t);
    const [ex, ey, ez] = expected(200, 100, 190, 10, o);
    const ok = Math.abs(rx - ex) < 1e-3 && Math.abs(ry - ey) < 1e-3 && Math.abs(tz - ez) < 1e-3;
    check(`${id}: tilt matches the original formula`, ok, `${t} vs ${ex.toFixed(4)} ${ey.toFixed(4)} ${ez.toFixed(4)}`);
    await ask('release');
    await frames(6);
    check(`${id}: release returns flat`, transform(id) === '', transform(id));
}

async function run() {
    register();
    register();
    await frames(6);
    await pressCase('abs', { mode: 'absolute', depth: 1, factor: 2, invert: false, zoom: 0.8 });
    await pressCase('rel', { mode: 'relative', depth: 1, factor: 10, invert: false, zoom: 0.8 });
    await pressCase('inv', { mode: 'absolute', depth: 1, factor: 2, invert: true, zoom: 0.8 });

    // A surface inside a pressure: drawn, and tilted with it.
    const inner = document.getElementById('inner')!;
    const path = inner.shadowRoot!.querySelector('.layer-fill path');
    check('nested surface draws its shape', !!path && (path.getAttribute('d') || '').indexOf('A') > 0);
    await ask('press-nest');
    check('nested surface tilts with the pressure', transform('nest').indexOf('rotateX') >= 0 && transform('inner') === '');
    await ask('release');
    return { userAgent: navigator.userAgent, checks };
}

run().then(
    (r) => (window.__result = r),
    (e) => (window.__result = { error: String((e && e.stack) || e) })
);
