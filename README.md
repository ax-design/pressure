<h1 align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ax-design/pressure/master/docs/logo-r.png">
    <img src="https://raw.githubusercontent.com/ax-design/pressure/master/docs/logo.png" alt="Ax Pressure">
  </picture>
</h1>

<p align="center">
  Web component that implements Tilt Effect of Axiom Design System.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@ax-design/pressure"><img src="https://img.shields.io/npm/v/@ax-design/pressure.svg" alt="npm version"></a>
  <a href="https://github.com/ax-design/pressure/actions/workflows/ci.yml"><img src="https://github.com/ax-design/pressure/actions/workflows/ci.yml/badge.svg" alt="CI Status"></a>
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT Licence" />

</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/ax-design/pressure/master/docs/screen-record.gif" alt="Screenshot">
</p>

## Installation

```bash
// with npm
npm install @ax-design/pressure

// with yarn
yarn add @ax-design/pressure
```

and import it:

```javascript
//CommonJS
require('@ax-design/pressure').register();

//ESModule
import { register } from '@ax-design/pressure';
register();
```

## Usage

To add a tilt effect on your web application, you need to wrap a `ax-pressure` component with the component you want to add tilt effect.
Here's an example:

```html
<ax-pressure>
  <div class="tile">
    <img class="tile-icon" src="./images/apple.svg" alt="Icon of Apple" />
    <p class="tile-title">Apple</p>
  </div>
</ax-pressure>
```

## Style Controlling

Pressure component uses custom properties to manage the style of the tile effect.

### --pressure-tilt-depth

**Type:** `<length>`

**Default:** `1px`

**Description:** The depth at which one side sinks down when the mouse presses the edge of the element.

### --pressure-zoom

**Type:** `<length>`

**Default:** `0.8px`

**Description:** The extent to which the entire element falls down when the mouse is pressed down the center of the element.

### --pressure-perspective

**Type:** `<length>`

**Default:** `25px`

**Description:** To give the element some perspective, check out [this tutorial](https://www.w3schools.com/cssref/css3_pr_perspective.asp).

### --pressure-tilt-mode

**Type:** `absolute | relative`

**Default:** `absolute`

**Description:** `absolute` sinks the pressed side by `--pressure-tilt-depth`, `relative` tilts the element by `--pressure-tilt-factor` degrees.

### --pressure-tilt-factor

**Type:** `<number>`

**Default:** `2`

**Description:** The angle in degrees for `relative` mode.

### --pressure-invert

**Type:** `true | false`

**Default:** `false`

**Description:** `true` lifts the pressed side instead of sinking it.

## With Surface

Pressure runs on [Surface](https://github.com/ax-design/surface), it's the tilt of `ax-surface`. Other surfaces inside `ax-pressure`, like `ax-reveal`, follow your pointer correctly while the element is tilted. If you already use `ax-surface`, you can tilt it directly with `--ax-tilt-mode: absolute`.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## Development

```bash
bun install
bun run build         # es/, build/index.mjs, build/main.js
bun run check         # type check
bun run test:browser  # browser tests
```