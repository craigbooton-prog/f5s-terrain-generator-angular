# f5s-terrain-generator-angular

An Angular 21 web app that procedurally generates a city-block layout on a
configurable grid using **Wave Function Collapse**. It is a port of the
[f5s-terrain-generator](https://github.com/craigbooton-prog/f5s-terrain-generator)
.NET console app, reusing the same tile palette, adjacency rules, and
algorithm shape.

## What you see

- A live SVG grid that re-renders whenever you change a control.
- Each tile is itself a **12×12 sub-grid of `Terrain` cells**. The five
  archetypes — Empty, Straight, Corner, T-junction, Crossroad — are
  auto-painted into this 12×12 form by laying down a centred 4-cell-wide
  road strip toward whichever sides have a road exit. Each archetype
  contributes its unique rotations, giving a 12-tile palette.
- A tile's "side" is the 12-cell edge of its grid. Two tiles are
  adjacency-compatible iff the 12 edge cells match cell-by-cell with the
  neighbouring tile's matching edge — this is what makes roads line up
  across cell boundaries automatically.

### Terrain palette

The `Terrain` registry in `src/app/wfc/tile.ts` ships with:

| Id                  | Used by default archetypes? | Intended look                     |
|---------------------|-----------------------------|-----------------------------------|
| `grass`             | yes                         | green background                  |
| `road`              | yes                         | dark asphalt                      |
| `flagstone`         | reserved                    | warm light-grey paving slab       |
| `kerbstone`         | reserved                    | cool pale concrete kerb           |
| `cracked-flagstone` | reserved                    | weathered, darker flagstone       |
| `manhole`           | reserved                    | cast-iron lid, cooler than road   |

The reserved ids exist as ready-to-use values for hand-authored archetypes
we haven't built yet. The current WFC palette only emits `grass` and
`road`, and there's a Vitest assertion that locks that behaviour in.

## Controls

| Control            | Effect                                                    |
|--------------------|-----------------------------------------------------------|
| Rows / Columns     | Grid dimensions                                            |
| Tile size          | Pixel size of each whole tile in the rendered SVG          |
| Sealed boundary    | When on, the outer edges of the grid are forced all-grass  |
| Grid lines         | Draw lines at every tile (row/column) boundary             |
| Cell lines (12×12) | Draw lines at every inner cell boundary inside each tile   |
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

- `tile.ts` — `Terrain` palette, `TILE_SIZE`/`ROAD_WIDTH` constants,
  archetype painter, rotation, edge extraction, default tile-set builder.
- `wfc.ts` — `generate(palette, options)` returns a `WfcResult`. Adjacency
  is plain cell-by-cell equality of the touching 12-cell edges.
- `wfc.spec.ts` — Vitest suite covering palette shape, tile dimensions,
  determinism, edge-by-edge adjacency, and sealed-boundary behaviour.

### Adding a new terrain

1. Add an entry to `Terrain` in `src/app/wfc/tile.ts` (e.g.
   `Sidewalk: 'sidewalk'`). Use kebab-case for the id so it lands cleanly
   in CSS class names.
2. Add a matching `.terrain-sidewalk { fill: ... }` rule in
   `src/app/grid/grid.scss`.
3. Use the new value when authoring tile cells. The WFC algorithm doesn't
   need any changes — adjacency is just string equality on edge cells.

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
