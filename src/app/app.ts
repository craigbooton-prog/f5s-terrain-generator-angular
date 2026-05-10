import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GridComponent } from './grid/grid';
import { TileType, TileVariant, buildDefaultTileSet } from './wfc/tile';
import { WfcResult, generate } from './wfc/wfc';

interface UsageEntry {
  readonly tile: TileVariant;
  /** Always a 1×1 grid wrapping `tile`, suitable for `<wfc-grid>` previews. */
  readonly previewGrid: readonly (TileVariant | null)[][];
  readonly count: number;
  readonly label: string;
}

function formatType(type: TileType): string {
  return type === TileType.TJunction ? 'T-junction' : type;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, GridComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly palette = buildDefaultTileSet();

  protected readonly rows = signal(5);
  protected readonly cols = signal(5);
  protected readonly tilePixels = signal(96);
  protected readonly sealedBoundary = signal(false);
  protected readonly useSeed = signal(true);
  protected readonly seed = signal(42);
  protected readonly showGridLines = signal(true);
  protected readonly showCellLines = signal(false);

  protected readonly result = signal<WfcResult>(this.runGenerator());
  protected readonly grid = computed(() => this.result().grid);

  /**
   * Flattens the current layout into a deduplicated list of variant +
   * occurrence counts, sorted from most-used to least-used. Each entry
   * also carries a stable 1×1 grid reference so the `<wfc-grid>` preview
   * doesn't churn its `input.required` binding on every change-detection.
   */
  protected readonly tileUsage = computed<readonly UsageEntry[]>(() => {
    const grid = this.grid();
    const counts = new Map<number, { tile: TileVariant; count: number }>();
    for (const row of grid) {
      for (const cell of row) {
        if (!cell) continue;
        const existing = counts.get(cell.id);
        if (existing) {
          existing.count++;
        } else {
          counts.set(cell.id, { tile: cell, count: 1 });
        }
      }
    }
    return [...counts.values()]
      .map(({ tile, count }) => ({
        tile,
        count,
        previewGrid: [[tile]] as (TileVariant | null)[][],
        label: `${formatType(tile.type)} ${tile.rotation * 90}°`,
      }))
      .sort((a, b) => b.count - a.count || a.tile.id - b.tile.id);
  });

  regenerate(): void {
    this.result.set(this.runGenerator());
  }

  randomizeSeed(): void {
    this.useSeed.set(true);
    this.seed.set(Math.floor(Math.random() * 1_000_000));
    this.regenerate();
  }

  private runGenerator(): WfcResult {
    return generate(this.palette, {
      rows: this.rows(),
      cols: this.cols(),
      seed: this.useSeed() ? this.seed() : undefined,
      sealedBoundary: this.sealedBoundary(),
    });
  }
}
