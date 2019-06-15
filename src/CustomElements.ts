import { setPressedStyle } from './pressureManager';

export class AxPressure extends HTMLElement {
    static readonly ElementName = 'ax-pressure';
    private container: HTMLDivElement;
    private root = this.attachShadow({ mode: 'open' });
    adoptedCallback() {
        this.connectedCallback();
    }
    connectedCallback() {
        this.addEventListener('pointerdown', (event) => setPressedStyle(this.container, this, event));
    }
    constructor() {
        super();
        this.root.innerHTML = `
    <div>
      <slot></slot>
      </div>
    <style>
      div { display: block; width: 100%; height: 100%; transition: transform .05s;}
      :host { display: inline-block; position: relative; }
      :host([block]) { display: block; }
      :host([inline-block]) { display: inline-block; }
      :host([flex]) { display: flex; }
      :host([inline-flex]) { display: inline-flex; }
      :host([grid]) { display: grid; }
      :host([inline-grid]) { display: inline-grid; }
      </style>`;

      this.container = this.root.querySelector('div')!;
    }
}
