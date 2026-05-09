/**
 * Tile model for the WFC generator.
 *
 * A tile is a TILE_SIZE × TILE_SIZE grid of {@link Terrain} cells. Its
 * "socket" on a given side is simply the 12-cell edge of that grid, read
 * left-to-right (for N/S) or top-to-bottom (for W/E). Two tiles are
 * adjacency-compatible iff the touching edge tuples are equal cell-by-cell.
 *
 * Built-in terrains are `Grass` and `Road`. New terrains can be added by
 * appending to the {@link Terrain} const map and a CSS rule for
 * `.terrain-<id>` in `grid/grid.scss`. Nothing in the algorithm cares how
 * many terrain values exist — adjacency is just string equality.
 */

/** Inner resolution of a single tile, in cells per side. */
export const TILE_SIZE = 12;

/**
 * Width of a road strip when an archetype is painted into a 12×12 tile.
 * Roughly 33 % of the tile, centred — large enough to span the middle and
 * leave a ~4-cell grass margin on each side.
 */
export const ROAD_WIDTH = 4;

/** First road column/row when painting a centred strip. Floor((TILE_SIZE - ROAD_WIDTH) / 2). */
export const ROAD_OFFSET = Math.floor((TILE_SIZE - ROAD_WIDTH) / 2);

/**
 * Built-in terrain ids.
 *
 * Only `Grass` and `Road` are referenced by the default tile archetypes, so
 * those are the only values the WFC generator currently produces. The other
 * ids exist as a reserved palette that hand-authored archetypes can pull
 * from when we add them later. Adding a new id here also requires a matching
 * `.terrain-<id>` CSS rule in `grid.scss` so the renderer knows what colour
 * to fill the cell with.
 *
 * Terrain values are plain strings, so user code can introduce custom ids
 * without touching this file at all if needed.
 */
export const Terrain = {
  Grass: 'grass',
  Road: 'road',
  // Reserved for future archetypes — not yet emitted by the default palette.
  Flagstone: 'flagstone',
  Kerbstone: 'kerbstone',
  CrackedFlagstone: 'cracked-flagstone',
  Manhole: 'manhole',
} as const;

export type TerrainId = string;

export enum TileType {
  Empty = 'Empty',
  Straight = 'Straight',
  Corner = 'Corner',
  TJunction = 'TJunction',
  Crossroad = 'Crossroad',
}

export enum Direction {
  North = 0,
  East = 1,
  South = 2,
  West = 3,
}

export const ALL_DIRECTIONS: readonly Direction[] = [
  Direction.North,
  Direction.East,
  Direction.South,
  Direction.West,
];

export type SocketTuple = readonly [boolean, boolean, boolean, boolean];

export function opposite(d: Direction): Direction {
  return ((d + 2) % 4) as Direction;
}

export function delta(d: Direction): { dRow: number; dCol: number } {
  switch (d) {
    case Direction.North:
      return { dRow: -1, dCol: 0 };
    case Direction.East:
      return { dRow: 0, dCol: 1 };
    case Direction.South:
      return { dRow: 1, dCol: 0 };
    case Direction.West:
      return { dRow: 0, dCol: -1 };
  }
}

/** A tile and one of its rotations, fully expanded into TILE_SIZE × TILE_SIZE cells. */
export interface TileVariant {
  readonly id: number;
  readonly type: TileType;
  /** 0..3 quarter-turns clockwise from the archetype's base orientation. */
  readonly rotation: number;
  /** Which sides have a road exit at the archetype level. Useful for filtering / debugging. */
  readonly sockets: SocketTuple;
  /** TILE_SIZE × TILE_SIZE grid of terrain ids. `cells[row][col]`. */
  readonly cells: readonly (readonly TerrainId[])[];
  /** Edge profiles cached for fast adjacency checks. Each array has TILE_SIZE entries. */
  readonly edges: Readonly<Record<Direction, readonly TerrainId[]>>;
  readonly weight: number;
}

export function hasRoad(v: TileVariant, d: Direction): boolean {
  return v.sockets[d];
}

/** Returns the TILE_SIZE-long edge profile of `tile` on side `d`. */
export function getEdge(tile: TileVariant, d: Direction): readonly TerrainId[] {
  return tile.edges[d];
}

/* ------------------------------------------------------------------ */
/* Cell helpers                                                       */
/* ------------------------------------------------------------------ */

function makeFilledGrid(value: TerrainId): TerrainId[][] {
  const grid: TerrainId[][] = [];
  for (let r = 0; r < TILE_SIZE; r++) {
    const row: TerrainId[] = [];
    for (let c = 0; c < TILE_SIZE; c++) row.push(value);
    grid.push(row);
  }
  return grid;
}

function paintRect(
  grid: TerrainId[][],
  r0: number,
  r1: number,
  c0: number,
  c1: number,
  value: TerrainId,
): void {
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) grid[r][c] = value;
  }
}

/**
 * Generates the cell grid for an archetype given its base socket booleans.
 * The road strip is ROAD_WIDTH cells wide and runs from the centre of the
 * tile out to whichever edges have a road exit. Where two strips overlap
 * (corners, T-junctions, crossroads) the cells are simply painted twice with
 * the same value — no special junction handling required.
 */
function paintArchetype(sockets: SocketTuple): TerrainId[][] {
  const cells = makeFilledGrid(Terrain.Grass);
  const stripStart = ROAD_OFFSET;                   // first road row/col (= 4)
  const stripEnd = ROAD_OFFSET + ROAD_WIDTH - 1;    // last road row/col  (= 7)
  const last = TILE_SIZE - 1;                       // = 11

  // Each direction paints a road rectangle from its edge through to the central
  // ROAD_WIDTH × ROAD_WIDTH square. Overlapping strips at the centre simply
  // paint the same `Road` value twice — no special junction logic needed.
  if (sockets[Direction.North]) paintRect(cells, 0,          stripEnd,  stripStart, stripEnd,  Terrain.Road);
  if (sockets[Direction.South]) paintRect(cells, stripStart, last,      stripStart, stripEnd,  Terrain.Road);
  if (sockets[Direction.East])  paintRect(cells, stripStart, stripEnd,  stripStart, last,      Terrain.Road);
  if (sockets[Direction.West])  paintRect(cells, stripStart, stripEnd,  0,          stripEnd,  Terrain.Road);

  return cells;
}

/** Rotates a square grid 90° clockwise. */
function rotate90Cw(grid: readonly (readonly TerrainId[])[]): TerrainId[][] {
  const n = grid.length;
  const out: TerrainId[][] = [];
  for (let r = 0; r < n; r++) {
    const row: TerrainId[] = [];
    for (let c = 0; c < n; c++) row.push(grid[n - 1 - c][r]);
    out.push(row);
  }
  return out;
}

function rotateCells(grid: readonly (readonly TerrainId[])[], steps: number): TerrainId[][] {
  let result: readonly (readonly TerrainId[])[] = grid;
  for (let s = 0; s < ((steps % 4) + 4) % 4; s++) {
    result = rotate90Cw(result);
  }
  return result.map(row => [...row]);
}

function rotateSockets(sockets: SocketTuple, steps: number): SocketTuple {
  const out: [boolean, boolean, boolean, boolean] = [false, false, false, false];
  for (let i = 0; i < 4; i++) {
    const src = ((i - steps) % 4 + 4) % 4;
    out[i] = sockets[src];
  }
  return out;
}

function extractEdges(
  cells: readonly (readonly TerrainId[])[],
): Record<Direction, readonly TerrainId[]> {
  const n = cells.length;
  const north = cells[0].slice();
  const south = cells[n - 1].slice();
  const west = cells.map(row => row[0]);
  const east = cells.map(row => row[row.length - 1]);
  return {
    [Direction.North]: north,
    [Direction.East]: east,
    [Direction.South]: south,
    [Direction.West]: west,
  };
}

/* ------------------------------------------------------------------ */
/* Default palette                                                    */
/* ------------------------------------------------------------------ */

interface Archetype {
  readonly type: TileType;
  readonly sockets: SocketTuple;
  readonly weight: number;
}

const ARCHETYPES: readonly Archetype[] = [
  { type: TileType.Empty,     sockets: [false, false, false, false], weight: 4.0 },
  { type: TileType.Straight,  sockets: [true,  false, true,  false], weight: 2.0 },
  { type: TileType.Corner,    sockets: [true,  true,  false, false], weight: 1.5 },
  { type: TileType.TJunction, sockets: [true,  true,  true,  false], weight: 1.0 },
  { type: TileType.Crossroad, sockets: [true,  true,  true,  true],  weight: 0.5 },
];

/**
 * Builds the canonical tile palette. Each archetype contributes only its
 * unique rotations (Empty has 1, Straight has 2, Corner / T-junction have 4
 * each, Crossroad has 1). Cells for each rotation are produced by painting
 * the base archetype and rotating the resulting grid — equivalent to
 * rotating the sockets and re-painting, but generalises to hand-authored
 * cell patterns later.
 */
export function buildDefaultTileSet(): readonly TileVariant[] {
  const palette: TileVariant[] = [];

  for (const a of ARCHETYPES) {
    const baseCells = paintArchetype(a.sockets);
    const seen = new Set<string>();

    for (let rot = 0; rot < 4; rot++) {
      const rotatedSockets = rotateSockets(a.sockets, rot);
      const key = rotatedSockets.map(b => (b ? '1' : '0')).join('');
      if (seen.has(key)) continue;
      seen.add(key);

      const cells = rotateCells(baseCells, rot);
      palette.push({
        id: palette.length,
        type: a.type,
        rotation: rot,
        sockets: rotatedSockets,
        cells,
        edges: extractEdges(cells),
        weight: a.weight,
      });
    }
  }

  return palette;
}

/** True iff every cell on the given edge is `Terrain.Grass` (used for sealed boundaries). */
export function isEdgeAllGrass(tile: TileVariant, d: Direction): boolean {
  return tile.edges[d].every(t => t === Terrain.Grass);
}
