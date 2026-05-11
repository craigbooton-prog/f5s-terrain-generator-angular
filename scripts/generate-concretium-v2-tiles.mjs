/**
 * Reads `Concretuim-basic-tiles-grid-values.xlsx` and writes
 * `src/app/wfc/concretium-tiles-basic-v2.ts`.
 *
 * Usage (repo root): node scripts/generate-concretium-v2-tiles.mjs [path/to/workbook.xlsx]
 */
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'src', 'app', 'wfc', 'concretium-tiles-basic-v2.ts');

const DEFAULT_XLSX = path.join(
  process.env.USERPROFILE || process.env.HOME || '',
  'Downloads',
  'Concretuim-basic-tiles-grid-values.xlsx',
);

/** @returns {Map<number, Map<string, { t: 's'|'n', v: string }>>} */
function parseSheet(xml) {
  const rows = new Map();
  const cellRe = /<c r="([A-Z]+)([0-9]+)"([^>]*)>(?:<v>([^<]*)<\/v>)?<\/c>/g;
  let m;
  while ((m = cellRe.exec(xml))) {
    const col = m[1];
    const row = +m[2];
    const attrs = m[3];
    const val = m[4] ?? '';
    const isShared = attrs.includes('t="s"');
    if (!rows.has(row)) rows.set(row, new Map());
    rows.get(row).set(col, { t: isShared ? 's' : 'n', v: val });
  }
  return rows;
}

/** @returns {string[]} */
function parseSharedStrings(xml) {
  const out = [];
  const re = /<si>([\s\S]*?)<\/si>/g;
  let m;
  while ((m = re.exec(xml))) {
    const chunk = m[1];
    const texts = [...chunk.matchAll(/<t[^>]*>([^<]*)<\/t>/g)].map(x => x[1]);
    out.push(texts.join(''));
  }
  return out;
}

/** @returns {Record<string,string>} cell string at row,col */
function cellStr(rows, r, col, strings) {
  const rowMap = rows.get(r);
  if (!rowMap) return '';
  const c = rowMap.get(col);
  if (!c) return '';
  if (c.t === 's') return strings[+c.v] ?? '';
  return c.v;
}

/** workbook tile id → TileType enum member — order preserved for validation */
const VARIANT_ORDER = [
  ['b-2x2-plate-cc-final', 'PlateCC'],
  ['b-2x2-plate-cd-final', 'PlateCD'],
  ['b-2x2-plate-cd-rev-final', 'PlateCDRev'],
  ['b-2x2-plate-c-final', 'PlateC'],
  ['b-2x2-plate-adda-final', 'PlateAdda'],
  ['b-2x2-plate-a-v2-final', 'PlateAV2'],
  ['b-2x2-plate-b-final', 'PlateB'],
  ['b-2x2-plate-dd-final-2', 'PlateDD2'],
  ['b-2x2-plate-d-final-2', 'PlateD2'],
  ['b-2x2-plate-ac-rev-final-2', 'PlateACRev2'],
  ['b-2x2-plate-aba-final', 'PlateABA'],
  ['b-2x2-plate-aa-final', 'PlateAA'],
  ['b-2x2-plate-ab-final', 'PlateAB'],
  ['b-2x2-plate-ab-rev-final', 'PlateABRev'],
  ['b-2x2-plate-ab-v2-final', 'PlateABV2'],
  ['b-2x2-plate-ac-final', 'PlateAC'],
  ['b-2x2-plate-bb-final', 'PlateBB'],
  ['b-2x2-plate-sp-final', 'PlateSP'],
];

/** Stable `GRID_*` id for emitted const (matches {@link TileType} names). */
const GRID_CONST = {
  PlateC: 'GRID_PLATE_C',
  PlateCC: 'GRID_PLATE_CC',
  PlateCD: 'GRID_PLATE_CD',
  PlateCDRev: 'GRID_PLATE_CD_REV',
  PlateAdda: 'GRID_PLATE_ADDA',
  PlateAV2: 'GRID_PLATE_AV2',
  PlateB: 'GRID_PLATE_B',
  PlateDD2: 'GRID_PLATE_DD2',
  PlateD2: 'GRID_PLATE_D2',
  PlateACRev2: 'GRID_PLATE_AC_REV2',
  PlateABA: 'GRID_PLATE_ABA',
  PlateAA: 'GRID_PLATE_AA',
  PlateAB: 'GRID_PLATE_AB',
  PlateABRev: 'GRID_PLATE_AB_REV',
  PlateABV2: 'GRID_PLATE_AB_V2',
  PlateAC: 'GRID_PLATE_AC',
  PlateBB: 'GRID_PLATE_BB',
  PlateSP: 'GRID_PLATE_SP',
};

/** @typedef {{ name: string, grid: string[][] }} Block */

/** @returns {Block[]} */
function extractBlocks(rows, strings) {
  const ordered = [...rows.keys()].sort((a, b) => a - b);
  const starts = [];
  for (const r of ordered) {
    const aCell = rows.get(r)?.get('A');
    const aTxt = aCell?.t === 's' ? strings[+aCell.v] : '';
    if (aTxt === 'tile variant name') {
      const nameCell = rows.get(r).get('B');
      const name = nameCell?.t === 's' ? strings[+nameCell.v] : '';
      starts.push({ row: r, name });
    }
  }

  const blocks = [];
  for (const { row: sr, name } of starts) {
    let gridRowStart = sr + 2;
    const bPeek = cellStr(rows, gridRowStart, 'B', strings).trim();
    const cPeek = cellStr(rows, gridRowStart, 'C', strings).trim();
    /** Excel column-number gutter row (`1`, `2`, … under the tile name). */
    if (
      (bPeek === '1' || bPeek === '1.0') &&
      (cPeek === '2' || cPeek === '2.0')
    ) {
      gridRowStart += 1;
    }
    const grid = [];
    for (let dr = 0; dr < 12; dr++) {
      const r = gridRowStart + dr;
      const rowVals = [];
      for (let ci = 0; ci < 12; ci++) {
        const col = String.fromCharCode(66 + ci);
        rowVals.push(cellStr(rows, r, col, strings).trim());
      }
      grid.push(rowVals);
    }
    blocks.push({ name, grid });
  }
  return blocks;
}

function normalizeTerrain(s) {
  const lower = s.toLowerCase().trim();
  if (lower === 'crackedflagstone' || s === 'CrackedFlagstone') return 'cracked-flagstone';
  if (lower === 'grill' || lower === 'grate') return 'grating';
  return lower;
}

/** @param {string[][]} grid @param {(x: string) => boolean} predicate */
function neighborHas(grid, r, c, predicate) {
  const dirs = [
    [r - 1, c],
    [r + 1, c],
    [r, c - 1],
    [r, c + 1],
  ];
  for (const [rr, cc] of dirs) {
    if (rr < 0 || rr > 11 || cc < 0 || cc > 11) continue;
    const x = normalizeTerrain(grid[rr][cc]);
    if (predicate(x)) return true;
  }
  return false;
}

/** @returns {string} TypeScript expression for one cell */
function toCellEmit(grid, r, c) {
  const raw = grid[r][c];
  const t = normalizeTerrain(raw);
  if (!t) throw new Error(`Empty cell at block row ${r + 1} col ${c + 1}`);

  /** @param {string} x */
  const roadLike = x => x === 'road' || x === 'kerbstone';
  const besideRoadFamily = neighborHas(grid, r, c, roadLike);

  switch (t) {
    case 'road':
      return 'Terrain.Road';
    case 'flagstone':
      return 'Terrain.Flagstone';
    case 'kerbstone':
      return 'Terrain.Kerbstone';
    case 'cracked-flagstone':
      return besideRoadFamily
        ? 'decorate(Terrain.CrackedFlagstone, Terrain.Road)'
        : 'decorate(Terrain.CrackedFlagstone, Terrain.Flagstone)';
    case 'cracked-kerbstone':
      return 'decorate(Terrain.CrackedKerbstone, Terrain.Road)';
    case 'grating':
      return 'decorate(Terrain.Grating, Terrain.Flagstone)';
    case 'manhole':
      return besideRoadFamily
        ? 'decorate(Terrain.Manhole, Terrain.Road)'
        : 'decorate(Terrain.Manhole, Terrain.Flagstone)';
    case 'cracked-road':
      return 'decorate(Terrain.CrackedRoad, Terrain.Road)';
    case 'recess':
      return 'decorate(Terrain.Recess, Terrain.Flagstone)';
    default:
      throw new Error(`Unknown terrain "${raw}"`);
  }
}

function emitTs(blocks, xlsxPath) {
  const lines = [];
  lines.push(`/**
 * Concretium tiles — basic — V2. Authored grids from spreadsheet
 * (${path.basename(xlsxPath)}). Regenerate via:
 *   node scripts/generate-concretium-v2-tiles.mjs
 *
 * Decorative cells use {@link decorate} so edge sockets match neighbours
 * on base terrains-only.
 */
`);
  lines.push(`import type { Cell } from './tile';`);
  lines.push(`import {`);
  lines.push(`  AuthoredArchetype,`);
  lines.push(`  Terrain,`);
  lines.push(`  TileType,`);
  lines.push(`  TileVariant,`);
  lines.push(`  buildPalette,`);
  lines.push(`  decorate,`);
  lines.push(`} from './tile';`);
  lines.push('');

  let bi = 0;
  for (const { name, grid } of blocks) {
    const expectedId = VARIANT_ORDER[bi]?.[0];
    if (name !== expectedId) {
      console.warn(`Warning: block ${bi} named "${name}", expected "${expectedId}"`);
    }
    const enumName = VARIANT_ORDER.find(([id]) => id === name)?.[1];
    if (!enumName) throw new Error(`No TileType mapping for workbook tile "${name}"`);
    lines.push(`/* ${name} */`);
    const constId = GRID_CONST[enumName];
    if (!constId) throw new Error(`GRID_CONST missing for ${enumName}`);

    lines.push(`const ${constId}: readonly (readonly Cell[])[] = [`);
    for (let r = 0; r < 12; r++) {
      const rowCells = [];
      for (let c = 0; c < 12; c++) rowCells.push(toCellEmit(grid, r, c));
      lines.push(`  [${rowCells.join(', ')}],`);
    }
    lines.push(`];`);
    lines.push('');
    bi++;
  }

  lines.push(`const ARCHETYPES: readonly AuthoredArchetype[] = [`);

  bi = 0;
  for (const { name } of blocks) {
    const enumName = VARIANT_ORDER[bi]?.[1];
    const constId = GRID_CONST[enumName];
    if (!enumName || !constId)
      throw new Error(`VARIANT_ORDER/block mismatch at index ${bi} (${name})`);
    lines.push(
      `  { kind: 'authored', type: TileType.${enumName}, cells: ${constId}, weight: 1.0 },`,
    );
    bi++;
  }
  lines.push(`];`);
  lines.push('');
  lines.push(
    `/** 18 workbook archetypes × up to four rotationally unique variants each. */`,
  );
  lines.push(
    `export function buildConcretiumTilesBasicV2Set(): readonly TileVariant[] {`,
  );
  lines.push(`  return buildPalette(ARCHETYPES);`);
  lines.push(`}`);
  lines.push('');

  writeFileSync(OUT, lines.join('\n'), 'utf8');
  console.error(`Wrote ${OUT} (${blocks.length} tiles)`);
}

function main() {
  const xlsxPath = process.argv[2] ?? DEFAULT_XLSX;
  const sheet = execSync(`unzip -p "${xlsxPath}" xl/worksheets/sheet1.xml`, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  const sstXml = execSync(`unzip -p "${xlsxPath}" xl/sharedStrings.xml`, {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
  });
  const strings = parseSharedStrings(sstXml);
  const rows = parseSheet(sheet);
  const blocks = extractBlocks(rows, strings);
  if (blocks.length !== VARIANT_ORDER.length) {
    throw new Error(`Expected ${VARIANT_ORDER.length} tile blocks, got ${blocks.length}`);
  }
  emitTs(blocks, xlsxPath);
}

main();
