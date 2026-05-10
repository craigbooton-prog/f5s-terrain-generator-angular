/**
 * "Concretium fields - basic" tile palette.
 *
 * Authored from the b-2x2-plate-* tiles in
 * `Concretuim-basic-tiles-grid-values.xlsx`. Each tile is a 12×12 grid
 * of cells with a flagstone background, a kerbstone strip, and road
 * along one or more edges. Decorative cells (cracked-flagstone,
 * cracked-kerbstone, grating) carry an explicit `matchAs` so they
 * don't constrain neighbouring tiles to also have the decoration.
 *
 * "2x2-plate" is just the source naming convention (LEGO-style); each
 * tile here still uses the standard 12×12 inner grid.
 */

import {
  AuthoredArchetype,
  Cell,
  Terrain,
  TileType,
  TileVariant,
  buildPalette,
  decorate,
} from './tile';

/* Terrain-id shorthands used inside the cell grids below. Single letters
 * keep the 12×12 grids readable as ASCII art. */
const R = Terrain.Road;
const F = Terrain.Flagstone;
const K = Terrain.Kerbstone;

/* Decorations: a decorative variant whose `matchAs` resolves to the
 * surrounding terrain so adjacency continuity isn't broken when the
 * decorated cell happens to land on (or rotate onto) an edge. */

/** Cracked-flagstone scattered into a road area. */
const cfR: Cell = decorate(Terrain.CrackedFlagstone, Terrain.Road);
/** Cracked-kerbstone scattered into a road area (e.g. a fallen kerb). */
const ckR: Cell = decorate(Terrain.CrackedKerbstone, Terrain.Road);
/** Grating set into the flagstone pavement (drainage, vent, etc.). */
const grF: Cell = decorate(Terrain.Grating, Terrain.Flagstone);

/* ------------------------------------------------------------------ */
/* b-2x2-plate-c-final                                                */
/* ------------------------------------------------------------------ */
/* Single-edge plate: rows 1-3 road, row 4 kerb, rows 5-12 flagstone. */
const PLATE_C: readonly (readonly Cell[])[] = [
  [R, R, R, R, R, R, R, R, R, R, R, R], //  1
  [R, R, R, R, R, R, R, R, R, R, R, R], //  2
  [R, R, R, R, R, R, R, R, R, R, R, R], //  3
  [K, K, K, K, K, K, K, K, K, K, K, K], //  4
  [F, F, F, F, F, F, F, F, F, F, F, F], //  5
  [F, F, F, F, F, F, F, F, F, F, F, F], //  6
  [F, F, F, F, F, F, F, F, F, F, F, F], //  7
  [F, F, F, F, F, F, F, F, F, F, F, F], //  8
  [F, F, F, F, F, F, F, F, F, F, F, F], //  9
  [F, F, F, F, F, F, F, F, F, F, F, F], // 10
  [F, F, F, F, F, F, F, F, F, F, F, F], // 11
  [F, F, F, F, F, F, F, F, F, F, F, F], // 12
];

/* ------------------------------------------------------------------ */
/* b-2x2-plate-cc-final                                               */
/* ------------------------------------------------------------------ */
/* Two-edge corner plate: road on N (full) and W (full); pavement     */
/* fills the SE 8×8; cracked-flagstone "imperfections" scattered      */
/* through the road area.                                             */
const PLATE_CC: readonly (readonly Cell[])[] = [
  [R, R, cfR, R, R, R, R, R, R, R, R, R], //  1
  [R, R, R,   R, cfR, R, R, R, cfR, R, R, R], //  2
  [R, R, R,   R, R,   R, R, R, R,   R, R, R], //  3
  [R, R, R,   K, K,   K, K, K, K,   K, K, K], //  4
  [R, R, R,   K, F,   F, F, F, F,   F, F, F], //  5
  [R, R, R,   K, F,   F, F, F, F,   F, F, F], //  6
  [R, R, R,   K, F,   F, F, F, F,   F, F, F], //  7
  [R, R, R,   K, F,   F, F, F, F,   F, F, F], //  8
  [R, cfR, R, K, F,   F, F, F, F,   F, F, F], //  9
  [R, R, R,   K, F,   F, F, F, F,   F, F, F], // 10
  [R, R, R,   K, F,   F, F, F, F,   F, F, F], // 11
  [R, R, R,   K, F,   F, F, F, F,   F, F, F], // 12
];

/* ------------------------------------------------------------------ */
/* b-2x2-plate-cd-final                                               */
/* ------------------------------------------------------------------ */
/* Like cc-final but with the kerb starting one row south (rows 1-4   */
/* are pure road), plus two grating cells set into the flagstone.     */
const PLATE_CD: readonly (readonly Cell[])[] = [
  [R, R, R,   R, R, R, R,   R, R, R, R, R], //  1
  [R, R, R,   R, R, R, R,   R, R, R, R, R], //  2
  [R, R, R,   R, R, R, R,   R, R, R, R, R], //  3
  [R, R, R,   R, R, R, R,   R, R, R, R, R], //  4
  [R, R, R,   K, K, K, K,   K, K, K, K, K], //  5
  [R, R, R,   K, F, F, F,   F, F, F, F, F], //  6
  [R, R, R,   K, F, F, F,   F, F, F, F, F], //  7
  [R, R, R,   K, F, F, F,   F, F, F, F, F], //  8
  [R, cfR, R, K, F, F, F,   F, F, F, F, F], //  9
  [R, R, R,   K, F, F, grF, F, F, F, F, F], // 10
  [R, R, R,   K, F, F, grF, F, F, F, F, F], // 11
  [R, R, R,   K, F, F, F,   F, F, F, F, F], // 12
];

/* ------------------------------------------------------------------ */
/* b-2x2-plate-cd-rev-final                                           */
/* ------------------------------------------------------------------ */
/* Horizontal mirror of cd-final: road on N and E; pavement in the    */
/* SW. Cannot be derived from cd-final by 90° rotation (a mirror is   */
/* not a rotation), so we author it explicitly. Cracked-kerbstone     */
/* cells appear in the road area.                                     */
const PLATE_CD_REV: readonly (readonly Cell[])[] = [
  [R, R, R, R, R,   R, R,   R, R, R, R,   R], //  1
  [R, R, R, R, R,   R, ckR, R, R, R, R,   R], //  2
  [R, R, R, R, ckR, R, R,   R, R, R, R,   R], //  3
  [R, R, R, R, R,   R, R,   R, R, R, R,   R], //  4
  [K, K, K, K, K,   K, K,   K, K, R, R,   R], //  5
  [F, F, F, F, F,   F, F,   F, K, R, R,   R], //  6
  [F, F, F, F, F,   F, F,   F, K, R, R,   R], //  7
  [F, F, F, F, F,   F, F,   F, K, R, R,   R], //  8
  [F, F, F, F, F,   F, F,   F, K, R, ckR, R], //  9
  [F, F, F, F, F,   F, F,   F, K, R, R,   R], // 10
  [F, F, F, F, F,   F, F,   F, K, R, R,   R], // 11
  [F, F, F, F, F,   F, F,   F, K, R, R,   R], // 12
];

/* ------------------------------------------------------------------ */
/* Library entry point                                                */
/* ------------------------------------------------------------------ */

const CONCRETIUM_ARCHETYPES: readonly AuthoredArchetype[] = [
  { kind: 'authored', type: TileType.PlateC,      cells: PLATE_C,      weight: 1.0 },
  { kind: 'authored', type: TileType.PlateCC,     cells: PLATE_CC,     weight: 1.0 },
  { kind: 'authored', type: TileType.PlateCD,     cells: PLATE_CD,     weight: 1.0 },
  { kind: 'authored', type: TileType.PlateCDRev,  cells: PLATE_CD_REV, weight: 1.0 },
];

/**
 * Builds the 16-variant Concretium fields - basic palette: each of the
 * four plate archetypes contributes 4 unique 90° rotations (none of
 * them are rotationally symmetric).
 */
export function buildConcretiumFieldsBasicTileSet(): readonly TileVariant[] {
  return buildPalette(CONCRETIUM_ARCHETYPES);
}
