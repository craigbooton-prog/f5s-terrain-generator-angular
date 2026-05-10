import { describe, expect, it } from 'vitest';
import {
  Direction,
  ROAD_OFFSET,
  ROAD_WIDTH,
  TILE_SIZE,
  Terrain,
  TileType,
  buildDefaultTileSet,
  cellMatchAs,
  cellTerrain,
  getEdge,
  isEdgeAllGrass,
  isEdgeAllOf,
  opposite,
} from './tile';
import { buildConcretiumFieldsBasicTileSet } from './concretium-fields-basic';
import { TILE_LIBRARIES, findLibrary } from './libraries';
import { generate } from './wfc';

describe('Terrain registry', () => {
  it('exposes the built-in palette plus the urban-stone ids', () => {
    expect(Terrain.Grass).toBe('grass');
    expect(Terrain.Road).toBe('road');
    expect(Terrain.Flagstone).toBe('flagstone');
    expect(Terrain.Kerbstone).toBe('kerbstone');
    expect(Terrain.CrackedFlagstone).toBe('cracked-flagstone');
    expect(Terrain.CrackedKerbstone).toBe('cracked-kerbstone');
    expect(Terrain.Manhole).toBe('manhole');
    expect(Terrain.Grating).toBe('grating');
  });

  it('default WFC archetypes only emit Grass and Road, never the urban-stone ids', () => {
    const palette = buildDefaultTileSet();
    const reserved = new Set<string>([
      Terrain.Flagstone,
      Terrain.Kerbstone,
      Terrain.CrackedFlagstone,
      Terrain.CrackedKerbstone,
      Terrain.Manhole,
      Terrain.Grating,
    ]);
    for (const v of palette) {
      for (const row of v.cells) {
        for (const c of row) {
          const t = cellTerrain(c);
          expect(reserved.has(t)).toBe(false);
          expect([Terrain.Grass, Terrain.Road]).toContain(t);
        }
      }
    }
  });
});

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
        for (const c of row) {
          expect([Terrain.Grass, Terrain.Road]).toContain(cellTerrain(c));
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
      expect(row.every(c => cellTerrain(c) === Terrain.Grass)).toBe(true);
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

describe('Cell metadata layer', () => {
  it('cellTerrain returns the bare string for plain cells', () => {
    expect(cellTerrain(Terrain.Grass)).toBe(Terrain.Grass);
    expect(cellTerrain({ terrain: Terrain.CrackedFlagstone })).toBe(Terrain.CrackedFlagstone);
  });

  it('cellMatchAs falls back to the render terrain when matchAs is omitted', () => {
    expect(cellMatchAs(Terrain.Road)).toBe(Terrain.Road);
    expect(cellMatchAs({ terrain: Terrain.Grating })).toBe(Terrain.Grating);
  });

  it('cellMatchAs uses matchAs when present, regardless of render terrain', () => {
    expect(
      cellMatchAs({ terrain: Terrain.CrackedFlagstone, matchAs: Terrain.Road }),
    ).toBe(Terrain.Road);
    expect(
      cellMatchAs({ terrain: Terrain.Grating, matchAs: Terrain.Flagstone }),
    ).toBe(Terrain.Flagstone);
  });
});

describe('isEdgeAllOf', () => {
  it('returns true only when every edge cell equals the requested terrain', () => {
    const palette = buildDefaultTileSet();
    const empty = palette.find(v => v.type === TileType.Empty)!;
    expect(isEdgeAllOf(empty, Direction.North, Terrain.Grass)).toBe(true);
    expect(isEdgeAllOf(empty, Direction.North, Terrain.Road)).toBe(false);
    expect(isEdgeAllOf(empty, Direction.North, Terrain.Flagstone)).toBe(false);
  });
});

describe('Concretium fields - basic palette', () => {
  it('contains 16 variants (4 archetypes × 4 unique rotations)', () => {
    const palette = buildConcretiumFieldsBasicTileSet();
    expect(palette.length).toBe(16);

    const counts = new Map<TileType, number>();
    for (const v of palette) counts.set(v.type, (counts.get(v.type) ?? 0) + 1);
    expect(counts.get(TileType.PlateC)).toBe(4);
    expect(counts.get(TileType.PlateCC)).toBe(4);
    expect(counts.get(TileType.PlateCD)).toBe(4);
    expect(counts.get(TileType.PlateCDRev)).toBe(4);
  });

  it('every variant is TILE_SIZE × TILE_SIZE and uses only the declared terrains', () => {
    const palette = buildConcretiumFieldsBasicTileSet();
    const allowed = new Set<string>([
      Terrain.Road,
      Terrain.Flagstone,
      Terrain.Kerbstone,
      Terrain.CrackedFlagstone,
      Terrain.CrackedKerbstone,
      Terrain.Grating,
    ]);
    for (const v of palette) {
      expect(v.cells.length).toBe(TILE_SIZE);
      for (const row of v.cells) {
        expect(row.length).toBe(TILE_SIZE);
        for (const c of row) {
          expect(allowed.has(cellTerrain(c))).toBe(true);
        }
      }
    }
  });

  it('decorative cells match-as a non-decorative terrain (so they do not constrain neighbours)', () => {
    const palette = buildConcretiumFieldsBasicTileSet();
    const decoratives = new Set<string>([
      Terrain.CrackedFlagstone,
      Terrain.CrackedKerbstone,
      Terrain.Grating,
    ]);
    // No edge profile (which is the matchAs view) should ever expose a
    // decorative terrain id; decorations always normalise to their base.
    for (const v of palette) {
      for (const dir of [Direction.North, Direction.East, Direction.South, Direction.West]) {
        for (const t of getEdge(v, dir)) {
          expect(decoratives.has(t)).toBe(false);
        }
      }
    }
  });

  it('plate C has an all-road N edge and an all-flagstone S edge in base orientation', () => {
    const palette = buildConcretiumFieldsBasicTileSet();
    const plateC0 = palette.find(v => v.type === TileType.PlateC && v.rotation === 0)!;
    expect(isEdgeAllOf(plateC0, Direction.North, Terrain.Road)).toBe(true);
    expect(isEdgeAllOf(plateC0, Direction.South, Terrain.Flagstone)).toBe(true);
  });
});

describe('library registry', () => {
  it('exposes Basic City Tiles and Concretium fields - basic', () => {
    const ids = TILE_LIBRARIES.map(l => l.id);
    expect(ids).toContain('basic-city-tiles');
    expect(ids).toContain('concretium-fields-basic');
  });

  it('Basic City Tiles seals on grass; Concretium fields - basic seals on flagstone', () => {
    expect(findLibrary('basic-city-tiles').sealedEdgeTerrain).toBe(Terrain.Grass);
    expect(findLibrary('concretium-fields-basic').sealedEdgeTerrain).toBe(Terrain.Flagstone);
  });

  it('throws on unknown library id', () => {
    expect(() => findLibrary('does-not-exist')).toThrow(/Unknown tile library/);
  });
});
