import {
  ALL_DIRECTIONS,
  Direction,
  Terrain,
  TerrainId,
  TileType,
  TileVariant,
  delta,
  getEdge,
  isEdgeAllOf,
  opposite,
} from './tile';

export interface WfcOptions {
  readonly rows: number;
  readonly cols: number;
  /** Optional integer seed for reproducible output. */
  readonly seed?: number;
  /**
   * When true, the outer edges of the grid must consist entirely of
   * {@link sealedEdgeTerrain} cells. Defaults to `Terrain.Grass` so the
   * built-in road palette keeps its prior behaviour.
   */
  readonly sealedBoundary?: boolean;
  /**
   * Terrain id required on every outer edge cell when
   * {@link sealedBoundary} is enabled. Defaults to `Terrain.Grass`.
   * Libraries whose tiles use a different background (e.g. flagstone
   * plates) should pass their own background id.
   */
  readonly sealedEdgeTerrain?: TerrainId;
  /** How many full restarts to allow on contradiction. Default 200. */
  readonly maxAttempts?: number;
  /**
   * Optional placement budget per archetype ({@link TileType}). Omit a type ⇒
   * unlimited placements (shared across all rotations of that type). A value
   * of `0` allows no placements of that type. Entries are starting counts
   * consumed as cells collapse; exhaustion removes that type’s palette indices
   * from unconstrained cells alongside propagation.
   */
  readonly inventoryCaps?: ReadonlyMap<TileType, number>;
}

export interface WfcResult {
  readonly success: boolean;
  readonly attempts: number;
  /** rows × cols. Each cell is either a collapsed variant or null on failure. */
  readonly grid: readonly (TileVariant | null)[][];
}

/** Mulberry32 — small, fast, deterministic PRNG seeded by a 32-bit integer. */
function makeRng(seed: number | undefined): () => number {
  if (seed === undefined) {
    return Math.random;
  }
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function edgesEqual(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Builds the adjacency table.
 *
 * `compat[variantId][direction]` = the set of variant ids that may legally
 * sit in the neighbour cell located in `direction` from this variant. Two
 * variants are compatible iff their touching edge profiles match cell-by-cell.
 */
function buildCompatibility(palette: readonly TileVariant[]): ReadonlySet<number>[][] {
  const compat: Set<number>[][] = [];
  for (let i = 0; i < palette.length; i++) {
    compat.push([new Set(), new Set(), new Set(), new Set()]);
    for (const dir of ALL_DIRECTIONS) {
      const myEdge = getEdge(palette[i], dir);
      const opp = opposite(dir);
      for (let j = 0; j < palette.length; j++) {
        if (edgesEqual(myEdge, getEdge(palette[j], opp))) {
          compat[i][dir].add(j);
        }
      }
    }
  }
  return compat;
}

/**
 * Wave Function Collapse over a 2D grid of road tiles.
 *
 * Per attempt:
 *   1. Reset every cell to the full possibility set.
 *   2. Optionally trim variants whose edges contain non-grass cells on a
 *      sealed boundary.
 *   3. Loop: pick the lowest-entropy cell, weighted-random collapse it,
 *      then BFS-propagate the consequences to neighbours.
 *   4. On contradiction (empty cell), restart the whole attempt.
 */
export function generate(
  palette: readonly TileVariant[],
  options: WfcOptions,
): WfcResult {
  const { rows, cols } = options;
  if (rows <= 0 || cols <= 0) {
    throw new Error('rows and cols must be positive');
  }
  if (palette.length === 0) {
    throw new Error('palette must not be empty');
  }

  const sealedBoundary = options.sealedBoundary ?? false;
  const sealedEdgeTerrain = options.sealedEdgeTerrain ?? Terrain.Grass;
  const maxAttempts = options.maxAttempts ?? 200;
  const rng = makeRng(options.seed);
  const compat = buildCompatibility(palette);
  const capMap = options.inventoryCaps;

  if (inventoryInsufficientForGrid(palette, capMap, rows, cols)) {
    return {
      success: false,
      attempts: 0,
      grid: emptySnapshot(rows, cols),
    };
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const cells: Set<number>[][] = makeFreshGrid(rows, cols, palette.length);

    if (sealedBoundary) {
      applyBoundaryConstraints(cells, palette, rows, cols, sealedEdgeTerrain);
    }

    const remaining = cloneInventoryRemaining(capMap);

    if (collapseAll(cells, palette, compat, rows, cols, rng, remaining)) {
      return {
        success: true,
        attempts: attempt,
        grid: snapshot(cells, palette),
      };
    }
  }

  return {
    success: false,
    attempts: maxAttempts,
    grid: emptySnapshot(rows, cols),
  };
}

/**
 * Mutable per-attempt counters (only capped types). `null` means “no caps”.
 */
function cloneInventoryRemaining(caps?: ReadonlyMap<TileType, number>): Map<TileType, number> | null {
  if (!caps || caps.size === 0) return null;
  return new Map([...caps]);
}

/**
 * If every archetype appearing in {@link palette} has a finite cap, require
 * the sum of those caps ≥ grid cells — otherwise synthesis is impossible.
 */
function inventoryInsufficientForGrid(
  palette: readonly TileVariant[],
  caps: ReadonlyMap<TileType, number> | undefined,
  rows: number,
  cols: number,
): boolean {
  if (!caps || caps.size === 0) return false;
  const typesInPalette = new Set(palette.map(v => v.type));
  const allFinite = [...typesInPalette].every(t => caps.has(t));
  if (!allFinite) return false;
  let sum = 0;
  for (const t of typesInPalette) {
    sum += caps.get(t) ?? 0;
  }
  return sum < rows * cols;
}

function makeFreshGrid(rows: number, cols: number, paletteSize: number): Set<number>[][] {
  const grid: Set<number>[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: Set<number>[] = [];
    for (let c = 0; c < cols; c++) {
      const set = new Set<number>();
      for (let i = 0; i < paletteSize; i++) {
        set.add(i);
      }
      row.push(set);
    }
    grid.push(row);
  }
  return grid;
}

function applyBoundaryConstraints(
  cells: Set<number>[][],
  palette: readonly TileVariant[],
  rows: number,
  cols: number,
  sealedEdgeTerrain: TerrainId,
): void {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = cells[r][c];
      for (const id of [...cell]) {
        const v = palette[id];
        if (
          (r === 0 && !isEdgeAllOf(v, Direction.North, sealedEdgeTerrain)) ||
          (r === rows - 1 && !isEdgeAllOf(v, Direction.South, sealedEdgeTerrain)) ||
          (c === 0 && !isEdgeAllOf(v, Direction.West, sealedEdgeTerrain)) ||
          (c === cols - 1 && !isEdgeAllOf(v, Direction.East, sealedEdgeTerrain))
        ) {
          cell.delete(id);
        }
      }
    }
  }
}

function collapseAll(
  cells: Set<number>[][],
  palette: readonly TileVariant[],
  compat: ReadonlySet<number>[][],
  rows: number,
  cols: number,
  rng: () => number,
  remaining: Map<TileType, number> | null,
): boolean {
  while (true) {
    const target = findMinEntropyCell(cells, rows, cols, rng);
    if (!target) {
      return true; // every cell is collapsed
    }

    if (!collapseCell(cells, palette, target.r, target.c, rng, remaining)) return false;
    const stripResult = stripExhaustedInventory(cells, palette, rows, cols, remaining);
    if (!stripResult.ok) return false;
    const seeds = [...stripResult.changed, { r: target.r, c: target.c }];
    if (!propagateMulti(cells, compat, rows, cols, seeds)) {
      return false; // contradiction
    }
  }
}

function findMinEntropyCell(
  cells: Set<number>[][],
  rows: number,
  cols: number,
  rng: () => number,
): { r: number; c: number } | null {
  let best = Number.MAX_SAFE_INTEGER;
  const candidates: { r: number; c: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const n = cells[r][c].size;
      if (n <= 1) continue;
      if (n < best) {
        best = n;
        candidates.length = 0;
        candidates.push({ r, c });
      } else if (n === best) {
        candidates.push({ r, c });
      }
    }
  }
  if (candidates.length === 0) return null;
  return candidates[Math.floor(rng() * candidates.length)];
}

function collapseCell(
  cells: Set<number>[][],
  palette: readonly TileVariant[],
  r: number,
  c: number,
  rng: () => number,
  remaining: Map<TileType, number> | null,
): boolean {
  const cell = cells[r][c];
  const ids = [...cell].filter(id => archetypeSlotsLeft(palette[id].type, remaining));

  if (ids.length === 0) return false;

  let total = 0;
  for (const id of ids) total += palette[id].weight;

  let pick = rng() * total;
  let chosen = ids[ids.length - 1];
  for (const id of ids) {
    pick -= palette[id].weight;
    if (pick <= 0) {
      chosen = id;
      break;
    }
  }

  cell.clear();
  cell.add(chosen);
  consumeInventoryForTile(palette[chosen].type, remaining);
  return true;
}

function archetypeSlotsLeft(type: TileType, remaining: Map<TileType, number> | null): boolean {
  if (!remaining) return true;
  const n = remaining.get(type);
  if (n === undefined) return true;
  return n > 0;
}

function consumeInventoryForTile(type: TileType, remaining: Map<TileType, number> | null): void {
  if (!remaining || !remaining.has(type)) return;
  remaining.set(type, remaining.get(type)! - 1);
}

/** Drops exhausted capped types from every unconstrained cell. */
function stripExhaustedInventory(
  cells: Set<number>[][],
  palette: readonly TileVariant[],
  rows: number,
  cols: number,
  remaining: Map<TileType, number> | null,
): { readonly ok: true; readonly changed: { r: number; c: number }[] } | { readonly ok: false } {
  if (!remaining) return { ok: true, changed: [] };
  const changed: { r: number; c: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = cells[r][c];
      if (cell.size <= 1) continue;
      const before = cell.size;
      for (const id of [...cell]) {
        const t = palette[id].type;
        const n = remaining.get(t);
        if (n !== undefined && n <= 0) cell.delete(id);
      }
      if (cell.size === 0) return { ok: false };
      if (cell.size < before) changed.push({ r, c });
    }
  }
  return { ok: true, changed };
}

function propagateMulti(
  cells: Set<number>[][],
  compat: ReadonlySet<number>[][],
  rows: number,
  cols: number,
  seeds: readonly { r: number; c: number }[],
): boolean {
  const queue: { r: number; c: number }[] = [...seeds];

  while (queue.length > 0) {
    const { r, c } = queue.shift()!;
    const cellPoss = cells[r][c];

    for (const dir of ALL_DIRECTIONS) {
      const { dRow, dCol } = delta(dir);
      const nr = r + dRow;
      const nc = c + dCol;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

      // The neighbour can only contain variants that are reachable from
      // at least one of this cell's remaining possibilities.
      const allowed = new Set<number>();
      for (const id of cellPoss) {
        const reachable = compat[id][dir];
        for (const j of reachable) allowed.add(j);
      }

      const neighbour = cells[nr][nc];
      const before = neighbour.size;
      for (const id of [...neighbour]) {
        if (!allowed.has(id)) neighbour.delete(id);
      }

      if (neighbour.size === 0) return false;
      if (neighbour.size !== before) queue.push({ r: nr, c: nc });
    }
  }
  return true;
}

function snapshot(
  cells: Set<number>[][],
  palette: readonly TileVariant[],
): (TileVariant | null)[][] {
  return cells.map(row =>
    row.map(cell => {
      if (cell.size !== 1) return null;
      const [id] = cell;
      return palette[id];
    }),
  );
}

function emptySnapshot(rows: number, cols: number): (TileVariant | null)[][] {
  const out: (TileVariant | null)[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: (TileVariant | null)[] = [];
    for (let c = 0; c < cols; c++) row.push(null);
    out.push(row);
  }
  return out;
}
