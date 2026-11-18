import type { Place } from "@/data/places";

/**
 * Rough grid positions (km) of each demo area relative to Taikoo Li.
 * Used only for *estimated* leg times — there is no live route matrix.
 */
const AREA_POS: Record<string, [number, number]> = {
  "Taikoo Li": [0, 0],
  "Tianfu Square": [-1.2, -0.3],
  Qingyang: [-3.5, 0.2],
  Wenshu: [-0.6, 1.6],
  Wuhou: [-2.2, -1.8],
  Chenghua: [3.2, 2.6],
  "Chenghua North": [2.8, 8.5],
};

export type Leg = { from: string; to: string; minutes: number; mode: "walk" | "metro/taxi"; estimated: true };

export function legMinutes(fromArea: string, toArea: string): { minutes: number; mode: Leg["mode"] } {
  const a = AREA_POS[fromArea];
  const b = AREA_POS[toArea];
  if (!a || !b) return { minutes: 25, mode: "metro/taxi" };
  const km = Math.hypot(a[0] - b[0], a[1] - b[1]);
  if (km < 0.3) return { minutes: 5, mode: "walk" };
  if (km <= 1.5) return { minutes: Math.round(km * 14), mode: "walk" };
  return { minutes: Math.round(10 + km * 3.5), mode: "metro/taxi" };
}

export const TRANSITION_BUFFER_MIN = 10;

/** Total = start→first leg + Σ stay + Σ adjacent legs + buffer per transition. */
export function computeRoute(stops: Place[], startArea = "Taikoo Li") {
  const legs: Leg[] = [];
  let prev = startArea;
  let prevName = startArea;
  for (const p of stops) {
    const l = legMinutes(prev, p.area);
    legs.push({ from: prevName, to: p.name, minutes: l.minutes, mode: l.mode, estimated: true });
    prev = p.area;
    prevName = p.name;
  }
  const stayMin = stops.reduce((s, p) => s + p.duration, 0);
  const travelMin = legs.reduce((s, l) => s + l.minutes, 0);
  const bufferMin = Math.max(0, stops.length - 1) * TRANSITION_BUFFER_MIN;
  return { legs, stayMin, travelMin, bufferMin, totalMin: stayMin + travelMin + bufferMin };
}

export type RainSwap = { originalId: string; replacementId: string };
export type RainProposal = { swaps: RainSwap[]; keptOutdoor: string[]; protectedIds: string[] };

/**
 * Suggest indoor replacements for outdoor stops. Never touches confirmed stops,
 * never proposes a place already in the plan, never uses one replacement twice.
 */
export function proposeRainSwaps(stops: Place[], allPlaces: Place[], confirmedIds: string[]): RainProposal {
  const used = new Set(stops.map((p) => p.id));
  const indoorPool = allPlaces.filter((p) => p.indoor && !used.has(p.id));
  const swaps: RainSwap[] = [];
  const keptOutdoor: string[] = [];
  const protectedIds: string[] = [];
  for (const p of stops) {
    if (p.indoor) continue;
    if (confirmedIds.includes(p.id)) {
      protectedIds.push(p.id);
      continue;
    }
    const next = indoorPool.shift();
    if (next) swaps.push({ originalId: p.id, replacementId: next.id });
    else keptOutdoor.push(p.id);
  }
  return { swaps, keptOutdoor, protectedIds };
}

export function applySwaps(stops: Place[], swaps: RainSwap[], find: (id: string) => Place | undefined) {
  return stops.map((p) => {
    const s = swaps.find((x) => x.originalId === p.id);
    return (s && find(s.replacementId)) || p;
  });
}
