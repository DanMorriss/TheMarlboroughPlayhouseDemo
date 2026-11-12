export interface BubbleSpec {
  /** Diameter in px */
  size: number;
  /** Bubbles in the same group (e.g. background colour) are kept apart */
  group: string;
}

export interface PlacedBubble {
  /** Top-left corner in px, relative to the container */
  left: number;
  top: number;
  size: number;
}

export interface BubbleLayout {
  bubbles: PlacedBubble[];
  height: number;
}

interface Circle {
  x: number;
  y: number;
  r: number;
  group: string;
}

/** How much neighbouring bubbles may overlap, as a share of the smaller one's diameter */
const OVERLAP = 0.12;
/** Random spots tried for each bubble; the best one wins */
const CANDIDATES = 60;

/**
 * Packs bubbles into a container of the given width so they look loosely
 * scattered rather than lined up in rows. Each bubble "floats up" from below
 * at a few random x positions and settles where it first touches the top or
 * another bubble; the highest spot wins, with some jitter and a penalty for
 * touching a bubble of the same group. Seeded, so a given width always gives
 * the same layout.
 */
export function layoutBubbles(specs: BubbleSpec[], width: number, seed = 7): BubbleLayout {
  const random = mulberry32(seed);
  const placed: Circle[] = [];

  for (const spec of specs) {
    const r = spec.size / 2;
    let best: { x: number; y: number; score: number } | null = null;

    for (let i = 0; i < CANDIDATES; i++) {
      const x = width <= spec.size ? width / 2 : r + random() * (width - spec.size);
      // Uneven "ceiling" so the top edge isn't a straight line either
      let y = r + random() * r * 0.5;

      for (const p of placed) {
        const minDist = r + p.r - OVERLAP * 2 * Math.min(r, p.r);
        const dx = Math.abs(x - p.x);
        if (dx < minDist) y = Math.max(y, p.y + Math.sqrt(minDist * minDist - dx * dx));
      }

      let score = y + random() * r * 0.6;
      for (const p of placed) {
        if (p.group === spec.group && Math.hypot(x - p.x, y - p.y) < r + p.r + 16) score += r * 4;
      }

      if (!best || score < best.score) best = { x, y, score };
    }

    placed.push({ x: best!.x, y: best!.y, r, group: spec.group });
  }

  // Centre the cluster horizontally
  const minX = Math.min(...placed.map((c) => c.x - c.r));
  const maxX = Math.max(...placed.map((c) => c.x + c.r));
  const shift = (width - (maxX - minX)) / 2 - minX;

  return {
    bubbles: placed.map((c) => ({ left: c.x - c.r + shift, top: c.y - c.r, size: c.r * 2 })),
    height: Math.max(0, ...placed.map((c) => c.y + c.r)),
  };
}

/** Small seeded random number generator, returns values in [0, 1) */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
