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

const ARCHETYPE_WEIGHT_MIN = 0.01;
const ARCHETYPE_WEIGHT_MAX = 100;

const ARCHETYPE_INVENTORY_MIN = 0;
const ARCHETYPE_INVENTORY_MAX = 10_000;

function clampArchetypeWeight(n: number): number {
  if (!Number.isFinite(n)) return ARCHETYPE_WEIGHT_MIN;
  return Math.min(ARCHETYPE_WEIGHT_MAX, Math.max(ARCHETYPE_WEIGHT_MIN, n));
}

function clampArchetypeInventory(n: number): number {
  if (!Number.isFinite(n)) return ARCHETYPE_INVENTORY_MIN;
  return Math.round(
    Math.min(ARCHETYPE_INVENTORY_MAX, Math.max(ARCHETYPE_INVENTORY_MIN, n)),
  );
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
   * Entries are listed in display-name order.
   */
  protected readonly archetypes = computed<readonly ArchetypeEntry[]>(() => {
    const palette = this.palette();
    const seen = new Map<TileType, TileVariant>();
    for (const v of palette) {
      const existing = seen.get(v.type);
      if (!existing || v.id < existing.id) seen.set(v.type, v);
    }
    return [...seen.values()]
      .sort((a, b) => {
        const cmp = formatType(a.type).localeCompare(formatType(b.type), undefined, {
          numeric: true,
          sensitivity: 'base',
        });
        return cmp !== 0 ? cmp : a.id - b.id;
      })
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

  /**
   * Optional per-archetype weight overrides for WFC collapse. Empty map ⇒ use
   * each variant’s built-in palette weight. Cleared when switching library.
   */
  protected readonly archetypeWeights = signal(new Map<TileType, number>());

  /**
   * Optional max placements per archetype for WFC. Missing entry ⇒ unlimited.
   * Stored values clamp to integers 0…10000 (`0` = that archetype may not appear).
   * Cleared when switching library.
   */
  protected readonly archetypeInventoryCaps = signal(new Map<TileType, number>());

  /** Archetypes with an explicit **Available** value (shown as tint on grids). */
  protected readonly finiteInventoryArchetypes = computed(
    (): ReadonlySet<TileType> => new Set(this.archetypeInventoryCaps().keys()),
  );

  protected readonly rows = signal(5);
  protected readonly cols = signal(5);
  protected readonly tilePixels = signal(96);
  protected readonly sealedBoundary = signal(false);
  /**
   * When true, archetypes without an Available count cannot be placed; summed
   * Available across selected archetypes must fill rows × cols.
   */
  protected readonly onlyFiniteInventory = signal(false);
  protected readonly useSeed = signal(true);
  protected readonly seed = signal(42);
  protected readonly showGridLines = signal(true);
  protected readonly showCellLines = signal(false);

  /** Collapsible tile-picker card body (header stays visible). */
  protected readonly tilePickerCardOpen = signal(true);
  /** Collapsible “Tiles used” card body. */
  protected readonly tileUsageCardOpen = signal(true);

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

  /** Sum of {@link tileUsage} counts; equals filled cells when WFC succeeded. */
  protected readonly tileUsageTotalCount = computed(() =>
    this.tileUsage().reduce((sum, e) => sum + e.count, 0),
  );

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
    this.archetypeWeights.set(new Map());
    this.archetypeInventoryCaps.set(new Map());
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

  /** Shown in the weight `<input>` for one archetype picker row. */
  protected displayedArchetypeWeight(entry: ArchetypeEntry): number {
    const over = this.archetypeWeights().get(entry.type);
    if (over === undefined) return entry.tile.weight;
    return clampArchetypeWeight(over);
  }

  protected setArchetypeWeight(
    type: TileType,
    raw: string | number | null | undefined,
    paletteDefault: number,
  ): void {
    const fallback = clampArchetypeWeight(paletteDefault);
    let n: number;
    if (typeof raw === 'number') n = raw;
    else if (raw === null || raw === undefined || raw === '') n = fallback;
    else n = Number(String(raw).trim());
    const next = clampArchetypeWeight(Number.isFinite(n) ? n : fallback);
    const current = new Map(this.archetypeWeights());
    current.set(type, next);
    this.archetypeWeights.set(current);
  }

  /** Empty string ⇒ unlimited (omit from caps map passed to generate). */
  protected displayArchetypeInventory(entry: ArchetypeEntry): number | '' {
    const v = this.archetypeInventoryCaps().get(entry.type);
    return v !== undefined ? v : '';
  }

  protected setArchetypeInventory(
    type: TileType,
    raw: string | number | null | undefined,
  ): void {
    const current = new Map(this.archetypeInventoryCaps());
    if (
      raw === null ||
      raw === undefined ||
      raw === '' ||
      (typeof raw === 'string' && raw.trim() === '')
    ) {
      current.delete(type);
      this.archetypeInventoryCaps.set(current);
      return;
    }
    const n = typeof raw === 'number' ? raw : Number(String(raw).trim());
    if (!Number.isFinite(n)) {
      current.delete(type);
      this.archetypeInventoryCaps.set(current);
      return;
    }
    current.set(type, clampArchetypeInventory(n));
    this.archetypeInventoryCaps.set(current);
  }

  private runGenerator(): WfcResult {
    const selected = this.selectedArchetypes();
    const weights = this.archetypeWeights();
    const weightedPalette = this.palette()
      .filter(v => selected.has(v.type))
      .map(v => {
        const over = weights.get(v.type);
        const base = over !== undefined ? over : v.weight;
        return { ...v, weight: clampArchetypeWeight(base) };
      });
    if (weightedPalette.length === 0) {
      return { success: false, attempts: 0, grid: [] };
    }
    const inv = this.archetypeInventoryCaps();
    const inventoryCaps = new Map<TileType, number>();
    for (const t of new Set(weightedPalette.map(v => v.type))) {
      const c = inv.get(t);
      if (c !== undefined) inventoryCaps.set(t, clampArchetypeInventory(c));
    }
    return generate(weightedPalette, {
      rows: this.rows(),
      cols: this.cols(),
      seed: this.useSeed() ? this.seed() : undefined,
      sealedBoundary: this.sealedBoundary(),
      sealedEdgeTerrain: this.library().sealedEdgeTerrain,
      inventoryCaps: inventoryCaps.size > 0 ? inventoryCaps : undefined,
      onlyFiniteInventory: this.onlyFiniteInventory(),
    });
  }
}
