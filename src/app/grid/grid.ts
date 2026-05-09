import { Component, computed, input } from '@angular/core';
import { Direction, TileVariant, hasRoad } from '../wfc/tile';

interface CellPlacement {
  readonly r: number;
  readonly c: number;
  readonly tile: TileVariant | null;
  readonly hasN: boolean;
  readonly hasE: boolean;
  readonly hasS: boolean;
  readonly hasW: boolean;
}

@Component({
  selector: 'wfc-grid',
  standalone: true,
  templateUrl: './grid.html',
  styleUrl: './grid.scss',
})
export class GridComponent {
  readonly grid = input.required<readonly (TileVariant | null)[][]>();
  readonly cellSize = input<number>(64);

  protected readonly cols = computed(() => this.grid()[0]?.length ?? 0);
  protected readonly rows = computed(() => this.grid().length);
  protected readonly width = computed(() => this.cols() * this.cellSize());
  protected readonly height = computed(() => this.rows() * this.cellSize());

  /** Half-cell length in pixels (used for road segments from edge to centre). */
  protected readonly half = computed(() => this.cellSize() * 0.5);
  /** Width of the road strip = 30% of the cell. */
  protected readonly roadWidth = computed(() => this.cellSize() * 0.3);
  /** Offset from the cell edge to the road strip ((cell - road) / 2). */
  protected readonly roadOffset = computed(() => this.cellSize() * 0.35);

  protected readonly placements = computed<readonly CellPlacement[]>(() => {
    const grid = this.grid();
    const out: CellPlacement[] = [];
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const tile = grid[r][c];
        out.push({
          r,
          c,
          tile,
          hasN: tile ? hasRoad(tile, Direction.North) : false,
          hasE: tile ? hasRoad(tile, Direction.East) : false,
          hasS: tile ? hasRoad(tile, Direction.South) : false,
          hasW: tile ? hasRoad(tile, Direction.West) : false,
        });
      }
    }
    return out;
  });
}
