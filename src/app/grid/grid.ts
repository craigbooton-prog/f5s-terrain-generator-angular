import { Component, computed, input } from '@angular/core';
import { TILE_SIZE, TileType, TileVariant, cellTerrain, tileTypeLabel } from '../wfc/tile';

interface CellPlacement {
  /** Pixel-space x of the cell's top-left corner (in the SVG coordinate system). */
  readonly x: number;
  readonly y: number;
  readonly terrain: string;
  readonly key: string;
}

@Component({
  selector: 'wfc-grid',
  standalone: true,
  templateUrl: './grid.html',
  styleUrl: './grid.scss',
})
export class GridComponent {
  /** rows × cols 2-D array of `TileVariant | null`. */
  readonly grid = input.required<readonly (TileVariant | null)[][]>();
  /** On-screen pixel size of a whole tile (default 96 px). */
  readonly tilePixels = input<number>(96);
  /** Show lines along every tile (row/column) boundary. */
  readonly showGridLines = input<boolean>(true);
  /** Show lines along every inner cell boundary (the 12×12 sub-grid). */
  readonly showCellLines = input<boolean>(false);
  /**
   * Render the SVG without the big drop-shadow / 12-px corner radius.
   * Useful when the grid is being used as a small preview (e.g. in the
   * tile-usage panel) where the chrome would dominate the tile itself.
   */
  readonly flat = input<boolean>(false);
  /** When set, whole tiles whose archetype (`TileType`) is in this set get a tinted overlay. */
  readonly finiteInventoryTypes = input<ReadonlySet<TileType> | undefined>(undefined);
  /**
   * When true (default), each tile slot has a native hover tooltip showing the archetype name.
   */
  readonly showTileTooltips = input(true);

  protected readonly cols = computed(() => this.grid()[0]?.length ?? 0);
  protected readonly rows = computed(() => this.grid().length);
  protected readonly width = computed(() => this.cols() * this.tilePixels());
  protected readonly height = computed(() => this.rows() * this.tilePixels());

  /** Pixel size of a single inner cell of a tile. */
  protected readonly cellPixels = computed(() => this.tilePixels() / TILE_SIZE);

  /**
   * Flat list of every cell across every tile in the grid. Pre-computed so
   * the template stays trivial and Angular's `@for ... track` can identify
   * cells by a stable string key.
   */
  protected readonly placements = computed<readonly CellPlacement[]>(() => {
    const grid = this.grid();
    const tilePx = this.tilePixels();
    const cellPx = this.cellPixels();
    const placements: CellPlacement[] = [];

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const tile = grid[r][c];
        const baseX = c * tilePx;
        const baseY = r * tilePx;

        if (!tile) {
          placements.push({
            x: baseX,
            y: baseY,
            terrain: 'failed',
            key: `${r}-${c}-failed`,
          });
          continue;
        }

        for (let cellR = 0; cellR < TILE_SIZE; cellR++) {
          for (let cellC = 0; cellC < TILE_SIZE; cellC++) {
            placements.push({
              x: baseX + cellC * cellPx,
              y: baseY + cellR * cellPx,
              terrain: cellTerrain(tile.cells[cellR][cellC]),
              key: `${r}-${c}-${cellR}-${cellC}`,
            });
          }
        }
      }
    }

    return placements;
  });

  /** One rectangle per collapsed tile slot that uses a capped-inventory archetype. */
  protected readonly finiteInventoryOverlays = computed(
    (): readonly { readonly x: number; readonly y: number; readonly key: string }[] => {
      const types = this.finiteInventoryTypes();
      if (!types || types.size === 0) return [];
      const grid = this.grid();
      const tilePx = this.tilePixels();
      const out: { readonly x: number; readonly y: number; readonly key: string }[] = [];
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          const tile = grid[r][c];
          if (!tile || !types.has(tile.type)) continue;
          out.push({ x: c * tilePx, y: r * tilePx, key: `fin-${r}-${c}` });
        }
      }
      return out;
    },
  );

  /** Transparent rects with SVG `<title>` for hover tooltips per tile slot. */
  protected readonly tileTooltipTargets = computed(
    (): readonly { readonly x: number; readonly y: number; readonly label: string; readonly key: string }[] => {
      if (!this.showTileTooltips()) return [];
      const grid = this.grid();
      const tilePx = this.tilePixels();
      const out: { readonly x: number; readonly y: number; readonly label: string; readonly key: string }[] = [];
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          const tile = grid[r][c];
          const label = tile ? tileTypeLabel(tile.type) : 'Failed';
          out.push({
            x: c * tilePx,
            y: r * tilePx,
            label,
            key: `tip-${r}-${c}`,
          });
        }
      }
      return out;
    },
  );

  /**
   * Lines that mark the tile-scale grid (one line per row/column boundary,
   * including the outer borders). Drawn on top of the cell rects so they
   * stay visible even where roads carry the same colour across tiles.
   */
  protected readonly gridLines = computed(() => {
    const rows = this.rows();
    const cols = this.cols();
    const tilePx = this.tilePixels();
    const w = this.width();
    const h = this.height();
    const lines: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];

    for (let i = 0; i <= cols; i++) {
      const x = i * tilePx;
      lines.push({ x1: x, y1: 0, x2: x, y2: h, key: `v-${i}` });
    }
    for (let j = 0; j <= rows; j++) {
      const y = j * tilePx;
      lines.push({ x1: 0, y1: y, x2: w, y2: y, key: `h-${j}` });
    }
    return lines;
  });

  /**
   * Lines that mark the inner cell-scale grid (one line per cell boundary
   * inside a tile, i.e. the TILE_SIZE × TILE_SIZE sub-grid). Positions that
   * coincide with tile boundaries are skipped so the two sets of gridlines
   * don't fight each other for pixels.
   */
  protected readonly cellLines = computed(() => {
    const rows = this.rows();
    const cols = this.cols();
    const cellPx = this.cellPixels();
    const w = this.width();
    const h = this.height();
    const lines: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];

    const totalCols = cols * TILE_SIZE;
    const totalRows = rows * TILE_SIZE;

    for (let i = 1; i < totalCols; i++) {
      if (i % TILE_SIZE === 0) continue;
      const x = i * cellPx;
      lines.push({ x1: x, y1: 0, x2: x, y2: h, key: `cv-${i}` });
    }
    for (let j = 1; j < totalRows; j++) {
      if (j % TILE_SIZE === 0) continue;
      const y = j * cellPx;
      lines.push({ x1: 0, y1: y, x2: w, y2: y, key: `ch-${j}` });
    }
    return lines;
  });

  protected terrainClass(terrain: string): string {
    return `terrain terrain-${terrain}`;
  }
}
