/**
 * Domain model for the road tiles. Direct port of the C# `Tiles.cs`:
 *  - five archetypes (Empty, Straight, Corner, T-junction, Crossroad)
 *  - each archetype is expanded into all of its *unique* rotations
 *  - sockets are indexed [N, E, S, W] so a 90° clockwise rotation is just
 *    a circular shift of the array.
 */

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

export interface TileVariant {
  /** Stable index in the palette. Used as the key in WFC possibility sets. */
  readonly id: number;
  readonly type: TileType;
  /** 0..3 quarter-turns clockwise from the archetype. */
  readonly rotation: number;
  /** [N, E, S, W] — true means a road exits this side. */
  readonly sockets: SocketTuple;
  /** Relative weight for random selection during collapse. */
  readonly weight: number;
}

export function hasRoad(v: TileVariant, d: Direction): boolean {
  return v.sockets[d];
}

/**
 * Rotates a socket array `steps` quarter-turns clockwise.
 * With index order N=0, E=1, S=2, W=3:
 *   rotated[i] = original[(i - steps) mod 4]
 * (e.g. one step CW: the road that exited W now exits N).
 */
function rotate(sockets: SocketTuple, steps: number): SocketTuple {
  const out: [boolean, boolean, boolean, boolean] = [false, false, false, false];
  for (let i = 0; i < 4; i++) {
    const src = ((i - steps) % 4 + 4) % 4;
    out[i] = sockets[src];
  }
  return out;
}

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
 * Builds the canonical 12-tile palette used by the generator.
 * Each archetype contributes only its unique rotations (e.g. an empty tile
 * rotates onto itself → 1 variant, a corner has 4).
 */
export function buildDefaultTileSet(): readonly TileVariant[] {
  const palette: TileVariant[] = [];
  for (const a of ARCHETYPES) {
    const seen = new Set<string>();
    for (let rot = 0; rot < 4; rot++) {
      const rotated = rotate(a.sockets, rot);
      const key = rotated.map(b => (b ? '1' : '0')).join('');
      if (!seen.has(key)) {
        seen.add(key);
        palette.push({
          id: palette.length,
          type: a.type,
          rotation: rot,
          sockets: rotated,
          weight: a.weight,
        });
      }
    }
  }
  return palette;
}
