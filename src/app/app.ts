import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GridComponent } from './grid/grid';
import { buildDefaultTileSet } from './wfc/tile';
import { WfcResult, generate } from './wfc/wfc';

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
  protected readonly cellSize = signal(72);
  protected readonly sealedBoundary = signal(false);
  protected readonly useSeed = signal(true);
  protected readonly seed = signal(42);

  protected readonly result = signal<WfcResult>(this.runGenerator());
  protected readonly grid = computed(() => this.result().grid);

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
