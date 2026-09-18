import { CrosswordEntry, CrosswordPuzzle } from "./types";
import { seededRandom } from "./dateUtils";

export interface WordClue {
  word: string;
  clue: string;
}

type Dir = "across" | "down";

interface Placed {
  word: string;
  clue: string;
  row: number;
  col: number;
  dir: Dir;
}

function key(r: number, c: number) {
  return `${r},${c}`;
}

function canPlace(grid: Map<string, string>, word: string, row: number, col: number, dir: Dir): boolean {
  const len = word.length;

  const beforeR = dir === "across" ? row : row - 1;
  const beforeC = dir === "across" ? col - 1 : col;
  if (grid.has(key(beforeR, beforeC))) return false;

  const afterR = dir === "across" ? row : row + len;
  const afterC = dir === "across" ? col + len : col;
  if (grid.has(key(afterR, afterC))) return false;

  let hasIntersection = false;
  for (let i = 0; i < len; i++) {
    const r = dir === "across" ? row : row + i;
    const c = dir === "across" ? col + i : col;
    const existing = grid.get(key(r, c));
    if (existing) {
      if (existing !== word[i]) return false;
      hasIntersection = true;
    } else if (dir === "across") {
      if (grid.has(key(r - 1, c)) || grid.has(key(r + 1, c))) return false;
    } else {
      if (grid.has(key(r, c - 1)) || grid.has(key(r, c + 1))) return false;
    }
  }
  return hasIntersection;
}

function place(grid: Map<string, string>, word: string, row: number, col: number, dir: Dir) {
  for (let i = 0; i < word.length; i++) {
    const r = dir === "across" ? row : row + i;
    const c = dir === "across" ? col + i : col;
    grid.set(key(r, c), word[i]);
  }
}

/**
 * Deterministically generates a small crossword from a themed word bank.
 * Words that can't find a valid crossing are quietly dropped, so the
 * puzzle always comes back valid even for a loosely-overlapping bank.
 */
export function generateCrossword(id: string, title: string, bank: WordClue[], seed: number): CrosswordPuzzle {
  const rand = seededRandom(seed);
  const words = bank
    .map((w) => ({ word: w.word.toUpperCase().replace(/[^A-Z]/g, ""), clue: w.clue }))
    .filter((w) => w.word.length >= 3)
    .sort((a, b) => b.word.length - a.word.length || rand() - 0.5);

  if (words.length === 0) {
    return { id, title, rows: 1, cols: 1, entries: [] };
  }

  const grid = new Map<string, string>();
  const placed: Placed[] = [];

  // seed word goes across through the origin
  const first = words[0];
  place(grid, first.word, 0, 0, "across");
  placed.push({ word: first.word, clue: first.clue, row: 0, col: 0, dir: "across" });

  for (let idx = 1; idx < words.length; idx++) {
    const w = words[idx];
    let best: { row: number; col: number; dir: Dir } | null = null;

    const existingCells = Array.from(grid.entries());
    for (let attempt = 0; attempt < existingCells.length && !best; attempt++) {
      const pickIdx = Math.floor(rand() * existingCells.length);
      const [cellKey, letter] = existingCells[pickIdx];
      const [rStr, cStr] = cellKey.split(",");
      const r = Number(rStr);
      const c = Number(cStr);

      for (let j = 0; j < w.word.length; j++) {
        if (w.word[j] !== letter) continue;
        const dirs: Dir[] = rand() > 0.5 ? ["across", "down"] : ["down", "across"];
        for (const dir of dirs) {
          const row = dir === "across" ? r : r - j;
          const col = dir === "across" ? c - j : c;
          if (canPlace(grid, w.word, row, col, dir)) {
            best = { row, col, dir };
            break;
          }
        }
        if (best) break;
      }
    }

    if (best) {
      place(grid, w.word, best.row, best.col, best.dir);
      placed.push({ word: w.word, clue: w.clue, row: best.row, col: best.col, dir: best.dir });
    }
  }

  const rows = placed.flatMap((p) => (p.dir === "down" ? [p.row, p.row + p.word.length - 1] : [p.row]));
  const cols = placed.flatMap((p) => (p.dir === "across" ? [p.col, p.col + p.word.length - 1] : [p.col]));
  const minRow = Math.min(...rows);
  const maxRow = Math.max(...rows);
  const minCol = Math.min(...cols);
  const maxCol = Math.max(...cols);

  const numberAt = new Map<string, number>();
  let nextNumber = 1;

  const sortedPlaced = [...placed].sort((a, b) => (a.row - b.row) * 1000 + (a.col - b.col));
  const startsCache = new Map<string, boolean>();
  for (const p of sortedPlaced) {
    const startKey = key(p.row, p.col);
    if (!startsCache.has(startKey)) {
      startsCache.set(startKey, true);
    }
  }
  // Assign numbers in reading order across all distinct start cells.
  const startCells = Array.from(new Set(placed.map((p) => key(p.row, p.col))))
    .map((k) => {
      const [r, c] = k.split(",").map(Number);
      return { r, c };
    })
    .sort((a, b) => (a.r - b.r) * 1000 + (a.c - b.c));

  for (const cell of startCells) {
    numberAt.set(key(cell.r, cell.c), nextNumber++);
  }

  const entries: CrosswordEntry[] = placed.map((p) => ({
    number: numberAt.get(key(p.row, p.col))!,
    clue: p.clue,
    answer: p.word,
    row: p.row - minRow,
    col: p.col - minCol,
    dir: p.dir,
  }));

  return {
    id,
    title,
    rows: maxRow - minRow + 1,
    cols: maxCol - minCol + 1,
    entries,
  };
}

/**
 * Runs the generator several times with different deterministic seeds and
 * keeps the layout that placed the most words, so a themed bank with only
 * so-so overlaps still comes back as a fuller puzzle.
 */
export function generateBestCrossword(
  id: string,
  title: string,
  bank: WordClue[],
  baseSeed: number,
  attempts = 8
): CrosswordPuzzle {
  let best: CrosswordPuzzle | null = null;
  for (let i = 0; i < attempts; i++) {
    const candidate = generateCrossword(id, title, bank, baseSeed + i * 104729);
    if (!best || candidate.entries.length > best.entries.length) {
      best = candidate;
    }
    if (best.entries.length >= bank.length) break;
  }
  return best!;
}
