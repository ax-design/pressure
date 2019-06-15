import { AxPressure } from './CustomElements.js';
export function register() {

    if (window.CSS && CSS.registerProperty) {
        customElements.define(AxPressure.ElementName, AxPressure);
        CSS.registerProperty({
            name: '--pressure-invert',
            syntax: '<custom-ident>',
            initialValue: 'false',
            inherits: true
        });
        CSS.registerProperty({
            name: '--pressure-tilt-factor',
            syntax: '<number>',
            initialValue: '2',
            inherits: true
        });
        CSS.registerProperty({
            name: '--pressure-tilt-depth',
            syntax: '<length>',
            initialValue: '1px',
            inherits: true
        });
        CSS.registerProperty({
            name: '--pressure-tilt-mode',
            syntax: '<custom-ident>',
            initialValue: 'absolute',
            inherits: true
        });
        CSS.registerProperty({
            name: '--pressure-perspective',
            syntax: '<length>',
            initialValue: '25px',
            inherits: true
        });
        CSS.registerProperty({
            name: '--pressure-zoom',
            syntax: '<length>',
            initialValue: '0.8px',
            inherits: true
        });
    } else {
        console.warn('Your browser do NOT support `CSS.registerProperty` method, register failed!');
    }

}