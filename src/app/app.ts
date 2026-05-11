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

interface ArchetypeEntry {
  readonly type: TileType;
  /** Canonical variant of this archetype (lowest-id, ≈ rotation 0). */
  readonly tile: TileVariant;
  readonly previewGrid: readonly (TileVariant | null)[][];
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
    case TileType.PlateAdda:
      return 'Plate adda';
    case TileType.PlateAV2:
      return 'Plate A v2';
    case TileType.PlateB:
      return 'Plate B';
    case TileType.PlateDD2:
      return 'Plate DD-2';
    case TileType.PlateD2:
      return 'Plate D-2';
    case TileType.PlateACRev2:
      return 'Plate AC-rev-2';
    case TileType.PlateABA:
      return 'Plate aba';
    case TileType.PlateAA:
      return 'Plate AA';
    case TileType.PlateAB:
      return 'Plate AB';
    case TileType.PlateABRev:
      return 'Plate AB-rev';
    case TileType.PlateABV2:
      return 'Plate AB-v2';
    case TileType.PlateAC:
      return 'Plate AC';
    case TileType.PlateBB:
      return 'Plate BB';
    case TileType.PlateSP:
      return 'Plate SP';
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

  /**
   * One entry per archetype in the current library, keyed by TileType.
   * Each entry's `tile` is the lowest-id variant of that archetype (the
   * canonical 0° rotation in practice) so the thumbnail is stable.
   */
  protected readonly archetypes = computed<readonly ArchetypeEntry[]>(() => {
    const palette = this.palette();
    const seen = new Map<TileType, TileVariant>();
    for (const v of palette) {
      const existing = seen.get(v.type);
      if (!existing || v.id < existing.id) seen.set(v.type, v);
    }
    return [...seen.values()]
      .sort((a, b) => a.id - b.id)
      .map(tile => ({
        type: tile.type,
        tile,
        previewGrid: [[tile]] as (TileVariant | null)[][],
        label: formatType(tile.type),
      }));
  });

  /**
   * Set of archetypes the user has chosen to include in generation.
   * Initialised to all archetypes of the default library; reset to "all"
   * whenever the user picks a different library via {@link selectLibrary}.
   */
  protected readonly selectedArchetypes = signal<ReadonlySet<TileType>>(
    new Set(this.palette().map(v => v.type)),
  );

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
   * Flattens the current layout into a list of one entry per archetype
   * (TileType), summing across every rotation of that archetype, sorted
   * from most-used to least-used. The preview shows the lowest-id
   * variant of each archetype (the canonical 0° rotation when it
   * survives dedup). Each entry also carries a stable 1×1 grid
   * reference so the `<wfc-grid>` preview doesn't churn its
   * `input.required` binding on every change-detection.
   */
  protected readonly tileUsage = computed<readonly UsageEntry[]>(() => {
    const grid = this.grid();
    const counts = new Map<TileType, { tile: TileVariant; count: number }>();
    for (const row of grid) {
      for (const cell of row) {
        if (!cell) continue;
        const existing = counts.get(cell.type);
        if (existing) {
          existing.count++;
          // Keep the canonical (lowest-id) variant as the entry's preview.
          if (cell.id < existing.tile.id) existing.tile = cell;
        } else {
          counts.set(cell.type, { tile: cell, count: 1 });
        }
      }
    }
    return [...counts.values()]
      .map(({ tile, count }) => ({
        tile,
        count,
        previewGrid: [[tile]] as (TileVariant | null)[][],
        label: formatType(tile.type),
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

  /**
   * Switches the active library and resets the archetype selection to
   * include everything in the new library, then regenerates. Library
   * switches always discard the previous selection set.
   */
  selectLibrary(id: string): void {
    this.libraryId.set(id);
    this.selectedArchetypes.set(new Set(this.palette().map(v => v.type)));
    this.regenerate();
  }

  toggleArchetype(type: TileType): void {
    this.selectedArchetypes.update(current => {
      const next = new Set(current);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  isArchetypeSelected(type: TileType): boolean {
    return this.selectedArchetypes().has(type);
  }

  private runGenerator(): WfcResult {
    const selected = this.selectedArchetypes();
    const palette = this.palette().filter(v => selected.has(v.type));
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
