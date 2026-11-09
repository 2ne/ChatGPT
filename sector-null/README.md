# Sector Null

A top-down sci-fi survival shooter and competition remix of [Abandon All Hope by Josh Werner](https://codepen.io/editor/joshwerner/pen/01a18d27-5cbe-77c4-9685-9f3836db15e6). Keep the reactor deck clear as rogue security units breach the bulkheads. Choose an upgrade after each wave.

## Status

Playable first build. The wave system, enemy pathing, destructible entrances and character animation are adapted from the supplied original. Sector Null has a new Three.js reactor deck, armoured operator, security drones, interface and procedural Web Audio score and effects. The Core Zero art direction informed the smoked glass, machined hardware and cyan and amber lighting. Graphics and sound are generated locally, and best runs and settings are saved in the browser.

## Run locally

Use Node.js 22 or later.

```sh
npm ci
npm run dev
```

`npm run build` writes a static site to `dist/`. Use `npm run preview` to serve that build locally. The browser needs WebGL. Sound starts after interacting with the title screen.

| Action | Keyboard and mouse | Touch |
| --- | --- | --- |
| Move | WASD or arrow keys | Drag on the left side |
| Aim and fire | Mouse and left click | Drag and hold on the right side |
| Reload | R | Reload button |
| Pause | Esc or P | Pause button |
| Choose an upgrade | 1–3 or click | Tap a card |
| Mute | M or volume settings | Volume settings |
