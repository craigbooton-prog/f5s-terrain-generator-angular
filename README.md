# f5s-terrain-generator-angular

An Angular 21 web app that procedurally generates a city-block layout on a
configurable grid using **Wave Function Collapse**. It is a port of the
[f5s-terrain-generator](https://github.com/craigbooton-prog/f5s-terrain-generator)
.NET console app, reusing the same tile palette, adjacency rules, and
algorithm shape.

## What you see

- A live SVG grid that re-renders whenever you change a control.
- Tiles drawn as grass-coloured cells with grey road strips emerging from
  whichever cardinal sides have a road exit. Adjacent tiles automatically
  line up because that's exactly what the WFC adjacency rule enforces.
- Five tile archetypes — Empty, Straight, Corner, T-junction, Crossroad —
  expanded into all of their unique rotations, giving a 12-tile palette.

## Controls

| Control            | Effect                                                    |
|--------------------|-----------------------------------------------------------|
| Rows / Columns     | Grid dimensions                                            |
| Cell size          | Pixel size of each tile in the rendered SVG                |
| Sealed boundary    | When on, no road may exit the outer edge of the grid       |
| Use seed + Seed    | Lock RNG to a deterministic seed for reproducible layouts  |
| Generate           | Re-run WFC with the current settings                       |
| Random seed        | Pick a fresh seed and regenerate                           |

## Algorithm

Standard Wave Function Collapse with weighted random selection:

1. Every cell starts with the full 12-variant possibility set.
2. (Optional) Trim variants whose roads would exit a sealed boundary.
3. Repeatedly: pick the cell with lowest entropy, weighted-random-collapse
   it, then BFS-propagate the consequences. A neighbour can only contain
   variants whose touching socket matches one of the source cell's
   remaining options.
4. On contradiction (zero-possibility cell) → restart from scratch. The
   default budget is 200 attempts.

The implementation lives in [`src/app/wfc/`](src/app/wfc):

- `tile.ts` — types, palette, rotation logic.
- `wfc.ts` — `generate(palette, options)` returns a `WfcResult`.
- `wfc.spec.ts` — Vitest suite covering palette shape, determinism,
  edge-socket consistency, and sealed-boundary behaviour.

## Project layout

```
src/
├── app/
│   ├── grid/        Standalone <wfc-grid> component (SVG renderer)
│   ├── wfc/         Pure-TypeScript WFC implementation + tests
│   ├── app.ts       Root component (signals + form bindings)
│   ├── app.html
│   ├── app.scss
│   └── app.config.ts
├── styles.scss
├── main.ts
└── index.html
```

## Build & run

Requires Node 20+ (this repo was built on Node 22) and npm 10+.

```powershell
npm install
npm start                  # ng serve, http://localhost:4200
npm run build              # production build into dist/
npm test                   # Vitest unit tests (jsdom)
```

## Stack

- **Angular 21** with standalone components and signals (`input.required`,
  `computed`, `signal`).
- **Vitest 4** for unit tests (replaces Karma + Jasmine).
- **SCSS** for styling.
- No additional runtime dependencies — the WFC implementation is plain
  TypeScript, no external libraries.
