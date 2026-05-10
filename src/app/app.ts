import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GridComponent } from './grid/grid';
import { TileType, TileVariant } from './wfc/tile';
import { DEFAULT_LIBRARY_ID, TILE_LIBRARIES, findLibrary } from './wfc/libraries';
import { WfcResult, generate } from './wfc/wfc';

interface UsageEntry {
  readonly tile: TileVariant;
  /** Always a 1×1 grid wrapping `tile`, suitable for `<wfc-grid>` previews. */
  readonly previewGrid: readonly (TileVariant | null)[][];
  readonly count: number;
  readonly label: string;
}

function formatType(type: TileType): string {
  switch (type) {
    case TileType.TJunction:
      return 'T-junction';
    case TileType.PlateC:
      return 'Plate C';
    case TileType.PlateCC:
      return 'Plate CC';
    case TileType.PlateCD:
      return 'Plate CD';
    case TileType.PlateCDRev:
      return 'Plate CD-rev';
    default:
      return type;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, GridComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly libraries = TILE_LIBRARIES;
  protected readonly libraryId = signal<string>(DEFAULT_LIBRARY_ID);
  protected readonly library = computed(() => findLibrary(this.libraryId()));
  protected readonly palette = computed(() => this.library().build());

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
    const palette = this.palette();
    if (palette.length === 0) {
      return { success: false, attempts: 0, grid: [] };
    }
    return generate(palette, {
      rows: this.rows(),
      cols: this.cols(),
      seed: this.useSeed() ? this.seed() : undefined,
      sealedBoundary: this.sealedBoundary(),
      sealedEdgeTerrain: this.library().sealedEdgeTerrain,
    });
  }
}
