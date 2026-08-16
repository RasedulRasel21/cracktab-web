/**
 * Coarse equirectangular land mask, shared by the static SVG map
 * (`WorldMap`) and the cursor-reactive canvas field (`WorldDotField`) so both
 * draw the same continents.
 *
 * Grid is 60 columns x 28 rows: each column spans 6° of longitude starting at
 * -180, each row 5° of latitude starting at 82.5°N. `LAND` lists the inclusive
 * column ranges that are land on each row.
 */
export const COLS = 60;
export const ROWS = 28;

/**
 * Dots are drawn on a subdivided grid: each mask cell becomes SUB x SUB dots.
 * That makes the texture finer and denser without re-authoring the mask — the
 * continent outlines keep their original resolution.
 */
export const SUB = 2;
export const SUB_COLS = COLS * SUB;
export const SUB_ROWS = ROWS * SUB;

/** Dot radius in *sub-cell* units — 0.5 would make adjacent dots touch. */
export const DOT_R = 0.22;

export const LAND: [number, number][][] = [
  [[16, 18], [22, 26], [32, 33]],
  [[10, 18], [20, 26], [32, 33], [39, 41], [45, 47]],
  [[7, 26], [33, 59]],
  [[2, 27], [30, 59]],
  [[2, 20], [22, 23], [26, 27], [30, 59]],
  [[2, 20], [28, 59]],
  [[8, 20], [28, 59]],
  [[9, 20], [29, 55]],
  [[9, 18], [28, 54]],
  [[9, 17], [28, 53]],
  [[10, 17], [28, 53]],
  [[10, 16], [27, 50]],
  [[12, 17], [27, 50]],
  [[12, 20], [27, 38], [42, 48]],
  [[14, 20], [27, 37], [42, 43], [45, 48], [50, 51]],
  [[16, 20], [28, 37], [43, 43], [46, 48], [50, 51]],
  [[17, 22], [31, 37], [45, 51]],
  [[17, 24], [31, 37], [46, 52]],
  [[17, 24], [32, 36], [46, 53]],
  [[17, 23], [32, 36], [50, 55]],
  [[18, 23], [32, 36], [49, 54]],
  [[18, 23], [32, 35], [49, 55]],
  [[18, 22], [32, 35], [49, 55]],
  [[18, 21], [33, 35], [49, 55]],
  [[17, 20], [53, 55], [58, 59]],
  [[17, 19], [54, 54], [58, 59]],
  [[17, 18]],
  [[17, 18]],
];

/** Flat SUB_COLS*SUB_ROWS lookup — 1 where the sub-cell is land. */
export function landMask(): Uint8Array {
  const mask = new Uint8Array(SUB_COLS * SUB_ROWS);
  LAND.forEach((ranges, row) => {
    for (const [from, to] of ranges) {
      for (let col = from; col <= to; col++) {
        for (let sy = 0; sy < SUB; sy++) {
          for (let sx = 0; sx < SUB; sx++) {
            mask[(row * SUB + sy) * SUB_COLS + col * SUB + sx] = 1;
          }
        }
      }
    }
  });
  return mask;
}

/** Land dot positions as [col, row] pairs on the subdivided grid. */
export function landDots(): [number, number][] {
  const dots: [number, number][] = [];
  LAND.forEach((ranges, row) => {
    for (const [from, to] of ranges) {
      for (let col = from; col <= to; col++) {
        for (let sy = 0; sy < SUB; sy++) {
          for (let sx = 0; sx < SUB; sx++) {
            dots.push([col * SUB + sx, row * SUB + sy]);
          }
        }
      }
    }
  });
  return dots;
}

/** Lat/lon to a 0-100 percentage position, matching the dot grid exactly. */
export function project(lon: number, lat: number) {
  return {
    x: ((lon + 180) / 6 / COLS) * 100,
    y: ((82.5 - lat) / 5 / ROWS) * 100,
  };
}
