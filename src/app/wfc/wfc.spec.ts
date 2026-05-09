import { describe, expect, it } from 'vitest';
import {
  Direction,
  ROAD_OFFSET,
  ROAD_WIDTH,
  TILE_SIZE,
  Terrain,
  TileType,
  buildDefaultTileSet,
  getEdge,
  isEdgeAllGrass,
  opposite,
} from './tile';
import { generate } from './wfc';

describe('tile palette', () => {
  it('has 12 unique variants (1+2+4+4+1)', () => {
    const palette = buildDefaultTileSet();
    expect(palette.length).toBe(12);

    const counts = new Map<TileType, number>();
    for (const v of palette) {
      counts.set(v.type, (counts.get(v.type) ?? 0) + 1);
    }
    expect(counts.get(TileType.Empty)).toBe(1);
    expect(counts.get(TileType.Straight)).toBe(2);
    expect(counts.get(TileType.Corner)).toBe(4);
    expect(counts.get(TileType.TJunction)).toBe(4);
    expect(counts.get(TileType.Crossroad)).toBe(1);
  });

  it('every variant is TILE_SIZE × TILE_SIZE cells', () => {
    const palette = buildDefaultTileSet();
    for (const v of palette) {
      expect(v.cells.length).toBe(TILE_SIZE);
      for (const row of v.cells) {
        expect(row.length).toBe(TILE_SIZE);
        for (const t of row) {
          expect([Terrain.Grass, Terrain.Road]).toContain(t);
        }
      }
    }
  });

  it('every variant has 4 edge profiles of length TILE_SIZE', () => {
    const palette = buildDefaultTileSet();
    for (const v of palette) {
      for (const dir of [Direction.North, Direction.East, Direction.South, Direction.West]) {
        expect(v.edges[dir].length).toBe(TILE_SIZE);
      }
    }
  });

  it('the empty tile is all grass; the crossroad has road on every edge', () => {
    const palette = buildDefaultTileSet();
    const empty = palette.find(v => v.type === TileType.Empty)!;
    const cross = palette.find(v => v.type === TileType.Crossroad)!;

    for (const row of empty.cells) {
      expect(row.every(c => c === Terrain.Grass)).toBe(true);
    }

    for (const dir of [Direction.North, Direction.East, Direction.South, Direction.West]) {
      const edge = getEdge(cross, dir);
      // Road occupies the centred ROAD_WIDTH cells.
      const roadCells = edge.filter(c => c === Terrain.Road).length;
      expect(roadCells).toBe(ROAD_WIDTH);
      for (let i = 0; i < TILE_SIZE; i++) {
        const inStrip = i >= ROAD_OFFSET && i < ROAD_OFFSET + ROAD_WIDTH;
        expect(edge[i]).toBe(inStrip ? Terrain.Road : Terrain.Grass);
      }
    }
  });

  it('opposite() round-trips', () => {
    expect(opposite(Direction.North)).toBe(Direction.South);
    expect(opposite(Direction.East)).toBe(Direction.West);
    for (const d of [Direction.North, Direction.East, Direction.South, Direction.West]) {
      expect(opposite(opposite(d))).toBe(d);
    }
  });
});

describe('wfc.generate', () => {
  it('produces a fully collapsed 5×5 grid', () => {
    const palette = buildDefaultTileSet();
    const result = generate(palette, { rows: 5, cols: 5, seed: 42 });
    expect(result.success).toBe(true);
    expect(result.grid.length).toBe(5);
    for (const row of result.grid) {
      expect(row.length).toBe(5);
      for (const cell of row) {
        expect(cell).not.toBeNull();
      }
    }
  });

  it('is deterministic for a given seed', () => {
    const palette = buildDefaultTileSet();
    const a = generate(palette, { rows: 6, cols: 6, seed: 12345 });
    const b = generate(palette, { rows: 6, cols: 6, seed: 12345 });
    expect(a.grid.map(r => r.map(t => t?.id))).toEqual(
      b.grid.map(r => r.map(t => t?.id)),
    );
  });

  it('matches edge profiles cell-by-cell at every internal seam', () => {
    const palette = buildDefaultTileSet();
    const { success, grid } = generate(palette, { rows: 7, cols: 7, seed: 999 });
    expect(success).toBe(true);

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const here = grid[r][c]!;
        if (c + 1 < grid[r].length) {
          const right = grid[r][c + 1]!;
          expect(getEdge(here, Direction.East)).toEqual(getEdge(right, Direction.West));
        }
        if (r + 1 < grid.length) {
          const below = grid[r + 1][c]!;
          expect(getEdge(here, Direction.South)).toEqual(getEdge(below, Direction.North));
        }
      }
    }
  });

  it('keeps every outer edge all-grass when sealedBoundary=true', () => {
    const palette = buildDefaultTileSet();
    const { success, grid } = generate(palette, {
      rows: 5,
      cols: 5,
      seed: 7,
      sealedBoundary: true,
    });
    expect(success).toBe(true);

    const last = grid.length - 1;
    for (let i = 0; i <= last; i++) {
      expect(isEdgeAllGrass(grid[0][i]!, Direction.North)).toBe(true);
      expect(isEdgeAllGrass(grid[last][i]!, Direction.South)).toBe(true);
      expect(isEdgeAllGrass(grid[i][0]!, Direction.West)).toBe(true);
      expect(isEdgeAllGrass(grid[i][last]!, Direction.East)).toBe(true);
    }
  });
});
