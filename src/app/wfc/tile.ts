/**
 * Tile model for the WFC generator.
 *
 * A tile is a TILE_SIZE × TILE_SIZE grid of {@link Cell}s. Its "socket"
 * on a given side is simply the 12-cell edge of that grid, read
 * left-to-right (for N/S) or top-to-bottom (for W/E). Two tiles are
 * adjacency-compatible iff the touching edge tuples are equal cell-by-cell.
 *
 * Cells carry two terrain identities: what they look like (`terrain`) and
 * what they match as for adjacency (`matchAs`). For cells that don't need
 * to differ between the two — the overwhelming majority — the cell is
 * stored as a bare {@link TerrainId} string. Decorative variants whose
 * presence on an edge should not constrain the neighbour (e.g. a
 * `cracked-flagstone` painted into the middle of a road) use the
 * {@link DecoratedCell} object form to declare a different `matchAs`.
 *
 * Tiles come from one of two archetype kinds:
 *   - **Painted**: declared by a road-socket boolean tuple, expanded by
 *     {@link paintArchetype} into a centred road strip on grass.
 *   - **Authored**: declared by an explicit cell grid (typically read
 *     from a hand-drawn spreadsheet). Useful for tiles whose layout
 *     can't be expressed as centred road strips.
 *
 * Both kinds flow through {@link buildPalette}, which derives rotations,
 * sockets, and edge profiles uniformly.
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
 * Adding a new id here requires a matching `.terrain-<id>` CSS rule in
 * `grid.scss` so the renderer knows what colour to fill the cell with.
 *
 * Terrain values are plain strings, so user code can introduce custom ids
 * without touching this file at all if needed.
 */
export const Terrain = {
  Grass: 'grass',
  Road: 'road',
  Flagstone: 'flagstone',
  Kerbstone: 'kerbstone',
  CrackedFlagstone: 'cracked-flagstone',
  CrackedKerbstone: 'cracked-kerbstone',
  Manhole: 'manhole',
  Grating: 'grating',
  /** Cosmetic distress on asphalt; matches as plain road at edges. */
  CrackedRoad: 'cracked-road',
  /** Pavement groove; matches neighbours as flagstone. */
  Recess: 'recess',
} as const;

export type TerrainId = string;

/* ------------------------------------------------------------------ */
/* Per-cell metadata layer                                            */
/* ------------------------------------------------------------------ */

/**
 * One cell of a tile. Most cells are plain {@link TerrainId} strings.
 * Cells whose render appearance differs from their adjacency identity
 * (e.g. a `cracked-flagstone` painted on top of road) carry a separate
 * `matchAs` via {@link DecoratedCell} so edge equality doesn't constrain
 * neighbours to the decorative variant.
 */
export type Cell = TerrainId | DecoratedCell;

export interface DecoratedCell {
  /** Terrain id used for rendering. */
  readonly terrain: TerrainId;
  /**
   * Terrain id used for adjacency / edge equality. When omitted, falls
   * back to {@link terrain}. Use this to place a decorative variant on
   * (or near) an edge without constraining the neighbour to also have
   * the decoration.
   */
  readonly matchAs?: TerrainId;
}

/** Renderable terrain id of a cell (what gets drawn). */
export function cellTerrain(c: Cell): TerrainId {
  return typeof c === 'string' ? c : c.terrain;
}

/** Adjacency terrain id of a cell (what edge equality compares against). */
export function cellMatchAs(c: Cell): TerrainId {
  if (typeof c === 'string') return c;
  return c.matchAs ?? c.terrain;
}

/**
 * Convenience constructor for a decorated cell. Pass `matchAs` when the
 * cell sits on (or could rotate onto) an edge and you want neighbours to
 * see the underlying terrain rather than the decoration.
 */
export function decorate(terrain: TerrainId, matchAs?: TerrainId): DecoratedCell {
  return matchAs === undefined ? { terrain } : { terrain, matchAs };
}

/* ------------------------------------------------------------------ */
/* Tile-level types                                                   */
/* ------------------------------------------------------------------ */

export enum TileType {
  Empty = 'Empty',
  Straight = 'Straight',
  Corner = 'Corner',
  TJunction = 'TJunction',
  Crossroad = 'Crossroad',
  PlateC = 'PlateC',
  PlateCC = 'PlateCC',
  PlateCD = 'PlateCD',
  PlateCDRev = 'PlateCDRev',
  PlateAdda = 'PlateAdda',
  PlateAV2 = 'PlateAV2',
  PlateB = 'PlateB',
  PlateDD2 = 'PlateDD2',
  PlateD2 = 'PlateD2',
  PlateACRev2 = 'PlateACRev2',
  PlateABA = 'PlateABA',
  PlateAA = 'PlateAA',
  PlateAB = 'PlateAB',
  PlateABRev = 'PlateABRev',
  PlateABV2 = 'PlateABV2',
  PlateAC = 'PlateAC',
  PlateBB = 'PlateBB',
  PlateSP = 'PlateSP',
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
  /** Which sides have a road-matching cell at the archetype level. Useful for filtering / debug. */
  readonly sockets: SocketTuple;
  /** TILE_SIZE × TILE_SIZE grid of cells. `cells[row][col]`. */
  readonly cells: readonly (readonly Cell[])[];
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

function makeFilledGrid(value: Cell): Cell[][] {
  const grid: Cell[][] = [];
  for (let r = 0; r < TILE_SIZE; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < TILE_SIZE; c++) row.push(value);
    grid.push(row);
  }
  return grid;
}

function paintRect(
  grid: Cell[][],
  r0: number,
  r1: number,
  c0: number,
  c1: number,
  value: Cell,
): void {
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) grid[r][c] = value;
  }
}

/**
 * Generates the cell grid for a painted archetype given its base socket
 * booleans. The road strip is ROAD_WIDTH cells wide and runs from the
 * centre of the tile out to whichever edges have a road exit. Where two
 * strips overlap (corners, T-junctions, crossroads) the cells are simply
 * painted twice with the same value.
 */
function paintArchetype(sockets: SocketTuple): Cell[][] {
  const cells = makeFilledGrid(Terrain.Grass);
  const stripStart = ROAD_OFFSET; // first road row/col (= 4)
  const stripEnd = ROAD_OFFSET + ROAD_WIDTH - 1; // last road row/col  (= 7)
  const last = TILE_SIZE - 1; // = 11

  if (sockets[Direction.North])
    paintRect(cells, 0, stripEnd, stripStart, stripEnd, Terrain.Road);
  if (sockets[Direction.South])
    paintRect(cells, stripStart, last, stripStart, stripEnd, Terrain.Road);
  if (sockets[Direction.East])
    paintRect(cells, stripStart, stripEnd, stripStart, last, Terrain.Road);
  if (sockets[Direction.West])
    paintRect(cells, stripStart, stripEnd, 0, stripEnd, Terrain.Road);

  return cells;
}

/** Rotates a square grid 90° clockwise. */
function rotate90Cw(grid: readonly (readonly Cell[])[]): Cell[][] {
  const n = grid.length;
  const out: Cell[][] = [];
  for (let r = 0; r < n; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < n; c++) row.push(grid[n - 1 - c][r]);
    out.push(row);
  }
  return out;
}

function rotateCells(grid: readonly (readonly Cell[])[], steps: number): Cell[][] {
  let result: readonly (readonly Cell[])[] = grid;
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
  cells: readonly (readonly Cell[])[],
): Record<Direction, readonly TerrainId[]> {
  const n = cells.length;
  const north = cells[0].map(cellMatchAs);
  const south = cells[n - 1].map(cellMatchAs);
  const west = cells.map(row => cellMatchAs(row[0]));
  const east = cells.map(row => cellMatchAs(row[row.length - 1]));
  return {
    [Direction.North]: north,
    [Direction.East]: east,
    [Direction.South]: south,
    [Direction.West]: west,
  };
}

/**
 * Heuristic: a side has a "socket" iff any cell on that edge matches as
 * road. Used as a label/debug aid for authored archetypes — adjacency
 * itself never consults this.
 */
function deriveSockets(cells: readonly (readonly Cell[])[]): SocketTuple {
  const n = cells.length;
  const hasRoadOnSide = (edge: readonly Cell[]): boolean =>
    edge.some(c => cellMatchAs(c) === Terrain.Road);
  return [
    hasRoadOnSide(cells[0]),
    hasRoadOnSide(cells.map(r => r[r.length - 1])),
    hasRoadOnSide(cells[n - 1]),
    hasRoadOnSide(cells.map(r => r[0])),
  ];
}

/* ------------------------------------------------------------------ */
/* Archetypes & palette construction                                  */
/* ------------------------------------------------------------------ */

export type Archetype = PaintedArchetype | AuthoredArchetype;

export interface PaintedArchetype {
  readonly kind: 'painted';
  readonly type: TileType;
  readonly sockets: SocketTuple;
  readonly weight: number;
}

export interface AuthoredArchetype {
  readonly kind: 'authored';
  readonly type: TileType;
  /** Base-orientation cell grid. Must be TILE_SIZE × TILE_SIZE. */
  readonly cells: readonly (readonly Cell[])[];
  readonly weight: number;
}

const DEFAULT_ARCHETYPES: readonly Archetype[] = [
  {
    kind: 'painted',
    type: TileType.Empty,
    sockets: [false, false, false, false],
    weight: 4.0,
  },
  { kind: 'painted', type: TileType.Straight, sockets: [true, false, true, false], weight: 2.0 },
  { kind: 'painted', type: TileType.Corner, sockets: [true, true, false, false], weight: 1.5 },
  {
    kind: 'painted',
    type: TileType.TJunction,
    sockets: [true, true, true, false],
    weight: 1.0,
  },
  { kind: 'painted', type: TileType.Crossroad, sockets: [true, true, true, true], weight: 0.5 },
];

function archetypeBaseCells(a: Archetype): Cell[][] {
  if (a.kind === 'painted') return paintArchetype(a.sockets);
  if (a.cells.length !== TILE_SIZE) {
    throw new Error(`Authored archetype ${a.type} has ${a.cells.length} rows, expected ${TILE_SIZE}`);
  }
  for (const row of a.cells) {
    if (row.length !== TILE_SIZE) {
      throw new Error(`Authored archetype ${a.type} has a row of length ${row.length}, expected ${TILE_SIZE}`);
    }
  }
  return a.cells.map(row => [...row]);
}

function canonicalKey(cells: readonly (readonly Cell[])[]): string {
  const lines: string[] = [];
  for (const row of cells) {
    lines.push(
      row
        .map(c => (typeof c === 'string' ? c : `${c.terrain}~${c.matchAs ?? c.terrain}`))
        .join(','),
    );
  }
  return lines.join('\n');
}

/**
 * Builds a tile palette from the given archetypes. Each archetype
 * contributes only its visually unique rotations. Painted archetypes
 * derive their cells from socket patterns; authored archetypes use their
 * declared base-orientation grid directly.
 */
export function buildPalette(archetypes: readonly Archetype[]): readonly TileVariant[] {
  const palette: TileVariant[] = [];

  for (const a of archetypes) {
    const baseCells = archetypeBaseCells(a);
    const baseSockets = a.kind === 'painted' ? a.sockets : deriveSockets(baseCells);
    const seen = new Set<string>();

    for (let rot = 0; rot < 4; rot++) {
      const cells = rotateCells(baseCells, rot);
      const key = canonicalKey(cells);
      if (seen.has(key)) continue;
      seen.add(key);

      palette.push({
        id: palette.length,
        type: a.type,
        rotation: rot,
        sockets: rotateSockets(baseSockets, rot),
        cells,
        edges: extractEdges(cells),
        weight: a.weight,
      });
    }
  }

  return palette;
}

/**
 * The original road-tile palette: 1 Empty + 2 Straights + 4 Corners +
 * 4 T-junctions + 1 Crossroad = 12 variants drawn on a grass background.
 */
export function buildDefaultTileSet(): readonly TileVariant[] {
  return buildPalette(DEFAULT_ARCHETYPES);
}

/* ------------------------------------------------------------------ */
/* Edge predicates                                                    */
/* ------------------------------------------------------------------ */

/** True iff every cell on the given edge matches `terrain`. */
export function isEdgeAllOf(tile: TileVariant, d: Direction, terrain: TerrainId): boolean {
  return tile.edges[d].every(t => t === terrain);
}

/** Convenience wrapper: true iff every cell on the given edge is `Terrain.Grass`. */
export function isEdgeAllGrass(tile: TileVariant, d: Direction): boolean {
  return isEdgeAllOf(tile, d, Terrain.Grass);
}
