/**
 * Tile-library catalogue.
 *
 * A library is a named, mutually-exclusive collection of tile variants
 * the WFC generator can draw from. The picker in the app forces a
 * mandatory choice at generation time — there is no implicit
 * "all-libraries" mode, because two libraries' edge-string conventions
 * usually do not match and would not produce coherent adjacencies.
 *
 * Adding a new library:
 *   1. Implement a `build()` returning `readonly TileVariant[]`.
 *   2. Append a {@link TileLibrary} to {@link TILE_LIBRARIES}.
 *   3. (Optional) Set `sealedEdgeTerrain` so the sealed-boundary mode
 *      knows what background terrain to require on the outer edges.
 */

import { Terrain, TerrainId, TileVariant, buildDefaultTileSet } from './tile';
import { buildConcretiumFieldsBasicTileSet } from './concretium-fields-basic';
import { buildConcretiumTilesBasicV2Set } from './concretium-tiles-basic-v2';

export interface TileLibrary {
  /** Stable id used in URLs / saved settings / tests. */
  readonly id: string;
  /** Human-readable name shown in the library picker. */
  readonly name: string;
  /** One-line description shown beneath the picker (optional). */
  readonly description?: string;
  /** Builds the full palette of tile variants for this library. */
  readonly build: () => readonly TileVariant[];
  /**
   * Background terrain id required on every outer-edge cell when the
   * user enables `sealedBoundary`. Defaults to `Terrain.Grass`.
   */
  readonly sealedEdgeTerrain?: TerrainId;
}

export const TILE_LIBRARIES: readonly TileLibrary[] = [
  {
    id: 'basic-city-tiles',
    name: 'Basic City Tiles',
    description:
      'Centred road strips on grass: empty, straight, corner, T-junction, crossroad.',
    build: buildDefaultTileSet,
    sealedEdgeTerrain: Terrain.Grass,
  },
  {
    id: 'concretium-fields-basic',
    name: 'Concretium fields - basic',
    description:
      'Hand-authored 12×12 plate tiles with flagstone pavement, kerbstone strips and road edges.',
    build: buildConcretiumFieldsBasicTileSet,
    sealedEdgeTerrain: Terrain.Flagstone,
  },
  {
    id: 'concretium-tiles-basic-v2',
    name: 'Concretium tiles - basic - V2',
    description:
      'Full 18-variant workbook palette from Concretuim-basic-tiles-grid-values.xlsx.',
    build: buildConcretiumTilesBasicV2Set,
    sealedEdgeTerrain: Terrain.Flagstone,
  },
];

export const DEFAULT_LIBRARY_ID = 'basic-city-tiles';

export function findLibrary(id: string): TileLibrary {
  const lib = TILE_LIBRARIES.find(l => l.id === id);
  if (!lib) {
    throw new Error(`Unknown tile library: ${id}`);
  }
  return lib;
}
