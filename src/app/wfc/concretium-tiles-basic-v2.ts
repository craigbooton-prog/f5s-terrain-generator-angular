/**
 * Concretium tiles — basic — V2. Authored grids from spreadsheet
 * (Concretuim-basic-tiles-grid-values.xlsx). Regenerate via:
 *   node scripts/generate-concretium-v2-tiles.mjs
 *
 * Decorative cells use {@link decorate} so edge sockets match neighbours
 * on base terrains-only.
 */

import type { Cell } from './tile';
import {
  AuthoredArchetype,
  Terrain,
  TileType,
  TileVariant,
  buildPalette,
  decorate,
} from './tile';

/* b-2x2-plate-cc-final */
const GRID_PLATE_CC: readonly (readonly Cell[])[] = [
  [Terrain.Road, Terrain.Road, decorate(Terrain.CrackedFlagstone, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, decorate(Terrain.CrackedFlagstone, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road, decorate(Terrain.CrackedFlagstone, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, decorate(Terrain.CrackedFlagstone, Terrain.Road), Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
];

/* b-2x2-plate-cd-final */
const GRID_PLATE_CD: readonly (readonly Cell[])[] = [
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, decorate(Terrain.CrackedFlagstone, Terrain.Road), Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Grating, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Grating, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
];

/* b-2x2-plate-cd-rev-final */
const GRID_PLATE_CD_REV: readonly (readonly Cell[])[] = [
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, decorate(Terrain.CrackedKerbstone, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, decorate(Terrain.CrackedKerbstone, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Kerbstone, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Kerbstone, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Kerbstone, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Kerbstone, Terrain.Road, decorate(Terrain.CrackedKerbstone, Terrain.Road), Terrain.Road],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Kerbstone, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Kerbstone, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Kerbstone, Terrain.Road, Terrain.Road, Terrain.Road],
];

/* b-2x2-plate-c-final */
const GRID_PLATE_C: readonly (readonly Cell[])[] = [
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
];

/* b-2x2-plate-adda-final */
const GRID_PLATE_ADDA: readonly (readonly Cell[])[] = [
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Road],
  [Terrain.Road, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Kerbstone, Terrain.Road],
  [Terrain.Road, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Kerbstone, Terrain.Road],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, decorate(Terrain.CrackedKerbstone, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, decorate(Terrain.CrackedKerbstone, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
];

/* b-2x2-plate-a-v2-final */
const GRID_PLATE_AV2: readonly (readonly Cell[])[] = [
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), Terrain.Flagstone],
  [Terrain.Flagstone, decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), Terrain.Flagstone],
  [Terrain.Flagstone, decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), Terrain.Flagstone],
  [Terrain.Flagstone, decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
];

/* b-2x2-plate-b-final */
const GRID_PLATE_B: readonly (readonly Cell[])[] = [
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
];

/* b-2x2-plate-dd-final-2 */
const GRID_PLATE_DD2: readonly (readonly Cell[])[] = [
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, decorate(Terrain.CrackedRoad, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, decorate(Terrain.CrackedRoad, Terrain.Road), Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
];

/* b-2x2-plate-d-final-2 */
const GRID_PLATE_D2: readonly (readonly Cell[])[] = [
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, decorate(Terrain.CrackedRoad, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, decorate(Terrain.CrackedRoad, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
];

/* b-2x2-plate-ac-rev-final-2 */
const GRID_PLATE_AC_REV2: readonly (readonly Cell[])[] = [
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, decorate(Terrain.CrackedRoad, Terrain.Road), Terrain.Road, decorate(Terrain.CrackedRoad, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [decorate(Terrain.CrackedRoad, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, decorate(Terrain.CrackedKerbstone, Terrain.Road), decorate(Terrain.CrackedKerbstone, Terrain.Road), Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
];

/* b-2x2-plate-aba-final */
const GRID_PLATE_ABA: readonly (readonly Cell[])[] = [
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, decorate(Terrain.CrackedRoad, Terrain.Road), Terrain.Road, decorate(Terrain.CrackedRoad, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, decorate(Terrain.CrackedKerbstone, Terrain.Road), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
];

/* b-2x2-plate-aa-final */
const GRID_PLATE_AA: readonly (readonly Cell[])[] = [
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, decorate(Terrain.CrackedRoad, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, decorate(Terrain.Manhole, Terrain.Road), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Grating, Terrain.Flagstone), decorate(Terrain.Grating, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Grating, Terrain.Flagstone), decorate(Terrain.Grating, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
];

/* b-2x2-plate-ab-final */
const GRID_PLATE_AB: readonly (readonly Cell[])[] = [
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, decorate(Terrain.CrackedRoad, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Kerbstone, decorate(Terrain.Manhole, Terrain.Road), Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, decorate(Terrain.Manhole, Terrain.Road), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Grating, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
];

/* b-2x2-plate-ab-rev-final */
const GRID_PLATE_AB_REV: readonly (readonly Cell[])[] = [
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, decorate(Terrain.CrackedRoad, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Kerbstone, Terrain.Kerbstone, decorate(Terrain.Manhole, Terrain.Road), Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, decorate(Terrain.Manhole, Terrain.Road), Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Road],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Manhole, Terrain.Road), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Road],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Road],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Road],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Grating, Terrain.Flagstone), decorate(Terrain.Grating, Terrain.Flagstone), decorate(Terrain.Grating, Terrain.Flagstone), decorate(Terrain.Grating, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Road],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Road],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Road],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Road],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Road],
  [Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Road],
];

/* b-2x2-plate-ab-v2-final */
const GRID_PLATE_AB_V2: readonly (readonly Cell[])[] = [
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, decorate(Terrain.CrackedRoad, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Kerbstone, decorate(Terrain.Manhole, Terrain.Road), Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, decorate(Terrain.Manhole, Terrain.Road), Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, decorate(Terrain.Manhole, Terrain.Road), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Grating, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), decorate(Terrain.Recess, Terrain.Flagstone), Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
];

/* b-2x2-plate-ac-final */
const GRID_PLATE_AC: readonly (readonly Cell[])[] = [
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, decorate(Terrain.CrackedRoad, Terrain.Road), Terrain.Road, decorate(Terrain.CrackedRoad, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, decorate(Terrain.CrackedRoad, Terrain.Road), Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, decorate(Terrain.CrackedRoad, Terrain.Road)],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, decorate(Terrain.CrackedKerbstone, Terrain.Road), decorate(Terrain.CrackedKerbstone, Terrain.Road), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
];

/* b-2x2-plate-bb-final */
const GRID_PLATE_BB: readonly (readonly Cell[])[] = [
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road, Terrain.Road],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, decorate(Terrain.Manhole, Terrain.Road), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Road, Terrain.Road, Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
];

/* b-2x2-plate-sp-final */
const GRID_PLATE_SP: readonly (readonly Cell[])[] = [
  [Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone, Terrain.Kerbstone],
  [Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Manhole, Terrain.Road), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Manhole, Terrain.Road), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, decorate(Terrain.Manhole, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Kerbstone, decorate(Terrain.Manhole, Terrain.Road), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Kerbstone, Terrain.Flagstone, decorate(Terrain.Manhole, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Kerbstone, Terrain.Flagstone, decorate(Terrain.Manhole, Terrain.Flagstone), Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
  [Terrain.Kerbstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone, Terrain.Flagstone],
];

const ARCHETYPES: readonly AuthoredArchetype[] = [
  { kind: 'authored', type: TileType.PlateCC, cells: GRID_PLATE_CC, weight: 1.0 },
  { kind: 'authored', type: TileType.PlateCD, cells: GRID_PLATE_CD, weight: 1.0 },
  { kind: 'authored', type: TileType.PlateCDRev, cells: GRID_PLATE_CD_REV, weight: 1.0 },
  { kind: 'authored', type: TileType.PlateC, cells: GRID_PLATE_C, weight: 1.0 },
  { kind: 'authored', type: TileType.PlateAdda, cells: GRID_PLATE_ADDA, weight: 1.0 },
  { kind: 'authored', type: TileType.PlateAV2, cells: GRID_PLATE_AV2, weight: 1.0 },
  { kind: 'authored', type: TileType.PlateB, cells: GRID_PLATE_B, weight: 1.0 },
  { kind: 'authored', type: TileType.PlateDD2, cells: GRID_PLATE_DD2, weight: 1.0 },
  { kind: 'authored', type: TileType.PlateD2, cells: GRID_PLATE_D2, weight: 1.0 },
  { kind: 'authored', type: TileType.PlateACRev2, cells: GRID_PLATE_AC_REV2, weight: 1.0 },
  { kind: 'authored', type: TileType.PlateABA, cells: GRID_PLATE_ABA, weight: 1.0 },
  { kind: 'authored', type: TileType.PlateAA, cells: GRID_PLATE_AA, weight: 1.0 },
  { kind: 'authored', type: TileType.PlateAB, cells: GRID_PLATE_AB, weight: 1.0 },
  { kind: 'authored', type: TileType.PlateABRev, cells: GRID_PLATE_AB_REV, weight: 1.0 },
  { kind: 'authored', type: TileType.PlateABV2, cells: GRID_PLATE_AB_V2, weight: 1.0 },
  { kind: 'authored', type: TileType.PlateAC, cells: GRID_PLATE_AC, weight: 1.0 },
  { kind: 'authored', type: TileType.PlateBB, cells: GRID_PLATE_BB, weight: 1.0 },
  { kind: 'authored', type: TileType.PlateSP, cells: GRID_PLATE_SP, weight: 1.0 },
];

/** 18 workbook archetypes × up to four rotationally unique variants each. */
export function buildConcretiumTilesBasicV2Set(): readonly TileVariant[] {
  return buildPalette(ARCHETYPES);
}
