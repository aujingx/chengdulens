import { places, type Place } from "@/data/places";
import { computeRoute } from "./tripMath";

export type Mood = "tea" | "lanes" | "indoor";
export const MOODS: { id: Mood; en: string; zh: string; ids: string[] }[] = [
  { id: "tea", en: "Tea & slow time", zh: "茶馆发呆", ids: ["peoples-park", "wenshu-monastery", "fangsuo-bookstore", "taikoo-li-street-loop"] },
  { id: "lanes", en: "Old lanes", zh: "街巷人文", ids: ["jinli-alley", "wenshu-monastery", "taikoo-li-street-loop", "peoples-park"] },
  { id: "indoor", en: "Indoors", zh: "雨天室内", ids: ["chengdu-museum", "fangsuo-bookstore"] },
];
export function wanderRoute(mood: Mood, seed: number, rain: boolean, start = "Taikoo Li"): Place[] {
  const pool = (MOODS.find((m) => m.id === mood)?.ids ?? []).flatMap((id) => places.find((p) => p.id === id) ?? []).filter((p) => !rain || p.indoor);
  const list = pool.length ? pool : places.filter((p) => p.indoor);
  const rotated = [...list.slice(seed % list.length), ...list.slice(0, seed % list.length)];
  const out: Place[] = [];
  for (const p of rotated) {
    if (computeRoute([...out, p], start).totalMin <= 150) out.push(p);
    if (out.length === 2) break;
  }
  return out;
}
