import { findPlace, places, type Place } from "@/data/places";
import { computeRoute, legMinutes } from "./tripMath";

export const SAMPLE = {
  zh: "今天下午从太古里出发，在成都玩 4 小时，不吃辣。今晚住成都，明天去九寨沟，也帮我安排交通、吃饭和住宿。",
  en: "I have 4 hours in Chengdu this afternoon, starting at Taikoo Li. No spicy food. I’ll stay in Chengdu tonight and go to Jiuzhaigou tomorrow. Help me plan transport, meals and hotels.",
};

export type Lang = keyof typeof SAMPLE;
export type Brief = { text: string; minutes: number; start: string; noSpice: boolean; vegetarian: boolean; rain: boolean; interest: "culture" | "parks" | "city" };
export type Step = "places" | "dinner" | "chengduHotel" | "tomorrow" | "summary";
export const STEPS: Step[] = ["places", "dinner", "chengduHotel", "tomorrow", "summary"];
export type Plan = {
  brief: Brief; step: Step; mode: "manual" | "guided"; rain: boolean; sunnyStops: string[]; rainyStops: string[] | null;
  dinner: string | null; chengduHotel: string | null; transfer: string | null; meal: string | null; jiuzhaiHotel: string | null; saved: boolean;
};

export function readBrief(text: string): Brief | null {
  if (!/成都|太古里|chengdu|taikoo li/i.test(text) || !/九寨沟|jiuzhai(?:gou)?\b/i.test(text)) return null;
  if (/不去九寨沟|(?:not going to|skip|avoid) jiuzhai/i.test(text)) return null;
  const afternoon = text.match(/下午[^。；\n]{0,55}|[^.!?\n]{0,75}\bafternoon\b[^.!?\n]{0,45}/i)?.[0] ?? text;
  const hours = afternoon.match(/(\d+(?:\.\d+)?|[一二两三四五六七八九]|one|two|three|four|five|six|seven|eight|nine)\s*(?:个?小时|h(?:ours?|rs?)?\b)/i);
  const words: Record<string, number> = { 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };
  const amount = hours?.[1]?.toLowerCase();
  const start = /(?:从|自)\s*(?:天府广场)|(?:start(?:ing)? (?:at|from)|from) tianfu square/i.test(text) ? "Tianfu Square"
    : /(?:从|自)\s*(?:文殊院)|(?:start(?:ing)? (?:at|from)|from) wenshu/i.test(text) ? "Wenshu" : "Taikoo Li";
  return {
    text, minutes: amount ? Math.max(1, Math.round((words[amount] ?? Number(amount)) * 60)) : 240, start,
    noSpice: /不吃辣|不辣|不能吃辣|no (?:spicy|chili)|non.spicy|mild food/i.test(text),
    vegetarian: /素食|吃素|vegetarian|vegan|纯素/i.test(text),
    rain: /下雨|雨天|rainy|\brain(?:ing)?\b/i.test(text),
    interest: /公园|喝茶|茶馆|park|tea house/i.test(text) ? "parks" : /古街|历史|博物馆|文化|museum|history|culture|old town/i.test(text) ? "culture" : "city",
  };
}

export function routeStops(plan: Plan): Place[] {
  const sunny = plan.sunnyStops.flatMap((id) => findPlace(id) ?? []);
  if (!plan.rain) return sunny;
  if (plan.rainyStops !== null) return plan.rainyStops.flatMap((id) => findPlace(id) ?? []);
  const indoors = sunny.filter((place) => place.indoor).map((place) => place.id);
  if (sunny.some((place) => !place.indoor)) {
    for (const id of recommendStops(plan.brief, true)) if (!indoors.includes(id)) indoors.push(id);
  }
  return indoors.flatMap((id) => findPlace(id) ?? []);
}

export function recommendStops(brief: Brief, rain: boolean) {
  const order = rain ? ["chengdu-museum", "wenshu-monastery", "fangsuo-bookstore"] : brief.interest === "parks"
    ? ["peoples-park", "wenshu-monastery", "taikoo-li-street-loop"] : brief.interest === "culture"
      ? ["chengdu-museum", "jinli-alley", "fangsuo-bookstore"] : ["taikoo-li-street-loop", "jinli-alley", "fangsuo-bookstore", "peoples-park"];
  const fit: Place[] = [];
  for (const id of order) {
    const place = findPlace(id);
    if (place && computeRoute([...fit, place], brief.start).totalMin <= brief.minutes) fit.push(place);
    if (fit.length === 3) break;
  }
  return fit.map((place) => place.id);
}

export type Option = { id: string; en: string; zh: string; note: { en: string; zh: string }; area?: string; query?: string };
const option = (id: string, en: string, zh: string, description: string, descriptionZh: string, area?: string, query?: string): Option =>
  ({ id, en, zh, note: { en: description, zh: descriptionZh }, area, query });

const DINNER = [
  option("jinli", "Jinli snack walk", "锦里小吃街 · 三大炮与甜水点心", "Sweet glutinous rice snacks; add a sit-down meal nearby if you need something more filling.", "可先尝甜口糯米小吃；想吃饱，可再在武侯祠一带找堂食。", "Wuhou", "锦里美食 成都"),
  option("taikoo", "Chunxi Road · Cantonese dinner", "春熙路 · 粤菜晚餐", "Look for steamed dishes, clay-pot rice and simple soups; ask the kitchen about sauces.", "优先选清蒸、煲仔饭和例汤；点餐时确认酱汁。", "Taikoo Li", "春熙路 粤菜 成都"),
  option("wenshu", "Wenshu · Vegetarian dinner", "文殊院 · 素食晚餐", "Look for a vegetarian kitchen near the monastery. Confirm closing time and ingredients before going.", "可找文殊院周边的素食餐厅，出发前确认营业时间和食材。", "Wenshu", "文殊院 素食餐厅 成都"),
  option("tianfu", "Tianfu Square · Noodles or wontons", "天府广场 · 清汤面或抄手", "Ask whether a clear broth without chili oil or Sichuan pepper is available.", "询问能否做清汤、不加红油和花椒。", "Tianfu Square", "天府广场 清汤抄手 成都"),
  option("qingyang", "People’s Park · Home-style dinner", "人民公园 · 川味家常菜", "Ask for steamed egg and seasonal greens, with chili served separately.", "可问店家能否做蒸蛋和时蔬，辣椒另放。", "Qingyang", "人民公园 家常菜 成都"),
];

export const CHENGDU_HOTELS = [
  option("east", "Rayfont Hotel Chengdu", "成都龙之梦瑞峰国际酒店", "East Railway Station area; choose it to simplify tomorrow’s train departure.", "位于成都东站一带，适合把明早赶高铁的路程留短一些。", undefined, "成都龙之梦瑞峰国际酒店"),
  option("central", "The Temple House", "成都博舍", "Taikoo Li; choose it for a central stay with dinner nearby.", "位于太古里，适合想留在市中心、晚饭后少折腾的人。", undefined, "成都博舍"),
  option("wuhou", "Home Inn near Wuhou Shrine", "如家酒店 · 武侯祠片区", "Near Jinli; check the exact branch, room type and trip to East Railway Station.", "靠近锦里；核对具体分店、房型与去东站的路线。", undefined, "如家 成都 武侯祠 锦里"),
];

export const JIUZHAI_HOTELS = [
  option("demo-gate", "Valley Gate Guesthouse · Demo", "九寨沟口山谷客栈 · 演示", "Fictional stay near the park gate. No rail station pickup; bus-drop-off pickup is unverified.", "靠近沟口的虚构客栈。不提供高铁站接站，大巴下车点接送未核实。"),
  option("holiday", "Holiday Inn Express Jiuzhaigou", "九寨沟智选假日酒店", "Park gate area; verify the route from the bus drop-off and breakfast hours.", "沟口一带；核对大巴下车点到酒店的距离和早餐时间。", undefined, "九寨沟智选假日酒店"),
  option("hilton", "Hilton Jiuzhaigou Resort", "九寨鲁能希尔顿度假酒店", "A resort farther from the gate; allow a separate drive to the park.", "离沟口较远的度假酒店，入园前另留一段车程。", undefined, "九寨鲁能希尔顿度假酒店"),
];

export const TRANSFERS = [
  option("bus", "Scenic-area bus", "景区方向大巴", "Check the departure tied to your train, its drop-off and the last leg to your hotel.", "按车次核对大巴班次、下车点，以及下车后到酒店的一段路。"),
  option("car", "Taxi or private car", "出租车或包车", "More flexible with luggage. Confirm the price and destination with the driver before leaving.", "行李多时更灵活；出发前确认费用和目的地。"),
  option("pickup", "Hotel pickup request", "向酒店询问接站", "Only use it after the hotel confirms pickup for your exact train and any extra charge.", "请酒店书面确认你的车次、接站地点和是否收费后再采用。"),
];

export const MEALS = [
  option("gate", "Dinner near the gate", "沟口晚餐 · 牦牛汤或当地家常菜", "Ask whether the soup is mild and whether sauces can be served separately.", "可问牦牛汤是否清淡，并请店家把辣酱另放。"),
  option("habit", "Dinner at your hotel", "酒店用餐 · 米饭、时蔬、热汤", "Confirm meal hours, particularly if your train arrives late.", "如果高铁到得晚，提前确认酒店供餐时间。"),
  option("veg", "Vegetarian dinner near your hotel", "酒店附近 · 素食晚餐", "Ask for vegetable dishes without meat stock or lard; confirm availability before arrival.", "提前找能做素食的店，确认不用肉汤或猪油。"),
];

export function dinnerOptions(plan: Plan) {
  const anchor = routeStops(plan).at(-1)?.area ?? plan.brief.start;
  const sorted = [...DINNER].filter((x) => !plan.brief.vegetarian || x.id !== "tianfu")
    .sort((a, b) => (plan.brief.vegetarian ? Number(b.id === "wenshu") - Number(a.id === "wenshu") : 0) ||
      legMinutes(anchor, a.area ?? anchor).minutes - legMinutes(anchor, b.area ?? anchor).minutes);
  return sorted.slice(0, 3);
}

export const getDinner = (id: string | null) => DINNER.find((x) => x.id === id);
export const optionById = (options: Option[], id: string | null) => options.find((x) => x.id === id);
export const placeOptions = (rain: boolean) => places.filter((place) => rain ? place.indoor : ["jinli-alley", "taikoo-li-street-loop", "wenshu-monastery", "peoples-park", "chengdu-museum", "fangsuo-bookstore"].includes(place.id))
  .sort((a, b) => Number(b.id === "jinli-alley") - Number(a.id === "jinli-alley") || Number(b.id === "taikoo-li-street-loop") - Number(a.id === "taikoo-li-street-loop"));

export function newPlan(brief: Brief, mode: Plan["mode"]): Plan {
  const plan: Plan = { brief, mode, step: "places", rain: brief.rain, sunnyStops: [], rainyStops: null, dinner: null,
    chengduHotel: null, transfer: null, meal: null, jiuzhaiHotel: null, saved: false };
  return mode === "guided" ? fillPlan(plan) : plan;
}

export function fillPlan(plan: Plan): Plan {
  const next: Plan = {
    ...plan, mode: "guided", step: "summary", saved: false,
    sunnyStops: plan.rain || plan.sunnyStops.length ? plan.sunnyStops : recommendStops(plan.brief, false),
    rainyStops: plan.rain && !routeStops(plan).length ? recommendStops(plan.brief, true) : plan.rainyStops,
    chengduHotel: plan.chengduHotel ?? "east", transfer: plan.transfer ?? "bus", meal: plan.meal ?? (plan.brief.vegetarian ? "veg" : "gate"),
    jiuzhaiHotel: plan.jiuzhaiHotel ?? "holiday",
  };
  return { ...next, dinner: next.dinner ?? dinnerOptions(next)[0]?.id ?? null };
}

export function changeWeather(plan: Plan, rain: boolean): Plan {
  return plan.rain === rain ? plan : { ...plan, rain, saved: false };
}

export function toggleStop(plan: Plan, id: string, alreadySelected: boolean): Plan {
  const ids = routeStops(plan).map((place) => place.id);
  const next = alreadySelected ? ids.filter((value) => value !== id) : [...ids, id];
  const stops = next.flatMap((value) => findPlace(value) ?? []);
  next.sort((a, b) => legMinutes(plan.brief.start, findPlace(a)?.area ?? plan.brief.start).minutes - legMinutes(plan.brief.start, findPlace(b)?.area ?? plan.brief.start).minutes);
  if (!alreadySelected && computeRoute(next.flatMap((value) => findPlace(value) ?? []), plan.brief.start).totalMin > plan.brief.minutes) return plan;
  if (stops.length !== next.length || (!alreadySelected && stops.some((place) => plan.rain && !place.indoor))) return plan;
  return { ...plan, saved: false, ...(plan.rain ? { rainyStops: next } : { sunnyStops: next }) };
}
