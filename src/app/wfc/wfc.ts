import {
  ALL_DIRECTIONS,
  Direction,
  TileVariant,
  delta,
  hasRoad,
  opposite,
} from './tile';

export interface WfcOptions {
  readonly rows: number;
  readonly cols: number;
  /** Optional integer seed for reproducible output. */
  readonly seed?: number;
  /** When true, no road may exit the outer edges of the grid. */
  readonly sealedBoundary?: boolean;
  /** How many full restarts to allow on contradiction. Default 200. */
  readonly maxAttempts?: number;
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

/**
 * Builds the adjacency table.
 *
 * `compat[variantId][direction]` = the set of variant ids that may legally
 * sit in the neighbour cell located in `direction` from this variant.
 */
function buildCompatibility(palette: readonly TileVariant[]): ReadonlySet<number>[][] {
  const compat: Set<number>[][] = [];
  for (let i = 0; i < palette.length; i++) {
    compat.push([new Set(), new Set(), new Set(), new Set()]);
    for (const dir of ALL_DIRECTIONS) {
      const opp = opposite(dir);
      const needsRoad = hasRoad(palette[i], dir);
      for (let j = 0; j < palette.length; j++) {
        if (hasRoad(palette[j], opp) === needsRoad) {
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
 *   2. Optionally trim variants whose road exits would leave a sealed boundary.
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
  const maxAttempts = options.maxAttempts ?? 200;
  const rng = makeRng(options.seed);
  const compat = buildCompatibility(palette);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const cells: Set<number>[][] = makeFreshGrid(rows, cols, palette.length);

    if (sealedBoundary) {
      applyBoundaryConstraints(cells, palette, rows, cols);
    }

    if (collapseAll(cells, palette, compat, rows, cols, rng)) {
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
): void {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = cells[r][c];
      for (const id of [...cell]) {
        const v = palette[id];
        if (
          (r === 0 && hasRoad(v, Direction.North)) ||
          (r === rows - 1 && hasRoad(v, Direction.South)) ||
          (c === 0 && hasRoad(v, Direction.West)) ||
          (c === cols - 1 && hasRoad(v, Direction.East))
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
): boolean {
  while (true) {
    const target = findMinEntropyCell(cells, rows, cols, rng);
    if (!target) {
      return true; // every cell is collapsed
    }

    collapseCell(cells, palette, target.r, target.c, rng);
    if (!propagate(cells, compat, rows, cols, target.r, target.c)) {
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
): void {
  const cell = cells[r][c];
  const ids = [...cell];

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
}

function propagate(
  cells: Set<number>[][],
  compat: ReadonlySet<number>[][],
  rows: number,
  cols: number,
  startR: number,
  startC: number,
): boolean {
  const queue: { r: number; c: number }[] = [{ r: startR, c: startC }];

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
