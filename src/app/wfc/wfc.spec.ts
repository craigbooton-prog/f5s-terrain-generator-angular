import { describe, expect, it } from 'vitest';
import {
  Direction,
  TileType,
  buildDefaultTileSet,
  hasRoad,
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

  it('opposite() and rotation are consistent', () => {
    expect(opposite(Direction.North)).toBe(Direction.South);
    expect(opposite(Direction.East)).toBe(Direction.West);
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

  it('respects sockets at every cell boundary', () => {
    const palette = buildDefaultTileSet();
    const { success, grid } = generate(palette, { rows: 7, cols: 7, seed: 999 });
    expect(success).toBe(true);

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const cell = grid[r][c]!;
        if (c + 1 < grid[r].length) {
          const right = grid[r][c + 1]!;
          expect(hasRoad(cell, Direction.East)).toBe(hasRoad(right, Direction.West));
        }
        if (r + 1 < grid.length) {
          const below = grid[r + 1][c]!;
          expect(hasRoad(cell, Direction.South)).toBe(hasRoad(below, Direction.North));
        }
      }
    }
  });

  it('keeps roads inside the grid when sealedBoundary=true', () => {
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
      expect(hasRoad(grid[0][i]!, Direction.North)).toBe(false);
      expect(hasRoad(grid[last][i]!, Direction.South)).toBe(false);
      expect(hasRoad(grid[i][0]!, Direction.West)).toBe(false);
      expect(hasRoad(grid[i][last]!, Direction.East)).toBe(false);
    }
  });
});
